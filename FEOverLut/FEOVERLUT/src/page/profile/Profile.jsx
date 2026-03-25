import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserById } from '../../features/users/hook/useUsers';
import { useVolunteerProfile } from '../../features/volunteer/hook/useVolunteer';
import TaskBar from '../../components/TaskBar';
import SkillRegistrationModal from '../../components/volunteer/SkillRegistrationModal';
import OfferRegistrationModal from '../../components/volunteer/OfferRegistrationModal';

const ROLE_NAMES = {
    1: 'Citizen',
    2: 'Rescue Team',
    3: 'Rescue Coordinator',
    4: 'Manager',
    5: 'Admin',
};

function Profile() {
    const { getUserById, isLoading, error } = useUserById();
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem('userId');
    const roleId = parseInt(localStorage.getItem('roleId')) || null;
    const isDarkMode = true; // Hardcoded for this demo, usually from context

    const { profile, fetchProfile, registerVolunteer, isLoading: isVolLoading } = useVolunteerProfile();
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    
    // Registration State
    const [isRegistering, setIsRegistering] = useState(false);
    const [regForm, setRegForm] = useState({
        notes: "Sẵn sàng hỗ trợ cộng đồng!",
        provinceCode: '',
        wardCode: '',
        provinceName: '',
        wardName: ''
    });
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        if (userId) {
            getUserById(userId)
                .then(data => {
                    // API might return data wrapped or directly
                    setUserData(data?.data || data);
                })
                .catch(err => console.error(err));
            
            fetchProfile();
        }

        // Fetch provinces for registration
        axios.get('https://provinces.open-api.vn/api/?depth=3')
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Failed to fetch provinces:", err));
    }, [userId, fetchProfile]);

    const handleRegister = async () => {
        if (!regForm.provinceName || !regForm.wardName) {
            alert("Vui lòng chọn Tỉnh và Phường bạn muốn làm tình nguyện!");
            return;
        }
        await registerVolunteer(regForm.notes, regForm.provinceName, regForm.wardName);
        setIsRegistering(false);
    };

    const theme = {
        bg: isDarkMode ? 'bg-[#0f1525]' : 'bg-[#f0f4f8]',
        text: isDarkMode ? 'text-white' : 'text-slate-800',
        cardBg: isDarkMode ? 'bg-gradient-to-br from-[#1e253c]/90 to-[#1e253c]/40' : 'bg-white',
        border: isDarkMode ? 'border-white/10' : 'border-slate-200',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} relative overflow-hidden font-sans transition-colors duration-500`}>
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="pt-4 px-4 sm:px-6">
                    <TaskBar isDarkMode={isDarkMode} />
                </div>

                <div className="flex-1 px-4 sm:px-6 py-8 max-w-4xl mx-auto w-full mt-8">
                    <h2 className={`text-3xl font-bold mb-8 text-center ${theme.text}`}>Cá Nhân</h2>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center">
                            Không thể tải thông tin cá nhân.
                        </div>
                    ) : userData ? (
                        <div className={`${theme.cardBg} border ${theme.border} rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 shadow-xl">
                                        <div className="w-full h-full rounded-full bg-[#1e253c] flex items-center justify-center text-5xl object-cover overflow-hidden">
                                            {/* Fallback Initials */}
                                            <span className="text-white font-bold">
                                                {(userData.fullName || userData.FullName || userData.name || userData.Name || 'U').charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                                        {ROLE_NAMES[roleId] || ROLE_NAMES[userData.roleId] || ROLE_NAMES[userData.RoleId] || 'User'}
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}>Họ và Tên</p>
                                        <p className="text-lg font-medium">{userData.fullName || userData.FullName || userData.name || userData.Name || 'Chưa cập nhật'}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}>Email</p>
                                        <p className="text-lg font-medium">{userData.email || userData.Email || 'Chưa cập nhật'}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}>Số điện thoại</p>
                                        <p className="text-lg font-medium">{userData.phone || userData.Phone || userData.phoneNumber || userData.PhoneNumber || 'Chưa cập nhật'}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}>Trạng thái</p>
                                        <p className="text-lg font-medium">
                                            {userData.status || userData.Status ? (
                                                <span className="text-green-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div> Đang hoạt động</span>
                                            ) : (
                                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Không xác định</span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}>Địa chỉ</p>
                                        <p className="text-lg font-medium">{userData.address || userData.Address || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Volunteer Section */}
                            <div className="mt-16 pt-10 border-t border-white/5 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black flex items-center gap-3">
                                            <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
                                            Chế độ Tình nguyện viên
                                        </h3>
                                        <p className="text-slate-500 text-xs mt-1 ml-5">Quản lý hoạt động cứu trợ và kỹ năng chuyên môn</p>
                                    </div>
                                    {profile && profile.applicationStatus === 1 && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Đang hoạt động</span>
                                        </div>
                                    )}
                                </div>

                                 {!profile ? (
                                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
                                        {!isRegistering ? (
                                            <>
                                                <p className="text-slate-400 text-sm mb-4">Bạn chưa đăng ký làm tình nguyện viên của hệ thống OverLut.</p>
                                                <button 
                                                    onClick={() => setIsRegistering(true)}
                                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
                                                >
                                                    Đăng ký làm Tình nguyện viên
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-full max-w-md space-y-4 text-left">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Đăng ký tình nguyện</h4>
                                                    <button onClick={() => setIsRegistering(false)} className="text-slate-500 hover:text-white transition-colors">Hủy</button>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Tỉnh / Thành phố *</label>
                                                        <select 
                                                            value={regForm.provinceCode}
                                                            onChange={e => {
                                                                const p = provinces.find(p => p.code == e.target.value);
                                                                setRegForm({ ...regForm, provinceCode: e.target.value, provinceName: p?.name || '', wardCode: '', wardName: '' });
                                                            }}
                                                            className="w-full bg-[#1e253c]/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        >
                                                            <option value="">-- Chọn Tỉnh --</option>
                                                            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                                        </select>
                                                    </div>
                                                    
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Phường / Xã *</label>
                                                        <select 
                                                            value={regForm.wardCode}
                                                            disabled={!regForm.provinceCode}
                                                            onChange={e => {
                                                                const p = provinces.find(p => p.code == regForm.provinceCode);
                                                                // Search in all districts of that province
                                                                let foundWard = null;
                                                                p?.districts?.forEach(d => {
                                                                    const w = d.wards?.find(w => w.code == e.target.value);
                                                                    if (w) foundWard = w;
                                                                });
                                                                setRegForm({ ...regForm, wardCode: e.target.value, wardName: foundWard?.name || '' });
                                                            }}
                                                            className="w-full bg-[#1e253c]/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                                                        >
                                                            <option value="">-- Chọn Phường --</option>
                                                            {provinces.find(p => p.code == regForm.provinceCode)?.districts?.flatMap(d => d.wards || []).map(w => (
                                                                <option key={w.code} value={w.code}>{w.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Ghi chú / Giới thiệu</label>
                                                    <textarea 
                                                        value={regForm.notes}
                                                        onChange={e => setRegForm({ ...regForm, notes: e.target.value })}
                                                        placeholder="VD: Tôi có kinh nghiệm sơ cứu y tế..."
                                                        className="w-full bg-[#1e253c]/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                                                    />
                                                </div>

                                                <button 
                                                    onClick={handleRegister}
                                                    disabled={isVolLoading}
                                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                                >
                                                    {isVolLoading ? "Đang gửi..." : "Xác nhận đăng ký"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : profile.applicationStatus === 0 ? (
                                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-yellow-500 font-semibold mb-1">Đơn đăng ký đang chờ phê duyệt</p>
                                        <p className="text-slate-400 text-xs">Hồ sơ của bạn đã được gửi tới quản trị viên. Chúng tôi sẽ phản hồi qua email sớm nhất.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                         {/* Coordination Banner */}
                                        {profile.joinedTeamName && (
                                            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/5 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-blue-900/10">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                                                            Nhiệm vụ hiện tại
                                                        </div>
                                                        <h4 className="text-3xl font-black text-white tracking-tight">{profile.joinedTeamName}</h4>
                                                        <div className="flex items-center gap-4">
                                                            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-300">
                                                                Vai trò: <span className="text-blue-400 font-bold ml-1">{profile.teamRoleName || "Thành viên"}</span>
                                                            </div>
                                                            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-300">
                                                                Trạng thái: <span className="text-green-400 font-bold ml-1">Sẵn sàng</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#0f1525]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-full md:max-w-xs shadow-inner">
                                                        <div className="flex items-center gap-2 mb-3 text-slate-500">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Điểm tập kết</span>
                                                        </div>
                                                        <p className="text-sm text-slate-200 font-medium leading-relaxed italic">
                                                            "{profile.assemblyPoint || "Vui lòng chờ cập nhật địa điểm chính thức..."}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Registered Area Badge */}
                                        <div className="flex flex-wrap items-center gap-3 mb-8">
                                            <div className="px-5 py-3 bg-[#1e253c]/40 border border-white/10 rounded-2xl flex items-center gap-3 group hover:border-blue-500/30 transition-all">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Khu vực đăng ký</span>
                                                    <span className="text-sm font-bold text-white uppercase">{profile.volunteerProvince} - {profile.volunteerWard}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Offer Card */}
                                            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-500 group relative overflow-hidden">
                                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform duration-500">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-[10px] uppercase tracking-widest text-emerald-500 font-black mb-1">Vật phẩm</span>
                                                        <span className="block text-[8px] text-slate-500 font-bold uppercase">Tiếp tế nhu yếu phẩm</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-black mb-3 text-white">Đóng góp Vật phẩm</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed mb-8">Hỗ trợ cộng đồng bằng cách gửi thực phẩm, thuốc men hoặc phương tiện cứu hộ.</p>
                                                <button 
                                                    onClick={() => setIsOfferModalOpen(true)}
                                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    Bắt đầu Tiếp tế
                                                </button>
                                            </div>

                                            {/* Skill Card */}
                                            <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 rounded-3xl p-8 hover:border-indigo-500/40 transition-all duration-500 group relative overflow-hidden">
                                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-900/20 group-hover:scale-110 transition-transform duration-500">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-[10px] uppercase tracking-widest text-indigo-500 font-black mb-1">Kỹ năng</span>
                                                        <span className="block text-[8px] text-slate-500 font-bold uppercase">Góp sức cứu hộ</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-black mb-3 text-white">Đăng ký Kỹ năng</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed mb-8">Cập nhật chuyên môn (Y tế, Cứu hộ, Kỹ thuật) để sẵn sàng nhận nhiệm vụ điều động.</p>
                                                <button 
                                                    onClick={() => setIsSkillModalOpen(true)}
                                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    Cập nhật Chuyên môn
                                                </button>
                                            </div>
                                        </div>

                                        {/* Active Offers List */}
                                        {profile.activeOffers?.length > 0 && (
                                            <div className="mt-12 bg-[#0f1525]/40 rounded-3xl p-8 border border-white/5 shadow-inner">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h5 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Vật phẩm đang tiếp tế</h5>
                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-md border border-blue-500/20">
                                                        {profile.activeOffers.length} kiện hàng
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {profile.activeOffers.map(offer => (
                                                        <div key={offer.offerId} className="group bg-[#1e253c]/50 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/30 transition-all duration-300">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{offer.offerName || offer.typeName}</p>
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        <span className="text-xs text-slate-400 font-medium">{offer.quantity} {offer.unit}</span>
                                                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                                            offer.statusName === 'Available' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                            offer.statusName === 'Assigned' ? 'bg-amber-500/10 text-amber-500' :
                                                                            'bg-blue-500/10 text-blue-500'
                                                                        }`}>
                                                                            {offer.statusName}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {offer.dropoffLocation && (
                                                                <div className="sm:text-right bg-black/20 p-3 rounded-xl border border-white/5 sm:w-48 group-hover:bg-blue-500/5 transition-colors">
                                                                    <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Kho tiếp nhận</p>
                                                                    <p className="text-xs text-blue-300 font-semibold leading-snug">{offer.dropoffLocation}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Modals */}
            <SkillRegistrationModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} />
            <OfferRegistrationModal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} />
        </div>
    );
}

export default Profile;
