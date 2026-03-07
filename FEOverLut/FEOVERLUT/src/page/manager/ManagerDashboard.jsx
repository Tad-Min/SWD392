import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMissions } from '../../features/missions/hook/useMissions';
import { useInventory } from '../../features/inventory/hook/useInventory';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Helper: ensure value is always an array
const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        // common patterns: { data: [...] } / { items: [...] } / { result: [...] }
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

// ── Hourly request data ───────────────────────────────────────────
const hourlyData = [
    { h: '6h', req: 12 }, { h: '8h', req: 28 }, { h: '10h', req: 45 },
    { h: '12h', req: 38 }, { h: '14h', req: 55 }, { h: '16h', req: 42 },
];

// Status colour map (StatusId from BE)
const STATUS_MAP = {
    1: { label: 'Hoàn thành', color: '#22c55e' },
    2: { label: 'Đang xử lý', color: '#3b82f6' },
    3: { label: 'Chờ xử lý', color: '#eab308' },
    4: { label: 'Đã hủy', color: '#ef4444' },
};

const TEAM_STATUS = {
    1: { label: 'Đang hoạt động', cls: 'text-emerald-500 bg-emerald-500/10' },
    2: { label: 'Sẵn sàng', cls: 'text-blue-500 bg-blue-500/10' },
    3: { label: 'Ngoại tuyến', cls: 'text-slate-400 bg-slate-400/10' },
};

