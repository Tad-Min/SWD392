import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, Shield, MapPin, User, Users, ChevronDown, ChevronRight, Activity, Archive } from 'lucide-react';
import { useRescueMission } from '../../../features/Rescue/hook/useRescueMission';
import { useRescueRequest } from '../../../features/Rescue/hook/useRescueRequest';
import { useRescueMissionStatusById } from '../../../features/status/hook/useRescueMissionStatus';
import { useUsers } from '../../../features/users/hook/useUsers';

export default function MissionManagerModal({ isOpen, onClose, teams = [] }) {
    const { getRescueMission, loading: missionsLoading } = useRescueMission();
    const { getRescueRequest } = useRescueRequest();
    const { getRescueMissionStatusById } = useRescueMissionStatusById();
    const { getUsers } = useUsers();

    const [missions, setMissions] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [requestsMap, setRequestsMap] = useState({});
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'
    const [expandedId, setExpandedId] = useState(null);

    const urgencyMeta = {
        1: { label: 'Cần hỗ trợ', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        2: { label: 'Nguy hiểm', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
        3: { label: 'Khẩn cấp', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };

    // Mission status ID mapping: 1=Assigned, 2=EnRoute, 3=Rescuing, 4=Completed, 5=Failed
    const activeStatusIds = [1, 2, 3];
    const completedStatusIds = [4, 5];

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                let msns = [];
                try {
                    const res = await getRescueMission();
                    msns = res?.data ?? res ?? [];
                    if (Array.isArray(msns)) {
                        msns = msns.sort((a, b) => (b.missionId ?? 0) - (a.missionId ?? 0));
                        setMissions(msns);
                    } else {
                        setMissions([]);
                    }
                } catch (err) {
                    console.error("Failed to fetch missions", err);
                }

                // Fetch statuses
                try {
                    const uniqueStatusIds = [...new Set(msns.map((m) => m.statusId).filter(Boolean))];
                    const sMap = {};
                    await Promise.all(
                        uniqueStatusIds.map(async (sid) => {
                            try {
                                const sRes = await getRescueMissionStatusById(sid);
                                const sObj = sRes?.data ?? sRes;
                                if (sObj) sMap[sid] = sObj.statusName ?? sObj.name;
                            } catch (e) {
                                console.error(`Failed to fetch status ${sid}:`, e);
                            }
                        })
                    );
                    setStatusMap(sMap);
                } catch (e) {
                    console.error("Failed to fetch mission statuses", e);
                }

                // Fetch Requests
                try {
                    const reqRes = await getRescueRequest();
                    const reqData = reqRes?.data ?? reqRes ?? [];
                    const rMap = {};
                    if (Array.isArray(reqData)) {
                        reqData.forEach(r => {
                            const id = r.rescueRequestId ?? r.id;
                            if (id != null) rMap[id] = r;
                        });
                    }
                    setRequestsMap(rMap);
                } catch (e) {
                    console.error("Failed to fetch requests", e);
                }

                // Fetch Users
                try {
                    const uRes = await getUsers();
                    let uData = uRes?.data ?? uRes ?? [];
                    if (uData.items) uData = uData.items;
                    const uMap = {};
                    if (Array.isArray(uData)) {
                        uData.forEach(u => {
                            const id = u.userId ?? u.id;
                            if (id != null) uMap[id] = u;
                        });
                    }
                    setUsersMap(uMap);
                } catch (e) {
                    console.error("Failed to fetch users", e);
                }
            } catch (err) {
                console.error("Failed to fetch missions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.teamId === teamId);
        return team ? (team.teamName || team.name) : `Đội (ID: ${teamId})`;
    };

    const getStatusInfo = (mission) => {
        const sid = mission.statusId;
        const statusName = statusMap[sid] || 'Không rõ';
        const lowerName = statusName.toLowerCase();

        let color = 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        let icon = <Clock className="w-3.5 h-3.5" />;

        if (lowerName.includes('assigned') || lowerName.includes('phân công')) {
            color = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            icon = <Clock className="w-3.5 h-3.5" />;
        } else if (lowerName.includes('enroute') || lowerName.includes('di chuyển')) {
            color = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            icon = <Activity className="w-3.5 h-3.5" />;
        } else if (lowerName.includes('rescuing') || lowerName.includes('cứu hộ')) {
            color = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            icon = <Shield className="w-3.5 h-3.5" />;
        } else if (lowerName.includes('completed') || lowerName.includes('hoàn thành')) {
            color = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            icon = <CheckCircle className="w-3.5 h-3.5" />;
        } else if (lowerName.includes('failed') || lowerName.includes('thất bại')) {
            color = 'bg-red-500/20 text-red-400 border-red-500/30';
            icon = <XCircle className="w-3.5 h-3.5" />;
        }

        return { label: statusName, color, icon };
    };

    const filteredMissions = missions.filter(m => {
        const sid = m.statusId;
        if (activeTab === 'active') return activeStatusIds.includes(sid);
        return completedStatusIds.includes(sid);
    });

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const tabs = [
        { key: 'active', label: 'Đang thực hiện', icon: <Activity className="w-4 h-4" />, count: missions.filter(m => activeStatusIds.includes(m.statusId)).length },
        { key: 'completed', label: 'Đã hoàn thành', icon: <Archive className="w-4 h-4" />, count: missions.filter(m => completedStatusIds.includes(m.statusId)).length },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-[fadeInScale_0.2s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Quản Lý Chung</h3>
                            <p className="text-xs text-slate-400">Tất cả nhiệm vụ cứu hộ</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 px-6 bg-slate-800/30">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setExpandedId(null); }}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === tab.key
                                    ? 'text-blue-400 border-blue-400'
                                    : 'text-slate-400 border-transparent hover:text-slate-300'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {loading || missionsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                            <p className="text-slate-400 text-sm">Đang tải danh sách nhiệm vụ...</p>
                        </div>
                    ) : filteredMissions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-slate-800/30 rounded-2xl border border-dashed border-white/10">
                            <Shield className="w-10 h-10 text-slate-600 mb-3" />
                            <p className="text-slate-400 text-sm">
                                {activeTab === 'active' ? 'Không có nhiệm vụ đang thực hiện' : 'Không có nhiệm vụ đã hoàn thành'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {filteredMissions.map((m) => {
                                const statusInfo = getStatusInfo(m);
                                const mId = m.missionId;
                                const isExpanded = expandedId === mId;
                                const request = requestsMap[m.rescueRequestId];
                                const reqUser = request ? usersMap[request.userReqId] : null;
                                const urgencyInfo = request ? urgencyMeta[request.urgencyLevel] : null;
                                const locationText = request?.locationText || 'Chưa xác định';
                                const userName = reqUser ? (reqUser.fullName || reqUser.userName) : 'Không rõ';

                                return (
                                    <div key={mId} className="bg-slate-800/40 border border-white/5 rounded-xl overflow-hidden transition-all">
                                        {/* Collapsed row — always visible */}
                                        <button
                                            onClick={() => toggleExpand(mId)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/70 transition-colors cursor-pointer"
                                        >
                                            <div className="text-slate-400">
                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 flex items-center gap-3 min-w-0">
                                                <span className="text-sm font-bold text-white whitespace-nowrap">
                                                    Nhiệm vụ #{mId}
                                                </span>
                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${statusInfo.color}`}>
                                                    {statusInfo.icon}
                                                    <span>{statusInfo.label}</span>
                                                </div>
                                                {urgencyInfo && (
                                                    <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${urgencyInfo.color} hidden sm:block`}>
                                                        {urgencyInfo.label}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-slate-500 whitespace-nowrap">
                                                {m.teamId ? getTeamName(m.teamId) : ''}
                                            </span>
                                        </button>

                                        {/* Expanded details */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-slate-900/40 space-y-3 animate-[fadeIn_0.15s_ease-out]">
                                                {/* User & Urgency */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <User className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-white font-semibold">{userName}</span>
                                                    </div>
                                                    {urgencyInfo && (
                                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${urgencyInfo.color}`}>
                                                            {urgencyInfo.label}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Location */}
                                                <div className="flex items-start gap-2 text-xs">
                                                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                                    <span className="text-slate-300 leading-tight">{locationText}</span>
                                                </div>

                                                {/* Team */}
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                                                    <span className="text-white font-semibold">
                                                        {m.teamId ? getTeamName(m.teamId) : 'Chưa phân công'}
                                                    </span>
                                                </div>

                                                {/* Description */}
                                                {m.description && (
                                                    <div className="text-[11px] text-slate-400 italic bg-black/20 p-2 rounded">
                                                        "{m.description}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
