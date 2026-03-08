import React from 'react';
import { useLogout } from '../../features/auth/hook/useAuth';

const RescueTeamDashboard = () => {
    const { logout } = useLogout();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4">
            <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Nhiệm vụ Cứu hộ</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Giao diện quản lý tác vụ dành cho Đội Cứu Hộ đang được hoàn thiện. Vui lòng quay lại sau.
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default RescueTeamDashboard;
