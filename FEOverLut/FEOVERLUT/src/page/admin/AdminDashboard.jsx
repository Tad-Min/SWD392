import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

// --- MOCK DATA FOR SYSTEM ADMIN DASHBOARD ---
// Based on typical ILogService, User management, System configs
const systemLoadData = [
    { time: '00:00', requests: 120, cpu: 15 },
    { time: '04:00', requests: 45, cpu: 8 },
    { time: '08:00', requests: 450, cpu: 30 },
    { time: '12:00', requests: 800, cpu: 55 },
    { time: '16:00', requests: 620, cpu: 42 },
    { time: '20:00', requests: 950, cpu: 75 },
    { time: '23:59', requests: 300, cpu: 22 },
];

const mockSystemLogs = [
    { id: 1, type: 'SECURITY', message: 'Failed login attempt (IP: 192.168.1.5)', time: '2 phút trước', status: 'warning' },
    { id: 2, type: 'CONFIG', message: 'Update UrgencyLevelDTO by User #U001', time: '15 phút trước', status: 'info' },
    { id: 3, type: 'SYSTEM', message: 'Database backup completed successfully', time: '1 giờ trước', status: 'success' },
    { id: 4, type: 'USER_MGT', message: 'Role changed for User #U105 to Coordinator', time: '3 giờ trước', status: 'info' },
    { id: 5, type: 'ERROR', message: 'API Rate limit exceeded on /api/RescueRequest', time: '5 giờ trước', status: 'error' }
];

const mockRoleStats = [
    { role: 'Admin', count: 3, color: 'bg-fuchsia-500' },
    { role: 'Manager', count: 12, color: 'bg-indigo-500' },
    { role: 'Coordinator', count: 45, color: 'bg-blue-500' },
    { role: 'Rescuer', count: 150, color: 'bg-emerald-500' },
    { role: 'Citizen', count: 4200, color: 'bg-slate-400' }
];

const AdminDashboard = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const getLogIconColor = (status) => {
        if (status === 'error') return 'text-red-500 bg-red-500/10';
        if (status === 'warning') return 'text-orange-500 bg-orange-500/10';
        if (status === 'success') return 'text-emerald-500 bg-emerald-500/10';
        return 'text-blue-500 bg-blue-500/10';
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Giám sát tài nguyên máy chủ, log hệ thống và trạng thái phân quyền người dùng (Role Management).</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.cardBg} ${theme.text} shadow-sm flex items-center gap-2`}>
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
                        Server: ONLINE (Uptime: 99.9%)
                    </div>
                </div>
            </div>

            {/* KPI System Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Tổng người dùng */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-500">+120</span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>4,410</h4>
                        <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Tổng số tài khoản (Users)</p>
                    </div>
                </div>

                {/* API Requests */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-red-500">Peak hour</span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>12.5k<span className="text-lg">/hr</span></h4>
                        <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Thống kê Request API</p>
                    </div>
                </div>

                {/* System Errors (Log) */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-red-500">2 unresolved</span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>18</h4>
                        <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>System Errors (Log 24h)</p>
                    </div>
                </div>

                {/* Storage used */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-fuchsia-500/10 text-fuchsia-500 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">65%</span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>3.2<span className="text-lg">GB</span></h4>
                        <p className={`text-[13px] font-medium ${theme.textMuted} mt-1`}>Overlut_Storage Database</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

                {/* System Load Chart */}
                <div className={`lg:col-span-2 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`font-bold text-lg ${theme.text}`}>Biểu Đồ Tài Nguyên Máy Chủ</h3>
                            <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Thống kê tần suất request API và CPU Load.</p>
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
                                <Tooltip
                                    contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}
                                    itemStyle={{ color: isDarkMode ? '#E2E8F0' : '#0F172A', fontSize: '13px', fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="requests" name="API Requests" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                                <Area type="monotone" dataKey="cpu" name="CPU Load %" stroke="#8B5CF6" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Roles Distribution */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm flex flex-col`}>
                    <div className="mb-6">
                        <h3 className={`font-bold text-lg ${theme.text}`}>Phân Bổ Quyền (Roles)</h3>
                        <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Cấu trúc tài khoản hệ thống trên toàn quốc.</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-4 w-full px-2">
                        {mockRoleStats.map((roleInfo, idx) => {
                            const max = 4200;
                            const percentage = Math.max((roleInfo.count / max) * 100, 2); // At least 2% for visual
                            return (
                                <div key={idx} className="w-full">
                                    <div className="flex justify-between text-[13px] font-semibold mb-1">
                                        <span className={theme.text}>{roleInfo.role}</span>
                                        <span className={theme.textMuted}>{roleInfo.count.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                        <div className={`h-full ${roleInfo.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row - System Logs */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl shadow-sm overflow-hidden`}>
                <div className={`p-5 lg:p-6 border-b ${theme.border} flex items-center justify-between`}>
                    <div>
                        <h3 className={`font-bold text-lg ${theme.text}`}>Nhật Ký Hệ Thống (System Logs)</h3>
                        <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Theo dõi các sự kiện thay đổi dữ liệu cấu hình hoặc lỗi phần mềm.</p>
                    </div>
                    <button className="text-sm font-semibold text-cyan-500 hover:text-cyan-600 transition-colors">Mở Log Console</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Loại Sự Kiện</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Mô tả sự kiện</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Thời gian</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 whitespace-nowrap">
                            {mockSystemLogs.map((log) => (
                                <tr key={log.id} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                    <td className="px-6 py-4">
                                        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg ${getLogIconColor(log.status)}`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-[14px] font-medium ${theme.text}`}>
                                        {log.message}
                                    </td>
                                    <td className={`px-6 py-4 text-[13px] ${theme.textMuted}`}>
                                        {log.time}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className={`p-1.5 rounded-lg opacity-50 group-hover:opacity-100 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} transition-all inline-block`}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes fadeInUp {
                from {opacity: 0; transform: translateY(10px); }
            to {opacity: 1; transform: translateY(0); }
                }
            .animate-fade-in-up {
                animation: fadeInUp 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default AdminDashboard;
