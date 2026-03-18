import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigation, MapPin, Clock, Send, CheckCircle, XCircle, ArrowLeft, Users, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { useRescueRequestById, useUpdateRescueRequest } from '../../../features/Rescue/hook/useRescueRequest';
import { useUpdateRescueMission } from '../../../features/Rescue/hook/useRescueMission';
import { useAssignVehicleByVehicleMission, useUpdateAssignVehicle } from '../../../features/Vehicle/hook/useAssignVehicle';
import { useVehicleById, useUpdateVehicle } from '../../../features/Vehicle/hook/useVehicle';
import { useUpdateRescueTeam } from '../../../features/Rescue/hook/useRescueTeam';
import { getRescueRequestTypesApi } from '../../../features/system_config/api/systemConfigApi';
import { toast } from 'react-toastify';
import MissionMap from './MissionMap';

// ── Status step definitions ─────────────────────────────────────────────
// RescueMission:  1-Assigned, 2-EnRoute, 3-Rescuing, 4-Completed, 5-Failed
// RescueRequest:  1-Assigned, 2-EnRoute, 3-OnSite, 4-Resolved, ... Cancelled

const MISSION_STEPS = [
    { id: 1, statusName: 'Assigned', label: 'Đã giao', icon: '📋' },
    { id: 2, statusName: 'EnRoute', label: 'Đang đi', icon: '🚗' },
    { id: 3, statusName: 'Rescuing', label: 'Đang cứu hộ', icon: '🛟' },
    { id: 4, statusName: 'Completed', label: 'Hoàn thành', icon: '✅' },
];

// Map mission statusId (number) to its step index (0-based)
const getStepIndex = (statusId) => {
    switch (statusId) {
        case 1: return 0; // Assigned
        case 2: return 1; // EnRoute
        case 3: return 2; // Rescuing
        case 4: return 3; // Completed
        case 5: return 3; // Failed (shows at last step visually)
        default: return 0;
    }
};

const getStatusLabel = (statusId) => {
    switch (statusId) {
        case 1: return 'Đã giao';
        case 2: return 'Đang di chuyển';
        case 3: return 'Đang cứu hộ';
        case 4: return 'Hoàn thành';
        case 5: return 'Thất bại';
        default: return 'Chưa rõ';
    }
};

// Proximity threshold in meters to consider "arrived"
const ARRIVAL_THRESHOLD_METERS = 150;

