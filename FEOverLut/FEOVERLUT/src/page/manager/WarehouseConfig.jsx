import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getWareHouseApi, createWareHouseApi, updateWareHouseApi, deleteWareHouseApi, getWareHouseStockApi } from '../../features/wareHouse/api/wareHouseApi';
import { useInventory } from '../../features/inventory/hook/useInventory';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

const WarehouseConfig = () => {
    const { isDarkMode, theme } = useOutletContext();
    const { getProducts, getCategories } = useInventory();

    // ── Data ───────────────────────────────────────────────────────
    const [warehouses, setWarehouses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── Filter ─────────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState('');

    // ── Modal state ────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Stock Modal
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [loadingStock, setLoadingStock] = useState(false);
    const [currentStockData, setCurrentStockData] = useState([]);
    const [selectedWarehouseForStock, setSelectedWarehouseForStock] = useState(null);

    // Form
    const [form, setForm] = useState({
        warehouseId: null,
        warehouseName: '',
        address: '',
        gpsText: '10.762622, 106.660172',
        isActive: true
    });

    // ── Fetch ──────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getWareHouseApi();
            setWarehouses(toArr(res.data || res));
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Computed ───────────────────────────────────────────────────
    const filtered = warehouses.filter(w => {
        const matchSearch = (w.warehouseName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (w.address ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchSearch;
    });

    const activeCount = warehouses.filter(w => w.isActive).length;
    const inactiveCount = warehouses.length - activeCount;

    // ── Submit Form ────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!form.warehouseName.trim()) return;
        setSubmitting(true);
        try {
            // Parse gpsText (lat, lng) to GeoJSON Point coordinates [lng, lat]
            let coordinates = [106.660172, 10.762622];
            if (form.gpsText && form.gpsText.includes(',')) {
                const parts = form.gpsText.split(',').map(s => parseFloat(s.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    // GeoJSON coordinates are [longitude, latitude]
                    coordinates = [parts[1], parts[0]];
                }
            }

            const payload = {
                warehouseId: form.warehouseId || 0,
                warehouseName: form.warehouseName,
                address: form.address,
                locationText: form.address, // Team leader: "Location text là cái địa chỉ bên trên á"
                isActive: form.isActive,
                location: {
                    type: "Point",
                    coordinates: coordinates
                }
            };

            if (modalMode === 'edit' && form.warehouseId) {
                await updateWareHouseApi(form.warehouseId, payload);
            } else {
                await createWareHouseApi(payload);
            }

            setIsModalOpen(false);
            setForm({
                warehouseId: null,
                warehouseName: '',
                address: '',
                gpsText: '10.762622, 106.660172',
                isActive: true
            });
            fetchAll();
        } catch (error) {
            alert('Lưu thông tin kho thất bại. Vui lòng kiểm tra lại!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteWareHouseApi(id);
            setDeleteConfirmId(null);
            fetchAll();
        } catch (e) {
            console.error(e);
            alert('Không thể xoá kho này từ hệ thống. \n\nLý do: Kho đang có hàng tồn hoặc đã có dữ liệu lịch sử liên quan. Bạn nên chuyển sang trạng thái "Đã đóng" thay vì xoá bỏ hoàn toàn để bảo toàn dữ liệu.');
        }
    };

    const openCreate = () => {
        setForm({
            warehouseId: null,
            warehouseName: '',
            address: '',
            gpsText: '10.762622, 106.660172',
            isActive: true
        });
        setModalMode('create');
        setIsModalOpen(true);
    };

    const openEdit = (item) => {
        const itemLat = item.location?.coordinates?.[1] ?? 10.762622;
        const itemLng = item.location?.coordinates?.[0] ?? 106.660172;
        setForm({
            warehouseId: item.warehouseId ?? item.id,
            warehouseName: item.warehouseName || '',
            address: item.address || '',
            gpsText: `${itemLat}, ${itemLng}`,
            isActive: item.isActive ?? true
        });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewStock = async (wh) => {
        setSelectedWarehouseForStock(wh);
        setIsStockModalOpen(true);
        setLoadingStock(true);
        try {
            const whId = wh.warehouseId ?? wh.id;
            // Fetch stocks and products and categories in parallel
            const [stockRes, prodRes, catRes] = await Promise.all([
                getWareHouseStockApi(whId),
                getProducts(),
                getCategories()
            ]);

            const stocks = toArr(stockRes.data || stockRes);
            const products = toArr(prodRes);
            const categories = toArr(catRes);

            // Map product details into stocks
            const mappedStocks = stocks.map(st => {
                const p = products.find(prod => (prod.productId ?? prod.id) === st.productId) || {};
                const c = categories.find(cat => (cat.categoryId ?? cat.id) === p.categoryId) || {};
                return {
                    ...st,
                    productName: p.productName || 'Vật tư không xác định',
                    unit: p.unit || 'Đơn vị',
                    categoryName: c.categoryName || c.name || 'Khác',
                };
            });

            setCurrentStockData(mappedStocks);
        } catch {
            alert("Không thể lấy dữ liệu tồn kho. Vui lòng thử lại!");
            setIsStockModalOpen(false);
        } finally {
            setLoadingStock(false);
        }
    };

    return (
        <div className="space-y-6 animate-wh-in">
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Hệ Thống Điểm Kho</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Định nghĩa và tuỳ chỉnh các địa điểm tập kết hàng hóa cứu trợ.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => fetchAll()}
                        className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`}
                        title="Làm mới"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Thêm Kho Mới
                    </button>
                </div>
            </div>

            {/* ── KPI CARDS ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Tổng số điểm kho', value: warehouses.length, color: 'bg-blue-500/10 text-blue-500' },
                    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Kho đang hoạt động', value: activeCount, color: 'bg-emerald-500/10 text-emerald-500' },
                    { icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Kho tạm đã đóng', value: inactiveCount, color: 'bg-slate-500/10 text-slate-500' },
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
                    <input type="text" placeholder="Tìm kiếm theo Tên kho hoặc Địa chỉ..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                </div>
                <p className={`lg:ml-auto text-sm ${theme.textMuted} shrink-0`}>
                    {isLoading ? 'Đang tải...' : `${filtered.length} kết quả`}
                </p>
            </div>

            {/* ── TABLE ──────────────────────────────────────────── */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['ID', 'Tên Kho', 'Địa chỉ', 'Tọa độ GPS', 'Trạng thái', 'Thao tác'].map(h => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider ${h === 'Thao tác' ? 'text-center' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Đang tải dữ liệu điểm kho...</span>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className={`w-12 h-12 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Không tìm thấy dữ liệu điểm kho.</span>
                                        <button onClick={openCreate} className="mt-1 text-sm font-semibold text-emerald-500 hover:text-emerald-400">+ Thêm điểm kho đầu tiên</button>
                                    </div>
                                </td></tr>
                            ) : filtered.map((item) => {
                                const whId = item.warehouseId ?? item.id;
                                return (
                                    <tr key={whId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            #WH-{String(whId).padStart(3, '0')}
                                        </td>
                                        <td className={`px-6 py-4 text-[15px] font-semibold ${theme.text}`}>
                                            {item.warehouseName || '—'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${theme.text} max-w-[200px] truncate`} title={item.address}>
                                            {item.address || '—'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${theme.textMuted} font-mono text-[12px]`}>
                                            {item.location?.coordinates ? (
                                                <span>
                                                    {item.location.coordinates[1].toFixed(6)}, {item.location.coordinates[0].toFixed(6)}
                                                </span>
                                            ) : (item.address || '—')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.isActive ? (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10`}>Hoạt động</span>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-500/10`}>Đã đóng</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {deleteConfirmId === whId ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleDelete(whId)} className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded flex shrink-0">Xóa kho</button>
                                                    <button onClick={() => setDeleteConfirmId(null)} className={`px-2.5 py-1 rounded text-[11px] font-bold border ${theme.border} ${theme.textMuted} hover:bg-black/5 flex shrink-0`}>Hủy</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleViewStock(item)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-amber-500`} title="Xem tồn kho">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                                    </button>
                                                    <button onClick={() => openEdit(item)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500`} title="Chỉnh sửa kho">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteConfirmId(whId)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500`}>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL CREATE/EDIT ──────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[480px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>
                                {modalMode === 'edit' ? 'Cập Nhật Điểm Kho' : 'Thêm Kho Mới'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tên kho <span className="text-red-400">*</span></label>
                                <input type="text" placeholder="Ví dụ: Kho Lũ Lụt TP..."
                                    value={form.warehouseName}
                                    onChange={e => setForm(p => ({ ...p, warehouseName: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Địa chỉ</label>
                                <input type="text" placeholder="Số nhà, đường, phường, quận..."
                                    value={form.address}
                                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                                />
                            </div>

                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tọa độ GPS</label>
                                <input type="text" placeholder="Ví dụ: 10.762622, 106.660172"
                                    value={form.gpsText}
                                    onChange={e => setForm(p => ({ ...p, gpsText: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono`}
                                />
                                <p className={`text-[11px] mt-1 ${theme.textMuted}`}>Chuỗi định dạng: vĩ độ, kinh độ (latitude, longitude).</p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
                                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                    <span className={`ml-3 text-[13px] font-semibold ${theme.text}`}>Kho đang hoạt động</span>
                                </label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                            <button onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !form.warehouseName.trim()}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting || !form.warehouseName.trim() ? 'bg-emerald-600/50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30'}`}
                            >
                                {submitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                {modalMode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL VIEW STOCK ──────────────────────────────── */}
            {isStockModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[700px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between shrink-0`}>
                            <div>
                                <h3 className={`text-lg font-bold ${theme.text}`}>Tồn Kho: {selectedWarehouseForStock?.warehouseName}</h3>
                                <p className={`text-xs ${theme.textMuted} mt-0.5`}>Thống kê số lượng vật tư đang lưu trữ tại điểm kho này.</p>
                            </div>
                            <button onClick={() => setIsStockModalOpen(false)} className={`p-1.5 rounded-lg border ${theme.border} ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-0 min-h-[300px]">
                            {loadingStock ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-3">
                                    <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    <span className={`text-sm ${theme.textMuted}`}>Đang tải dữ liệu tồn khoa...</span>
                                </div>
                            ) : currentStockData.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-2">
                                    <svg className={`w-12 h-12 mb-2 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    <span className={`text-[15px] font-semibold ${theme.text}`}>Kho đang trống rỗng</span>
                                    <span className={`text-sm ${theme.textMuted}`}>Chưa có hàng hóa nào được lưu trữ tại điểm kho này.</span>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className={`sticky top-0 ${isDarkMode ? 'bg-slate-800/95' : 'bg-slate-50/95'} backdrop-blur-md border-b ${theme.border} z-10`}>
                                        <tr>
                                            <th className={`px-6 py-3.5 text-xs font-semibold ${theme.textMuted} uppercase`}>Vật phẩm</th>
                                            <th className={`px-6 py-3.5 text-xs font-semibold ${theme.textMuted} uppercase text-right`}>Tồn kho</th>
                                            <th className={`px-6 py-3.5 text-xs font-semibold ${theme.textMuted} uppercase`}>Lần cập nhật cuối</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                        {currentStockData.map((st, i) => (
                                            <tr key={i} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors`}>
                                                <td className="px-6 py-3">
                                                    <div className={`text-sm font-bold ${theme.text}`}>{st.productName}</div>
                                                    <div className={`text-[11px] font-medium uppercase tracking-wide px-2 py-0.5 inline-block mt-1 rounded-md bg-blue-500/10 text-blue-500`}>{st.categoryName}</div>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <span className={`text-[15px] font-extrabold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{st.currentQuantity}</span>
                                                    <span className={`text-[11px] font-bold ml-1.5 ${theme.textMuted}`}>{st.unit}</span>
                                                </td>
                                                <td className={`px-6 py-3 text-sm font-medium ${theme.textMuted}`}>
                                                    {st.lastUpdated ? new Date(st.lastUpdated).toLocaleString('vi-VN') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes whIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-wh-in { animation: whIn 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default WarehouseConfig;
