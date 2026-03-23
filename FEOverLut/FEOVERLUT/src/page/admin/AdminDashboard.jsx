import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useUsers } from '../../features/users/hook/useUsers';
import { useMissions } from '../../features/missions/hook/useMissions';
import api from '../../config/axios';
import { toast } from 'react-toastify';


const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
};

// ── System Load ───────────────────────────────────────────────────
const systemLoadData = [
    { time: '00:00', requests: 120, cpu: 15 },
    { time: '04:00', requests: 45, cpu: 8 },
    { time: '08:00', requests: 450, cpu: 30 },
    { time: '12:00', requests: 800, cpu: 55 },
    { time: '16:00', requests: 620, cpu: 42 },
    { time: '20:00', requests: 950, cpu: 75 },
    { time: '23:59', requests: 300, cpu: 22 },
];

// ── Role Configurations (khớp với DB: 1=Citizen, 2=RescueTeam, 3=Coordinator, 4=Manager, 5=Admin) ───
const ROLE_MAP = {
    1: { label: 'Citizen', color: 'bg-slate-400' },
    2: { label: 'Rescue Team', color: 'bg-emerald-500' },
    3: { label: 'Coordinator', color: 'bg-blue-500' },
    4: { label: 'Manager', color: 'bg-indigo-500' },
    5: { label: 'Admin', color: 'bg-fuchsia-500' },
};

