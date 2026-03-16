import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { useTransaction } from '../../features/transactions/hook/useTransaction';
import { useInventory } from '../../features/inventory/hook/useInventory';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

// txType map: 0=Nhập, 1=Xuất, 2=Điều chỉnh
const TX_TYPE = {
    0: { label: 'Nhập kho', cls: 'text-emerald-500 bg-emerald-500/10', dot: 'bg-emerald-500' },
    1: { label: 'Xuất kho', cls: 'text-blue-500 bg-blue-500/10', dot: 'bg-blue-500' },
    2: { label: 'Điều chỉnh', cls: 'text-amber-500 bg-amber-500/10', dot: 'bg-amber-400' },
};

const dropdownArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

const DistributionTracking = () => {
    const { isDarkMode, theme } = useOutletContext();

    // ── Data ──────────────────────────────────────────────────────
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── Filter ─────────────────────────────────────────────────────
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterWarehouse, setFilterWarehouse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // ── Pagination ────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // ── Modal tạo giao dịch ────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        warehouseId: '', productId: '', txType: '1', quantity: '', missionId: '', note: ''
    });

    // ── Chi tiết giao dịch ────────────────────────────────────────
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);

    const { getTransactions, createTransaction } = useTransaction();
    const { getProducts, getWarehouses } = useInventory();

    // ── Fetch ─────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        const params = {};
        if (filterDate) params.createdAt = filterDate;
        if (filterType) params.txType = filterType;
        if (filterWarehouse) params.warehouseId = filterWarehouse;

        const [txRes, pRes, wRes] = await Promise.allSettled([
            getTransactions(params),
            getProducts(),
            getWarehouses(),
        ]);
        if (txRes.status === 'fulfilled') setTransactions(toArr(txRes.value));
        if (pRes.status === 'fulfilled') setProducts(toArr(pRes.value));
        if (wRes.status === 'fulfilled') setWarehouses(toArr(wRes.value));
        setIsLoading(false);
        setPage(1);
    }, [filterDate, filterType, filterWarehouse, getTransactions, getProducts, getWarehouses]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Helpers ───────────────────────────────────────────────────
    const getProductName = (id) => products.find(p => p.productId === id)?.productName ?? `#${id}`;
    const getWarehouseName = (id) => warehouses.find(w => w.warehouseId === id)?.warehouseName ?? `#${id}`;

    // ── Client-side search ────────────────────────────────────────
    const filtered = transactions.filter(tx => {
        if (!searchTerm) return true;
        const name = getProductName(tx.productId ?? tx.productid).toLowerCase();
        return name.includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── KPI counts ────────────────────────────────────────────────
    const totalIn = transactions.filter(t => t.txType === 0 || t.txtype === 0).length;
    const totalOut = transactions.filter(t => t.txType === 1 || t.txtype === 1).length;

    // ── Submit ────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!form.warehouseId || !form.productId || !form.quantity) return;
        setSubmitting(true);
        try {
            await createTransaction({
                warehouseId: parseInt(form.warehouseId),
                productId: parseInt(form.productId),
                txType: parseInt(form.txType),
                quantity: parseInt(form.quantity),
                missionId: form.missionId ? parseInt(form.missionId) : 1, // Default 1 to bypass DB constraint if empty
                createdByUserId: 1, // Dummy or default user for testing
                createdAt: new Date().toISOString()
            });
            setIsModalOpen(false);
            setForm({ warehouseId: '', productId: '', txType: '2', quantity: '', missionId: '', note: '' });
            fetchAll();
        } catch (error) {
            const errDetail = error.response?.data?.message || error.response?.data?.title || error.message || '';
            alert(`Tạo giao dịch thất bại. ${errDetail}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewDetail = (tx) => {
        setSelectedTx(tx);
        setIsDetailOpen(true);
    };

    const handleExportCSV = () => {
        if (filtered.length === 0) {
            alert('Không có dữ liệu để xuất!');
            return;
        }

        // Header for CSV
        const headers = ['ID Giao Dich', 'Thoi Gian', 'Loai Giao Dich', 'Ten Vat Tu', 'Diem Kho', 'Nhiem Vu', 'So Luong', 'Nguoi Tao'];

        // Add UTF-8 BOM so Excel opens Vietnamese correctly
        let csvContent = "\uFEFF" + headers.join(',') + '\n';

        filtered.forEach(tx => {
            const typeInfo = TX_TYPE[tx.txType] || { label: 'Khác' };
            const row = [
                `TX-${String(tx.txId).padStart(4, '0')}`,
                tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN').replace(/,/g, '') : '',
                typeInfo.label,
                `"${getProductName(tx.productId)}"`,
                `"${getWarehouseName(tx.warehouseId)}"`,
                tx.missionId ? `Mission-${tx.missionId}` : 'Giao dich le',
                `${tx.quantity}`,
                tx.createdByUserId || 'Manager'
            ];
            csvContent += row.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `PhanPhoiCuuTro_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-dt-in">
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Theo Dõi Phân Phối Cứu Trợ</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Quản lý và theo dõi các giao dịch nhập xuất hàng cứu trợ giữa các kho và vùng ngập lụt.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button onClick={() => fetchAll()} className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`} title="Làm mới">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button onClick={handleExportCSV} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Excel
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/30 active:scale-95`}
                        onClick={() => setIsModalOpen(true)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Tạo giao dịch
                    </button>
                </div>
            </div>

            {/* ── KPI ────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Tổng giao dịch', value: transactions.length, color: 'bg-blue-500/10 text-blue-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                    { label: 'Nhập kho', value: totalIn, color: 'bg-emerald-500/10 text-emerald-500', icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 4v8m0 0l4-4m-4 4l-4-4' },
                    { label: 'Xuất / Phân phối', value: totalOut, color: 'bg-purple-500/10 text-purple-500', icon: 'M5 10l7-7m0 0l7 7m-7-7v18' },
                ].map((s, i) => (
                    <div key={i} className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${theme.textMuted}`}>{s.label}</p>
                            <p className={`text-2xl font-extrabold ${theme.text}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── FILTERS ────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                {/* Date */}
                <div className="relative">
                    <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm transition-all border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm`}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                    />
                </div>

                {/* Type */}
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`pl-10 pr-10 py-2.5 rounded-xl border ${theme.border} ${theme.inputBg} ${theme.text} text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer transition-all shadow-sm hover:shadow-md`} style={{ backgroundImage: dropdownArrow, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}>
                    <option value="">Tất cả loại Giao dịch</option>
                    <option value="0">Nhập kho</option>
                    <option value="1">Xuất kho</option>
                    <option value="2">Điều chỉnh</option>
                </select>

                {/* Warehouse */}
                <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all w-full sm:w-56 border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer appearance-none bg-no-repeat`}
                    style={{ backgroundImage: dropdownArrow, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                    <option value="">Tất cả kho</option>
                    {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName ?? w.name}</option>)}
                </select>

                {/* Search product name */}
                <div className="relative w-full sm:w-60 ml-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" placeholder="Tìm sản phẩm..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all`}
                    />
                </div>
            </div>

            {/* ── TABLE ──────────────────────────────────────────── */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['ID', 'Loại GD', 'Sản phẩm', 'Số lượng', 'Kho', 'Nhiệm vụ', 'Ngày tạo', 'Thao tác'].map(h => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr><td colSpan="8" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-8 h-8 text-purple-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Đang tải giao dịch...</span>
                                    </div>
                                </td></tr>
                            ) : paginated.length === 0 ? (
                                <tr><td colSpan="8" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className={`w-12 h-12 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Chưa có giao dịch nào.</span>
                                        <button onClick={() => setIsModalOpen(true)} className="mt-1 text-sm font-semibold text-blue-500 hover:text-blue-400">+ Tạo giao dịch mới</button>
                                    </div>
                                </td></tr>
                            ) : paginated.map((tx) => {
                                const txId = tx.txId ?? tx.txid ?? tx.id;
                                const typeId = tx.txType ?? tx.txtype ?? 0;
                                const prodId = tx.productId ?? tx.productid;
                                const whId = tx.warehouseId ?? tx.warehouseid;
                                const qty = tx.quantity ?? 0;
                                const typeInfo = TX_TYPE[typeId] ?? { label: `Type #${typeId}`, cls: 'text-slate-400 bg-slate-400/10', dot: 'bg-slate-400' };
                                const createdAt = tx.createdAt ?? tx.createdat;
                                return (
                                    <tr key={txId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                            #TX-{String(txId).padStart(4, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${typeInfo.cls}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${typeInfo.dot}`} />
                                                {typeInfo.label}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-[14px] font-semibold ${theme.text}`}>{getProductName(prodId)}</td>
                                        <td className={`px-6 py-4 text-[15px] font-bold ${theme.text}`}>{qty.toLocaleString()}</td>
                                        <td className={`px-6 py-4 text-sm ${theme.textMuted}`}>{getWarehouseName(whId)}</td>
                                        <td className={`px-6 py-4 text-sm ${theme.textMuted}`}>
                                            {tx.missionId ? <span className="text-blue-500 font-medium">#{tx.missionId}</span> : '—'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${theme.textMuted}`}>
                                            {createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetail(tx)}
                                                className={`p-1.5 rounded-lg opacity-40 group-hover:opacity-100 transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && filtered.length > PAGE_SIZE && (
                    <div className={`px-6 py-4 border-t ${theme.border} flex items-center justify-between`}>
                        <p className={`text-sm ${theme.textMuted}`}>
                            Hiển thị <span className="font-semibold">{(page - 1) * PAGE_SIZE + 1}</span>–<span className="font-semibold">{Math.min(page * PAGE_SIZE, filtered.length)}</span> trong <span className="font-semibold">{filtered.length}</span> kết quả
                        </p>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                className={`p-2 rounded-lg border ${theme.border} ${page <= 1 ? 'opacity-40 cursor-not-allowed' : `${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} cursor-pointer`}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                                className={`p-2 rounded-lg border ${theme.border} ${page >= totalPages ? 'opacity-40 cursor-not-allowed' : `${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} cursor-pointer`}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── MODAL TẠO GIAO DỊCH ──────────────────────────── */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[550px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>Tạo Giao Dịch Mới</h3>
                            <button onClick={() => setIsModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Loại giao dịch */}
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Loại giao dịch <span className="text-red-400">*</span></label>
                                <select value={form.txType} onChange={e => setForm(p => ({ ...p, txType: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}>
                                    {Object.entries(TX_TYPE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                            {/* Sản phẩm + Kho */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Sản phẩm <span className="text-red-400">*</span></label>
                                    <select value={form.productId} onChange={e => setForm(p => ({ ...p, productId: e.target.value }))}
                                        className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}>
                                        <option value="">-- Chọn --</option>
                                        {products.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Kho <span className="text-red-400">*</span></label>
                                    <select value={form.warehouseId} onChange={e => setForm(p => ({ ...p, warehouseId: e.target.value }))}
                                        className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}>
                                        <option value="">-- Chọn --</option>
                                        {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName ?? w.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            {/* Số lượng + Mission */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Số lượng <span className="text-red-400">*</span></label>
                                    <input type="number" min="1" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                                        placeholder="0"
                                        className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`} />
                                </div>
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.textMuted} mb-1.5`}>ID Nhiệm vụ (Tuỳ chọn)</label>
                                    <input type="number" min="1" value={form.missionId} onChange={e => setForm(p => ({ ...p, missionId: e.target.value }))}
                                        placeholder="(Tuỳ chọn)"
                                        className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`} />
                                </div>
                            </div>
                            {/* Ghi chú */}
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Ghi chú</label>
                                <textarea rows={2} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                                    placeholder="Thông tin thêm..."
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none`} />
                            </div>
                        </div>
                        <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                            <button onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>Hủy bỏ</button>
                            <button onClick={handleSubmit} disabled={submitting || !form.warehouseId || !form.productId || !form.quantity}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting || !form.warehouseId || !form.productId || !form.quantity ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'}`}>
                                {submitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )}

            {/* ── MODAL CHI TIẾT GIAO DỊCH ───────────────────────── */}
            {isDetailOpen && selectedTx && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[500px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-3xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        <div className={`px-8 py-6 border-b ${theme.border} flex items-center justify-between`}>
                            <div>
                                <h3 className={`text-xl font-bold ${theme.text}`}>Chi Tiết Giao Dịch</h3>
                                <p className={`text-xs ${theme.textMuted} mt-1`}>Mã tham chiếu: #TX-{String(selectedTx.txId ?? selectedTx.txid).padStart(4, '0')}</p>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'} transition-colors`}>
                                <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Loại giao dịch</p>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${TX_TYPE[selectedTx.txType ?? selectedTx.txtype]?.cls}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${TX_TYPE[selectedTx.txType ?? selectedTx.txtype]?.dot}`} />
                                        {TX_TYPE[selectedTx.txType ?? selectedTx.txtype]?.label}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Thời gian</p>
                                    <p className={`text-sm font-semibold ${theme.text}`}>
                                        {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString('vi-VN') : '—'}
                                    </p>
                                </div>
                            </div>

                            <div className={`p-5 rounded-2xl border ${theme.border} ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} space-y-4`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Sản phẩm vật tư</p>
                                        <p className={`text-base font-bold ${theme.text}`}>{getProductName(selectedTx.productId ?? selectedTx.productid)}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Số lượng</p>
                                        <p className={`text-xl font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {(selectedTx.quantity ?? 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`pt-4 border-t ${theme.border} space-y-1`}>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Địa điểm kho</p>
                                    <p className={`text-sm font-semibold ${theme.text}`}>{getWarehouseName(selectedTx.warehouseId ?? selectedTx.warehouseid)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Nhiệm vụ liên kết</p>
                                    <p className={`text-sm font-bold ${selectedTx.missionId ? 'text-blue-500' : theme.textMuted}`}>
                                        {selectedTx.missionId ? `#Mission-${selectedTx.missionId}` : 'Giao dịch lẻ'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Người thực hiện</p>
                                    <p className={`text-sm font-semibold ${theme.text}`}>UID: {selectedTx.createdByUserId ?? 'Manager'}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Ghi chú chi tiết</p>
                                <div className={`p-4 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-slate-800' : 'bg-white'} text-sm ${theme.text} italic shadow-inner`}>
                                    {selectedTx.note || "Không có ghi chú thêm cho giao dịch này."}
                                </div>
                            </div>
                        </div>

                        <div className={`px-8 py-6 border-t ${theme.border} bg-black/5 dark:bg-white/5`}>
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className={`w-full py-3 rounded-xl text-sm font-bold bg-slate-200 dark:bg-slate-700 ${theme.text} hover:opacity-80 transition-all uppercase tracking-widest`}>
                                Đóng Cửa Sổ
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dtIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-dt-in { animation: dtIn 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default DistributionTracking;
