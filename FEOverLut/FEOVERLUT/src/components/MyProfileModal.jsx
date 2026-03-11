import React, { useState, useEffect } from 'react';
import { useUsers } from '../features/users/hook/useUsers';
import { toast } from 'react-toastify';

const MyProfileModal = ({ isOpen, onClose, isDarkMode, theme }) => {
    const { getUsers, updateUser, isLoading } = useUsers();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        userId: '',
        fullName: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadUserProfile();
        }
    }, [isOpen]);

    const loadUserProfile = async () => {
        try {
            const localUserId = localStorage.getItem('userId');
            if (!localUserId) return;

            // Fetch all and find current -> In real app, we'd use GET /User/{id}
            const allUsers = await getUsers();
            const rawData = allUsers.data ?? allUsers.items ?? allUsers.result ?? allUsers.value ?? allUsers;
            const usersList = Array.isArray(rawData) ? rawData : [];

            // Some backend match string/int, some model have id/userId
            const currentUser = usersList.find(u =>
                String((u.userId ?? u.id)) === String(localUserId)
            );

            if (currentUser) {
                setUser(currentUser);
                setFormData({
                    userId: currentUser.userId ?? currentUser.id,
                    fullName: currentUser.fullName ?? currentUser.userName ?? '',
                    phone: currentUser.phone ?? '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin hồ sơ");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation check
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.warning("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await updateUser({
                userId: formData.userId,
                fullName: formData.fullName,
                phone: formData.phone,
                // Only send password if they want to change it
                ...(formData.newPassword ? { password: formData.newPassword } : {})
            });

            toast.success("Cập nhật thông tin thành công!");
            setIsEditing(false);

            // Reflect new name locally
            if (formData.fullName) {
                localStorage.setItem('name', formData.fullName);
            }
            loadUserProfile();

        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Lỗi khi cập nhật hồ sơ");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Box */}
            <div className={`relative w-full max-w-lg rounded-3xl ${theme.cardBg} ${theme.border} border shadow-2xl overflow-hidden animate-fade-in-up`}>

                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-cyan-500 to-blue-600 overflow-hidden flex items-end justify-between px-6 pb-4">
                    {/* Wavy shape */}
                    <svg className="absolute top-0 left-0 w-full h-full object-cover opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="white" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,197.3C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Avatar overlapping header */}
                <div className="px-6 relative">
                    <div className="absolute -top-12 left-6">
                        <div className="w-24 h-24 rounded-full border-4 border-[#1E293B] bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl flex items-center justify-center text-4xl font-extrabold text-white">
                            {user?.fullName?.charAt(0)?.toUpperCase() || user?.userName?.charAt(0)?.toUpperCase() || localStorage.getItem('name')?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* Top Action */}
                    <div className="flex justify-end pt-4 h-12">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 transition-colors border border-cyan-500/30"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="pt-2 pb-8">
                        {isLoading && !user ? (
                            <div className="flex justify-center p-8">
                                <svg className="w-8 h-8 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className={`text-[12px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Họ và tên</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isEditing ? `bg-white dark:bg-slate-800 border ${theme.inputBorder} focus:ring-2 focus:ring-cyan-500 outline-none ${theme.text}` : `bg-transparent border-transparent ${theme.text} px-0`}`}
                                        />
                                    </div>

                                    {/* Email (Disabled always usually for primary keys in Auth) */}
                                    <div className="space-y-1.5">
                                        <label className={`text-[12px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Email / Tài khoản</label>
                                        <input
                                            type="email"
                                            value={user?.email || 'N/A'}
                                            disabled
                                            className={`w-full px-0 py-2.5 text-sm font-semibold bg-transparent border-transparent text-slate-500 dark:text-slate-400`}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label className={`text-[12px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Số điện thoại</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isEditing ? `bg-white dark:bg-slate-800 border ${theme.inputBorder} focus:ring-2 focus:ring-cyan-500 outline-none ${theme.text}` : `bg-transparent border-transparent ${theme.text} px-0`}`}
                                        />
                                    </div>

                                    {/* Role Readonly */}
                                    <div className="space-y-1.5">
                                        <label className={`text-[12px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Chức vụ / Role</label>
                                        <div className="py-2.5">
                                            {(() => {
                                                const rId = user?.roleId ?? user?.role;
                                                const roleConfig = {
                                                    1: { label: 'Công dân', class: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
                                                    2: { label: 'Đội Cứu Hộ', class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                                                    3: { label: 'Điều Phối Viên', class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                                                    4: { label: 'Quản Lý', class: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
                                                    5: { label: 'Quản Trị Viên', class: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20' },
                                                };
                                                const config = roleConfig[rId] || { label: 'Người dùng', class: 'bg-slate-400/10 text-slate-400 border-slate-400/20' };
                                                return (
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${config.class}`}>
                                                        {config.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Password Area only when editing */}
                                {isEditing && (
                                    <div className={`mt-6 pt-4 border-t ${theme.border} space-y-4`}>
                                        <h4 className={`text-sm font-bold ${theme.text}`}>Đổi mật khẩu <span className="text-xs font-normal text-slate-500">(Bỏ trống nếu không đổi)</span></h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    placeholder="Mật khẩu mới"
                                                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white dark:bg-slate-800 border ${theme.inputBorder} focus:ring-2 focus:ring-cyan-500 outline-none ${theme.text}`}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Xác nhận mật khẩu"
                                                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white dark:bg-slate-800 border ${theme.inputBorder} focus:ring-2 focus:ring-cyan-500 outline-none ${theme.text}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-3 justify-end pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(false); loadUserProfile(); }}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold ${theme.textMuted} hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors`}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/30 text-white transition-all ${isLoading ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95'}`}
                                        >
                                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileModal;
