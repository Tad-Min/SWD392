import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTransaction } from '../../features/transactions/hook/useTransaction';
import { useInventory } from '../../features/inventory/hook/useInventory';
import { getWareHouseApi } from '../../features/wareHouse/api/wareHouseApi';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

const getTxTypeName = (type) => {
    switch (type) {
        case 1: return { label: 'Nhập kho', color: 'text-emerald-500 bg-emerald-500/10' };
        case 2: return { label: 'Xuất kho', color: 'text-amber-500 bg-amber-500/10' };
        case 3: return { label: 'Phân bổ', color: 'text-blue-500 bg-blue-500/10' };
        case 4: return { label: 'Hủy/Lỗi', color: 'text-red-500 bg-red-500/10' };
        default: return { label: `Khác (${type})`, color: 'text-slate-500 bg-slate-500/10' };
    }
};

const TransactionHistory = () => {
    const { isDarkMode, theme } = useOutletContext();
    const { getTransactions, isLoading: loadingTx } = useTransaction();
    const { getProducts } = useInventory();

    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [filterType, setFilterType] = useState(''); // '' | '1' | '2'
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        setLoadingData(true);
        try {
            const [txRes, prodRes, whRes] = await Promise.all([
                getTransactions(),
                getProducts(),
                getWareHouseApi()
            ]);

            setTransactions(toArr(txRes));
            setProducts(toArr(prodRes));
            setWarehouses(toArr(whRes.data || whRes));
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map Product & Warehouse names
    const mappedTransactions = transactions.map(tx => {
        const p = products.find(prod => (prod.productId ?? prod.id) === tx.productId);
        const w = warehouses.find(wh => (wh.warehouseId ?? wh.id) === tx.warehouseId);
        return {
            ...tx,
            productName: p?.productName || `Sản phẩm #${tx.productId}`,
            unit: p?.unit || 'Lượng',
            warehouseName: w?.warehouseName || `Kho #${tx.warehouseId}`,
        };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mới nhất lên đầu

    // Filter
    const filtered = mappedTransactions.filter(t => {
        const matchSearch = t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType ? String(t.txType) === filterType : true;
        return matchSearch && matchType;
    });

    const importsCount = mappedTransactions.filter(t => t.txType === 1).length;
    const exportsCount = mappedTransactions.filter(t => t.txType === 2).length;

    const handleExportCSV = () => {
        if (filtered.length === 0) {
            alert('Không có dữ liệu để xuất!');
            return;
        }

        // Header for CSV
        const headers = ['ID Giao Dich', 'Thoi Gian', 'Loai Giao Dich', 'Ten Vat Tu', 'Diem Kho', 'So Luong', 'Don Vi', 'Nguoi Tao'];

        // Add UTF-8 BOM so Excel opens Vietnamese correctly
        let csvContent = "\uFEFF" + headers.join(',') + '\n';

        filtered.forEach(tx => {
            const typeInfo = getTxTypeName(tx.txType);
            const isAdd = tx.txType === 1;
            const row = [
                `TX-${String(tx.txId).padStart(4, '0')}`,
                tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN').replace(/,/g, '') : '',
                typeInfo.label,
                `"${tx.productName}"`,
                `"${tx.warehouseName}"`,
                `${isAdd ? '+' : '-'}${tx.quantity}`,
                tx.unit,
                tx.createdByUserId
            ];
            csvContent += row.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `LichSuGiaoDich_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-wh-in">
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Lịch Sử Giao Dịch</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Theo dõi toàn bộ biến động Nhập / Xuất / Phân bổ kho vật tư.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => fetchData()}
                        className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`}
                        title="Làm mới dữ liệu"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* ── KPI CARDS ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Tổng giao dịch', value: mappedTransactions.length, color: 'bg-indigo-500/10 text-indigo-500' },
                    { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', label: 'Phiếu Nhập', value: importsCount, color: 'bg-emerald-500/10 text-emerald-500' },
                    { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0c-1.226 0-2.445-.725-3.024-1.93L11 12H3', label: 'Phiếu Xuất', value: exportsCount, color: 'bg-amber-500/10 text-amber-500' },
                ].map((s, i) => (
                    <div key={i} className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${theme.textMuted}`}>{s.label}</p>
                            <p className={`text-2xl font-extrabold ${theme.text}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── ACTION BAR ─────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="relative w-full lg:w-80 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" placeholder="Tìm theo Tên vật tư hoặc Tên kho..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                </div>

                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] pr-10`}
                >
                    <option value="">Tất cả loại Giao dịch</option>
                    <option value="1">Nhập kho</option>
                    <option value="2">Xuất kho</option>
                    <option value="3">Phân bổ</option>
                    <option value="4">Điều chỉnh</option>
                </select>

                <p className={`lg:ml-auto text-sm ${theme.textMuted} shrink-0`}>
                    {loadingData || loadingTx ? 'Đang tải...' : `${filtered.length} kết quả`}
                </p>
            </div>

            {/* ── TABLE ──────────────────────────────────────────── */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['ID', 'Thời gian', 'Loại TX', 'Vật phẩm', 'Điểm Kho', 'Biến động', 'Người tạo'].map(h => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider ${h === 'Biến động' ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {(loadingData || loadingTx) ? (
                                <tr><td colSpan="7" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Đang tải lịch sử giao dịch...</span>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className={`w-12 h-12 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Không có dữ liệu giao dịch</span>
                                    </div>
                                </td></tr>
                            ) : filtered.map((tx) => {
                                const typeInfo = getTxTypeName(tx.txType);
                                const isAdd = tx.txType === 1;
                                return (
                                    <tr key={tx.txId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className={`px-6 py-4 text-[13px] font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            #TX-{String(tx.txId).padStart(4, '0')}
                                        </td>
                                        <td className={`px-6 py-4 text-[13px] font-medium ${theme.textMuted}`}>
                                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${typeInfo.color}`}>
                                                {typeInfo.label}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4`}>
                                            <div className={`text-sm font-semibold ${theme.text}`}>
                                                {tx.productName}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4`}>
                                            <div className={`text-sm font-medium ${theme.textMuted} flex items-center gap-1.5`}>
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                {tx.warehouseName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`text-[15px] font-extrabold ${isAdd ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-amber-400' : 'text-amber-600')}`}>
                                                {isAdd ? '+' : '-'}{tx.quantity}
                                            </div>
                                            <div className={`text-[11px] font-bold ${theme.textMuted}`}>{tx.unit}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-[13px] font-medium ${theme.textMuted}`}>UID: {tx.createdByUserId}</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes whIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-wh-in { animation: whIn 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default TransactionHistory;
