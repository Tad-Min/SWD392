import { useState, useEffect, useCallback, useRef } from "react";
import { getRescueRequestApi } from "../features/Rescue/api/rescueRequestApi";
import { getUserByIdApi } from "../features/users/api/usersApi";
import {
    connectWebSocket,
    addMessageListener,
    removeMessageListener,
} from "../features/websocket/api/webSocketService";
import { toast } from "react-toastify";

/**
 * Play a notification beep sound using Web Audio API
 */
function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // First beep
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.value = 880;
        osc1.type = "sine";
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.3);

        // Second beep (higher pitch)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.45);

        setTimeout(() => ctx.close(), 1000);
    } catch (e) {
        // Audio not supported, ignore
    }
}

const urgencyLabels = {
    1: "Cần hỗ trợ",
    2: "Nguy hiểm",
    3: "Khẩn cấp",
};

/**
 * Custom toast component for new rescue requests
 */
function RescueRequestToast({ request, userName }) {
    const urgency = urgencyLabels[request.urgencyLevel] || "Không rõ";
    const urgencyColors = {
        1: "#f59e0b",
        2: "#ef4444",
        3: "#a855f7",
    };
    const color = urgencyColors[request.urgencyLevel] || "#64748b";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                    style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        animation: "pulse 1s infinite",
                    }}
                />
                <strong style={{ fontSize: "13px" }}>🚨 Yêu cầu cứu trợ mới!</strong>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                <div>👤 {userName || "Người dân"}</div>
                <div>📍 {request.locationText || "Chưa xác định"}</div>
                <div>
                    ⚠️ Mức độ:{" "}
                    <span style={{ color, fontWeight: "bold" }}>{urgency}</span>
                </div>
                {request.peopleCount > 1 && (
                    <div>👥 {request.peopleCount} người cần hỗ trợ</div>
                )}
            </div>
        </div>
    );
}

/**
 * Hook realtime cho rescue requests
 * - Kết nối WebSocket để nhận thông báo realtime
 * - Polling mỗi 10 giây như fallback
 * - Hiện toast + âm thanh khi có request mới
 */
export const useRealtimeRescueRequests = () => {
    const [requests, setRequests] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(true);
    const knownIdsRef = useRef(new Set());
    const isInitialLoadRef = useRef(true);
    const listenerId = useRef(`rescue-realtime-${Date.now()}`);

    // Fetch user name for a given userId
    const fetchUserName = useCallback(async (userId) => {
        if (!userId) return null;
        try {
            const res = await getUserByIdApi(userId);
            const user = res?.data ?? res;
            return user?.fullName || user?.userName || user?.email || "Người dân";
        } catch {
            return null;
        }
    }, []);

    // Notify about new requests (toast + sound)
    const notifyNewRequests = useCallback(
        async (newRequests) => {
            if (newRequests.length === 0) return;

            playNotificationSound();

            for (const req of newRequests) {
                // Fetch user name for the toast
                let userName = userMap[req.userReqId];
                if (!userName && req.userReqId) {
                    userName = await fetchUserName(req.userReqId);
                    if (userName) {
                        setUserMap((prev) => ({ ...prev, [req.userReqId]: userName }));
                    }
                }

                toast(
                    <RescueRequestToast
                        request={req}
                        userName={userName || req.citizenName}
                    />,
                    {
                        position: "top-right",
                        autoClose: 8000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                        style: {
                            background: "rgba(15, 23, 42, 0.95)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "12px",
                        },
                    }
                );
            }
        },
        [userMap, fetchUserName]
    );

    // Fetch all requests and detect new ones
    const fetchAndDetectNew = useCallback(async () => {
        try {
            const reqData = await getRescueRequestApi();
            const reqs = reqData ?? [];

            // Detect new requests
            const newRequests = reqs.filter((r) => {
                const id = r.id ?? r.rescueRequestId;
                return id && !knownIdsRef.current.has(id);
            });

            // Update known IDs
            reqs.forEach((r) => {
                const id = r.id ?? r.rescueRequestId;
                if (id) knownIdsRef.current.add(id);
            });

            // Fetch user info for new requests
            const newUserIds = [
                ...new Set(
                    newRequests
                        .map((r) => r.userReqId)
                        .filter((uid) => uid && !userMap[uid])
                ),
            ];
            if (newUserIds.length > 0) {
                const newMapEntries = {};
                await Promise.all(
                    newUserIds.map(async (uid) => {
                        const name = await fetchUserName(uid);
                        if (name) newMapEntries[uid] = name;
                    })
                );
                if (Object.keys(newMapEntries).length > 0) {
                    setUserMap((prev) => ({ ...prev, ...newMapEntries }));
                }
            }

            setRequests(reqs);

            // Only notify after initial load
            if (!isInitialLoadRef.current && newRequests.length > 0) {
                notifyNewRequests(newRequests);
            }
            isInitialLoadRef.current = false;
        } catch (err) {
            console.error("Failed to fetch rescue requests:", err);
        } finally {
            setLoading(false);
        }
    }, [userMap, fetchUserName, notifyNewRequests]);

    // Initial fetch + polling
    useEffect(() => {
        fetchAndDetectNew();

        const interval = setInterval(fetchAndDetectNew, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // WebSocket listener for instant notifications
    useEffect(() => {
        // Connect WebSocket
        connectWebSocket(null, (status) => {
            console.log("[Realtime Rescue] WebSocket status:", status);
        });

        // Listen for rescue_request notifications via WebSocket
        addMessageListener(listenerId.current, (message) => {
            if (
                message.type === "notification" &&
                message.content
            ) {
                try {
                    // Try to parse content as rescue request data
                    const parsed =
                        typeof message.content === "string"
                            ? JSON.parse(message.content)
                            : message.content;

                    if (parsed && (parsed.rescueRequestId || parsed.id)) {
                        // Got a new rescue request via WebSocket - immediately fetch all to sync
                        fetchAndDetectNew();
                    }
                } catch {
                    // If content is just a text notification about new rescue request
                    const lowerContent = (message.content || "").toLowerCase();
                    if (
                        lowerContent.includes("rescue") ||
                        lowerContent.includes("cứu") ||
                        lowerContent.includes("request")
                    ) {
                        fetchAndDetectNew();
                    }
                }
            }
        });

        return () => {
            removeMessageListener(listenerId.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        requests,
        setRequests,
        userMap,
        setUserMap,
        loading,
        refetch: fetchAndDetectNew,
    };
};
