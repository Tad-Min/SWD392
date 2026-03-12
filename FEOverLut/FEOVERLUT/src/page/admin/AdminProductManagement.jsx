import { useState, useEffect, useCallback, useRef } from 'react';
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

const AdminProductManagement = () => {
    const { isDarkMode, theme } = useOutletContext();

    const {
        getProducts, createProduct, updateProduct, deleteProduct,
        getCategories, createCategory, updateCategory, deleteCategory,
        getWarehouseStock, deleteWarehouseStock
    } = useInventory();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeletingId, setIsDeletingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'categories'
    const [submitting, setSubmitting] = useState(false);

    const [productForm, setProductForm] = useState({
        productId: null, productName: '', categoryId: '', unit: ''
    });

    const [catForm, setCatForm] = useState({ categoryId: null, categoryName: '', description: '' });
    const [isCatEditing, setIsCatEditing] = useState(false);

    // Combobox state for product name
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const comboboxRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (comboboxRef.current && !comboboxRef.current.contains(e.target)) {
                setShowProductDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        const [pRes, cRes] = await Promise.allSettled([
            getProducts(),
            getCategories(),
        ]);
        if (pRes.status === 'fulfilled') setProducts(toArr(pRes.value));
        if (cRes.status === 'fulfilled') setCategories(toArr(cRes.value));
        setIsLoading(false);
    }, [getProducts, getCategories]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const mappedProducts = products.map(p => {
        const cat = categories.find(c => (c.categoryId ?? c.id) === (p.categoryId ?? p.id));
        return { ...p, categoryName: cat?.categoryName ?? cat?.name ?? '—' };
    });

    const filtered = mappedProducts.filter(item => {
        const matchSearch = (item.productName ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = selectedCategory ? item.categoryId === parseInt(selectedCategory) : true;
        return matchSearch && matchCat;
    });

    const handleProductSubmit = async () => {
        if (!productForm.productName.trim()) return;
        setSubmitting(true);
        try {
            if (modalMode === 'edit' && productForm.productId) {
                await updateProduct(productForm.productId, {
                    productName: productForm.productName.trim(),
                    categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
                    unit: productForm.unit || 'Đơn vị',
                });
            } else {
                await createProduct({
                    productName: productForm.productName.trim(),
                    categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
                    unit: productForm.unit || 'Đơn vị',
                });
            }

            setIsModalOpen(false);
            setProductForm({ productId: null, productName: '', categoryId: '', unit: '' });
            fetchAll();
        } catch (error) {
            console.error(error);
            let msg = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!";
            if (typeof error.response?.data === 'string') msg = error.response.data;
            else if (error.response?.data?.message) msg = error.response.data.message;
            alert(`Lỗi: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này? Hệ thống sẽ xoá tất cả hàng hóa liên quan trong các kho trước (Safe Delete).")) return;

        setIsDeletingId(id);
        try {
            // Bước 1: Lấy danh sách kho chứa sản phẩm này
            const stockRes = await getWarehouseStock(null, id);
            const stocks = toArr(stockRes);

            // Bước 2: Xoá lần lượt trong các kho
            for (let i = 0; i < stocks.length; i++) {
                const stock = stocks[i];
                if (stock.warehouseId && stock.productId) {
                    await deleteWarehouseStock(stock.warehouseId, stock.productId);
                }
            }

            // Bước 3: Xoá sản phẩm gốc
            await deleteProduct(id);
            fetchAll();
            alert("Xóa sản phẩm an toàn thành công!");
        } catch (e) {
            console.error("Fail to delete product", e);
            let msg = "Lỗi không xác định hoặc vật tư này đã có dữ liệu ràng buộc Giao dịch (Transactions) nên không thể xoá.";
            if (typeof e.response?.data === 'string') msg = e.response.data;
            else if (e.response?.data?.message) msg = e.response.data.message;
            alert(`Xoá thất bại: ${msg}`);
        } finally {
            setIsDeletingId(null);
        }
    };

    const handleCatSubmit = async () => {
        if (!catForm.categoryName.trim()) return;
        setSubmitting(true);
        try {
            const catName = catForm.categoryName.trim();
            if (isCatEditing && catForm.categoryId) {
                await updateCategory(catForm.categoryId, catName);
            } else {
                await createCategory(catName);
            }
            const freshCats = await getCategories();
            setCategories(toArr(freshCats));
            setCatForm({ categoryId: null, categoryName: '', description: '' });
            setIsCatEditing(false);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu danh mục. Vui lòng thử tên khác hoặc kiểm tra lại!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCatDelete = async (id) => {
        try {
            await deleteCategory(id);
            const cRes = await getCategories();
            setCategories(toArr(cRes));
        } catch {
            alert('Xoá thất bại. Vui lòng kiểm tra sản phẩm đang dùng danh mục này.');
        }
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
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Sản Phẩm (Admin)</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Chức năng đầy đủ: xem, sinh mới sản phẩm, loại hàng, và cho phép Safe Delete.</p>
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
                        onClick={() => { setModalMode('categories'); setIsModalOpen(true); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                    >
                        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        Quản lý Loại hàng
                    </button>
                    <button
                        onClick={() => {
                            setProductForm({ productId: null, productName: '', categoryId: '', unit: '' });
                            setModalMode('add');
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Tạo Vật Phẩm Mới
                    </button>
                </div>
            </div>

            {/* ── ACTION BAR ─────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="relative w-full lg:w-64 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" placeholder="Tìm tên sản phẩm..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                </div>

                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all w-full sm:w-48 border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer appearance-none bg-no-repeat`}
                    style={{ backgroundImage: dropdownArrow, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                    <option value="">Tất cả loại hàng</option>
                    {categories.map(c => <option key={c.categoryId ?? c.id} value={c.categoryId ?? c.id}>{c.categoryName ?? c.name}</option>)}
                </select>

                <p className={`lg:ml-auto text-sm ${theme.textMuted} shrink-0`}>
                    Tổng số: {filtered.length} sản phẩm
                </p>
            </div>

            {/* ── TABLE ──────────────────────────────────────────── */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['ID', 'Tên Vật Phẩm', 'Loại Hàng', 'Đơn Vị', 'Thao tác'].map(h => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider whitespace-nowrap ${h === 'Thao tác' ? 'text-center' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <span className={`text-sm ${theme.textMuted}`}>Đang tải...</span>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className={`text-sm ${theme.textMuted}`}>{searchTerm ? 'Không tìm thấy kết quả.' : 'Chưa có sản phẩm nào.'}</span>
                                    </div>
                                </td></tr>
                            ) : filtered.map((item, idx) => {
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
                                        <td className="px-6 py-4">
                                            <span className={`text-[12px] font-medium tracking-wide uppercase px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 border ${theme.border}`}>{item.unit || 'Đơn vị'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity gap-2">
                                                <button disabled={isDeletingId === item.productId} onClick={() => { setProductForm({ productId: item.productId, productName: item.productName || '', categoryId: item.categoryId || '', unit: item.unit || '' }); setModalMode('edit'); setIsModalOpen(true); }} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500`} title="Chi tiết / Cập nhật">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button disabled={isDeletingId === item.productId} onClick={() => handleDeleteProduct(item.productId ?? item.id)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500`} title="Xóa toàn phần an toàn (Tự động xóa trong kho)">
                                                    {isDeletingId === item.productId ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    )}
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

            {/* ── MODALS ────────────────────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className={`w-full max-w-lg my-8 ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-visible relative`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>
                                {modalMode === 'categories' ? 'Quản lý Loại hàng' : modalMode === 'edit' ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm Mới'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        {modalMode === 'categories' ? (
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="catNameInput" className={`text-[13px] font-semibold ${theme.text}`}>Tên loại hàng mới</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="catNameInput"
                                                type="text"
                                                placeholder="Tên danh mục..."
                                                value={catForm.categoryName}
                                                onChange={e => setCatForm(p => ({ ...p, categoryName: e.target.value }))}
                                                className={`flex-1 border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none`}
                                            />
                                            <button onClick={handleCatSubmit} disabled={!catForm.categoryName.trim() || submitting}
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${submitting || !catForm.categoryName.trim() ? 'bg-purple-600/50' : 'bg-purple-600 hover:bg-purple-500 shadow-md'}`}>
                                                {isCatEditing ? 'Lưu' : 'Thêm'}
                                            </button>
                                        </div>
                                    </div>
                                    {isCatEditing && (
                                        <button onClick={() => { setIsCatEditing(false); setCatForm({ categoryId: null, categoryName: '', description: '' }); }}
                                            className="text-xs text-blue-500 hover:underline">Hủy chỉnh sửa</button>
                                    )}
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                                    {categories.map(cat => (
                                        <div key={cat.categoryId ?? cat.id} className={`flex items-center justify-between p-3 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                            <span className={`text-[14px] font-semibold ${theme.text}`}>{cat.categoryName ?? cat.name}</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setIsCatEditing(true); setCatForm({ categoryId: cat.categoryId ?? cat.id, categoryName: cat.categoryName ?? cat.name, description: cat.description ?? '' }); }} className={`p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleCatDelete(cat.categoryId ?? cat.id)} className={`p-1.5 rounded-lg text-red-500 hover:bg-red-500/10`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 space-y-4 overflow-visible">
                                <div ref={comboboxRef} className="relative z-[1010]">
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tên vật phẩm <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Nhập hoặc chọn tên sản phẩm..."
                                            value={productForm.productName}
                                            onChange={e => {
                                                setProductForm(p => ({ ...p, productName: e.target.value }));
                                                setShowProductDropdown(true);
                                            }}
                                            onClick={() => setShowProductDropdown(true)}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowProductDropdown(prev => !prev)}
                                            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme.textMuted} hover:text-blue-500 transition-colors`}
                                        >
                                            <svg className={`w-4 h-4 transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    {showProductDropdown && (() => {
                                        const query = productForm.productName.toLowerCase().trim();
                                        const suggestions = products.filter(p =>
                                            !query || (p.productName ?? '').toLowerCase().includes(query)
                                        );
                                        if (suggestions.length === 0) return null;
                                        return (
                                            <div className={`mt-2 w-full max-h-32 overflow-y-auto rounded-xl border ${theme.border} ${isDarkMode ? 'bg-[#0F172A]' : 'bg-slate-50'} shadow-inner`}>
                                                {suggestions.map(p => {
                                                    const cat = categories.find(c => (c.categoryId ?? c.id) === p.categoryId);
                                                    return (
                                                        <button
                                                            key={p.productId ?? p.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setProductForm(prev => ({
                                                                    ...prev,
                                                                    productName: p.productName ?? '',
                                                                    categoryId: p.categoryId ?? '',
                                                                    unit: p.unit ?? '',
                                                                }));
                                                                setShowProductDropdown(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-blue-50'}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
                                                                {(p.productName ?? '?').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className={`font-medium ${theme.text} truncate`}>{p.productName}</span>
                                                                <span className={`text-[11px] ${theme.textMuted}`}>
                                                                    {cat ? (cat.categoryName ?? cat.name) : '—'} · {p.unit || 'Đơn vị'}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Thuộc Loại hàng</label>
                                        <select
                                            value={productForm.categoryId}
                                            onChange={e => setProductForm(p => ({ ...p, categoryId: e.target.value }))}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer`}
                                        >
                                            <option value="">-- Chọn --</option>
                                            {categories.map(c => <option key={c.categoryId ?? c.id} value={c.categoryId ?? c.id}>{c.categoryName ?? c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Đơn vị <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Vd: Thùng, Gói, Can..."
                                            value={productForm.unit}
                                            onChange={e => setProductForm(p => ({ ...p, unit: e.target.value }))}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {modalMode !== 'categories' && (
                            <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                                <button onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>Hủy bỏ</button>
                                <button
                                    onClick={handleProductSubmit}
                                    disabled={submitting || !productForm.productName.trim() || !productForm.unit.trim()}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all ${submitting || !productForm.productName.trim() || !productForm.unit.trim() ? 'bg-blue-600/50' : 'bg-blue-600 hover:bg-blue-500'}`}
                                >
                                    {submitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                                    {modalMode === 'edit' ? 'Lưu cập nhật' : 'Phát hành mới'}
                                </button>
                            </div>
                        )}
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

export default AdminProductManagement;
