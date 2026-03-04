import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const SystemConfig = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [activeTab, setActiveTab] = useState('emergency');

    // Mock settings sub-menu
    const subMenus = [
        { id: 'general', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Cài đặt chung' },
        { id: 'emergency', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', label: 'Mức độ khẩn cấp' },
        { id: 'vehicle', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', label: 'Loại phương tiện' },
        { id: 'api', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'API Integration' },
    ];

    // Mock Urgency Levels (Map loosely to UrgencyLevelDTO)
    const urgencyLevels = [
        { id: 1, name: 'Critical', desc: 'Sơ tán tức thời thiết yếu', priorityLabel: 'Cao', priorityValue: 100, colorCode: '#DC2626', priorityColor: 'bg-red-600' },
        { id: 2, name: 'High', desc: 'Chuẩn bị phòng ngừa nguy hiểm', priorityLabel: 'TB - Cao', priorityValue: 75, colorCode: '#F97316', priorityColor: 'bg-orange-500' },
        { id: 3, name: 'Moderate', desc: 'Chú ý điều kiện tại địa phương', priorityLabel: 'Trung bình', priorityValue: 50, colorCode: '#EAB308', priorityColor: 'bg-yellow-500' },
        { id: 4, name: 'Low', desc: 'Không có đe dọa trực tiếp', priorityLabel: 'Thấp', priorityValue: 25, colorCode: '#10B981', priorityColor: 'bg-emerald-500' },
    ];

    return (
        <div className="animate-fade-in-up h-full flex flex-col sm:flex-row gap-6">
            {/* Sub-menu Navigation Sidebar */}
            <div className={`w-full sm:w-64 shrink-0 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-4 flex flex-col gap-2 h-fit`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.textMuted} mb-2 px-3`}>Tùy chọn</h3>
                {subMenus.map(menu => (
                    <button
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer
                            ${activeTab === menu.id
                                ? isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'
                                : `${theme.textMuted} ${theme.navHover} border border-transparent`
                            }
                        `}
                    >
                        <svg className={`w-5 h-5 ${activeTab === menu.id ? 'text-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={menu.icon} />
                        </svg>
                        <span className="text-sm font-semibold">{menu.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Configuration Content */}
            <div className={`flex-1 flex flex-col ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-6 sm:p-8 min-h-[500px]`}>
                {/* Header Action inside Content */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.text}`}>Mức độ khẩn cấp (Emergency Levels)</h2>
                        <p className={`text-sm ${theme.textMuted} mt-1`}>Định nghĩa các cấp độ cảnh báo để kích hoạt quy trình tự động.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            Thêm mức độ mới
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/30 active:scale-95 whitespace-nowrap">
                            Lưu Thay Đổi
                        </button>
                    </div>
                </div>

                {/* Data Table for Levels */}
                <div className={`w-full border ${theme.border} rounded-xl overflow-hidden mb-8`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                    <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Tên Cấp Độ</th>
                                    <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider w-[25%]`}>Độ Ưu Tiên</th>
                                    <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Mã Màu Hiển Thị</th>
                                    <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                {urgencyLevels.map((level) => (
                                    <tr key={level.id} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[15px] font-bold ${theme.text}`}>{level.name}</span>
                                                <span className={`text-[12px] ${theme.textMuted} mt-0.5`}>{level.desc}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 w-full pr-4">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className={`font-semibold ${theme.text}`}>{level.priorityLabel}</span>
                                                    <span className={theme.textMuted}>{level.priorityValue}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                                    <div className={`h-full ${level.priorityColor} rounded-full`} style={{ width: `${level.priorityValue}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                                                    style={{ backgroundColor: level.colorCode }}
                                                ></div>
                                                <span className={`text-sm font-mono ${theme.textMuted}`}>{level.colorCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-blue-500 transition-colors`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} text-red-500 transition-colors`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                    <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'} flex gap-4 items-start transition-colors`}>
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} mb-1`}>Quy Tắc Tự Động</h4>
                            <p className={`text-[13px] ${theme.textMuted} leading-relaxed`}>Việc thay đổi màu sắc hoặc mức độ ưu tiên sẽ tự động cập nhật trên ứng dụng người dùng và bảng điều khiển trung tâm trong vòng 5 phút.</p>
                        </div>
                    </div>

                    <div className={`p-5 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/50'} flex gap-4 items-start transition-colors`}>
                        <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'} flex items-center justify-center shrink-0 mt-0.5`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${theme.text} mb-1`}>Lịch sử thay đổi</h4>
                            <p className={`text-[13px] ${theme.textMuted} leading-relaxed`}>Lần cập nhật cuối cùng bởi <span className="font-semibold text-current">Admin User</span> vào lúc 14:30 hôm nay.</p>
                        </div>
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

export default SystemConfig;
