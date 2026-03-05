import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSystemConfig } from '../../features/system_config/hook/useSystemConfig';

const SystemConfig = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [activeTab, setActiveTab] = useState('emergency');

    // ── Urgency Levels ─────────────────────────────────────────────────
    const urgencyLevels = [
        { id: 1, name: 'Critical', desc: 'Sơ tán tức thời thiết yếu', priorityLabel: 'Cao', priorityValue: 100, colorCode: '#DC2626', priorityColor: 'bg-red-600' },
        { id: 2, name: 'High', desc: 'Chuẩn bị phòng ngừa nguy hiểm', priorityLabel: 'TB - Cao', priorityValue: 75, colorCode: '#F97316', priorityColor: 'bg-orange-500' },
        { id: 3, name: 'Moderate', desc: 'Chú ý điều kiện tại địa phương', priorityLabel: 'Trung bình', priorityValue: 50, colorCode: '#EAB308', priorityColor: 'bg-yellow-500' },
        { id: 4, name: 'Low', desc: 'Không có đe dọa trực tiếp', priorityLabel: 'Thấp', priorityValue: 25, colorCode: '#10B981', priorityColor: 'bg-emerald-500' },
    ];

    // ── Vehicle Types State ─────────────────────────────────────────────
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vtLoading, setVtLoading] = useState(false);
    const [vtError, setVtError] = useState(null);
    const [vtSearch, setVtSearch] = useState('');
    const [isVtModalOpen, setIsVtModalOpen] = useState(false);
    const [editingVt, setEditingVt] = useState(null); // null = create mode
    const [vtForm, setVtForm] = useState({ vehiclesTypeName: '' });
    const [vtSubmitting, setVtSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const { getVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType } = useSystemConfig();

    const fetchVehicleTypes = async () => {
        setVtLoading(true);
        setVtError(null);
        try {
            const params = vtSearch ? { typeName: vtSearch } : {};
            const res = await getVehicleTypes(params);
            setVehicleTypes(res);
        } catch {
            setVtError('Không thể tải danh sách loại phương tiện.');
        } finally {
            setVtLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'vehicle') {
            fetchVehicleTypes();
        }
    }, [activeTab]);

    // Search debounce
    useEffect(() => {
        if (activeTab !== 'vehicle') return;
        const t = setTimeout(() => fetchVehicleTypes(), 400);
        return () => clearTimeout(t);
    }, [vtSearch]);

    const openCreate = () => {
        setEditingVt(null);
        setVtForm({ vehiclesTypeName: '' });
        setIsVtModalOpen(true);
    };

    const openEdit = (vt) => {
        setEditingVt(vt);
        setVtForm({ vehiclesTypeName: vt.vehiclesTypeName ?? vt.typeName ?? '' });
        setIsVtModalOpen(true);
    };

    const handleVtSubmit = async () => {
        if (!vtForm.vehiclesTypeName.trim()) return;
        setVtSubmitting(true);
        try {
            if (editingVt) {
                await updateVehicleType({
                    vehiclesTypeId: editingVt.vehiclesTypeId ?? editingVt.id,
                    vehiclesTypeName: vtForm.vehiclesTypeName,
                });
            } else {
                await createVehicleType({
                    vehiclesTypeName: vtForm.vehiclesTypeName,
                });
            }
            setIsVtModalOpen(false);
            fetchVehicleTypes();
        } catch {
            alert('Lỗi khi lưu. Vui lòng thử lại.');
        } finally {
            setVtSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteVehicleType(id);
            setDeleteConfirmId(null);
            fetchVehicleTypes();
        } catch {
            alert('Xóa thất bại.');
        }
    };

    // ── Sub-menus ───────────────────────────────────────────────────────
    const subMenus = [
        { id: 'general', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Cài đặt chung' },
        { id: 'emergency', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', label: 'Mức độ khẩn cấp' },
        { id: 'vehicle', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', label: 'Loại phương tiện' },
        { id: 'api', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'API Integration' },
    ];

    // ── Icon colours cycling ────────────────────────────────────────────
    const iconColors = [
        'bg-blue-500/10 text-blue-500',
        'bg-purple-500/10 text-purple-500',
        'bg-orange-500/10 text-orange-500',
        'bg-emerald-500/10 text-emerald-500',
        'bg-red-500/10 text-red-500',
        'bg-cyan-500/10 text-cyan-500',
    ];

    return (
        <div className="animate-fade-in-up h-full flex flex-col sm:flex-row gap-6">
            {/* Sub-menu Navigation Sidebar */}
            <div className={`w-full sm:w-64 shrink-0 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-4 flex flex-col gap-2 h-fit`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.textMuted} mb-2 px-3`}>Tùy chọn</h3>
                {subMenus.map(menu => (
                    <button
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer
                            ${activeTab === menu.id
                                ? isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'
                                : `${theme.textMuted} ${theme.navHover} border border-transparent`
                            }
                        `}
                    >
                        <svg className={`w-5 h-5 ${activeTab === menu.id ? 'text-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={menu.icon} />
                        </svg>
                        <span className="text-sm font-semibold">{menu.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Configuration Content */}
            <div className={`flex-1 flex flex-col ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-6 sm:p-8 min-h-[500px]`}>

                {/* ── EMERGENCY LEVELS TAB ────────────────────────────────── */}
                {activeTab === 'emergency' && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className={`text-2xl font-bold ${theme.text}`}>Mức độ khẩn cấp (Emergency Levels)</h2>
                                <p className={`text-sm ${theme.textMuted} mt-1`}>Định nghĩa các cấp độ cảnh báo để kích hoạt quy trình tự động.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                    Thêm mức độ mới
                                </button>
                            </div>
                        </div>
                        <div className={`w-full border ${theme.border} rounded-xl overflow-hidden mb-8`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                            <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Tên Cấp Độ</th>
                                            <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider w-[25%]`}>Độ Ưu Tiên</th>
                                            <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Mã Màu</th>
                                            <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Thao Tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                        {urgencyLevels.map((level) => (
                                            <tr key={level.id} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className={`text-[15px] font-bold ${theme.text}`}>{level.name}</span>
                                                        <span className={`text-[12px] ${theme.textMuted} mt-0.5`}>{level.desc}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 w-full pr-4">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className={`font-semibold ${theme.text}`}>{level.priorityLabel}</span>
                                                            <span className={theme.textMuted}>{level.priorityValue}</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                                            <div className={`h-full ${level.priorityColor} rounded-full`} style={{ width: `${level.priorityValue}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" style={{ backgroundColor: level.colorCode }}></div>
                                                        <span className={`text-sm font-mono ${theme.textMuted}`}>{level.colorCode}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500 transition-colors`}>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500 transition-colors`}>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ── VEHICLE TYPES TAB ──────────────────────────────────── */}
                {activeTab === 'vehicle' && (
                    <>
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className={`text-2xl font-bold ${theme.text}`}>Loại Phương Tiện Cứu Hộ</h2>
                                <p className={`text-sm ${theme.textMuted} mt-1`}>Quản lý danh mục loại phương tiện dùng trong các nhiệm vụ.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => fetchVehicleTypes()}
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
                                    Thêm loại mới
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
                                placeholder="Tìm theo tên loại..."
                                value={vtSearch}
                                onChange={e => setVtSearch(e.target.value)}
                                className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                            />
                        </div>

                        {/* Error */}
                        {vtError && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                {vtError}
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
                                            <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Tên Loại Phương Tiện</th>
                                            <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Thao Tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                        {vtLoading ? (
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
                                        ) : vehicleTypes.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <svg className={`w-10 h-10 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                                        <span className={`text-sm ${theme.textMuted}`}>Chưa có loại phương tiện nào.</span>
                                                        <button onClick={openCreate} className="mt-2 text-sm font-semibold text-blue-500 hover:text-blue-400">+ Thêm loại mới</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : vehicleTypes.map((vt, idx) => {
                                            const id = vt.vehiclesTypeId ?? vt.id;
                                            const name = vt.vehiclesTypeName ?? vt.typeName ?? vt.name ?? '—';
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
                                                                <button onClick={() => openEdit(vt)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500 transition-colors`}>
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
                        {!vtLoading && vehicleTypes.length > 0 && (
                            <p className={`mt-3 text-xs ${theme.textMuted}`}>Hiển thị {vehicleTypes.length} loại phương tiện</p>
                        )}
                    </>
                )}

                {/* ── OTHER TABS PLACEHOLDER ─────────────────────────────── */}
                {(activeTab === 'general' || activeTab === 'api') && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
                        <div className={`w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'} flex items-center justify-center`}>
                            <svg className={`w-8 h-8 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        <div className="text-center">
                            <p className={`font-semibold ${theme.text}`}>Chức năng đang phát triển</p>
                            <p className={`text-sm ${theme.textMuted} mt-1`}>Module này chưa hoàn thiện tính năng.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── MODAL Thêm / Sửa Loại Phương Tiện ───────────────────── */}
            {isVtModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div
                        className={`w-full max-w-[420px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>
                                {editingVt ? 'Chỉnh sửa loại phương tiện' : 'Thêm loại phương tiện mới'}
                            </h3>
                            <button onClick={() => setIsVtModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>
                                Tên loại phương tiện <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Ca nô cứu hộ, Trực thăng..."
                                value={vtForm.vehiclesTypeName}
                                onChange={e => setVtForm({ vehiclesTypeName: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleVtSubmit()}
                                className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                autoFocus
                            />
                            {editingVt && (
                                <p className={`mt-2 text-xs ${theme.textMuted}`}>ID: #{String(editingVt.vehiclesTypeId ?? editingVt.id).padStart(3, '0')}</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                            <button onClick={() => setIsVtModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleVtSubmit}
                                disabled={vtSubmitting || !vtForm.vehiclesTypeName.trim()}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${vtSubmitting || !vtForm.vehiclesTypeName.trim() ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'}`}
                            >
                                {vtSubmitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
                                {editingVt ? 'Lưu thay đổi' : 'Thêm mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default SystemConfig;
