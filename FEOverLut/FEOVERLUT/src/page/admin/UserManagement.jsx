import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUsers } from '../../features/users/hook/useUsers';

// Helper to safe-array
const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

// Role mappings based on typical 1: Admin, 2: Coordinator, 3: Rescuer, 4: Support
const roleConfig = {
    1: { label: 'Quản trị viên', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', darkBg: 'dark:bg-fuchsia-500/20' },
    2: { label: 'Điều phối viên', color: 'text-blue-500', bg: 'bg-blue-500/10', darkBg: 'dark:bg-blue-500/20' },
    3: { label: 'Hiện trường', color: 'text-emerald-500', bg: 'bg-emerald-500/10', darkBg: 'dark:bg-emerald-500/20' },
    4: { label: 'Hỗ trợ', color: 'text-slate-500', bg: 'bg-slate-500/10', darkBg: 'dark:bg-slate-500/20' },
};

// Fallback data if API returns an empty user array but we want to still show columns (Optional config)
// The backend returns role/teams matching these values
const initialMockUsers = [
    { UserId: 1, FullName: 'Nguyễn Văn A', Email: 'nguyenvana@cuuho.gov.vn', RoleId: 1, IsActive: true, TeamName: 'Đội Kỹ Thuật', LastLogin: '2 phút trước', Initials: 'NV' },
    { UserId: 2, FullName: 'Trần Thị B', Email: 'tranthib@cuuho.gov.vn', RoleId: 2, IsActive: true, TeamName: 'Đội Ứng Cứu', LastLogin: '1 giờ trước', Initials: 'TB' },
    { UserId: 3, FullName: 'Lê Văn C', Email: 'levanc@cuuho.gov.vn', RoleId: 3, IsActive: false, TeamName: 'Đội Hiện Trường A', LastLogin: '3 giờ trước', Initials: 'LC', Avatar: 'https://i.pravatar.cc/150?u=3' },
    { UserId: 4, FullName: 'Phạm Thị D', Email: 'phamthid@cuuho.gov.vn', RoleId: 4, IsActive: false, TeamName: 'Support Center', LastLogin: '1 ngày trước', Initials: 'PD' },
    { UserId: 5, FullName: 'Hoàng Văn E', Email: 'hoangvane@cuuho.gov.vn', RoleId: 3, IsActive: true, TeamName: 'Đội Hiện Trường B', LastLogin: '2 ngày trước', Initials: 'HE', Avatar: 'https://i.pravatar.cc/150?u=5' },
    { UserId: 6, FullName: 'Đặng Thị F', Email: 'dangthif@cuuho.gov.vn', RoleId: 2, IsActive: true, TeamName: 'Trung tâm chỉ huy', LastLogin: '5 ngày trước', Initials: 'DF' },
];

const UserManagement = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { getUsers } = useUsers();

    const fetchAllUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getUsers();
            setUsers(toArr(res));
        } catch {
            // error handled by hook
        } finally {
            setIsLoading(false);
        }
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const fullname = user.fullName ?? user.fullname ?? user.FullName ?? '';
        const email = user.email ?? user.Email ?? '';
        const idStr = String(user.userId ?? user.userid ?? user.UserId ?? user.id ?? '');
        return fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idStr.includes(searchTerm);
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Người Dùng</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Quản lý quyền truy cập và vai trò của nhân sự trong hệ thống.</p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 mb-6">
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm`}
                    />
                </div>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm Người Dùng Mới
                </button>
            </div>

            {/* Main Table Card */}
            <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>ID</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Họ và Tên</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Vai trò</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Trạng thái</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Đội nhóm</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Đăng nhập lần cuối</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className={`text-sm ${theme.textMuted}`}>Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <span className={`text-sm ${theme.textMuted}`}>Không tìm thấy người dùng nào.</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const userId = user.userId ?? user.userid ?? user.UserId ?? user.id;
                                    const fullname = user.fullName ?? user.fullname ?? user.FullName ?? 'Không tên';
                                    const email = user.email ?? user.Email ?? 'Không email';
                                    const roleId = user.roleId ?? user.roleid ?? user.RoleId ?? 0;
                                    const isActive = user.isActive ?? user.isactive ?? user.IsActive ?? true;
                                    const initials = fullname.substring(0, 2).toUpperCase();
                                    return (
                                        <tr key={userId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                            <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                #U{String(userId).padStart(3, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.Avatar ? (
                                                        <img src={user.Avatar} alt={fullname} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                                    ) : (
                                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                                        ${userId % 2 === 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                                            {initials}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-semibold ${theme.text}`}>{fullname}</span>
                                                        <span className={`text-[12px] ${theme.textMuted}`}>{email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${roleConfig[roleId]?.bg || 'bg-slate-500/10'} ${roleConfig[roleId]?.darkBg || 'dark:bg-slate-500/20'} ${roleConfig[roleId]?.color || 'text-slate-500'}`}>
                                                    {roleConfig[roleId]?.label || 'Chưa phân quyền'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400 dark:bg-slate-500'}`}></div>
                                                    <span className={`text-[13px] font-medium ${isActive ? 'text-emerald-600 dark:text-emerald-400' : theme.textMuted}`}>
                                                        {isActive ? 'Đang hoạt động' : 'Đã khóa'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-medium ${theme.text}`}>
                                                {user.TeamName ?? user.teamName ?? '—'}
                                            </td>
                                            <td className={`px-6 py-4 text-[13px] ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                                                {user.LastLogin ?? '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} focus:opacity-100`}>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className={`p-4 border-t ${theme.border} flex items-center justify-between`}>
                    <p className={`text-[13px] ${theme.textMuted}`}>
                        Hiển thị <span className="font-semibold text-current">1</span> đến <span className="font-semibold text-current">{filteredUsers.length}</span> trong <span className="font-semibold text-current">{users.length}</span> người dùng
                    </p>
                    <div className="flex gap-1.5">
                        <button className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm ${theme.textMuted} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20">1</button>
                        <button className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm font-medium ${theme.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}>2</button>
                        <button className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm font-medium ${theme.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}>3</button>
                        <span className={`px-2 py-1.5 text-sm ${theme.textMuted}`}>...</span>
                        <button className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm font-medium ${theme.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}>8</button>
                        <button className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm ${theme.textMuted} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default UserManagement;
