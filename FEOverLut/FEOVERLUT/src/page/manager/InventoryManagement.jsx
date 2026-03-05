import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInventory } from '../../features/inventory/hook/useInventory';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

const dropdownArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

const InventoryManagement = () => {
    const { isDarkMode, theme } = useOutletContext();

    // ── Data ───────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Inventory hook
    const { getProducts, getCategories, getWarehouses, getWarehouseStock, createProduct, createWarehouseStock } = useInventory();

    // ── Filter ─────────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    // ── Modal state ────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('import'); // 'import' | 'product'
    const [submitting, setSubmitting] = useState(false);

    // Import modal form
    const [importForm, setImportForm] = useState({
        productName: '', categoryId: '', quantity: 0, warehouseId: '', unit: '', note: ''
    });

    // ── Fetch ──────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        const [pRes, cRes, wRes, sRes] = await Promise.allSettled([
            getProducts(),
            getCategories(),
            getWarehouses(),
            getWarehouseStock(),
        ]);
        if (pRes.status === 'fulfilled') setProducts(toArr(pRes.value));
        if (cRes.status === 'fulfilled') setCategories(toArr(cRes.value));
        if (wRes.status === 'fulfilled') setWarehouses(toArr(wRes.value));
        if (sRes.status === 'fulfilled') setStocks(toArr(sRes.value));
        setIsLoading(false);
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Computed ───────────────────────────────────────────────────
    // Merge products + stock for table
    const inventory = products.map(p => {
        const stockEntries = stocks.filter(s => s.productId === p.productId);
        const totalQty = stockEntries.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
        const cat = categories.find(c => c.categoryId === p.categoryId);
        return { ...p, totalQty, categoryName: cat?.categoryName ?? cat?.name ?? '—' };
    });

    const totalItems = stocks.reduce((acc, s) => acc + (s.quantity ?? 0), 0);
    const lowStockItems = stocks.filter(s => (s.quantity ?? 0) < 50).length;
    const activeWh = warehouses.filter(w => w.isActive !== false).length;

    const filtered = inventory.filter(item => {
        const matchSearch = (item.productName ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = selectedCategory ? item.categoryId === parseInt(selectedCategory) : true;
        return matchSearch && matchCat;
    });

    // ── Submit Import form ─────────────────────────────────────────
    const handleImportSubmit = async () => {
        if (!importForm.productName.trim() || !importForm.quantity) return;
        setSubmitting(true);
        try {
            // 1. Create product if new
            const newProd = await createProduct({
                productName: importForm.productName,
                categoryId: importForm.categoryId ? parseInt(importForm.categoryId) : null,
                unit: importForm.unit || 'Đơn vị',
            });

            // 2. Add stock entry
            if (importForm.warehouseId && newProd?.productId) {
                await createWarehouseStock({
                    warehouseId: parseInt(importForm.warehouseId),
                    productId: newProd.productId,
                    quantity: parseInt(importForm.quantity),
                });
            }
            setIsModalOpen(false);
            setImportForm({ productName: '', categoryId: '', quantity: 0, warehouseId: '', unit: '', note: '' });
            fetchAll();
        } catch {
            alert('Nhập hàng thất bại. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Status badge ───────────────────────────────────────────────
    const getStatusBadge = (qty) => {
        if (qty === 0) return { label: 'Hết hàng', cls: 'text-red-500 bg-red-500/10' };
        if (qty < 50) return { label: 'Sắp hết', cls: 'text-amber-500 bg-amber-500/10' };
        if (qty < 200) return { label: 'Cảnh báo', cls: 'text-orange-400 bg-orange-400/10' };
        return { label: 'Tốt', cls: 'text-emerald-500 bg-emerald-500/10' };
    };

    const iconColors = [
        'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
        'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    ];

    return (
        <div className="space-y-6 animate-inv-in">
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Kho Hàng Cứu Trợ</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Theo dõi tồn kho, quản lý nhập xuất và cập nhật tình trạng vật tư cứu hộ.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => fetchAll()}
                        className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`}
                        title="Làm mới"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Xuất file
                    </button>
                    <button
                        onClick={() => { setModalMode('import'); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Nhập Hàng
                    </button>
                </div>
            </div>

            {/* ── KPI CARDS ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Tổng số lượng vật tư', value: totalItems.toLocaleString(), color: 'bg-blue-500/10 text-blue-500' },
                    { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', label: 'Cần bổ sung gấp', value: lowStockItems, color: 'bg-red-500/10 text-red-500' },
                    { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Kho đang hoạt động', value: activeWh, color: 'bg-emerald-500/10 text-emerald-500' },
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
                {/* Search */}
                <div className="relative w-full lg:w-64 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" placeholder="Tìm vật phẩm..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                </div>

                {/* Category filter */}
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all w-full sm:w-48 border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer appearance-none bg-no-repeat`}
                    style={{ backgroundImage: dropdownArrow, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(c => <option key={c.categoryId ?? c.id} value={c.categoryId ?? c.id}>{c.categoryName ?? c.name}</option>)}
                </select>

                {/* Warehouse filter */}
                <select value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all w-full sm:w-56 border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer appearance-none bg-no-repeat`}
                    style={{ backgroundImage: dropdownArrow, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                    <option value="">Tất cả kho chỉ huy</option>
                    {warehouses.map(w => <option key={w.warehouseId ?? w.id} value={w.warehouseId ?? w.id}>{w.warehouseName ?? w.name}</option>)}
                </select>

                <p className={`lg:ml-auto text-sm ${theme.textMuted} shrink-0`}>
                    {isLoading ? 'Đang tải...' : `${filtered.length} vật phẩm`}
                </p>
            </div>

            {/* ── TABLE ──────────────────────────────────────────── */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['ID', 'Tên Vật Phẩm', 'Danh Mục', 'Tổng SL', 'Đơn vị', 'Trạng thái', 'Thao tác'].map(h => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider ${h === 'Thao tác' ? 'text-center' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr><td colSpan="7" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Đang tải kho hàng từ backend...</span>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className={`w-12 h-12 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>{searchTerm ? 'Không tìm thấy kết quả.' : 'Kho hàng chưa có dữ liệu.'}</span>
                                        <button onClick={() => { setModalMode('import'); setIsModalOpen(true); }} className="mt-1 text-sm font-semibold text-blue-500 hover:text-blue-400">+ Nhập hàng mới</button>
                                    </div>
                                </td></tr>
                            ) : filtered.map((item, idx) => {
                                const st = getStatusBadge(item.totalQty);
                                const colorCls = iconColors[idx % iconColors.length];
                                const initials = (item.productName ?? '?').charAt(0).toUpperCase();
                                return (
                                    <tr key={item.productId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            #PRD-{String(item.productId).padStart(3, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${colorCls}`}>{initials}</div>
                                                <span className={`text-[15px] font-semibold ${theme.text}`}>{item.productName ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${theme.text}`}>{item.categoryName}</td>
                                        <td className={`px-6 py-4 text-[15px] font-bold ${theme.text}`}>{item.totalQty.toLocaleString()}</td>
                                        <td className={`px-6 py-4 text-sm ${theme.textMuted}`}>{item.unit ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${st.cls}`}>{st.label}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <button className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL NHẬP HÀNG ──────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[460px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>Nhập Hàng Mới</h3>
                            <button onClick={() => setIsModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tên vật phẩm <span className="text-red-400">*</span></label>
                                <input type="text" placeholder="Ví dụ: Mì tôm Hảo Hảo"
                                    value={importForm.productName}
                                    onChange={e => setImportForm(p => ({ ...p, productName: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Loại hàng</label>
                                    <select value={importForm.categoryId}
                                        onChange={e => setImportForm(p => ({ ...p, categoryId: e.target.value }))}
                                        className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                    >
                                        <option value="">-- Chọn --</option>
                                        {categories.map(c => <option key={c.categoryId ?? c.id} value={c.categoryId ?? c.id}>{c.categoryName ?? c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Số lượng <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <input type="number" min="0"
                                            value={importForm.quantity}
                                            onChange={e => setImportForm(p => ({ ...p, quantity: e.target.value }))}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl pl-4 pr-16 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                        />
                                        <input type="text" placeholder="Đơn vị"
                                            value={importForm.unit}
                                            onChange={e => setImportForm(p => ({ ...p, unit: e.target.value }))}
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-14 text-[11px] text-center border ${theme.inputBorder} ${theme.inputBg} rounded-lg px-1 py-0.5 outline-none`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Vị trí kho</label>
                                <select value={importForm.warehouseId}
                                    onChange={e => setImportForm(p => ({ ...p, warehouseId: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                >
                                    <option value="">-- Chọn kho --</option>
                                    {warehouses.map(w => <option key={w.warehouseId ?? w.id} value={w.warehouseId ?? w.id}>{w.warehouseName ?? w.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Ghi chú (Tùy chọn)</label>
                                <textarea rows={3} placeholder="Thông tin thêm về lô hàng..."
                                    value={importForm.note}
                                    onChange={e => setImportForm(p => ({ ...p, note: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                            <button onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleImportSubmit}
                                disabled={submitting || !importForm.productName.trim()}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting || !importForm.productName.trim() ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'}`}
                            >
                                {submitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                Xác nhận nhập
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes invIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-inv-in { animation: invIn 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default InventoryManagement;
