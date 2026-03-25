import { useState, useEffect, useCallback, useRef } from "react";
import { getRescueMissionByTeamIdApi } from "../../../features/Rescue/api/rescueMissionApi.js";
import {
    connectWebSocket,
    joinGroup,
    leaveGroup,
    addMessageListener,
    removeMessageListener,
} from "../../../features/websocket/api/webSocketService.js";
import { toast } from "react-toastify";

/**
 * Play a notification beep sound using Web Audio API
 */
function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

const missionStatusLabels = {
    1: "Mới",
    2: "Đã phân công",
    3: "Đang di chuyển",
    4: "Tại hiện trường",
    5: "Đang xử lý",
    6: "Hoàn thành",
    7: "Thất bại",
};

/**
 * Custom toast component for new mission assignments
 */
function MissionToast({ mission }) {
    const statusLabel = missionStatusLabels[mission.statusId || mission.StatusId] || "Mới";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                    style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        animation: "pulse 1s infinite",
                    }}
                />
                <strong style={{ fontSize: "13px" }}>🚀 Nhiệm vụ mới được giao!</strong>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                {mission.missionDescription || mission.description ? (
                    <div>📋 {mission.missionDescription || mission.description}</div>
                ) : null}
                <div>📊 Trạng thái: <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{statusLabel}</span></div>
                {mission.rescueRequestId && (
                    <div>🆘 Mã yêu cầu: #{mission.rescueRequestId}</div>
                )}
            </div>
        </div>
    );
}

/**
 * Helper: extract missions array from API response
 */
function extractMissions(data) {
    if (data && data.$values) return data.$values;
    if (data && data.data) return Array.isArray(data.data) ? data.data : [];
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.result)) return data.result;
    return [];
}

/**
 * Hook realtime cho rescue missions của team
 * - Kết nối WebSocket & join group `team_{teamId}`
 * - Polling mỗi 15 giây như fallback
 * - Hiện toast + âm thanh khi có nhiệm vụ mới
 *
 * @param {string|number} teamId - ID của team
 */
export const useRealtimeRescueMissions = (teamId) => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const knownIdsRef = useRef(new Set());
    const isInitialLoadRef = useRef(true);
    const listenerId = useRef(`mission-realtime-${Date.now()}`);
    const teamIdRef = useRef(teamId);

    // Keep teamId ref current
    useEffect(() => {
        teamIdRef.current = teamId;
    }, [teamId]);

    // Notify about new missions
    const notifyNewMissions = useCallback((newMissions) => {
        if (newMissions.length === 0) return;

        playNotificationSound();

        for (const mission of newMissions) {
            // Dispatch custom event so NotificationBell can pick it up
            const statusLabel = missionStatusLabels[mission.statusId || mission.StatusId] || "Mới";
            const description = mission.missionDescription || mission.description || "";
            window.dispatchEvent(new CustomEvent("new-mission-notification", {
                detail: {
                    id: Date.now() + Math.random(),
                    title: "🚀 Nhiệm vụ mới được giao!",
                    message: description
                        ? `${description} — Trạng thái: ${statusLabel}`
                        : `Nhiệm vụ mới — Trạng thái: ${statusLabel}`,
                    time: new Date().toLocaleTimeString(),
                    read: false,
                    data: mission,
                },
            }));

            toast(
                <MissionToast mission={mission} />,
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
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "12px",
                    },
                }
            );
        }
    }, []);

    // Fetch missions and detect new ones
    const fetchAndDetectNew = useCallback(async () => {
        const currentTeamId = teamIdRef.current;
        if (!currentTeamId) return;

        try {
            const missionData = await getRescueMissionByTeamIdApi(currentTeamId);
            const missionArr = extractMissions(missionData);

            // Detect new missions
            const newMissions = missionArr.filter((m) => {
                const id = m.missionId || m.MissionId || m.id || m.rescueMissionId;
                return id && !knownIdsRef.current.has(id);
            });

            // Update known IDs
            missionArr.forEach((m) => {
                const id = m.missionId || m.MissionId || m.id || m.rescueMissionId;
                if (id) knownIdsRef.current.add(id);
            });

            setMissions(missionArr);

            // Only notify after initial load
            if (!isInitialLoadRef.current && newMissions.length > 0) {
                notifyNewMissions(newMissions);
            }
            isInitialLoadRef.current = false;
        } catch (err) {
            console.error("Failed to fetch rescue missions:", err);
        } finally {
            setLoading(false);
        }
    }, [notifyNewMissions]);

    // Initial fetch + polling
    useEffect(() => {
        if (!teamId) {
            setLoading(false);
            return;
        }

        isInitialLoadRef.current = true;
        knownIdsRef.current = new Set();
        setLoading(true);

        fetchAndDetectNew();

        const interval = setInterval(fetchAndDetectNew, 15000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId]);

    // WebSocket listener
    useEffect(() => {
        if (!teamId) return;

        // Connect to WebSocket
        connectWebSocket(null, (status) => {
            console.log("[Realtime Mission] WebSocket status:", status);
        });

        // Join team-specific group
        const groupName = `team_${teamId}`;
        joinGroup(groupName);
        console.log(`[Realtime Mission] Joined group: ${groupName}`);

        // Listen for mission-related notifications
        addMessageListener(listenerId.current, (message) => {
            if (message.type === "notification" && message.content) {
                try {
                    const parsed =
                        typeof message.content === "string"
                            ? JSON.parse(message.content)
                            : message.content;

                    if (parsed && (parsed.rescueMissionId || parsed.missionId || parsed.MissionId)) {
                        // Got mission data via WebSocket — immediately re-fetch
                        fetchAndDetectNew();
                    }
                } catch {
                    // Text-based notification — check keywords
                    const lower = (message.content || "").toLowerCase();
                    if (
                        lower.includes("mission") ||
                        lower.includes("nhiệm vụ") ||
                        lower.includes("assigned") ||
                        lower.includes("phân công") ||
                        lower.includes("giao việc")
                    ) {
                        fetchAndDetectNew();
                    }
                }
            }
        });

        return () => {
            removeMessageListener(listenerId.current);
            leaveGroup(groupName);
            console.log(`[Realtime Mission] Left group: ${groupName}`);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId]);

    return {
        missions,
        setMissions,
        loading,
        refetch: fetchAndDetectNew,
    };
};
