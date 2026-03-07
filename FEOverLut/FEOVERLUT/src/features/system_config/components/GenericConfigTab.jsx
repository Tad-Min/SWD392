import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

const GenericConfigTab = ({
    title,
    subtitle,
    itemName,
    nameHeader,
    searchPlaceholder,
    fetchApi,
    createApi,
    updateApi,
    deleteApi,
    idField = 'id',
    nameField = 'name'
}) => {
    const { isDarkMode, theme } = useOutletContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formName, setFormName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const iconColors = [
        'bg-blue-500/10 text-blue-500',
        'bg-purple-500/10 text-purple-500',
        'bg-orange-500/10 text-orange-500',
        'bg-emerald-500/10 text-emerald-500',
        'bg-red-500/10 text-red-500',
        'bg-cyan-500/10 text-cyan-500',
    ];

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            // Assume apis handle params ?typeName=... or similar
            // Some APIs might use different param names, so we might need a custom search function or standardized param.
            // But let's assume they accept { typeName: search } or { name: search }
            const params = search ? { typeName: search, name: search } : {};
            const res = await fetchApi(params);
            setItems(res);
        } catch (err) {
            setError(`Không thể tải danh sách ${itemName}.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []); // Run once on mount or when tab changes (since it's inside the tab)

    // Search debounce
    useEffect(() => {
        const t = setTimeout(() => fetchItems(), 400);
        return () => clearTimeout(t);
    }, [search]);

    const openCreate = () => {
        setEditingItem(null);
        setFormName('');
        setIsModalOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormName(item[nameField] ?? item.name ?? item.typeName ?? '');
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formName.trim()) return;
        setSubmitting(true);
        try {
            if (editingItem) {
                await updateApi({
                    [idField]: editingItem[idField] ?? editingItem.id,
                    [nameField]: formName,
                });
            } else {
                await createApi({
                    [nameField]: formName,
                });
            }
            setIsModalOpen(false);
            fetchItems();
            toast.success(editingItem ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        } catch (err) {
            toast.error('Lỗi khi lưu. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteApi(id);
            setDeleteConfirmId(null);
            fetchItems();
            toast.success('Xóa thành công!');
        } catch (err) {
            toast.error('Xóa thất bại.');
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>{title}</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>{subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchItems}
                        className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`}
                        title="Làm mới"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Thêm mới
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72 mb-5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {error}
                </div>
            )}

            {/* Table */}
            <div className={`w-full border ${theme.border} rounded-xl overflow-hidden flex-1`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>ID</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Biểu tượng</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>{nameHeader}</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-7 h-7 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className={`text-sm ${theme.textMuted}`}>Đang tải từ backend...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className={`w-10 h-10 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                            <span className={`text-sm ${theme.textMuted}`}>Chưa có {itemName} nào.</span>
                                            <button onClick={openCreate} className="mt-2 text-sm font-semibold text-blue-500 hover:text-blue-400">+ Thêm mới</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.map((item, idx) => {
                                const id = item[idField] ?? item.id;
                                const name = item[nameField] ?? item.typeName ?? item.name ?? '—';
                                const colorClass = iconColors[idx % iconColors.length];
                                return (
                                    <tr key={id} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            #{String(id).padStart(3, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${colorClass}`}>
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-[15px] font-semibold ${theme.text}`}>{name}</td>
                                        <td className="px-6 py-4 text-right">
                                            {deleteConfirmId === id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`text-xs ${theme.textMuted}`}>Xác nhận xóa?</span>
                                                    <button onClick={() => handleDelete(id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors">Xóa</button>
                                                    <button onClick={() => setDeleteConfirmId(null)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${theme.border} ${theme.textMuted} hover:bg-black/5`}>Hủy</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(item)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500 transition-colors`}>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteConfirmId(id)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500 transition-colors`}>
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

            {/* Count */}
            {!loading && items.length > 0 && (
                <p className={`mt-3 text-xs ${theme.textMuted}`}>Hiển thị {items.length} {itemName}</p>
            )}

            {/* ── MODAL Thêm / Sửa ───────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div
                        className={`w-full max-w-[420px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>
                                {editingItem ? `Sửa ${itemName}` : `Thêm ${itemName}`}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>
                                {nameHeader} <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder={`Nhập tên ${itemName}...`}
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                autoFocus
                            />
                            {editingItem && (
                                <p className={`mt-2 text-xs ${theme.textMuted}`}>ID: #{String(editingItem[idField] ?? editingItem.id).padStart(3, '0')}</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                            <button onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !formName.trim()}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting || !formName.trim() ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'}`}
                            >
                                {submitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
                                {editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GenericConfigTab;
