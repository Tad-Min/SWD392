import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useRescueTeam, useUpdateRescueTeam, useGetRescueTeamMemberByTeamId, useDeleteRescueTeamMember } from '../../features/Rescue/hook/useRescueTeam';
import { useUsers } from '../../features/users/hook/useUsers';
import { useVolunteerManager } from '../../features/volunteer/hook/useVolunteer';
import { useMissions } from '../../features/missions/hook/useMissions';
import { translateSkill } from '../../utils/vnTranslations';
import axios from 'axios';

const toArr = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
        const inner = v.data ?? v.items ?? v.result ?? v.value ?? Object.values(v).find(Array.isArray);
        if (Array.isArray(inner)) return inner;
    }
    return [];
};

const RescueTeamManagement = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'applications'

    // Hooks
    const { getRescueTeam } = useRescueTeam();
    const { updateRescueTeam } = useUpdateRescueTeam();
    const { getRescueTeamMemberByTeamId } = useGetRescueTeamMemberByTeamId();
    const { deleteRescueTeamMember } = useDeleteRescueTeamMember();
    
    // New Hooks for Manager features
    const { getRescueTeamRoles, createRescueTeam: apiCreateTeam, assignVolunteerToTeam } = useMissions();
    const { 
        applications, 
        fetchApplications, 
        approveVolunteer: apiApprove, 
        rejectVolunteer: apiReject,
        isLoading: isVolLoading 
    } = useVolunteerManager();
    const { getUsers } = useUsers();

    // Data State
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [approvedVolunteers, setApprovedVolunteers] = useState([]);
    const [teamRoles, setTeamRoles] = useState([]);
    const [occupiedUserIds, setOccupiedUserIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    // Modal Add/Edit Team
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teamForm, setTeamForm] = useState({ 
        id: null, 
        teamName: '',
        roleId: '',
        assemblyLocationText: '',
        assemblyNote: ''
    });

    // Form Address Open API
    const [provinces, setProvinces] = useState([]);
    const [addrState, setAddrState] = useState({
        street: '',
        provinceCode: '',
        districtCode: '',
        wardCode: ''
    });

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=3')
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Failed to fetch provinces:", err));
    }, []);

    // Modal Manage Members
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [assignForm, setAssignForm] = useState({
        userId: '',
        roleId: 3, // Default: Member
        note: ''
    });
    const [expandedVolId, setExpandedVolId] = useState(null); // For viewing profile
    const [volSearch, setVolSearch] = useState('');

    const fetchTeams = async () => {
        setIsLoading(true);
        try {
            const res = await getRescueTeam();
            const teamsData = toArr(res);
            setTeams(teamsData);

            // Fetch all members to find occupied users
            const allMembersPromises = teamsData.map(t => getRescueTeamMemberByTeamId(t.id || t.teamId));
            const allMembersResults = await Promise.allSettled(allMembersPromises);
            
            const occupied = new Set();
            allMembersResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    const members = toArr(result.value);
                    members.forEach(m => occupied.add(m.userId));
                }
            });
            setOccupiedUserIds(occupied);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(toArr(res));
        } catch (error) {
            console.error("Lỗi lấy danh sách users", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await getRescueTeamRoles();
            setTeamRoles(toArr(res));
            
            // Also fetch approved volunteers for assignment
            const volRes = await fetchApplications(1); // status 1 = Approved
            setApprovedVolunteers(toArr(volRes));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchUsers();
        fetchRoles();
        if (activeTab === 'applications') fetchApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const filteredTeams = teams.filter(t =>
        (t.teamName || t.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveTeam = async () => {
        if (!teamForm.teamName.trim()) return;
        if (!teamForm.id && !teamForm.roleId) {
            alert("Vui lòng chọn Loại Vai Trò cho đội!");
            return;
        }
        setIsSubmitting(true);
        try {
            if (teamForm.id) {
                await updateRescueTeam(teamForm.id, {
                    teamName: teamForm.teamName.trim()
                });
            } else {
                let fullAddress = (teamForm.assemblyLocationText || '').trim();
                if (addrState.provinceCode) {
                    const p = provinces.find(p => p.code == addrState.provinceCode);
                    const d = p?.districts?.find(d => d.code == addrState.districtCode);
                    const w = d?.wards?.find(w => w.code == addrState.wardCode);
                    const parts = [];
                    if (addrState.street.trim()) parts.push(addrState.street.trim());
                    if (w) parts.push(w.name);
                    if (d) parts.push(d.name);
                    if (p) parts.push(p.name);
                    if (parts.length > 0) fullAddress = parts.join(', ');
                }

                await apiCreateTeam({
                    teamName: teamForm.teamName.trim(),
                    roleId: parseInt(teamForm.roleId),
                    assemblyLocationText: fullAddress || 'Chưa xác định',
                    assemblyNote: teamForm.assemblyNote.trim()
                });
            }
            setIsTeamModalOpen(false);
            setTeamForm({ id: null, teamName: '', roleId: '', assemblyLocationText: '', assemblyNote: '' });
            setAddrState({ street: '', provinceCode: '', districtCode: '', wardCode: '' });
            fetchTeams();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Lưu đội cứu hộ thất bại!";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (userId) => {
        if (!window.confirm("Phê duyệt người dùng này làm Tình nguyện viên?")) return;
        try {
            await apiApprove(userId);
            fetchUsers(); // Refresh user list for assignment
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (userId) => {
        const reason = window.prompt("Lý do từ chối đơn đăng ký:", "Không đủ điều kiện phù hợp");
        if (reason === null) return;
        try {
            await apiReject(userId, reason);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenMembers = async (team) => {
        setSelectedTeam(team);
        setIsMemberModalOpen(true);
        setAssignForm({ userId: '', roleId: 3, note: '' });
        setIsMembersLoading(true);
        try {
            const res = await getRescueTeamMemberByTeamId(team.id || team.teamId);
            const data = toArr(res);
            setTeamMembers(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách thành viên", error);
            setTeamMembers([]);
        } finally {
            setIsMembersLoading(false);
        }
    };

    const handleAddMember = async (vId) => {
        if (!vId) return;
        setIsSubmitting(true);
        try {
            await assignVolunteerToTeam({
                teamId: selectedTeam.id || selectedTeam.teamId,
                userId: parseInt(vId),
                roleId: parseInt(assignForm.roleId),
                note: assignForm.note,
                notifyByEmail: true
            });

            // Update occupied state
            setOccupiedUserIds(prev => new Set(prev).add(parseInt(vId)));

            // Refresh members list
            const res = await getRescueTeamMemberByTeamId(selectedTeam.id || selectedTeam.teamId);
            setTeamMembers(toArr(res));
            setAssignForm({ userId: '', roleId: 3, note: '' });
            setExpandedVolId(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMember = async (member) => {
        console.log("Deleting member:", member);
        const uId = member.userId;
        const tId = member.teamId || selectedTeam.id || selectedTeam.teamId;

        if (!uId || !tId) {
            alert("Thiếu thông tin (UserId hoặc TeamId) để xóa.");
            return;
        }

        if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi đội?")) return;
        setIsSubmitting(true);
        try {
            await deleteRescueTeamMember({ userId: uId, teamId: tId });
            
            // Update occupied state
            setOccupiedUserIds(prev => {
                const next = new Set(prev);
                next.delete(uId);
                return next;
            });

            // Refresh members list
            const res = await getRescueTeamMemberByTeamId(selectedTeam.id || selectedTeam.teamId);
            setTeamMembers(toArr(res));
            alert("Xóa thành viên thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi xóa thành viên.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-inv-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Đội Cứu Hộ</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Tạo đội cứu hộ mới và sắp xếp thành viên.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => fetchTeams()}
                        className={`p-2.5 rounded-xl border ${theme.border} ${theme.textMuted} hover:text-blue-500 transition-colors`}
                        title="Làm mới"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button
                        onClick={() => {
                            setTeamForm({ id: null, teamName: '', roleId: '', assemblyLocationText: '', assemblyNote: '' });
                            setAddrState({ street: '', provinceCode: '', districtCode: '', wardCode: '' });
                            setIsTeamModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Tạo Đội Mới
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-white/5 pb-0">
                <button
                    onClick={() => setActiveTab('teams')}
                    className={`px-6 py-3 text-sm font-bold transition-all relative ${activeTab === 'teams' ? 'text-emerald-500' : `${theme.textMuted} hover:text-emerald-400`}`}
                >
                    Quản lý Đội
                    {activeTab === 'teams' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full shadow-[0_-5px_15px_rgba(16,185,129,0.5)]" />}
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-6 py-3 text-sm font-bold transition-all relative ${activeTab === 'applications' ? 'text-blue-500' : `${theme.textMuted} hover:text-blue-400`}`}
                >
                    Đơn đăng ký TNV
                    {applications.length > 0 && (
                        <span className="absolute top-2 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    )}
                    {activeTab === 'applications' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-full shadow-[0_-5px_15px_rgba(59,130,246,0.5)]" />}
                </button>
            </div>

            {activeTab === 'teams' ? (
                <>
                    {/* Action Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        <div className="relative w-full lg:w-64 shrink-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input type="text" placeholder="Tìm tên đội..." value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className={`pl-10 pr-4 py-2.5 rounded-xl text-sm w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                            />
                        </div>
                        <p className={`lg:ml-auto text-sm ${theme.textMuted} shrink-0`}>
                            Tổng số: {filteredTeams.length} Đội
                        </p>
                    </div>

                    {/* Table Teams */}
                    <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                        {['ID', 'Tên Đội', 'Quản lý'].map((h, i) => (
                                            <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider whitespace-nowrap ${i === 2 ? 'text-center' : ''}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                    {isLoading ? (
                                        <tr><td colSpan="3" className="px-6 py-14 text-center">Đang tải...</td></tr>
                                    ) : filteredTeams.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-14 text-center text-sm text-slate-400">Chưa có đội cứu hộ nào.</td></tr>
                                    ) : filteredTeams.map(item => (
                                        <tr key={item.id || item.teamId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                            <td className={`px-6 py-4 text-sm font-bold ${theme.text}`}>#{item.id || item.teamId}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base font-bold shrink-0 shadow-inner">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <span className={`text-[15px] font-semibold ${theme.text}`}>{item.teamName || item.name}</span>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">{item.assemblyLocationText || 'Chưa định vị'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => handleOpenMembers(item)} className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-blue-500/5">
                                                    Thành viên & Gán việc
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Volunteer Applications Table */}
                    <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5 animate-mgr-in`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                        {['Người đăng ký', 'CMND/CCCD', 'Địa chỉ', 'Kỹ năng mong muốn', 'Hành động'].map((h) => (
                                            <th key={h} className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider whitespace-nowrap`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                    {isVolLoading ? (
                                        <tr><td colSpan="5" className="px-6 py-14 text-center">Đang tải đơn đăng ký...</td></tr>
                                    ) : applications.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-14 text-center text-sm text-slate-400">Không có đơn đăng ký nào đang chờ.</td></tr>
                                    ) : applications.map(app => (
                                        <tr key={app.userId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm border border-blue-500/20">
                                                        {app.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className={`text-[14px] font-bold ${theme.text}`}>{app.fullName}</p>
                                                        <p className="text-[11px] text-slate-500">ID: #{app.userId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-medium ${theme.text}`}>{app.identifyId || 'Chưa cập nhật'}</td>
                                            <td className={`px-6 py-4 text-sm ${theme.textMuted} max-w-[200px] truncate`}>
                                                <p className={theme.text}>{app.address || 'Chưa cập nhật'}</p>
                                                {(app.volunteerProvince || app.volunteerWard) && (
                                                    <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase">
                                                        Khu vực: {app.volunteerProvince} - {app.volunteerWard}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-xs p-2 rounded-lg bg-slate-500/5 border ${theme.border} italic ${theme.textMuted}`}>
                                                    {app.notes || 'Không có ghi chú'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleApprove(app.userId)}
                                                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(app.userId)}
                                                        className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all active:scale-95"
                                                    >
                                                        Từ chối
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

            {/* Modal: Add/Edit Team */}
            {isTeamModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-sm mt-16 ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl p-6`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>
                            {teamForm.id ? 'Sửa Đội' : 'Tạo Đội Mới'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tên Đội *</label>
                                <input
                                    type="text"
                                    value={teamForm.teamName}
                                    placeholder="VD: Đội cứu hộ số 1"
                                    onChange={e => setTeamForm(p => ({ ...p, teamName: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                                />
                            </div>
                            
                            {!teamForm.id && (
                                <>
                                    <div className="sm:col-span-2">
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Loại Vai Trò *</label>
                                        <select
                                            value={teamForm.roleId}
                                            onChange={e => setTeamForm(p => ({ ...p, roleId: e.target.value }))}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                                        >
                                            <option value="">{teamRoles.length === 0 ? '-- Đang tải vai trò... --' : '-- Chọn vai trò đội --'}</option>
                                            {teamRoles.map(r => (
                                                <option key={r.teamRoleId} value={r.teamRoleId}>{r.roleName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2 space-y-3">
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Vị trí tập kết cụ thể *</label>
                                        <input
                                            type="text"
                                            value={addrState.street}
                                            placeholder="Số nhà, đường, hẻm hoặc địa danh..."
                                            onChange={e => setAddrState(p => ({ ...p, street: e.target.value }))}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <select 
                                                value={addrState.provinceCode} 
                                                onChange={e => setAddrState(p => ({ ...p, provinceCode: e.target.value, districtCode: '', wardCode: '' }))}
                                                className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]`}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                            >
                                                <option value="">-- Tỉnh/Thành --</option>
                                                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                            </select>
                                            <select 
                                                value={addrState.districtCode} 
                                                onChange={e => setAddrState(p => ({ ...p, districtCode: e.target.value, wardCode: '' }))} 
                                                disabled={!addrState.provinceCode}
                                                className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]`}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                            >
                                                <option value="">-- Quận/Huyện --</option>
                                                {provinces.find(p => p.code == addrState.provinceCode)?.districts?.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                            </select>
                                            <select 
                                                value={addrState.wardCode} 
                                                onChange={e => setAddrState(p => ({ ...p, wardCode: e.target.value }))} 
                                                disabled={!addrState.districtCode}
                                                className={`w-full border ${theme.inputBorder} ${theme.inputBg} ${theme.text} rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]`}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                            >
                                                <option value="">-- Phường/Xã --</option>
                                                {provinces.find(p => p.code == addrState.provinceCode)?.districts?.find(d => d.code == addrState.districtCode)?.wards?.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Ghi chú tập kết</label>
                                        <textarea
                                            value={teamForm.assemblyNote}
                                            placeholder="VD: Tập kết trang thiết bị y tế tại cổng chính..."
                                            onChange={e => setTeamForm(p => ({ ...p, assemblyNote: e.target.value }))}
                                            className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]`}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsTeamModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5`}>Hủy</button>
                            <button
                                onClick={handleSaveTeam}
                                disabled={isSubmitting || !teamForm.teamName.trim() || (!teamForm.id && !teamForm.roleId)}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${isSubmitting || !teamForm.teamName.trim() || (!teamForm.id && !teamForm.roleId) ? 'bg-emerald-600/50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30'}`}
                            >
                                {isSubmitting ? 'Đang lưu...' : 'Lưu Lại'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: View/Add Members - REDESIGNED 2-SIDE */}
            {isMemberModalOpen && selectedTeam && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md">
                    <div className={`w-full max-w-6xl mt-8 ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-3xl shadow-2xl p-0 flex flex-col max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-8 py-5 border-b border-white/10 shrink-0 bg-white/5">
                            <div>
                                <h3 className={`text-xl font-black ${theme.text} flex items-center gap-3`}>
                                    <span className="w-2 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                    Thiết lập đội ngũ: <span className="text-emerald-400">{selectedTeam.teamName || selectedTeam.name}</span>
                                </h3>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Quản lý thành viên & điều phối nhiệm vụ</p>
                            </div>
                            <button onClick={() => setIsMemberModalOpen(false)} className={`p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-red-500/20 transition-all`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* LEFT SIDE (30%) - Team Status & Current Members */}
                            <div className="w-[30%] border-r border-white/10 flex flex-col bg-black/20">
                                <div className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                                    {/* Team Meta */}
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Địa điểm tập kết</p>
                                            <p className="text-sm text-slate-200 font-medium italic">"{selectedTeam.assemblyLocationText || 'Chưa định vị'}"</p>
                                        </div>
                                    </div>

                                    {/* Members List */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Thành viên ({teamMembers.length})</h4>
                                        </div>
                                        
                                        {isMembersLoading ? (
                                            <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div></div>
                                        ) : teamMembers.length === 0 ? (
                                            <div className="py-10 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-xs text-slate-500">Chưa có thành viên</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {teamMembers.map((m, i) => {
                                                    const userDetail = [...users, ...approvedVolunteers].find(u => (u.id || u.userId) === m.userId);
                                                    return (
                                                        <div key={m.id || i} className="group p-3 rounded-2xl bg-[#0f1525]/80 border border-white/5 flex items-center justify-between hover:border-blue-500/30 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-500/20">
                                                                    {(userDetail?.fullName || '?').charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[13px] font-bold text-white leading-none mb-1">{userDetail?.fullName || `User #${m.userId}`}</p>
                                                                    <div className={`text-[9px] font-black uppercase inline-block px-1.5 py-0.5 rounded ${
                                                                        m.roleId === 1 ? 'bg-amber-500/10 text-amber-500' :
                                                                        m.roleId === 2 ? 'bg-indigo-500/10 text-indigo-500' :
                                                                        'bg-slate-500/10 text-slate-400'
                                                                    }`}>
                                                                        {m.roleId === 1 ? 'Đội trưởng' : m.roleId === 2 ? 'Đội phó' : 'Thành viên'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleDeleteMember(m)}
                                                                className="p-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE (70%) - Volunteer Selection */}
                            <div className="w-[70%] flex flex-col bg-[#0f1525]/40 relative">
                                {/* Search & Tool Bar */}
                                <div className="p-6 border-b border-white/5 bg-[#0f1525]/20 shrink-0 flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Tìm TNV theo tên, khu vực hoặc kỹ năng..." 
                                            value={volSearch}
                                            onChange={e => setVolSearch(e.target.value)}
                                            className="w-full bg-[#1e253c]/50 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                    <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <span className="text-[10px] font-black text-blue-400 uppercase">Gợi ý theo địa điểm</span>
                                    </div>
                                </div>

                                {/* Volunteers List */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {approvedVolunteers
                                        .filter(u => !occupiedUserIds.has(u.id || u.userId))
                                        .filter(u => {
                                            const search = volSearch.toLowerCase();
                                            return (u.fullName || '').toLowerCase().includes(search) || 
                                                   (u.volunteerProvince || '').toLowerCase().includes(search) ||
                                                   (u.volunteerWard || '').toLowerCase().includes(search) ||
                                                   (u.notes || '').toLowerCase().includes(search);
                                        })
                                        .sort((a, b) => {
                                            // SORT: Priority if province/ward matches team assembly location
                                            const loc = (selectedTeam.assemblyLocationText || '').toLowerCase();
                                            const aMatch = loc.includes((a.volunteerProvince || '___').toLowerCase()) || loc.includes((a.volunteerWard || '___').toLowerCase());
                                            const bMatch = loc.includes((b.volunteerProvince || '___').toLowerCase()) || loc.includes((b.volunteerWard || '___').toLowerCase());
                                            if (aMatch && !bMatch) return -1;
                                            if (!aMatch && bMatch) return 1;
                                            return 0;
                                        })
                                        .map(v => {
                                            const locMatch = (selectedTeam.assemblyLocationText || '').toLowerCase().includes((v.volunteerProvince || '___').toLowerCase()) || 
                                                           (selectedTeam.assemblyLocationText || '').toLowerCase().includes((v.volunteerWard || '___').toLowerCase());
                                            
                                            return (
                                                <div key={v.id || v.userId} className={`p-5 rounded-3xl border transition-all duration-300 relative group overflow-hidden ${
                                                    locMatch ? 'bg-blue-600/5 border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'
                                                }`}>
                                                    {locMatch && <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>}
                                                    
                                                    <div className="flex items-start justify-between relative z-10">
                                                        <div className="flex gap-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-cyan-500/10 border border-white/10 flex items-center justify-center text-blue-400 font-black text-xl">
                                                                {(v.fullName || 'U').charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-lg font-black text-white leading-tight mb-1">{v.fullName}</h5>
                                                                <div className="flex flex-wrap items-center gap-3">
                                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                                        {v.phone || v.phoneNumber || 'Chưa cập nhật'}
                                                                    </span>
                                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /></svg>
                                                                        {v.volunteerProvince} - {v.volunteerWard}
                                                                    </span>
                                                                    {locMatch && <span className="text-[10px] font-black text-blue-400 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md uppercase tracking-wider animate-pulse">Phù hợp địa điểm</span>}
                                                                    
                                                                    {/* Skills Badge List */}
                                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                                        {v.skills?.map(s => (
                                                                            <span key={s.skillTypeId} className="text-[11px] font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl whitespace-nowrap">
                                                                                {translateSkill(s.skillName)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-2">
                                                            <button 
                                                                onClick={() => setExpandedVolId(expandedVolId === (v.id || v.userId) ? null : (v.id || v.userId))}
                                                                className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors"
                                                            >
                                                                {expandedVolId === (v.id || v.userId) ? 'Ẩn bớt' : 'Xem hồ sơ'}
                                                            </button>
                                                            <div className="flex items-center gap-2">
                                                                <select 
                                                                    value={expandedVolId === (v.id || v.userId) ? assignForm.roleId : 3}
                                                                    onChange={e => setAssignForm(p=>({...p, roleId: e.target.value}))}
                                                                    className="bg-black/40 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] font-bold outline-none text-slate-300"
                                                                >
                                                                    <option value="3">Thành viên</option>
                                                                    <option value="2">Đội phó</option>
                                                                    <option value="1">Đội trưởng</option>
                                                                </select>
                                                                <button 
                                                                    onClick={() => handleAddMember(v.id || v.userId)}
                                                                    disabled={isSubmitting}
                                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                                                >
                                                                    Thêm vào đội
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Profile Info */}
                                                    {expandedVolId === (v.id || v.userId) && (
                                                        <div className="mt-5 pt-5 border-t border-white/5 animate-inv-in space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Email</p>
                                                                    <p className="text-xs text-slate-300 truncate">{v.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Địa chỉ thường trú</p>
                                                                    <p className="text-xs text-slate-300">{v.address}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Kỹ năng chuyên môn</p>
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {v.skills?.length > 0 ? v.skills.map(s => (
                                                                        <span key={s.skillTypeId} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-black rounded-xl shadow-lg shadow-indigo-500/5">
                                                                            {translateSkill(s.skillName)}
                                                                        </span>
                                                                    )) : (
                                                                        <span className="text-[10px] text-slate-500 italic">Chưa đăng ký chuyên môn</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Tự giới thiệu</p>
                                                                <p className="text-xs text-slate-200 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed italic">
                                                                    "{v.notes || 'Không có ghi chú thêm.'}"
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] text-slate-500 font-bold uppercase mb-1 block">Ghi chú gán việc (Tùy chọn)</label>
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="VD: Phụ trách lái canô hoặc cứu hộ y tế..."
                                                                    value={assignForm.note}
                                                                    onChange={e => setAssignForm(p=>({...p, note: e.target.value}))}
                                                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    
                                    {approvedVolunteers.filter(u => !occupiedUserIds.has(u.id || u.userId)).length === 0 && (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                            <p className="text-slate-500 text-sm">Không tìm thấy tình nguyện viên nào phù hợp hoặc chưa có đơn đăng ký được duyệt.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between shrink-0">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Blue accent: Có sẵn cơ động</span>
                                </div>
                            </div>
                            <button onClick={() => setIsMemberModalOpen(false)} className={`px-6 py-2 rounded-xl text-sm font-bold border border-white/10 ${theme.textMuted} hover:bg-white/5 transition-all`}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RescueTeamManagement;
