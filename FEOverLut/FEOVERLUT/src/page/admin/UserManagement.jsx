import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUsers } from '../../features/users/hook/useUsers';
import { toast } from 'react-toastify';

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
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Modal & Actions state
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ userName: '', email: '', phone: '', password: '', roleId: 1 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editUserForm, setEditUserForm] = useState({ userId: null, fullName: '', phone: '' });
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const { getUsers, changeUserRole, deleteUser, createUser, updateUser } = useUsers();

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

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            setDeleteConfirmId(null);
            fetchAllUsers();
            toast.success('Xóa người dùng thành công!');
        } catch (e) {
            toast.error('Lỗi khi xóa người dùng: ' + (e?.message || e));
        }
    };

    const openRoleModal = (user, currentRole) => {
        setSelectedUser(user);
        setSelectedRole(currentRole || 1);
        setIsRoleModalOpen(true);
    };

    const handleRoleSubmit = async () => {
        if (!selectedUser) return;
        setSubmitting(true);
        try {
            const userId = selectedUser.userId ?? selectedUser.userid ?? selectedUser.UserId ?? selectedUser.id;
            await changeUserRole({
                userId: userId,
                roleId: parseInt(selectedRole)
            });
            setIsRoleModalOpen(false);
            fetchAllUsers();
            toast.success('Cấp quyền thành công!');
        } catch (e) {
            toast.error('Lỗi cập nhật quyền: ' + (e?.message || e));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUserForm.email || !newUserForm.password || !newUserForm.userName) {
            toast.error('Vui lòng điền đủ Tên, Email và Mật khẩu!');
            return;
        }
        setSubmitting(true);
        try {
            // 1. Register User
            const createdUser = await createUser({
                email: newUserForm.email,
                phone: newUserForm.phone,
                userName: newUserForm.userName,
                password: newUserForm.password,
                confirmPassword: newUserForm.password, // Added for backend's RegisterModel validation
            });
            // 2. Change Role if needed (default usually citizen, we force role here)
            const userId = createdUser?.userId ?? createdUser?.UserId ?? createdUser?.userid;
            if (userId && Number(newUserForm.roleId) !== 1) { // Assume 1 is default
                try {
                    await changeUserRole({ userId, roleId: Number(newUserForm.roleId) });
                } catch (roleErr) {
                    console.warn("Lỗi khi cập nhật quyền sau khi tạo:", roleErr);
                    // Silently fail role update but still refresh
                }
            }
            setIsAddModalOpen(false);
            setNewUserForm({ userName: '', email: '', phone: '', password: '', roleId: 1 });
            fetchAllUsers();
            toast.success('Tạo người dùng thành công!');
        } catch (e) {
            toast.error('Lỗi tạo người dùng: ' + (e?.message || e));
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (user) => {
        const userId = user.userId ?? user.userid ?? user.UserId ?? user.id;
        const fullName = user.fullName ?? user.fullname ?? user.FullName ?? '';
        const phone = user.phone ?? user.Phone ?? '';
        setEditUserForm({ userId, fullName, phone });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editUserForm.fullName) {
            toast.error('Vui lòng điền Họ Tên!');
            return;
        }
        setSubmitting(true);
        try {
            await updateUser({
                userId: editUserForm.userId,
                fullName: editUserForm.fullName,
                phone: editUserForm.phone
            });
            setIsEditModalOpen(false);
            fetchAllUsers();
            toast.success('Cập nhật thông tin thành công!');
        } catch (e) {
            toast.error('Lỗi cập nhật: ' + (e?.message || e));
        } finally {
            setSubmitting(false);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const fullname = user.fullName ?? user.fullname ?? user.FullName ?? '';
        const email = user.email ?? user.Email ?? '';
        const idStr = String(user.userId ?? user.userid ?? user.UserId ?? user.id ?? '');
        return fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idStr.includes(searchTerm);
    });

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap"
                >
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
                                currentUsers.map((user) => {
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
                                                {deleteConfirmId === userId ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleDelete(userId)} className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded flex shrink-0">Xác nhận</button>
                                                        <button onClick={() => setDeleteConfirmId(null)} className={`px-2.5 py-1 rounded text-[11px] font-bold border ${theme.border} ${theme.textMuted} hover:bg-black/5 flex shrink-0`}>Hủy</button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                                        <button onClick={() => openEditModal(user)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-amber-500`} title="Sửa thông tin">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button onClick={() => openRoleModal(user, roleId)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500`} title="Cấp quyền">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                        </button>
                                                        <button onClick={() => setDeleteConfirmId(userId)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500`} title="Xóa người dùng">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                )}
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
                        Hiển thị <span className="font-semibold text-current">{filteredUsers.length === 0 ? 0 : Math.min(indexOfFirstUser + 1, filteredUsers.length)}</span> đến <span className="font-semibold text-current">{Math.min(indexOfLastUser, filteredUsers.length)}</span> trong <span className="font-semibold text-current">{filteredUsers.length}</span> người dùng
                    </p>
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm ${theme.textMuted} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm font-semibold transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : `font-medium ${theme.text} hover:bg-slate-100 dark:hover:bg-slate-800`
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className={`px-2 py-1.5 text-sm ${theme.textMuted}`}>...</span>;
                            }
                            return null;
                        })}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-3 py-1.5 rounded-lg border ${theme.inputBorder} text-sm ${theme.textMuted} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MODAL PHÂN QUYỀN ──────────────────────────────── */}
            {isRoleModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[400px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>Cấp Quyền Người Dùng</h3>
                            <button onClick={() => setIsRoleModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className={`text-sm ${theme.textMuted} mb-1`}>Người dùng:</p>
                                <p className={`text-base font-bold ${theme.text}`}>{selectedUser?.fullName ?? selectedUser?.fullname ?? selectedUser?.FullName ?? 'Unkown'}</p>
                            </div>

                            <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>Chọn vai trò mới</label>
                            <select
                                value={selectedRole}
                                onChange={e => setSelectedRole(e.target.value)}
                                className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-semibold ${theme.text}`}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                            >
                                <option value="1">Quản trị viên (Admin)</option>
                                <option value="2">Điều phối viên (Manager)</option>
                                <option value="3">Hiện trường (Rescuer)</option>
                                <option value="4">Hỗ trợ (Support)</option>
                                <option value="5">Công dân (Citizen)</option>
                            </select>
                        </div>

                        <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                            <button onClick={() => setIsRoleModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                Hủy
                            </button>
                            <button
                                onClick={handleRoleSubmit}
                                disabled={submitting}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'}`}
                            >
                                {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL THÊM NGƯỜI DÙNG MỚI ─────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[450px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between bg-black/5 dark:bg-white/5`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>Thêm Người Dùng Mới</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Họ và Tên *</label>
                                <input
                                    type="text" required
                                    value={newUserForm.userName}
                                    onChange={e => setNewUserForm({ ...newUserForm, userName: e.target.value })}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400`}
                                    placeholder="Vd: Nguyễn Văn A..."
                                />
                            </div>
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Email *</label>
                                <input
                                    type="email" required
                                    value={newUserForm.email}
                                    onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400`}
                                    placeholder="Vd: user@example.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        value={newUserForm.phone}
                                        onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                                        className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400`}
                                        placeholder="Vd: 09..."
                                    />
                                </div>
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Mật khẩu *</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"} required
                                            value={newUserForm.password}
                                            onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400`}
                                            placeholder="Tối thiểu 6 ký tự"
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Vai trò ban đầu</label>
                                <select
                                    value={newUserForm.roleId}
                                    onChange={e => setNewUserForm({ ...newUserForm, roleId: e.target.value })}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium ${theme.text}`}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                >
                                    <option value="1">Công dân (Citizen)</option>
                                    <option value="2">Đội Cứu Hộ (RescueTeam)</option>
                                    <option value="3">Điều Phối Viên (Coordinator)</option>
                                    <option value="4">Quản lý (Manager)</option>
                                    <option value="5">Quản trị viên (Admin)</option>
                                </select>
                            </div>

                            <div className={`mt-6 pt-4 border-t ${theme.border} flex items-center justify-end gap-3`}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/30'}`}
                                >
                                    {submitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL SỬA THÔNG TIN NGƯỜI DÙNG ─────────────────────── */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-[450px] ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between bg-black/5 dark:bg-white/5`}>
                            <h3 className={`text-lg font-bold ${theme.text}`}>Sửa Thông Tin</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Họ và Tên *</label>
                                <input
                                    type="text" required
                                    value={editUserForm.fullName}
                                    onChange={e => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-400`}
                                />
                            </div>
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={editUserForm.phone}
                                    onChange={e => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-400`}
                                />
                            </div>

                            <div className={`mt-6 pt-4 border-t ${theme.border} flex items-center justify-end gap-3`}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5 transition-colors`}>
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${submitting ? 'bg-amber-600/50 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-500/30'}`}
                                >
                                    {submitting ? 'Đang cập nhật...' : 'Cập Nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
