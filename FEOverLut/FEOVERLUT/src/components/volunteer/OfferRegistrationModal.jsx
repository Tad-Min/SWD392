import React, { useState, useEffect } from 'react';
import { useVolunteerOffers } from '../../features/volunteer/hook/useVolunteer';

const OfferRegistrationModal = ({ isOpen, onClose }) => {
    const { offerTypes, fetchOfferTypes, createOffer, isLoading } = useVolunteerOffers();
    const [formData, setFormData] = useState({
        offerTypeId: '',
        offerName: '',
        quantity: 1,
        unit: 'Thùng / Gói',
        description: '',
        isReturnRequired: false,
        dropoffLocationText: '',
        contactPhone: ''
    });

    useEffect(() => {
        if (isOpen) fetchOfferTypes();
    }, [isOpen, fetchOfferTypes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOffer({
                ...formData,
                offerTypeId: parseInt(formData.offerTypeId)
            });
            onClose();
        } catch (error) {
            // Handled in Hook
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20">
            <div className="w-full max-w-lg bg-[#1e253c] border border-green-500/30 rounded-2xl shadow-2xl p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                
                <h3 className="text-xl font-bold text-white mb-2">Đăng ký Tiếp Tế Vật Phẩm</h3>
                <p className="text-sm text-slate-400 mb-6">
                    Vật phẩm của bạn sẽ được Quản lý tiếp nhận. Sau đó, chúng tôi sẽ gửi **Email thông báo Kho Tập Kết** để bạn có thể mang đồ tới.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Loại vật phẩm *</label>
                            <select 
                                required 
                                value={formData.offerTypeId} 
                                onChange={e => setFormData({...formData, offerTypeId: e.target.value})}
                                className="w-full p-2.5 bg-[#0f1525] border border-white/10 rounded-lg text-sm text-white focus:border-green-500 outline-none"
                            >
                                <option value="">-- Chọn loại --</option>
                                {offerTypes?.map(t => (
                                    <option key={t.offerTypeId} value={t.offerTypeId}>{t.typeName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Tên vật phẩm cụ thể *</label>
                            <input 
                                required type="text" placeholder="VD: Nước suối Lavie"
                                value={formData.offerName} onChange={e => setFormData({...formData, offerName: e.target.value})}
                                className="w-full p-2.5 bg-[#0f1525] border border-white/10 rounded-lg text-sm text-white focus:border-green-500 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 col-span-2 sm:col-span-1">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Số lượng *</label>
                                <input 
                                    required type="number" min="1"
                                    value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                    className="w-full p-2.5 bg-[#0f1525] border border-white/10 rounded-lg text-sm text-white focus:border-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Đơn vị *</label>
                                <input 
                                    required type="text"
                                    value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                                    className="w-full p-2.5 bg-[#0f1525] border border-white/10 rounded-lg text-sm text-white focus:border-green-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 bg-[#0f1525] p-3 rounded-lg border border-white/5">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isReturnRequired} onChange={e => setFormData({...formData, isReturnRequired: e.target.checked})}
                                    className="w-4 h-4 rounded bg-slate-700 text-green-500 focus:ring-green-500"
                                />
                                Yêu cầu hoàn trả (Đồ cho mượn - Vd: Thuyền, Áo phao)
                            </label>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Số điện thoại liên hệ *</label>
                            <input 
                                required type="tel" placeholder="090..."
                                value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                                className="w-full p-2.5 bg-[#0f1525] border border-white/10 rounded-lg text-sm text-white focus:border-green-500 outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Cần điều phối tới lấy tại đâu? (Ghi chú nếu bạn không thể tự mang tới Kho)</label>
                            <input 
                                type="text" placeholder="Địa chỉ hiện tại của mặt hàng..."
                                value={formData.dropoffLocationText} onChange={e => setFormData({...formData, dropoffLocationText: e.target.value})}
                                className="w-full p-2.5 bg-[#0f1525] border border-white/10 rounded-lg text-sm text-white focus:border-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 transition-colors shadow-lg shadow-green-500/25">
                            {isLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferRegistrationModal;
