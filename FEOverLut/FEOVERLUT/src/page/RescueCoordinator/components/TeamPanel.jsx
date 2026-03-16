import { useState, useEffect } from 'react';
import { Users, Shield, Radio, ChevronDown, Truck, Activity } from 'lucide-react';
import { useRescueTeamStatusById } from '../../../features/status/hook/useRescueTeamStatus';
import { useGetRescueTeamMemberByTeamId, useGetRescueTeamMemberRoleById } from '../../../features/Rescue/hook/useRescueTeam';
import { useVehicle } from '../../../features/Vehicle/hook/useVehicle';
import { useVehiclesStatus } from '../../../features/status/hook/useVehiclesStatus';
import { useSystemConfig } from '../../../features/system_config/hook/useSystemConfig';
import { getUserByIdApi } from '../../../features/users/api/usersApi';

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

const TeamAccordionItem = ({ team, getStatusName }) => {
    const [expanded, setExpanded] = useState(false);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const { getRescueTeamMemberByTeamId } = useGetRescueTeamMemberByTeamId();
    const { getRescueTeamMemberRoleById } = useGetRescueTeamMemberRoleById();

    const fetchMembers = async () => {
        if (!expanded && members.length === 0) {
            setLoadingMembers(true);
            try {
                const teamId = team.id ?? team.teamId ?? team.rescueTeamId;

                // If team object already contains rescueTeamMembers, use it. Otherwise fetch.
                let list = team.rescueTeamMembers;
                if (!list || list.length === 0) {
                    const res = await getRescueTeamMemberByTeamId(teamId);
                    list = res?.data ?? res ?? [];
                }
                if (!Array.isArray(list)) list = [];

                // Fetch user names and role names for each member concurrently
                const enrichedMembers = await Promise.all(
                    list.map(async (m) => {
                        let userName = `ID: ${m.userId}`;
                        let roleName = `Role ID: ${m.roleId}`;

                        try {
                            // Run both API calls in parallel
                            const [userRes, roleRes] = await Promise.allSettled([
                                getUserByIdApi(m.userId),
                                getRescueTeamMemberRoleById(m.roleId)
                            ]);

                            if (userRes.status === 'fulfilled') {
                                const user = userRes.value?.data ?? userRes.value;
                                if (user) userName = user.fullName || user.userName || userName;
                            }

                            if (roleRes.status === 'fulfilled') {
                                const role = roleRes.value?.data ?? roleRes.value;
                                if (role) roleName = role.rollName ?? role.roleName ?? role.name ?? roleName;
                            }

                        } catch (err) {
                            console.error(`Error enriching member ${m.userId}`, err);
                        }

                        return { ...m, userName, roleName };
                    })
                );

                setMembers(enrichedMembers);
            } catch (err) {
                console.error('Failed to fetch members', err);
            } finally {
                setLoadingMembers(false);
            }
        }
        setExpanded(!expanded);
    };

    const statusName = getStatusName(team);

    return (
        <div className="flex flex-col bg-slate-800/40 hover:bg-slate-800/70 transition-colors rounded-xl overflow-hidden border border-white/5">
            <div
                className="flex items-center gap-3 p-2.5 cursor-pointer"
                onClick={fetchMembers}
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
                <span className={`w-2 h-2 rounded-full flex-shrink-0 mr-1 ${getStatusColor(statusName)}`} />
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </div>

            {expanded && (
                <div className="px-3 pb-3 pt-1 border-t border-white/5 space-y-2 bg-slate-800/20">
                    {loadingMembers ? (
                        <p className="text-[10px] text-slate-400 text-center py-1">Đang tải thành viên...</p>
                    ) : members.length === 0 ? (
                        <p className="text-[10px] text-slate-400 text-center py-1">Không có thành viên nào</p>
                    ) : (
                        members.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-2 pl-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                                <div className="flex flex-col">
                                    <p className="text-xs text-slate-300">
                                        {m.userName}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        Vai trò: {m.roleName ?? 'Thành viên'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default function TeamPanel({ teams = [] }) {
    const [collapsed, setCollapsed] = useState(false);
    const [vehiclesCollapsed, setVehiclesCollapsed] = useState(false);

    // Status maps
    const { getRescueTeamStatusById } = useRescueTeamStatusById();
    const [statusMap, setStatusMap] = useState({});

    // Vehicles state
    const { fetchVehicle } = useVehicle();
    const { getVehiclesStatus } = useVehiclesStatus();
    const { getVehicleTypes } = useSystemConfig();
    const [vehicles, setVehicles] = useState([]);
    const [vehicleStatusMap, setVehicleStatusMap] = useState({});
    const [vehicleTypeMap, setVehicleTypeMap] = useState({});

    // Fetch Team Statuses
    useEffect(() => {
        if (!teams || teams.length === 0) return;

        (async () => {
            try {
                const uniqueStatusIds = [...new Set(teams.map(t => t.statusId ?? t.rescueTeamStatusId ?? t.id).filter(Boolean))];
                const newMap = { ...statusMap };
                let hasChanges = false;

                await Promise.all(
                    uniqueStatusIds.map(async (sid) => {
                        if (newMap[sid]) return; // already fetched
                        try {
                            const data = await getRescueTeamStatusById(sid);
                            const status = data?.data ?? data;
                            if (status && (status.statusName || status.name)) {
                                newMap[sid] = status.statusName || status.name;
                                hasChanges = true;
                            }
                        } catch (err) {
                            console.error(`Failed to fetch status for id ${sid}:`, err);
                        }
                    })
                );

                if (hasChanges) {
                    setStatusMap(newMap);
                }
            } catch (err) {
                console.error('Failed to fetch team statuses:', err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teams]);

    // Fetch Vehicles & Vehicle Statuses
    useEffect(() => {
        (async () => {
            try {
                // Fetch vehicle types
                try {
                    const vtData = await getVehicleTypes();
                    const vtList = vtData?.data ?? vtData ?? [];
                    const vtMap = {};
                    vtList.forEach(t => {
                        const id = t.id ?? t.vehicleTypeId ?? t.typeId;
                        const name = t.typeName ?? t.name;
                        if (id != null && name) vtMap[id] = name;
                    });
                    setVehicleTypeMap(vtMap);
                } catch (err) {
                    console.error('Failed to fetch vehicle types:', err);
                }

                // Fetch vehicle statuses
                const vsData = await getVehiclesStatus();
                const vsList = vsData?.data ?? vsData ?? [];
                const vMap = {};
                vsList.forEach(s => {
                    const id = s.id ?? s.vehiclesStatusId;
                    const name = s.statusName ?? s.name;
                    if (id != null && name) vMap[id] = name;
                });
                setVehicleStatusMap(vMap);

                // Fetch vehicles
                const vData = await fetchVehicle();
                const vList = vData?.data ?? vData ?? [];
                setVehicles(Array.isArray(vList) ? vList : []);
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helper functions
    const getStatusName = (team) => {
        const statusId = team.statusId ?? team.rescueTeamStatusId ?? team.id;
        if (statusId && statusMap[statusId]) return statusMap[statusId];
        if (team.status) return team.status;
        return 'Không rõ';
    };

    const getVehicleStatusName = (v) => {
        const sid = v.statusId ?? v.vehiclesStatusId;
        return (sid && vehicleStatusMap[sid]) ? vehicleStatusMap[sid] : 'Không rõ';
    };

    // Calculate stats
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
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[40vh]">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
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
                    <div className="overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hide flex-1 mt-2">
                        {teams.length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-4">Chưa có đội nào</p>
                        )}
                        {teams.map((team) => (
                            <TeamAccordionItem
                                key={team.teamId ?? team.id ?? team.rescueTeamId}
                                team={team}
                                getStatusName={getStatusName}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Vehicles list card */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[30vh]">
                <button
                    onClick={() => setVehiclesCollapsed(!vehiclesCollapsed)}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-white">Danh sách phương tiện</span>
                        <span className="text-[10px] font-medium bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full ml-1">
                            {vehicles.length}
                        </span>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${vehiclesCollapsed ? 'rotate-180' : ''}`}
                    />
                </button>

                {!vehiclesCollapsed && (
                    <div className="overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hide flex-1 mt-2">
                        {vehicles.length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-4">Chưa có phương tiện nào</p>
                        )}
                        {vehicles.map((v) => {
                            const vStatus = getVehicleStatusName(v);
                            return (
                                <div
                                    key={v.id ?? v.vehicleId}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-white/5"
                                >
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <p className="text-xs font-semibold text-white truncate">
                                            {v.vehicleCode ?? v.name ?? 'Phương tiện'}
                                        </p>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-[10px] text-slate-400 truncate">
                                                Loại: {vehicleTypeMap[v.vehicleType] ?? v.vehicleType ?? 'Không rõ'}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-slate-500" />
                                                <span className="text-[10px] text-slate-300">{vStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
