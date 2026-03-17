import React, { useEffect, useState } from 'react';
import { useUserById } from '../../features/users/hook/useUsers';
import TaskBar from '../../components/TaskBar';

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

    useEffect(() => {
        if (userId) {
            getUserById(userId)
                .then(data => {
                    // API might return data wrapped or directly
                    setUserData(data?.data || data);
                })
                .catch(err => console.error(err));
        }
    }, [userId]);

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
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Profile;