const ManagerDashboard = () => {
    const { isDarkMode, theme } = useOutletContext();
    const navigate = useNavigate();

    // ── Data states ──────────────────────────────────────────────────
    const [missions, setMissions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [teams, setTeams] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getRescueMissions, getRescueRequests, getRescueTeams } = useMissions();
    const { getWarehouseStock, getProducts } = useInventory();

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const [mRes, rRes, tRes, sRes, pRes] = await Promise.allSettled([
                getRescueMissions(),
                getRescueRequests(),
                getRescueTeams(),
                getWarehouseStock(),
                getProducts(),
            ]);

            if (mRes.status === 'fulfilled') setMissions(toArr(mRes.value));
            if (rRes.status === 'fulfilled') setRequests(toArr(rRes.value));
            if (tRes.status === 'fulfilled') setTeams(toArr(tRes.value));

            const prodList = pRes.status === 'fulfilled' ? toArr(pRes.value) : [];

            // Merge units into stocks if missing
            if (sRes.status === 'fulfilled') {
                const stockList = toArr(sRes.value).map(s => {
                    const p = prodList.find(pr => (pr.productId ?? pr.id) === (s.productId ?? s.productid));
                    return {
                        ...s,
                        productName: p?.productName || s.productName || `SP #${s.productId}`,
                        unit: p?.unit || s.unit || 'đơn vị'
                    };
                });
                setStocks(stockList);
            }
            setLoading(false);
        };
        fetchAll();
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    // ── Computed KPIs ──────────────────────────────────────────────
    const missionsTotal = missions.length;
    const missionsDone = missions.filter(m => m.statusId === 1).length;
    const missionsActive = missions.filter(m => m.statusId === 2).length;

    // Requests stats (RescueRequests)
    const requestsTotal = requests.length;
    const reqDone = requests.filter(r => (r.status === 1 || r.statusId === 1)).length;
    const reqActive = requests.filter(r => (r.status === 2 || r.statusId === 2)).length;
    const reqNew = requests.filter(r => (r.status === 3 || r.statusId === 3)).length;

    const teamsActive = teams.filter(t => t.statusId === 1).length;

    // Pie chart data (Missions + Requests status)
    const pieData = Object.entries(STATUS_MAP).map(([id, info]) => {
        const idNum = Number(id);
        const mCount = missions.filter(m => m.statusId === idNum).length;
        // Map request statuses similarly: 1=Done, 2=Active, 3=Pending
        const rCount = requests.filter(r => (r.status === idNum || r.statusId === idNum)).length;
        return {
            name: info.label,
            value: mCount + rCount,
            color: info.color,
        };
    }).filter(d => d.value > 0);

    // ── Loading skeleton ────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-9 h-9 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className={`text-sm ${theme.textMuted} animate-pulse`}>Đang tải dữ liệu hệ thống...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-8 animate-mgr-in">
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Tổng quan</h2>
                    <p className={`text-sm ${theme.textMuted} mt-0.5`}>Giám sát và quản lý hoạt động cứu trợ</p>
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border ${theme.border} ${theme.cardBg}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={theme.text}>Hệ thống trực tuyến</span>
                </div>
            </div>

            {/* ── KPI CARDS ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tổng yêu cầu */}
                <div className={`rounded-2xl p-5 bg-blue-600 text-white shadow-lg shadow-blue-600/30 relative overflow-hidden`}>
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                    <svg className="w-7 h-7 mb-3 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p className="text-3xl font-extrabold">{requestsTotal}</p>
                    <p className="text-sm text-blue-100 mt-1">Tổng yêu cầu cứu trợ</p>
                </div>

                {/* Yêu cầu mới/chờ xử lý */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-300'} rounded-2xl p-5 shadow-sm`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">MỚI</span>
                    </div>
                    <p className={`text-3xl font-extrabold ${theme.text}`}>{reqNew}</p>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Đang chờ xử lý</p>
                </div>

                {/* Đang triển khai */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm group`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </div>
                    <p className={`text-3xl font-extrabold ${theme.text}`}>{reqActive + missionsActive}</p>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Đang triển khai</p>
                </div>

                {/* Hoàn thành */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">XONG</span>
                    </div>
                    <p className={`text-3xl font-extrabold ${theme.text}`}>{reqDone + missionsDone}</p>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Đã hoàn thành</p>
                </div>

                {/* Đội cứu hộ */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-blue-500 bg-blue-500/10`}>TRỰC TUYẾN</span>
                    </div>
                    <p className={`text-3xl font-extrabold ${theme.text}`}>{teamsActive}/{teams.length}</p>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Đội đang cứu hộ</p>
                </div>
            </div>

            {/* ── CHARTS ROW ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Line chart - yêu cầu theo giờ */}
                <div className={`lg:col-span-1 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <h3 className={`font-bold ${theme.text} mb-1 flex items-center gap-2`}>
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Yêu cầu theo giờ
                    </h3>
                    <p className={`text-xs ${theme.textMuted} mb-4`}>Tổng: {requests.length} yêu cầu hôm nay</p>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="mgrReq" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11 }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ background: isDarkMode ? '#1E293B' : '#fff', borderRadius: 10, border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, fontSize: 12 }}
                                />
                                <Area type="monotone" dataKey="req" name="Yêu cầu" stroke="#3b82f6" strokeWidth={2.5} fill="url(#mgrReq)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div >

                {/* Donut - Phân bổ trạng thái */}
                < div className={`lg:col-span-1 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <h3 className={`font-bold ${theme.text} mb-4`}>Phân bổ trạng thái</h3>
                    {
                        pieData.length > 0 ? (
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                            {pieData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                                        <Tooltip contentStyle={{ background: isDarkMode ? '#1E293B' : '#fff', borderRadius: 10, border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[220px] flex flex-col items-center justify-center gap-2">
                                <div className="w-20 h-20 rounded-full border-8 border-dashed border-slate-300 dark:border-slate-600" />
                                <p className={`text-sm ${theme.textMuted}`}>Chưa có dữ liệu</p>
                            </div>
                        )
                    }
                </div >

                {/* Nguồn lực cứu trợ (WareHouse Stock) */}
                < div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm flex flex-col`}>
                    <h3 className={`font-bold ${theme.text} mb-4 flex items-center gap-2`}>
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        Nguồn lực cứu trợ
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1">
                        {stocks.length === 0 ? (
                            <p className={`text-sm ${theme.textMuted} text-center py-8`}>Không có dữ liệu tồn kho.</p>
                        ) : stocks.slice(0, 6).map((s, i) => {
                            const qty = s.quantity ?? s.totalQuantity ?? 0;
                            const cap = s.capacity ?? 100;
                            const pct = Math.min(Math.round((qty / cap) * 100), 100);
                            const lowStock = pct < 30;
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-[13px] font-medium mb-1">
                                        <span className={theme.text}>{s.productName ?? s.product?.productName ?? `SP #${s.productId}`}</span>
                                        <span className={theme.textMuted}>{qty.toLocaleString()}/{cap.toLocaleString()} {s.unit ?? 'đơn vị'}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${lowStock ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                                    </div>
                                    {lowStock && <p className="text-[11px] text-amber-400 mt-0.5 flex items-center gap-1">⚠ Sắp hết</p>}
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => navigate('/manager/inventory')}
                        className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md shadow-blue-600/30"
                    >
                        Quản lý kho
                    </button>
                </div >
            </div >

            {/* ── BOTTOM ROW ─────────────────────────────────────── */}
            < div className="grid grid-cols-1 lg:grid-cols-3 gap-4" >

                {/* Teams List */}
                < div className={`lg:col-span-2 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                    <h3 className={`font-bold ${theme.text} mb-4`}>Đội Cứu Hộ</h3>
                    <div className="space-y-3">
                        {teams.length === 0 ? (
                            <p className={`text-sm ${theme.textMuted} py-4 text-center`}>Không có dữ liệu đội cứu hộ.</p>
                        ) : teams.slice(0, 5).map((t) => {
                            const st = TEAM_STATUS[t.statusId] ?? { label: 'Không xác định', cls: 'text-slate-400 bg-slate-400/10' };
                            const done = missions.filter(m => m.teamId === t.teamId && m.statusId === 1).length;
                            return (
                                <div key={t.teamId} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-slate-50 hover:bg-white'} transition-colors`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${st.cls}`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[14px] font-semibold truncate ${theme.text}`}>{t.teamName ?? `Đội #${t.teamId}`}</p>
                                        <p className={`text-[12px] ${theme.textMuted} truncate`}>{t.description ?? 'Không có mô tả'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                                        <span className={`text-[11px] ${theme.textMuted}`}>{done} hoàn thành</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div >

                {/* Quick Actions */}
                < div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm flex flex-col`}>
                    <h3 className={`font-bold ${theme.text} mb-4`}>Hành động nhanh</h3>
                    <div className="flex flex-col gap-3 flex-1">
                        {[
                            { label: 'Gọi đội cứu hộ', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', route: '/manager/dashboard' },
                            { label: 'Cập nhật bản đồ', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', route: '/manager/dashboard' },
                            { label: 'Xem báo cáo', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', route: '/manager/dashboard' },
                        ].map((a, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(a.route)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${theme.border} text-sm font-semibold ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'} transition-colors ${theme.text} text-left w-full`}
                            >
                                <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg>
                                {a.label}
                            </button>
                        ))}
                    </div>
                </div >
            </div >

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes mgrIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-mgr-in { animation: mgrIn 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default ManagerDashboard;
