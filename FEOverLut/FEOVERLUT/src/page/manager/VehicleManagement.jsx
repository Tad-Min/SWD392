import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useVehicle, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../../features/Vehicle/hook/useVehicle';
import api from '../../config/axios';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

const VehicleManagement = () => {
    const { isDarkMode, theme } = useOutletContext();
    
    const { fetchVehicle } = useVehicle();
    const { createVehicle } = useCreateVehicle();
    const { updateVehicle } = useUpdateVehicle();
    const { deleteVehicle } = useDeleteVehicle();

    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [vehicleForm, setVehicleForm] = useState({
        vehicleId: null,
        vehicleCode: '',
        vehicleType: '',
        capacity: ''
    });

    const loadVehicles = async () => {
        setIsLoading(true);
        try {
            const [typesRes, vehiclesRes] = await Promise.allSettled([
                api.get('Types/Vehicles'),
                fetchVehicle()
            ]);
            if (typesRes.status === 'fulfilled') {
                setVehicleTypes(toArr(typesRes.value));
            }
            if (vehiclesRes.status === 'fulfilled') {
                setVehicles(toArr(vehiclesRes.value));
            }
        } catch (error) {
            console.error("Fail to load vehicles data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredVehicles = vehicles.filter(v => {
        const typeName = vehicleTypes.find(t => t.vehicleTypeId === v.vehicleType)?.typeName || '';
        return (v.vehicleCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
               typeName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSave = async () => {
        if (!vehicleForm.vehicleCode.trim() || !vehicleForm.vehicleType) return;
        setIsSubmitting(true);
        try {
            const payload = {
                vehicleCode: vehicleForm.vehicleCode.trim(),
                vehicleType: parseInt(vehicleForm.vehicleType),
                capacity: vehicleForm.capacity ? parseInt(vehicleForm.capacity) : 0,
                statusId: 1 // default to active/available
            };

            if (vehicleForm.vehicleId) {
                await updateVehicle(vehicleForm.vehicleId, payload);
            } else {
                await createVehicle(payload);
            }
            setIsModalOpen(false);
            setVehicleForm({ vehicleId: null, vehicleCode: '', vehicleType: '', capacity: '' });
            loadVehicles();
        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu phương tiện.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá phương tiện này?")) return;
        try {
            await deleteVehicle(id);
            loadVehicles();
        } catch (error) {
            console.error(error);
            alert("Không thể xoá phương tiện vì có thể đã được phân công hoặc cấu hình.");
        }
    };

    return (
        <div className="space-y-6 animate-inv-in">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Phương Tiện</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Xem, thêm, sửa, xoá phương tiện vận chuyển cứu trợ.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => loadVehicles()}
                        className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`}
                        title="Làm mới"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button
                        onClick={() => {
                            setVehicleForm({ vehicleId: null, vehicleCode: '', vehicleType: '', capacity: '' });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Thêm Phương Tiện
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="relative w-full lg:w-64 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" placeholder="Tìm biển số, loại..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                </div>
                <p className={`lg:ml-auto text-sm ${theme.textMuted} shrink-0`}>
                    Tổng số: {filteredVehicles.length} phương tiện
                </p>
            </div>

            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                {['ID', 'Biển Số', 'Loại', 'Tải Trọng / Sức chứa', 'Thao tác'].map((h, i) => (
                                    <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider whitespace-nowrap ${i === 4 ? 'text-center' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-14 text-center">Đang tải...</td></tr>
                            ) : filteredVehicles.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-14 text-center text-sm">Chưa có phương tiện nào.</td></tr>
                            ) : filteredVehicles.map(item => {
                                const typeName = vehicleTypes.find(t => t.vehicleTypeId === item.vehicleType)?.typeName || `Type #${item.vehicleType}`;
                                return (
                                <tr key={item.vehicleId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                    <td className={`px-6 py-4 text-sm font-bold ${theme.text}`}>#{item.vehicleId}</td>
                                    <td className={`px-6 py-4 text-[15px] font-semibold ${theme.text}`}>{item.vehicleCode}</td>
                                    <td className={`px-6 py-4 text-sm ${theme.text}`}>{typeName}</td>
                                    <td className={`px-6 py-4 text-sm ${theme.text}`}>{item.capacity || '—'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity gap-2">
                                            <button onClick={() => {
                                                setVehicleForm({ vehicleId: item.vehicleId, vehicleCode: item.vehicleCode || '', vehicleType: item.vehicleType || '', capacity: item.capacity || '' });
                                                setIsModalOpen(true);
                                            }} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500`}>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(item.vehicleId)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500`}>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md mt-16 ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl p-6`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>
                            {vehicleForm.vehicleId ? 'Cập Nhật Phương Tiện' : 'Tạo Phương Tiện Mới'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Biển số xe *</label>
                                <input
                                    type="text"
                                    value={vehicleForm.vehicleCode}
                                    placeholder="Vd: 51H-123.45"
                                    onChange={e => setVehicleForm(p => ({ ...p, vehicleCode: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                />
                            </div>
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Loại xe *</label>
                                <select
                                    value={vehicleForm.vehicleType}
                                    onChange={e => setVehicleForm(p => ({ ...p, vehicleType: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                >
                                    <option value="">-- Chọn Loại Xe --</option>
                                    {vehicleTypes.map(t => (
                                        <option key={t.vehicleTypeId} value={t.vehicleTypeId}>{t.typeName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Sức chứa / Tải trọng (số nguyên)</label>
                                <input
                                    type="number"
                                    value={vehicleForm.capacity}
                                    placeholder="Vd: 2000"
                                    onChange={e => setVehicleForm(p => ({ ...p, capacity: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5`}>Hủy</button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting || !vehicleForm.vehicleCode.trim() || !vehicleForm.vehicleType}
                                className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                            >
                                Lưu Lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleManagement;
