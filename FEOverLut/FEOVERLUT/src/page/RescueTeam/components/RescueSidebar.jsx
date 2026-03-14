import React from 'react';
import { LayoutGrid, Users, MessageSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../features/auth/hook/useAuth';

const RescueSidebar = ({ activeTab, setActiveTab, teamLabel, onOpenProfile, isSidebarOpen = true, theme, isDarkMode }) => {
    const navigate = useNavigate();
    const { logout } = useLogout();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { id: 'teamInfo', label: 'Thông Tin Đội', icon: LayoutGrid },
        { id: 'missions', label: 'Nhiệm vụ', icon: Users },
        { id: 'messages', label: 'Tin nhắn', icon: MessageSquare }
    ];

    return (
        <aside className={`relative z-20 ${isSidebarOpen ? 'w-[280px]' : 'w-20'} h-screen ${theme?.sidebarBg || 'bg-[#0F172A]'} flex flex-col border-r ${theme?.border || 'border-slate-800'} flex-shrink-0 transition-all duration-500 ease-in-out`}>
            {/* User Profile Area */}
            <div className={`p-6 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} border-b border-transparent`}>
                <div className="relative w-10 h-10 bg-[#0F172A] border border-slate-700/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer">
                    <svg className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                    </svg>
                </div>
                {isSidebarOpen && (
                    <div className="overflow-hidden transition-all duration-300 whitespace-nowrap">
                        <h2 className="font-bold text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-500 leading-tight">OverLut</h2>
                        <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{teamLabel || 'Đội Cứu Hộ'}</span>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <div className={`flex-1 ${isSidebarOpen ? 'px-4 py-2 mt-4' : 'px-2 py-4 mt-2'} flex flex-col gap-2 overflow-y-auto custom-scrollbar`}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-200 text-sm font-medium group
                                ${isActive
                                    ? (theme?.navActiveNode || 'bg-red-500/10 text-red-500 border-r-2 border-red-500')
                                    : `${theme?.textMuted || 'text-slate-400'} ${theme?.navHover || 'hover:bg-slate-800/50'}`
                                }
                            `}
                        >
                            <Icon size={isSidebarOpen ? 18 : 22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-red-500' : 'group-hover:text-red-400 transition-colors'} />
                            {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                        </button>
                    );
                })}
            </div>

            {/* User Profile & Logout */}
            <div className={`mt-auto p-4 border-t ${theme?.border || 'border-slate-800'} border-opacity-50 flex flex-col gap-2 flex-shrink-0`}>
                <div
                    onClick={onOpenProfile}
                    className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} p-2 rounded-xl transition-colors cursor-pointer ${theme?.navHover || 'hover:bg-slate-500/10'} active:scale-95`}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-rose-400 flex items-center justify-center text-white font-bold flex-shrink-0 uppercase shadow-lg shadow-red-500/20">
                        {localStorage.getItem('name')?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col overflow-hidden whitespace-nowrap">
                            <span className={`text-sm font-semibold truncate leading-tight ${theme?.text || 'text-slate-200'}`}>{localStorage.getItem('name') || 'User'}</span>
                            <span className="text-[11px] text-rose-500 hover:underline truncate mt-0.5">Hồ sơ cá nhân</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-200 text-sm font-medium w-full text-slate-400 ${theme?.navHover || 'hover:bg-slate-800/50'} group`}
                >
                    <LogOut size={18} strokeWidth={2} className="group-hover:text-red-500 transition-colors" />
                    {isSidebarOpen && <span className="whitespace-nowrap transition-colors group-hover:text-red-500">Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
};

export default RescueSidebar;
