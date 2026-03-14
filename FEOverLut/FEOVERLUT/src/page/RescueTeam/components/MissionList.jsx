import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const MissionList = ({ onSelectMission, teamIdLabel, theme, missions, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const getPriorityStyle = (priorityLv) => {
        switch (priorityLv) {
            case 3: // Khẩn cấp
            case 'Cao':
                return { label: 'Khẩn Cấp', color: 'bg-red-500/20 text-red-500 border-red-600/50' };
            case 2: // Nguy hiểm
            case 'Trung Bình':
                return { label: 'Nguy Hiểm', color: 'bg-yellow-600/20 text-yellow-500 border-yellow-700/50' };
            case 1: // Cần hỗ trợ
            case 'Thấp':
            default:
                return { label: 'Cần Hỗ Trợ', color: 'bg-blue-500/20 text-blue-500 border-blue-600/50' };
        }
    };

    // Helper function for Status
    const getStatusInfo = (statusId) => {
        switch (statusId) {
            case 1: return { label: 'Assigned (Đã giao)', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
            case 2: return { label: 'EnRoute (Đang di chuyển)', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' };
            case 3: return { label: 'Rescuing (Đang cứu hộ)', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
            case 4: return { label: 'Completed (Hoàn thành)', color: 'text-green-500 bg-green-500/10 border-green-500/20' };
            case 5: return { label: 'Failed (Thất bại)', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
            default: return { label: 'Chưa rõ', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
        }
    };

    // Filter Logic
    const filteredMissions = missions ? missions.filter(mission => {
        const descMatch = (mission.description || mission.Description || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = descMatch.includes(searchLower) ||
            (mission.missionId || mission.MissionId || '').toString().includes(searchLower);

        const matchesStatus = statusFilter === 'all' || (mission.statusId || mission.StatusId).toString() === statusFilter;

        return matchesSearch && matchesStatus;
    }) : [];

    // Format AssignedAt
    const formatAssignedDate = (dateString) => {
        if (!dateString) return 'Chưa rõ thời gian';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-red-500 font-bold text-xs tracking-wider mb-1 uppercase">
                        {teamIdLabel || 'Mã đội: RT-ALPHA-01'}
                    </div>
                    <h1 className={`text-3xl font-extrabold ${theme?.textTitle || 'text-white'} tracking-tight`}>Nhiệm Vụ Cứu Hộ Của Tôi</h1>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wide">Trực Tuyến</span>
                </div>
            </div>

            {/* List Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <h2 className={`text-lg font-bold ${theme?.text || 'text-slate-200'}`}>Nhiệm Vụ Sắp Tới</h2>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                    <div className={`flex items-center px-3 py-2 rounded-lg border ${theme?.border || 'border-slate-800'} ${theme?.navHover || 'bg-[#15202D]'}`}>
                        <Search size={16} className={`${theme?.textMuted || 'text-slate-500'}`} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ID hoặc mô tả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`ml-2 bg-transparent border-none outline-none text-sm w-48 ${theme?.text || 'text-white'} placeholder-slate-500`}
                        />
                    </div>
                    <div className={`flex items-center px-3 py-2 rounded-lg border ${theme?.border || 'border-slate-800'} ${theme?.navHover || 'bg-[#15202D]'}`}>
                        <Filter size={16} className={`${theme?.textMuted || 'text-slate-500'} mr-2`} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`bg-transparent border-none outline-none text-sm ${theme?.text || 'text-white'} cursor-pointer`}
                        >
                            <option value="all" className="bg-slate-800">Tất cả trạng thái</option>
                            <option value="1" className="bg-slate-800">Assigned</option>
                            <option value="2" className="bg-slate-800">EnRoute</option>
                            <option value="3" className="bg-slate-800">Rescuing</option>
                            <option value="4" className="bg-slate-800">Completed</option>
                            <option value="5" className="bg-slate-800">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : filteredMissions.length > 0 ? (
                    filteredMissions.map((mission) => {
                        const priorityInfo = getPriorityStyle(mission.priority || mission.priorityLv);
                        return (
                            <div
                                key={mission.id || mission.rescueMissionId || mission.rescueRequestId}
                                onClick={() => onSelectMission(mission)}
                                className={`${theme?.cardBg || 'bg-[#121A22]'} border ${theme?.border || 'border-slate-800/80'} hover:border-red-500/50 ${theme?.navHover || 'hover:bg-[#15202D]'} transition-all duration-200 rounded-xl p-5 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-red-900/10`}
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <h3 className={`text-base font-bold ${theme?.text || 'text-slate-200'} group-hover:text-red-500 transition-colors`}>
                                            Nhiệm vụ #{mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId || 'N/A'}
                                        </h3>
                                        {(() => {
                                            const status = getStatusInfo(mission.statusId || mission.StatusId);
                                            return (
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <p className={`text-sm ${theme?.textMuted || 'text-slate-500'} mt-1 truncate max-w-lg`}>
                                        {mission.description || mission.Description || mission.notes || 'Không có mô tả'}
                                    </p>
                                    <div className={`flex items-center mt-3 text-xs ${theme?.textMuted || 'text-slate-500'}`}>
                                        <Calendar size={12} className="mr-1" />
                                        <span>Giao lúc: {formatAssignedDate(mission.assignedAt || mission.AssignedAt)}</span>
                                    </div>
                                </div>

                                {/* Right Content */}
                                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-md border ${priorityInfo.color}`}>
                                        {priorityInfo.label}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                                        ID: {mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={`p-8 text-center ${theme?.textMuted || 'text-slate-500'} border ${theme?.border || 'border-slate-800'} rounded-xl border-dashed`}>
                        Chưa có nhiệm vụ nào được giao cho đội
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionList;
