import React from 'react';

const MissionList = ({ onSelectMission, teamIdLabel, theme, missions, loading }) => {
    // Helper function to get priority visual styles
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
            <h2 className={`text-lg font-bold ${theme?.text || 'text-slate-200'} mb-4`}>Nhiệm Vụ Sắp Tới</h2>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : missions && missions.length > 0 ? (
                    missions.map((mission) => {
                        const priorityInfo = getPriorityStyle(mission.priority || mission.priorityLv);
                        return (
                            <div
                                key={mission.id || mission.rescueMissionId || mission.rescueRequestId}
                                onClick={() => onSelectMission(mission)}
                                className={`${theme?.cardBg || 'bg-[#121A22]'} border ${theme?.border || 'border-slate-800/80'} hover:border-red-500/50 ${theme?.navHover || 'hover:bg-[#15202D]'} transition-all duration-200 rounded-xl p-5 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-red-900/10`}
                            >
                                <div className="flex flex-col">
                                    <h3 className={`text-base font-bold ${theme?.text || 'text-slate-200'} group-hover:text-red-500 transition-colors`}>
                                        Nhiệm vụ #{mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId || 'N/A'}
                                    </h3>
                                    <p className={`text-sm ${theme?.textMuted || 'text-slate-500'} mt-1`}>
                                        {mission.description || mission.Description || mission.notes || 'Không có mô tả'}
                                    </p>
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
