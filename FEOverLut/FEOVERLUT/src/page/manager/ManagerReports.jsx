import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMissions } from '../../features/missions/hook/useMissions';
import { useUsers } from '../../features/users/hook/useUsers';
import { useInventory } from '../../features/inventory/hook/useInventory';
import { useTransaction } from '../../features/transactions/hook/useTransaction';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

const dropdownArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

const MISSION_STATUS = { 0: 'Chờ xử lý', 1: 'Đang thực hiện', 2: 'Hoàn thành', 3: 'Hủy bỏ' };
const REQUEST_URGENCY = { 1: 'Thấp', 2: 'Trung bình', 3: 'Cao', 4: 'Khẩn cấp' };

const ManagerReports = () => {
    const { isDarkMode, theme } = useOutletContext();

    // ── API data ───────────────────────────────────────────────────
    const [missions, setMissions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── UI state ──────────────────────────────────────────────────
    const [selectedType, setSelectedType] = useState('mission');
    const [dateRange, setDateRange] = useState('month');
    const [isGenerating, setIsGenerating] = useState(false);
    const [exportFormat, setExportFormat] = useState('pdf');

    const formatDataForExport = () => {
        let title = '';
        let headers = [];
        let rows = [];

        if (selectedType === 'mission') {
            title = 'Bao_Cao_Nhiem_Vu';
            headers = ['ID', 'Ten Nhiem Vu', 'Trang Thai', 'Uu Tien', 'Ngay Tao'];
            rows = missions.map(m => [
                m.missionId ?? m.id,
                `"${m.missionName ?? 'N/A'}"`,
                MISSION_STATUS[m.statusId ?? m.statusid ?? m.status] || 'Khac',
                m.priority ?? 'N/A',
                new Date(m.createdAt || Date.now()).toLocaleDateString()
            ]);
        } else if (selectedType === 'inventory') {
            title = 'Bao_Cao_Kho_Hang';
            headers = ['ID', 'Ten San Pham', 'Tong Ton', 'Don Vi'];
            rows = products.map(p => {
                const stock = stocks.find(s => s.productId === (p.productId ?? p.id));
                return [
                    p.productId ?? p.id,
                    `"${p.productName ?? 'N/A'}"`,
                    stock?.quantity ?? 0,
                    p.unit ?? 'Cai'
                ];
            });
        } else if (selectedType === 'personnel') {
            title = 'Bao_Cao_Nhan_Su';
            headers = ['ID', 'Ho Ten', 'Email', 'So Dien Thoai', 'Trang Thai'];
            rows = users.map(u => [
                u.userId ?? u.id,
                `"${u.fullName ?? u.userName ?? 'N/A'}"`,
                `"${u.email ?? 'N/A'}"`,
                `"${u.phone ?? 'N/A'}"`,
                u.isActive ? 'Hoat Dong' : 'Khoa'
            ]);
        } else if (selectedType === 'request') {
            title = 'Bao_Cao_Yeu_Cau_SOS';
            headers = ['ID', 'Vi Tri', 'Muc Do', 'Nguoi Nhan', 'Ngay Yeu Cau'];
            rows = requests.map(r => [
                r.requestId ?? r.id,
                `"${r.location ?? 'N/A'}"`,
                REQUEST_URGENCY[r.urgencyLevelId ?? r.urgencyLevel ?? r.urgencylevel] || 'Khac',
                r.assignedTo ?? 'Chua phan cong',
                new Date(r.createdAt || Date.now()).toLocaleDateString()
            ]);
        }

        return { title, headers, rows };
    };

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const { title, headers, rows } = formatDataForExport();
            const dateStr = new Date().toISOString().split('T')[0];

            if (exportFormat === 'excel') {
                // 1. Xuất Excel thực sự với XLSX
                const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "ReportData");
                XLSX.writeFile(workbook, `${title}_${dateStr}.xlsx`);
                alert(`Đã xuất báo cáo "${title}" thành công. File Excel (.xlsx) đã được tải về.`);

            } else if (exportFormat === 'pdf') {
                // 2. Xuất PDF thực sự với jsPDF
                const doc = new jsPDF();
                const displayTitle = title.replace(/_/g, ' ');
                doc.setFontSize(16);
                doc.text(`Bao Cao: ${displayTitle}`, 14, 15);
                autoTable(doc, {
                    head: [headers],
                    body: rows,
                    startY: 20,
                    theme: 'grid',
                    styles: { font: 'helvetica', fontSize: 10 }
                });
                doc.save(`${title}_${dateStr}.pdf`);
                alert(`Đã xuất báo cáo "${title}" thành công. File PDF (.pdf) đã được tải về.`);

            } else if (exportFormat === 'word') {
                // 3. Xuất Word bằng cách xây dựng file mã MSWord HTML (.doc)
                const displayTitle = title.replace(/_/g, ' ');
                const htmlContent = `
                    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                    <head><meta charset='utf-8'><title>${displayTitle}</title></head>
                    <body>
                        <h2 style="text-align: center; color: #3b82f6; font-family: sans-serif;">${displayTitle} - ${dateStr}</h2>
                        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 13px;">
                            <thead style="background-color: #f1f5f9;">
                                <tr>${headers.map(h => `<th style="padding: 8px;">${h}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${rows.map(r => `<tr>${r.map(c => `<td style="padding: 8px;">${c}</td>`).join('')}</tr>`).join('')}
                            </tbody>
                        </table>
                    </body>
                    </html>
                `;
                const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${title}_${dateStr}.doc`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                alert(`Đã xuất báo cáo "${title}" thành công. File Word (.doc) đã được tải về để chỉnh sửa.`);
            }

            setIsGenerating(false);
        }, 1500);
    };

    const { getRescueMissions, getRescueRequests } = useMissions();
    const { getUsers } = useUsers();
    const { getProducts, getWarehouseStock } = useInventory();
    const { getTransactions } = useTransaction();

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        const [mRes, rRes, uRes, pRes, sRes, txRes] = await Promise.allSettled([
            getRescueMissions(),
            getRescueRequests(),
            getUsers(),
            getProducts(),
            getWarehouseStock(),
            getTransactions(),
        ]);
        if (mRes.status === 'fulfilled') setMissions(toArr(mRes.value));
        if (rRes.status === 'fulfilled') setRequests(toArr(rRes.value));
        if (uRes.status === 'fulfilled') setUsers(toArr(uRes.value));
        if (pRes.status === 'fulfilled') setProducts(toArr(pRes.value));
        if (sRes.status === 'fulfilled') setStocks(toArr(sRes.value));
        if (txRes.status === 'fulfilled') setTransactions(toArr(txRes.value));
        setIsLoading(false);
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Report type definitions (enriched with real counts) ────────
    const reportTypes = [
        {
            id: 'mission',
            title: 'Báo cáo Nhiệm Vụ',
            desc: 'Thống kê số lượng, trạng thái và hiệu quả cứu hộ',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            color: 'text-blue-500', bg: 'bg-blue-500/10',
            count: missions.length, countLabel: 'nhiệm vụ',
        },
        {
            id: 'inventory',
            title: 'Báo cáo Kho Hàng',
            desc: 'Kiểm kê vật tư, tỷ lệ xuất nhập và tồn kho hiện tại',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            color: 'text-emerald-500', bg: 'bg-emerald-500/10',
            count: products.length, countLabel: 'sản phẩm',
        },
        {
            id: 'personnel',
            title: 'Báo cáo Nhân sự',
            desc: 'Đánh giá cơ cấu tổ chức, phân quyền và số lượng tài khoản',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10',
            count: users.length, countLabel: 'tài khoản',
        },
        {
            id: 'request',
            title: 'Báo cáo Yêu Cầu SOS',
            desc: 'Thống kê yêu cầu cứu hộ từ công dân theo mức độ khẩn cấp',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
            color: 'text-red-500', bg: 'bg-red-500/10',
            count: requests.length, countLabel: 'yêu cầu',
        },
    ];

    const getFormatBadge = (fmt) => {
        if (fmt === 'PDF') return <span className="text-red-500 font-bold text-xs bg-red-500/10 px-2 py-1 rounded">PDF</span>;
        if (fmt === 'Excel') return <span className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">XLSX</span>;
        return <span className="text-blue-500 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded">DOCX</span>;
    };

    // ── Data preview for selected report type ──────────────────────
    const renderPreview = () => {
        if (selectedType === 'mission') {
            const statuses = Object.entries(MISSION_STATUS).map(([id, label]) => ({
                name: label, count: missions.filter(m => (m.statusId ?? m.statusid ?? m.status) === parseInt(id)).length,
            }));
            return (
                <div className="space-y-4">
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statuses} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '10px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }} />
                                <Bar dataKey="count" name="Số lượng" radius={[6, 6, 0, 0]}>
                                    {statuses.map((_, i) => <Cell key={i} fill={['#94A3B8', '#3B82F6', '#10B981', '#EF4444'][i]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className={`text-xs ${theme.textMuted} text-center`}>Tổng {missions.length} nhiệm vụ — theo trạng thái</p>
                </div>
            );
        }
        if (selectedType === 'inventory') {
            const totalQty = stocks.reduce((s, x) => s + (x.quantity ?? 0), 0);
            const txIn = transactions.filter(t => (t.txType ?? t.txtype) === 1).length;
            const txOut = transactions.filter(t => (t.txType ?? t.txtype) === 2).length;
            const rows = [
                { label: 'Tổng sản phẩm', value: products.length, color: 'text-blue-500' },
                { label: 'Tổng tồn kho', value: totalQty.toLocaleString(), color: 'text-emerald-500' },
                { label: 'GD nhập kho', value: txIn, color: 'text-cyan-500' },
                { label: 'GD xuất kho', value: txOut, color: 'text-purple-500' },
            ];
            return (
                <div className="grid grid-cols-2 gap-3">
                    {rows.map((r, i) => (
                        <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${theme.border}`}>
                            <p className={`text-xs font-medium ${theme.textMuted} mb-1`}>{r.label}</p>
                            <p className={`text-2xl font-bold ${r.color}`}>{r.value}</p>
                        </div>
                    ))}
                </div>
            );
        }
        if (selectedType === 'personnel') {
            const ROLE_MAP = { 1: 'Admin', 2: 'Manager', 3: 'Coordinator', 4: 'Rescuer', 5: 'Citizen' };
            const COLORS = { 1: '#D946EF', 2: '#6366F1', 3: '#3B82F6', 4: '#10B981', 5: '#94A3B8' };
            const data = Object.entries(ROLE_MAP).map(([id, name]) => ({
                name, count: users.filter(u => (u.roleId ?? u.roleid) === parseInt(id)).length,
                color: COLORS[id],
            })).filter(d => d.count > 0);
            return (
                <div className="space-y-4">
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '10px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }} />
                                <Bar dataKey="count" name="Tài khoản" radius={[6, 6, 0, 0]}>
                                    {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className={`text-xs ${theme.textMuted} text-center`}>Tổng {users.length} tài khoản — theo vai trò</p>
                </div>
            );
        }
        if (selectedType === 'request') {
            const urgencyData = Object.entries(REQUEST_URGENCY).map(([id, label]) => ({
                name: label,
                count: requests.filter(r => (r.urgencyLevelId ?? r.urgencyLevel ?? r.urgencylevel) === parseInt(id)).length,
            }));
            return (
                <div className="space-y-4">
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={urgencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '10px', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }} />
                                <Bar dataKey="count" name="Yêu cầu" radius={[6, 6, 0, 0]}>
                                    {urgencyData.map((_, i) => <Cell key={i} fill={['#94A3B8', '#F59E0B', '#EF4444', '#DC2626'][i]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className={`text-xs ${theme.textMuted} text-center`}>Tổng {requests.length} yêu cầu — theo mức độ khẩn cấp</p>
                </div>
            );
        }
        return null;
    };

    // Summary stats bar
    const summaryStats = [
        { label: 'Nhiệm vụ', value: missions.length, color: 'text-blue-500' },
        { label: 'Yêu cầu SOS', value: requests.length, color: 'text-red-500' },
        { label: 'Tài khoản', value: users.length, color: 'text-fuchsia-500' },
        { label: 'Sản phẩm', value: products.length, color: 'text-emerald-500' },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className={`text-sm ${theme.textMuted} font-medium animate-pulse`}>Đang tổng hợp dữ liệu báo cáo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Trích Xuất &amp; Báo Cáo</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Xem preview số liệu thực và tạo báo cáo phân tích đa chiều cho hoạt động cứu trợ.</p>
                </div>
                <button onClick={fetchAll} className={`self-start flex items-center gap-2 p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-cyan-500 transition-colors`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Làm mới
                </button>
            </div>

            {/* Summary KPI bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {summaryStats.map((s, i) => (
                    <div key={i} className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-4 shadow-sm flex items-center gap-3`}>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                        <p className={`text-[13px] font-medium ${theme.textMuted} leading-tight`}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Report Builder */}
                <div className="lg:col-span-2 space-y-5 flex flex-col">
                    {/* Report type cards — with real counts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {reportTypes.map(type => (
                            <div key={type.id} onClick={() => setSelectedType(type.id)}
                                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden
                                    ${selectedType === type.id
                                        ? `border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] ${isDarkMode ? 'bg-cyan-900/10' : 'bg-cyan-50'}`
                                        : `${theme.border} ${theme.cardBg} ${theme.glassEffect} hover:border-slate-400/50`
                                    }`}
                            >
                                {selectedType === type.id && (
                                    <div className="absolute top-4 right-4 text-cyan-500">
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                )}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${type.bg} ${type.color}`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} /></svg>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className={`font-bold text-base mb-0.5 ${theme.text}`}>{type.title}</h3>
                                        <p className={`text-[12px] ${theme.textMuted}`}>{type.desc}</p>
                                    </div>
                                    <div className={`ml-3 shrink-0 text-right`}>
                                        <span className={`text-2xl font-extrabold ${type.color}`}>{type.count}</span>
                                        <p className={`text-[10px] ${theme.textMuted}`}>{type.countLabel}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Data Preview Chart */}
                    <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 shadow-sm`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`font-bold text-base ${theme.text}`}>
                                Preview: {reportTypes.find(t => t.id === selectedType)?.title}
                            </h3>
                            <span className="text-[11px] text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md font-semibold">Dữ liệu thực</span>
                        </div>
                        {renderPreview()}
                    </div>

                    {/* Export Config */}
                    <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-6 shadow-sm`}>
                        <h3 className={`font-bold text-base mb-4 ${theme.text}`}>Cấu hình trích xuất</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>Thời gian</label>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-black/5 dark:bg-slate-800 rounded-xl">
                                    {[['week', 'Tuần này'], ['month', 'Tháng này'], ['custom', 'Tùy chọn']].map(([v, l]) => (
                                        <button key={v} onClick={() => setDateRange(v)}
                                            className={`py-2 text-sm font-semibold rounded-lg transition-all ${dateRange === v ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-cyan-400' : theme.textMuted}`}
                                        >{l}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>Định dạng file</label>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-semibold ${theme.text}`}
                                    style={{ backgroundImage: dropdownArrow, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                >
                                    <option value="pdf">PDF Document (.pdf) - Chuẩn báo cáo</option>
                                    <option value="excel">Excel Spreadsheet (.xlsx) - Data thô</option>
                                    <option value="word">Word Document (.docx) - Để chỉnh sửa</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                            <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm border ${theme.border} ${theme.textMuted} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                                Đặt lại
                            </button>
                            <button
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all
                                    ${isGenerating ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 active:scale-95'}`}
                            >
                                {isGenerating ? (
                                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Đang tổng hợp...</>
                                ) : (
                                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Tạo Báo Cáo</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Recent reports */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl flex flex-col overflow-hidden h-full`}>
                    <div className={`p-5 border-b ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                        <h3 className={`font-bold text-base ${theme.text}`}>Tài liệu gần đây</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {[
                            { id: 1, title: 'Báo cáo tổng kết tuần 12 - Nhiệm vụ cứu hộ', by: 'Manager User', date: 'Hôm nay 10:30', fmt: 'PDF', size: '2.4 MB' },
                            { id: 2, title: 'Bảng kê chi tiết xuất kho vật tư y tế tháng 3', by: 'Hệ thống tự động', date: 'Hôm nay 08:00', fmt: 'Excel', size: '1.1 MB' },
                            { id: 3, title: 'Báo cáo thiệt hại thiết bị không người lái', by: 'Nguyễn Văn A', date: 'Hôm qua', fmt: 'PDF', size: '850 KB' },
                            { id: 4, title: 'Đánh giá năng lực đội cứu hộ bộ số 2', by: 'Trần Thị B', date: '21/03/2026', fmt: 'Docx', size: '3.5 MB' },
                        ].map(report => (
                            <div key={report.id} className={`p-4 rounded-xl hover:${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100/50'} transition-colors cursor-pointer group flex items-start gap-3 mb-1`}>
                                <div className="mt-1 flex-shrink-0">{getFormatBadge(report.fmt)}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-semibold ${theme.text} group-hover:text-blue-500 transition-colors leading-tight`}>{report.title}</h4>
                                    <div className={`flex items-center gap-2 mt-1.5 text-[12px] font-medium ${theme.textMuted}`}>
                                        <span>{report.by}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                                        <span>{report.date}</span>
                                    </div>
                                    <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 dark:bg-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">{report.size}</span>
                                </div>
                                <button
                                    onClick={() => handleGenerateReport()}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-blue-400`}
                                    title="Tải lại file định dạng này"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
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

export default ManagerReports;
