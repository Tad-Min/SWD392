import { useState, useEffect } from 'react';
import { Users, Shield, Radio, ChevronDown } from 'lucide-react';
import { useRescueTeamStatus } from '../../../features/status/hook/useRescueTeamStatus';

// Badge color palette by status name
const STATUS_COLORS = {
    available: 'bg-emerald-400',
    busy: 'bg-amber-400',
    offline: 'bg-slate-500',
};

function getStatusColor(statusName) {
    if (!statusName) return 'bg-slate-500';
    const key = statusName.toLowerCase();
    return STATUS_COLORS[key] || 'bg-slate-500';
}

export default function TeamPanel({ teams = [] }) {
    const [collapsed, setCollapsed] = useState(false);
    const { getRescueTeamStatus } = useRescueTeamStatus();
    const [statusMap, setStatusMap] = useState({}); // id → statusName

    // Fetch statuses from API
    useEffect(() => {
        (async () => {
            try {
                const data = await getRescueTeamStatus();
                const list = data?.data ?? data;
                if (Array.isArray(list)) {
                    const map = {};
                    list.forEach((s) => {
                        const id = s.id ?? s.rescueTeamStatusId;
                        const name = s.statusName ?? s.name;
                        if (id != null && name) map[id] = name;
                    });
                    setStatusMap(map);
                }
            } catch (err) {
                console.error('Failed to fetch team statuses:', err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Resolve status name for a team
    const getStatusName = (team) => {
        // Try statusMap lookup first (by rescueTeamStatusId)
        const statusId = team.rescueTeamStatusId ?? team.statusId;
        if (statusId && statusMap[statusId]) return statusMap[statusId];
        // Fallback to direct status field
        if (team.status) return team.status;
        return 'Không rõ';
    };

    // Count teams by status
    const available = teams.filter((t) => getStatusName(t).toLowerCase() === 'available').length;
    const busy = teams.filter((t) => getStatusName(t).toLowerCase() === 'busy').length;

    return (
        <div className="absolute top-4 right-4 z-10 w-80 flex flex-col gap-3">
            {/* Stats card */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white">Đội cứu hộ</h3>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
                        {teams.length} đội
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-white">{teams.length}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Tổng</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-emerald-400">{available}</p>
                        <p className="text-[10px] text-emerald-400/70 mt-0.5">Sẵn sàng</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-amber-400">{busy}</p>
                        <p className="text-[10px] text-amber-400/70 mt-0.5">Đang đi</p>
                    </div>
                </div>
            </div>

            {/* Team list card */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-white">Danh sách đội</span>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
                    />
                </button>

                {!collapsed && (
                    <div className="max-h-[320px] overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hide">
                        {teams.length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-4">Chưa có đội nào</p>
                        )}
                        {teams.map((team) => {
                            const statusName = getStatusName(team);
                            return (
                                <div
                                    key={team.id ?? team.rescueTeamId}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Users className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">
                                            {team.teamName || team.name || 'Đội cứu hộ'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate">
                                            {statusName}
                                        </p>
                                    </div>
                                    <span
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(statusName)}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
