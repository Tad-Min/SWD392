import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useRescueTeam, useCreateRescueTeam, useUpdateRescueTeam, useGetRescueTeamMemberByTeamId, useCreateRescueTeamMember, useDeleteRescueTeamMember } from '../../features/Rescue/hook/useRescueTeam';
import { useUsers } from '../../features/users/hook/useUsers';

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
    
    const { getRescueTeam } = useRescueTeam();
    const { createRescueTeam } = useCreateRescueTeam();
    const { updateRescueTeam } = useUpdateRescueTeam();
    const { getRescueTeamMemberByTeamId } = useGetRescueTeamMemberByTeamId();
    const { createRescueTeamMember } = useCreateRescueTeamMember();
    const { deleteRescueTeamMember } = useDeleteRescueTeamMember();
    
    const { getUsers } = useUsers();

    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    // Modal Add/Edit Team
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teamForm, setTeamForm] = useState({ id: null, teamName: '' });

    // Modal Manage Members
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [newMemberId, setNewMemberId] = useState('');

    const fetchTeams = async () => {
        setIsLoading(true);
        try {
            const res = await getRescueTeam();
            setTeams(toArr(res));
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

    useEffect(() => {
        fetchTeams();
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTeams = teams.filter(t => 
        (t.teamName || t.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveTeam = async () => {
        if (!teamForm.teamName.trim()) return;
        setIsSubmitting(true);
        try {
            if (teamForm.id) {
                await updateRescueTeam(teamForm.id, {
                    teamName: teamForm.teamName.trim()
                });
            } else {
                await createRescueTeam({
                    teamName: teamForm.teamName.trim(),
                    // Optionally active: true based on API requirements
                });
            }
            setIsTeamModalOpen(false);
            setTeamForm({ id: null, teamName: '' });
            fetchTeams();
        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu Đội cứu hộ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenMembers = async (team) => {
        setSelectedTeam(team);
        setIsMemberModalOpen(true);
        setNewMemberId('');
        setIsMembersLoading(true);
        try {
            const res = await getRescueTeamMemberByTeamId(team.id || team.teamId);
            const data = toArr(res);
            console.log("Team Members data:", data);
            setTeamMembers(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách thành viên", error);
            setTeamMembers([]);
        } finally {
            setIsMembersLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberId) return;
        setIsSubmitting(true);
        try {
            const payload = {
                teamId: selectedTeam.id || selectedTeam.teamId,
                userId: parseInt(newMemberId),
                roleId: 1 // Default role for member if required by BE, adjust accordingly
            };
            await createRescueTeamMember(payload);
            
            // Refresh members list
            const res = await getRescueTeamMemberByTeamId(selectedTeam.id || selectedTeam.teamId);
            setTeamMembers(toArr(res));
            setNewMemberId('');
            alert("Thêm thành viên thành công!");
        } catch (error) {
            console.error(error);
            alert("Không thể thêm thành viên. (Có thể do User này đã làm trưởng nhóm hoặc có lỗi truy xuất)");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMember = async (member) => {
        console.log("Deleting member:", member);
        // Fallback fields for ID
        const memberId = member.id || member.rescueTeamMemberId || member.teamMemberId || member.userId;
        
        if (!memberId) {
            alert("Không tìm thấy ID thành viên để xóa.");
            return;
        }

        if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi đội?")) return;
        setIsSubmitting(true);
        try {
            await deleteRescueTeamMember(memberId);
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
                            setTeamForm({ id: null, teamName: '' });
                            setIsTeamModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Tạo Đội Mới
                    </button>
                </div>
            </div>

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

            {/* Table */}
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
                                <tr><td colSpan="3" className="px-6 py-14 text-center text-sm">Chưa có đội cứu hộ nào.</td></tr>
                            ) : filteredTeams.map(item => (
                                <tr key={item.id || item.teamId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                    <td className={`px-6 py-4 text-sm font-bold ${theme.text}`}>#{item.id || item.teamId}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base font-bold shrink-0">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            </div>
                                            <span className={`text-[15px] font-semibold ${theme.text}`}>{item.teamName || item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleOpenMembers(item)} className={`px-3 py-1.5 rounded-lg text-sm bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors`}>
                                                Xem & Thêm TV
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add/Edit Team */}
            {isTeamModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-sm mt-16 ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl p-6`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>
                            {teamForm.id ? 'Sửa Đội' : 'Tạo Đội Mới'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tên Đội *</label>
                                <input
                                    type="text"
                                    value={teamForm.teamName}
                                    onChange={e => setTeamForm(p => ({ ...p, teamName: e.target.value }))}
                                    className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsTeamModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textMuted} hover:bg-black/5`}>Hủy</button>
                            <button
                                onClick={handleSaveTeam}
                                disabled={isSubmitting || !teamForm.teamName.trim()}
                                className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
                            >
                                Lưu Lại
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: View/Add Members */}
            {isMemberModalOpen && selectedTeam && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-lg mt-16 ${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]`} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-bold ${theme.text}`}>
                                Xem Thành Viên: <span className="text-emerald-500">{selectedTeam.teamName || selectedTeam.name}</span>
                            </h3>
                            <button onClick={() => setIsMemberModalOpen(false)} className={`p-1 text-slate-400 hover:text-slate-600`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Thêm thành viên */}
                        <div className={`p-4 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} mb-4 shrink-0`}>
                            <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Thêm thành viên vào đội</label>
                            <div className="flex gap-2">
                                <select 
                                    value={newMemberId} 
                                    onChange={e => setNewMemberId(e.target.value)}
                                    className={`flex-1 border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full max-w-[250px]`}
                                >
                                    <option value="">-- Chọn User --</option>
                                    {users.map(u => (
                                        <option key={u.id || u.userId} value={u.id || u.userId}>
                                            {u.fullName || u.email || 'User #' + (u.id || u.userId)}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handleAddMember}
                                    disabled={!newMemberId || isSubmitting}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shrink-0 disabled:opacity-50"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>

                        {/* List thành viên */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {isMembersLoading ? (
                                <p className={`text-center text-sm ${theme.textMuted} py-4`}>Đang tải...</p>
                            ) : teamMembers.length === 0 ? (
                                <p className={`text-center text-sm ${theme.textMuted} py-4`}>Chưa có thành viên nào trong đội.</p>
                            ) : teamMembers.map((m, i) => {
                                // Find user details
                                const userDetail = users.find(u => (u.id || u.userId) === m.userId);
                                return (
                                    <div key={m.id || i} className={`p-3 rounded-xl border ${theme.border} ${theme.inputBg} flex justify-between items-center`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {(userDetail?.fullName || userDetail?.email || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${theme.text}`}>
                                                    {userDetail?.fullName || userDetail?.email || `User #${m.userId}`}
                                                </p>
                                                <p className={`text-[11px] ${theme.textMuted}`}>Role ID: {m.roleId}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteMember(m)}
                                            disabled={isSubmitting}
                                            className={`p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50`}
                                            title="Xóa thành viên"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RescueTeamManagement;