// Haversine distance in meters
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (d) => d * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Stepper Component ───────────────────────────────────────────────────
const StatusStepper = ({ currentStep, isFailed }) => {
    const steps = MISSION_STEPS;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                {/* Progress line background */}
                <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-slate-700 rounded-full z-0" />
                {/* Progress line filled */}
                <div
                    className="absolute top-5 left-[10%] h-1 rounded-full z-[1] transition-all duration-700 ease-in-out"
                    style={{
                        width: `${Math.min(currentStep / (steps.length - 1), 1) * 80}%`,
                        background: isFailed
                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                            : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                    }}
                />

                {steps.map((step, idx) => {
                    const isActive = idx <= currentStep && !isFailed;
                    const isCurrent = idx === currentStep && !isFailed;
                    const isFailedState = isFailed && idx === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center z-10 flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 shadow-lg
                                    ${isFailedState
                                        ? 'bg-red-600 border-red-400 text-white shadow-red-600/40'
                                        : isActive
                                            ? isCurrent
                                                ? 'bg-blue-600 border-blue-400 text-white shadow-blue-600/40 ring-4 ring-blue-600/20'
                                                : 'bg-blue-600 border-blue-500 text-white shadow-blue-600/20'
                                            : 'bg-slate-800 border-slate-600 text-slate-500'
                                    }`}
                            >
                                {isFailedState ? '✕' : isActive ? step.icon : idx + 1}
                            </div>
                            <span className={`mt-2 text-xs font-semibold tracking-wide transition-colors duration-300
                                ${isFailedState ? 'text-red-400' : isActive ? 'text-blue-400' : 'text-slate-500'}`}
                            >
                                {isFailedState ? 'Thất bại' : step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const MissionDetail = ({ mission, onBack, teamIdLabel, theme, onMissionUpdate }) => {
    const { loading: requestLoading, getRescueRequestById } = useRescueRequestById();
    const { updateRescueMission } = useUpdateRescueMission();
    const { updateRescueRequest } = useUpdateRescueRequest();
    const { updateRescueTeam } = useUpdateRescueTeam();

    const [requestData, setRequestData] = useState(null);
    const [requestTypes, setRequestTypes] = useState({});
    const [isNavigating, setIsNavigating] = useState(false);

    // Status tracking — use numeric statusId (1-5)
    const [currentStatusId, setCurrentStatusId] = useState(1);
    const [isFailed, setIsFailed] = useState(false);
    const [updating, setUpdating] = useState(false);
    const hasAutoTransitioned = useRef({ enroute: false, rescuing: false });

    // Vehicle state
    const { fetchAssignVehicleByVehicleMission } = useAssignVehicleByVehicleMission();
    const { updateAssignVehicle } = useUpdateAssignVehicle();
    const { fetchVehicleById } = useVehicleById();
    const { updateVehicle } = useUpdateVehicle();
    const [assignedVehicle, setAssignedVehicle] = useState(null);
    // Track assignment record explicitly
    const [assignedVehicleRecordId, setAssignedVehicleRecordId] = useState(null);

    // User location from MissionMap (shared via callback)
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (mission?.rescueRequestId) {
                const reqData = await getRescueRequestById(mission.rescueRequestId);
                if (reqData && reqData.data) {
                    setRequestData(reqData.data);
                } else if (reqData) {
                    setRequestData(reqData);
                }
            }

            try {
                const types = await getRescueRequestTypesApi();
                let typeArray = types?.data || types;
                if (Array.isArray(typeArray)) {
                    const map = {};
                    typeArray.forEach(t => {
                        const id = t.id ?? t.rescueRequestTypeId ?? t.typeId;
                        map[id] = t.name ?? t.requestTypeName ?? t.typeName;
                    });
                    setRequestTypes(map);
                }
            } catch (err) {
                console.error("Failed to fetch request types", err);
            }

            // Fetch assigned vehicle
            if (mission?.missionId || mission?.MissionId || mission?.id || mission?.rescueMissionId) {
                const mid = mission?.missionId || mission?.MissionId || mission?.id || mission?.rescueMissionId;
                try {
                    const assignData = await fetchAssignVehicleByVehicleMission(mid);
                    const assignments = assignData?.data || assignData;
                    // It returns a list or a single object. If it's a list, we take the first unreleased one or just the first.
                    if (Array.isArray(assignments) && assignments.length > 0) {
                        const assignment = assignments[0]; // the active one
                        if (assignment && assignment.vehicleId) {
                            setAssignedVehicleRecordId(assignment.id ?? assignment.assignVehicleId ?? assignment.assignId ?? assignment.vehicleAssignmentId);
                            const vehicleData = await fetchVehicleById(assignment.vehicleId);
                            setAssignedVehicle(vehicleData?.data || vehicleData);
                        }
                    } else if (assignments && assignments.vehicleId) {
                        setAssignedVehicleRecordId(assignments.id ?? assignments.assignVehicleId ?? assignments.assignId ?? assignments.vehicleAssignmentId);
                        const vehicleData = await fetchVehicleById(assignments.vehicleId);
                        setAssignedVehicle(vehicleData?.data || vehicleData);
                    }
                } catch (err) {
                    console.error("Failed to fetch assigned vehicle:", err);
                }
            }
        };
        fetchDetails();
    }, [mission]);

    // Set initial status from mission data (numeric statusId)
    useEffect(() => {
        if (mission) {
            const statusId = mission.statusId || mission.StatusId || 1;
            setCurrentStatusId(statusId);
            setIsFailed(statusId === 5);

            // Mark transitions that have already occurred
            if (statusId >= 2) hasAutoTransitioned.current.enroute = true;
            if (statusId >= 3) hasAutoTransitioned.current.rescuing = true;
        }
    }, [mission]);

    // ── API helpers ──────────────────────────────────────────────────────
    const missionId = mission?.missionId || mission?.MissionId || mission?.id || mission?.rescueMissionId;
    const requestId = mission?.rescueRequestId;

    const updateBothStatuses = useCallback(async (newMissionStatusId, newRequestStatusId) => {
        setUpdating(true);
        try {
            // Update RescueMission – send only flat DB columns
            await updateRescueMission(missionId, {
                missionId: missionId,
                rescueRequestId: mission.rescueRequestId,
                coordinatorUserId: mission.coordinatorUserId,
                teamId: mission.teamId || mission.TeamId,
                statusId: newMissionStatusId,
                assignedAt: mission.assignedAt || mission.AssignedAt,
                description: mission.description || mission.Description,
            });

            // Update RescueRequest – send only flat DB columns
            if (requestId && newRequestStatusId && requestData) {
                await updateRescueRequest(requestId, {
                    rescueRequestId: requestId,
                    userReqId: requestData.userReqId,
                    requestType: requestData.requestType,
                    urgencyLevel: requestData.urgencyLevel,
                    ipAddress: requestData.ipAddress,
                    userAgent: requestData.userAgent,
                    status: newRequestStatusId,
                    description: requestData.description,
                    peopleCount: requestData.peopleCount,
                    location: requestData.location,
                    locationText: requestData.locationText,
                    createdAt: requestData.createdAt,
                });
            }

            // Update Team Status when Completed or Failed
            const isTerminal = newMissionStatusId === 4 || newMissionStatusId === 5;
            if (isTerminal && (mission.teamId || mission.TeamId)) {
                await updateRescueTeam(mission.teamId || mission.TeamId, {
                    statusId: 1 // Back to available
                });
            }

            if (onMissionUpdate) {
                onMissionUpdate(missionId, newMissionStatusId);
            }

            return true;
        } catch (err) {
            console.error('Failed to update status:', err);
            toast.error('Cập nhật trạng thái thất bại!');
            return false;
        } finally {
            setUpdating(false);
        }
    }, [mission, missionId, requestData, requestId, updateRescueMission, updateRescueRequest, updateRescueTeam, onMissionUpdate]);

    // ── Auto transition: Assigned → EnRoute when user starts navigating ─
    useEffect(() => {
        if (
            isNavigating &&
            currentStatusId === 1 &&
            !hasAutoTransitioned.current.enroute
        ) {
            hasAutoTransitioned.current.enroute = true;
            (async () => {
                // Mission: Assigned(1) → EnRoute(2), Request: Assigned(3) → EnRoute(4)
                const success = await updateBothStatuses(2, 4);
                if (success) {
                    setCurrentStatusId(2);
                    toast.success('Trạng thái: Đang di chuyển đến vị trí cứu hộ');
                }
            })();
        }
    }, [isNavigating, currentStatusId, updateBothStatuses]);

    // ── Auto transition: EnRoute → Rescuing when arriving at destination ─
    useEffect(() => {
        if (!userLocation || !requestData || !isNavigating) return;
        if (currentStatusId !== 2) return;
        if (hasAutoTransitioned.current.rescuing) return;

        // Get rescue location from request data
        const coords = requestData?.location?.coordinates;
        if (!coords || coords.length < 2) return;

        const rescueLat = coords[1];
        const rescueLon = coords[0];
        const distance = haversineDistance(userLocation[0], userLocation[1], rescueLat, rescueLon);

        if (distance <= ARRIVAL_THRESHOLD_METERS) {
            hasAutoTransitioned.current.rescuing = true;
            (async () => {
                // Mission: EnRoute(2) → Rescuing(3), Request: EnRoute(4) → OnSite(5)
                const success = await updateBothStatuses(3, 5);
                if (success) {
                    setCurrentStatusId(3);
                    toast.success('🎯 Đã đến nơi! Trạng thái: Đang cứu hộ');
                }
            })();
        }
    }, [userLocation, requestData, currentStatusId, isNavigating, updateBothStatuses]);

    // ── Manual final status handlers ─────────────────────────────────────
    const handleComplete = async () => {
        if (updating) return;
        // Mission: → Completed(4), Request: → Resolved(6)
        const success = await updateBothStatuses(4, 6);
        if (success) {
            setCurrentStatusId(4);
            setIsNavigating(false);

            const vId = assignedVehicle?.vehicleId || assignedVehicle?.id;
            // Release vehicle if assigned
            if (vId) {
                try {
                    await updateAssignVehicle(vId);
                } catch (e) {
                    console.error("Failed to release vehicle", e);
                }
            }

            // Update Vehicle status to available
            if (vId) {
                try {
                    await updateVehicle(vId, {
                        ...assignedVehicle,
                        statusId: 1
                    });
                } catch (e) {
                    console.error("Failed to update vehicle status", e);
                }
            }

            toast.success('✅ Nhiệm vụ hoàn thành!');
        }
    };

    const handleFailed = async () => {
        if (updating) return;
        // Mission: → Failed(5), Request: → Cancelled(7)
        const success = await updateBothStatuses(5, 7);
        if (success) {
            setCurrentStatusId(5);
            setIsFailed(true);
            setIsNavigating(false);

            const vId = assignedVehicle?.vehicleId || assignedVehicle?.id;
            // Release vehicle if assigned
            if (vId) {
                try {
                    await updateAssignVehicle(vId);
                } catch (e) {
                    console.error("Failed to release vehicle", e);
                }
            }

            // Update Vehicle status to available
            if (vId) {
                try {
                    await updateVehicle(vId, {
                        ...assignedVehicle,
                        statusId: 1
                    });
                } catch (e) {
                    console.error("Failed to update vehicle status", e);
                }
            }

            toast.error('Nhiệm vụ thất bại');
        }
    };

    // ── UI helpers ───────────────────────────────────────────────────────
    const getUrgencyLabel = (level) => {
        switch (level) {
            case 3: return { label: 'KHẨN CẤP CAO', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
            case 2: return { label: 'NGUY HIỂM', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
            case 1:
            default: return { label: 'CẦN HỖ TRỢ', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
        }
    };

    const urgencyInfo = getUrgencyLabel(requestData?.urgencyLevel ?? mission?.priorityLv ?? 1);
    const requestTypeLabel = requestTypes[requestData?.requestType] || 'Cứu hộ';
    const currentStepIdx = getStepIndex(currentStatusId);
    const isTerminal = currentStatusId === 4 || currentStatusId === 5;

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-blue-500 font-bold text-xs tracking-wider mb-1 uppercase">
                        {teamIdLabel || 'Mã đội: '}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-lg transition-colors ${theme?.iconHover || 'hover:bg-slate-700/50'} ${theme?.textMuted || 'text-slate-300'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className={`text-3xl font-extrabold ${theme?.textTitle || 'text-white'} tracking-tight`}>Nhiệm Vụ Cứu Hộ Của Tôi</h1>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wide">Trực Tuyến</span>
                </div>
            </div>

            {/* ── Status Stepper ──────────────────────────────────────────── */}
            <div className={`${theme?.cardBg || 'bg-[#121A22]'} border ${theme?.border || 'border-slate-800/80'} rounded-2xl p-6 mb-6 shadow-lg`}>
                <h2 className={`text-sm font-bold ${theme?.textMuted || 'text-slate-400'} mb-4 uppercase tracking-wider`}>Tiến trình nhiệm vụ</h2>
                <StatusStepper currentStep={currentStepIdx} isFailed={isFailed} />

                {/* Current status label */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    {updating && <Loader2 size={16} className="animate-spin text-blue-400" />}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isFailed
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : currentStatusId === 4
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                        {updating ? 'Đang cập nhật...' : `Trạng thái hiện tại: ${getStatusLabel(currentStatusId)}`}
                    </span>
                </div>

                {/* ── Final action buttons (only show at Rescuing stage or later) ── */}
                {currentStatusId === 3 && !isTerminal && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            onClick={handleComplete}
                            disabled={updating}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all"
                        >
                            <CheckCircle size={20} />
                            Hoàn thành nhiệm vụ
                        </button>
                        <button
                            onClick={handleFailed}
                            disabled={updating}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all"
                        >
                            <XCircle size={20} />
                            Thất bại
                        </button>
                    </div>
                )}
            </div>

            <h2 className={`text-lg font-bold ${theme?.text || 'text-slate-200'} mb-4`}>Thông tin nhiệm vụ</h2>

            {/* Main Info Card */}
            <div className={`${theme?.cardBg || 'bg-[#121A22]'} border ${theme?.border || 'border-slate-800/80'} rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row mb-8`}>

                {/* Left Side: Real-time Map */}
                <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-slate-800 relative z-0">
                    <MissionMap
                        requestData={requestData}
                        isNavigating={isNavigating}
                        setIsNavigating={setIsNavigating}
                        onUserLocationChange={setUserLocation}
                    />

                    {/* Direction Button Overlay */}
                    {!isTerminal && (
                        <button
                            onClick={() => setIsNavigating(!isNavigating)}
                            className={`absolute bottom-4 right-4 ${isNavigating ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition-colors z-[1000]`}
                        >
                            {isNavigating ? <XCircle size={18} /> : <Navigation size={18} />}
                            {isNavigating ? 'Dừng Chỉ Đường' : 'Chỉ Đường'}
                        </button>
                    )}
                </div>

                {/* Right Side: Mission Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`${urgencyInfo.color} border px-3 py-1 rounded-md text-xs font-bold tracking-wider`}>
                            {urgencyInfo.label}
                        </span>
                        <span className="text-slate-500 text-sm font-semibold tracking-wider">
                            #{missionId || 'N/A'}
                        </span>
                    </div>

                    <h3 className={`text-2xl font-bold ${theme?.textTitle || 'text-white'} mb-2`}>
                        {mission.name || mission.title || `Nhiệm vụ #${missionId}`}
                    </h3>

                    <div className="flex flex-col gap-2 mb-4">
                        <div className={`flex items-center gap-2 ${theme?.text || 'text-slate-300'} text-sm font-medium`}>
                            <Info size={16} className="text-blue-500" />
                            <span>Loại yêu cầu: <span className="font-bold">{requestTypeLabel}</span></span>
                        </div>
                        <div className={`flex items-center gap-2 ${theme?.text || 'text-slate-300'} text-sm font-medium`}>
                            <AlertTriangle size={16} className="text-orange-500" />
                            <span>Phụ trách: <span className="font-bold">{teamIdLabel.replace('MÃ ĐỘI: ', '')}</span></span>
                        </div>
                        {assignedVehicle && (
                            <div className={`flex items-center gap-2 ${theme?.text || 'text-slate-300'} text-sm font-medium`}>
                                <div className="text-purple-500 w-4 h-4 flex items-center justify-center">🚐</div>
                                <span>Phương tiện: <span className="font-bold">{assignedVehicle.vehicleCode || assignedVehicle.name}</span>
                                    {assignedVehicle.note && <span className="text-slate-500 italic ml-2">- {assignedVehicle.note}</span>}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className={`text-sm leading-relaxed mb-6 ${theme?.textMuted || 'text-slate-400'}`}>
                        {requestData?.description || mission.description || mission.Description || mission.notes || 'Không có mô tả chi tiết'}
                    </p>

                    <div className="flex flex-col gap-3 bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
                        <div className={`flex items-center gap-3 ${theme?.text || 'text-slate-300'}`}>
                            <Users size={16} className="text-blue-500" />
                            <span className="text-sm font-semibold">Cần cứu hộ: {requestData?.peopleCount ?? 1} người</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <MapPin size={16} className="text-red-500" />
                            <span className="text-sm line-clamp-2">{requestData?.locationText || 'Chưa có thông tin địa chỉ'}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <Clock size={16} className="text-green-500" />
                            <span className="text-sm">Yêu cầu lúc: {requestData?.createdAt ? new Intl.DateTimeFormat('vi-VN', {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit'
                            }).format(new Date(requestData.createdAt)) : 'Chưa rõ'}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <Clock size={16} className="text-blue-500" />
                            <span className="text-sm">Giao lúc: {mission.assignedAt || mission.AssignedAt ? new Intl.DateTimeFormat('vi-VN', {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit'
                            }).format(new Date(mission.assignedAt || mission.AssignedAt)) : 'Chưa rõ thời gian'}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MissionDetail;
