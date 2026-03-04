import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

// --- MOCK DATA FOR CHARTS ---
const performanceData = [
    { name: 'T2', missions: 4, rescued: 12 },
    { name: 'T3', missions: 7, rescued: 25 },
    { name: 'T4', missions: 5, rescued: 18 },
    { name: 'T5', missions: 10, rescued: 40 },
    { name: 'T6', missions: 8, rescued: 30 },
    { name: 'T7', missions: 12, rescued: 55 },
    { name: 'CN', missions: 6, rescued: 20 },
];

const resourceUtilization = [
    { name: 'Đội Trực Thăng', active: 100, standby: 0 },
    { name: 'Đội Ca Nô 1', active: 80, standby: 20 },
    { name: 'Đội Y Tế', active: 65, standby: 35 },
    { name: 'Đội Cứu Hộ Bộ', active: 90, standby: 10 },
    { name: 'Đội Tiếp Tế', active: 40, standby: 60 },
];

// --- MOCK DATA FOR RECENT MISSIONS (Mapped to RescueMissionDTO & RescueTeamDTO) ---
const recentMissions = [
    { MissionId: 101, RescueRequestId: 501, TeamName: 'Đội Ca Nô 1', AssignedAt: '10:30 AM, Hôm nay', StatusId: 2, StatusName: 'Đang triển khai' },
    { MissionId: 102, RescueRequestId: 502, TeamName: 'Đội Trực Thăng', AssignedAt: '09:15 AM, Hôm nay', StatusId: 3, StatusName: 'Hoàn thành' },
    { MissionId: 103, RescueRequestId: 505, TeamName: 'Đội Y Tế', AssignedAt: '08:45 AM, Hôm nay', StatusId: 3, StatusName: 'Hoàn thành' },
    { MissionId: 104, RescueRequestId: 510, TeamName: 'Đội Cứu Hộ Bộ', AssignedAt: '07:00 AM, Hôm nay', StatusId: 2, StatusName: 'Đang triển khai' },
    { MissionId: 105, RescueRequestId: 512, TeamName: 'Đội Tiếp Tế', AssignedAt: 'Hôm qua', StatusId: 1, StatusName: 'Đã hủy' },
];

const ManagerDashboard = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Giả lập load data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const getStatusStyle = (statusId) => {
        switch (statusId) {
            case 2: return 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20'; // Đang triển khai
            case 3: return 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20'; // Hoàn thành
            case 1: return 'text-red-500 bg-red-500/10 dark:bg-red-500/20'; // Hủy
            default: return 'text-slate-500 bg-slate-500/10 dark:bg-slate-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className={`text-sm ${theme.textMuted} font-medium tracking-wide animate-pulse`}>Đang tải trung tâm chỉ huy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Trung Tâm Chỉ Huy Tổng Hợp (Dashboard)</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Cái nhìn toàn cảnh về tình hình cứu trợ, lực lượng và tiến độ các nhiệm vụ trong thời gian thực.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className={`p-2 rounded-xl border ${theme.border} ${theme.cardBg} ${theme.textMuted} hover:text-blue-500 transition-colors shadow-sm`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.cardBg} ${theme.text} shadow-sm flex items-center gap-2`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Trực tuyến
                    </div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Yêu cầu cứu hộ */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm relative overflow-hidden group`}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            12%
                        </span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>1,284</h4>
                        <p className={`text-sm font-medium ${theme.textMuted} mt-1`}>Yêu cầu cứu hộ mới</p>
                    </div>
                </div>

                {/* Nhiệm vụ đang triển khai */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm relative overflow-hidden group`}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            5%
                        </span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>342</h4>
                        <p className={`text-sm font-medium ${theme.textMuted} mt-1`}>Nhiệm vụ đang diễn ra</p>
                    </div>
                </div>

                {/* Người được cứu */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm relative overflow-hidden group`}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            24%
                        </span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>8,920</h4>
                        <p className={`text-sm font-medium ${theme.textMuted} mt-1`}>Người đã được sơ tán</p>
                    </div>
                </div>

                {/* Vật tư đã phân bổ */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm relative overflow-hidden group`}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl">
                            <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            2%
                        </span>
                    </div>
                    <div>
                        <h4 className={`text-3xl font-bold ${theme.text}`}>15K<span className="text-xl">kg</span></h4>
                        <p className={`text-sm font-medium ${theme.textMuted} mt-1`}>Vật tư đã chuyển phát</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

                {/* Main Trend Chart - 2/3 width */}
                <div className={`lg:col-span-2 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`font-bold text-lg ${theme.text}`}>Xu hướng Cứu Hộ Tuần Qua</h3>
                            <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Tương quan giữa số nhiệm vụ triển khai và người được cứu.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRescued" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}
                                    itemStyle={{ color: isDarkMode ? '#E2E8F0' : '#0F172A', fontSize: '13px', fontWeight: 600 }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="rescued" name="Người được cứu (x10)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRescued)" />
                                <Area type="monotone" dataKey="missions" name="Nhiệm vụ (x10)" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorMissions)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resource Chart - 1/3 width */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm flex flex-col`}>
                    <div className="mb-6">
                        <h3 className={`font-bold text-lg ${theme.text}`}>Trạng Thái Lực Lượng</h3>
                        <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Tỷ lệ phần trăm đội đang tham gia cứu trợ trực tiếp.</p>
                    </div>
                    <div className="flex-1 min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={resourceUtilization} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#E2E8F0' : '#1E293B', fontSize: 12, fontWeight: 500 }} width={100} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }} />
                                <Bar dataKey="active" name="Đang nhiệm vụ (%)" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="standby" name="Sẵn sàng (%)" stackId="a" fill={isDarkMode ? '#334155' : '#E2E8F0'} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Recent Missions Table */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl shadow-sm overflow-hidden`}>
                <div className={`p-5 lg:p-6 border-b ${theme.border} flex items-center justify-between`}>
                    <div>
                        <h3 className={`font-bold text-lg ${theme.text}`}>Các Nhiệm Vụ Gần Đây</h3>
                        <p className={`text-[13px] ${theme.textMuted} mt-0.5`}>Cập nhật theo thời gian thực (Real-time tracking).</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>ID Nhiệm Vụ</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Từ Yêu Cầu</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Lực Lượng Tham Gia (Team)</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Thời gian Điều động</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Trạng Thái</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Báo cáo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 whitespace-nowrap">
                            {recentMissions.map((mission) => (
                                <tr key={mission.MissionId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                    <td className={`px-6 py-4 text-sm font-bold ${theme.text}`}>
                                        #MSN-{mission.MissionId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[13px] font-medium px-2.5 py-1 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                            REQ-{mission.RescueRequestId}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-semibold ${theme.text}`}>
                                        {mission.TeamName}
                                    </td>
                                    <td className={`px-6 py-4 text-[13px] ${theme.textMuted}`}>
                                        {mission.AssignedAt}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusStyle(mission.StatusId)}`}>
                                            {mission.StatusId === 2 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>}
                                            {mission.StatusId === 3 && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            {mission.StatusName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} transition-colors inline-block`}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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

export default ManagerDashboard;
