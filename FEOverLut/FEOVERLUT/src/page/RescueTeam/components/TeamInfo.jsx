import React from 'react';

const TeamInfo = ({ teamIdLabel, members = [], loading = false, theme }) => {
    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-red-500 font-bold text-xs tracking-wider mb-1 uppercase">
                        {teamIdLabel || 'Mã đội: RT-ALPHA-01'}
                    </div>
                    <h1 className={`text-3xl font-extrabold ${theme?.textTitle || 'text-white'} tracking-tight`}>Thông tin đội</h1>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wide">Trực Tuyến</span>
                </div>
            </div>

            {/* Team Members Table Container */}
            <div className={`${theme?.cardBg || 'bg-[#1C2532]'} border ${theme?.border || 'border-slate-700/50'} rounded-2xl overflow-hidden shadow-2xl p-6 min-h-[400px]`}>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`${theme?.navHover || 'bg-white/5'} rounded-xl ${theme?.textTitle || 'text-slate-300'} text-sm font-semibold tracking-wide border-b border-transparent`}>
                                    <th className="px-6 py-4 rounded-l-xl">ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Identify</th>
                                    <th className="px-6 py-4 rounded-r-xl">Role</th>
                                </tr>
                            </thead>
                            <tbody className={`${theme?.text || 'text-slate-400'} text-sm`}>
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <tr key={index} className={`border-b ${theme?.border || 'border-slate-700/50'} ${theme?.navHover || 'hover:bg-slate-800/30'} transition-colors`}>
                                            <td className="px-6 py-4">{member.userId}</td>
                                            <td className="px-6 py-4">{member.userName}</td>
                                            <td className="px-6 py-4">{member.identifyId || '—'}</td>
                                            <td className="px-6 py-4">{member.roleName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">
                                            Chưa có thông tin thành viên
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TeamInfo;