const AdminDashboard = () => {
    const { isDarkMode, theme } = useOutletContext();

    // ── API state ─────────────────────────────────────────────────
    const [users, setUsers] = useState([]);
    const [missions, setMissions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [systemLogs, setSystemLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { getUsers } = useUsers();
    const { getRescueMissions, getRescueRequests } = useMissions();

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        const [uRes, mRes, rRes] = await Promise.allSettled([
            getUsers(),
            getRescueMissions(),
            getRescueRequests(),
        ]);
        if (uRes.status === 'fulfilled') setUsers(toArr(uRes.value));
        if (mRes.status === 'fulfilled') setMissions(toArr(mRes.value));
        if (rRes.status === 'fulfilled') setRequests(toArr(rRes.value));
        setIsLoading(false);
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    // ── Fetch real logs từ BE api/Logs ───────────────────────────────
    const fetchLogs = useCallback(async () => {
        try {
            const [reqLogs, missionLogs] = await Promise.allSettled([
                api.get('Logs/rescue-request'),
                api.get('Logs/mission'),
            ]);
            const combined = [
                ...(reqLogs.status === 'fulfilled' ? toArr(reqLogs.value?.data) : []).map(l => ({
                    ...l,
                    _type: 'REQUEST',
                    _status: 'info',
                })),
                ...(missionLogs.status === 'fulfilled' ? toArr(missionLogs.value?.data) : []).map(l => ({
                    ...l,
                    _type: 'MISSION',
                    _status: 'info',
                })),
            ].slice(0, 10);
            setSystemLogs(combined);
        } catch {
            setSystemLogs([]);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);
    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    // ── Computed ──────────────────────────────────────────────────
    const totalUsers = users.length;
    const totalMissions = missions.length;
    const pendingRequests = requests.filter(r => r.statusId === 1 || r.status === 1).length;

    // Role distribution from real users
    const roleStats = Object.entries(ROLE_MAP).map(([id, info]) => ({
        ...info,
        count: users.filter(u => u.roleId === parseInt(id) || u.roleid === parseInt(id)).length,
    })).filter(r => r.count > 0);

    const maxRoleCount = Math.max(...roleStats.map(r => r.count), 1);

    const getLogIconColor = (status) => {
        if (status === 'error') return 'text-red-500 bg-red-500/10';
        if (status === 'warning') return 'text-orange-500 bg-orange-500/10';
        if (status === 'success') return 'text-emerald-500 bg-emerald-500/10';
        return 'text-blue-500 bg-blue-500/10';
    };

    // System logs — từ API thực (fallback placeholder nếu rỗng)
    const displayLogs = systemLogs.length > 0 ? systemLogs : [
        { id: 1, _type: 'INFO', changedAt: null, _status: 'info', newRescueRequests: `Tổng ${totalUsers} tài khoản, ${totalMissions} nhiệm vụ, ${requests.length} yêu cầu cứu hộ.` },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className={`text-sm ${theme.textMuted} font-medium tracking-wide animate-pulse`}>Đang quét trạng thái hệ thống...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Tổng Quan Quản Trị Hệ Thống</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Giám sát tài nguyên máy chủ, nhiệm vụ cứu hộ và cấu trúc phân quyền người dùng.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchAll} className={`p-2 rounded-lg border ${theme.border} ${theme.textMuted} hover:text-cyan-500 transition-colors`} title="Làm mới">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.cardBg} ${theme.text} shadow-sm flex items-center gap-2`}>
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                        Server: ONLINE (Uptime: 99.9%)
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Tổng users — from API */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className={`text-xs font-bold ${totalUsers > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{totalUsers > 0 ? `${totalUsers} tài khoản` : 'Chưa có data'}</span>
                    </div>
                    <h4 className={`text-3xl font-bold ${theme.text}`}>{totalUsers.toLocaleString()}</h4>
                    <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Tổng số tài khoản (Users)</p>
                </div>

                {/* Nhiệm vụ — from API */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        </div>
                        <span className="text-xs font-bold text-cyan-500">Nhiệm vụ</span>
                    </div>
                    <h4 className={`text-3xl font-bold ${theme.text}`}>{totalMissions.toLocaleString()}</h4>
                    <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Tổng nhiệm vụ cứu hộ (Missions)</p>
                </div>

                {/* Rescue Requests — from API */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-red-500">Rescue SOS</span>
                    </div>
                    <h4 className={`text-3xl font-bold ${theme.text}`}>{requests.length.toLocaleString()}</h4>
                    <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Yêu cầu cứu hộ (Requests)</p>
                </div>

                {/* Storage */}
                {/* <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-fuchsia-500/10 text-fuchsia-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">65%</span>
                    </div>
                    <h4 className={`text-3xl font-bold ${theme.text}`}>3.2<span className="text-lg">GB</span></h4>
                    <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Overlut_Storage Database</p>
                </div> */}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* System Load Chart */}
                <div className={`lg:col-span-2 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`font-bold text-lg ${theme.text}`}>Biểu Đồ Tải Máy Chủ</h3>
                            <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Tần suất request API và CPU Load (dữ liệu mô phỏng).</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={systemLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }} itemStyle={{ color: isDarkMode ? '#E2E8F0' : '#0F172A', fontSize: '13px', fontWeight: 600 }} />
                                <Area type="monotone" dataKey="requests" name="API Requests" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                                <Area type="monotone" dataKey="cpu" name="CPU Load %" stroke="#8B5CF6" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Roles Distribution — from real /api/User data */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm flex flex-col`}>
                    <div className="mb-6">
                        <h3 className={`font-bold text-lg ${theme.text}`}>Phân Bổ Quyền (Roles)</h3>
                        <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>
                            {totalUsers > 0 ? `Tổng ${totalUsers} tài khoản (API thực).` : 'Chưa có dữ liệu user.'}
                        </p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-4 w-full px-2">
                        {roleStats.length > 0 ? roleStats.map((roleInfo, idx) => {
                            const pct = Math.max((roleInfo.count / maxRoleCount) * 100, 3);
                            return (
                                <div key={idx} className="w-full">
                                    <div className="flex justify-between text-[13px] font-semibold mb-1">
                                        <span className={theme.text}>{roleInfo.label}</span>
                                        <span className={theme.textMuted}>{roleInfo.count.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                        <div className={`h-full ${roleInfo.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        }) : (
                            // Fallback if data is empty
                            Object.entries(ROLE_MAP).map(([id, info]) => (
                                <div key={id} className="w-full">
                                    <div className="flex justify-between text-[13px] font-semibold mb-1">
                                        <span className={theme.text}>{info.label}</span>
                                        <span className={`${theme.textMuted} italic`}>—</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                        <div className={`h-full ${info.color} rounded-full opacity-20`} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* System Logs */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl shadow-sm overflow-hidden`}>
                <div className={`p-5 lg:p-6 border-b ${theme.border} flex items-center justify-between`}>
                    <div>
                        <h3 className={`font-bold text-lg ${theme.text}`}>Nhật Ký Hệ Thống (System Logs)</h3>
                        <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Theo dõi các sự kiện thay đổi dữ liệu cấu hình hoặc lỗi phần mềm.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['Loại Sự Kiện', 'Mô tả sự kiện'].map((h, i) => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 whitespace-nowrap">
                            {displayLogs.map((log, idx) => {
                                const logType = log._type ?? log.type ?? 'LOG';
                                const logMsg = log.newRescueRequests ?? log.newMissions ?? log.description ?? log.message ?? 'Thay đổi dữ liệu hệ thống';
                                const logTime = log.changedAt
                                    ? new Date(log.changedAt).toLocaleString('vi-VN')
                                    : log.time ?? '—';
                                const logStatus = log._status ?? log.status ?? 'info';
                                return (
                                    <tr key={log.logId ?? log.id ?? idx} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className="px-6 py-4">
                                            <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg ${getLogIconColor(logStatus)}`}>{logType}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-[14px] font-medium ${theme.text}`}>{logMsg}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default AdminDashboard;
