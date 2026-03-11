import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import MyProfileModal from './MyProfileModal';
import NotificationBell from './NotificationBell';
import { useLogout } from '../features/auth/hook/useAuth';

const ManagerLayout = () => {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const location = useLocation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x: xOffset, y: yOffset });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const theme = {
        bg: isDarkMode ? 'bg-[#0A1128]' : 'bg-[#f0f4f8]',
        sidebarBg: isDarkMode ? 'bg-[#0F172A]/80' : 'bg-white/70',
        cardBg: isDarkMode ? 'bg-[#1E293B]/70' : 'bg-white/80',
        border: isDarkMode ? 'border-slate-700/50' : 'border-slate-300/60',
        text: isDarkMode ? 'text-slate-100' : 'text-slate-800',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        navActiveNode: isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-400' : 'bg-emerald-600/10 text-emerald-700 border-r-[3px] border-emerald-600',
        navHover: isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-200/50',
        glassEffect: 'backdrop-blur-xl',
        inputBg: isDarkMode ? 'bg-[#0F172A]' : 'bg-white',
        inputBorder: isDarkMode ? 'border-slate-700/80' : 'border-slate-300',
    };

    const navItems = [
        { path: '/manager/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', label: 'Tổng quan' },
        { path: '/manager/products', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Sản phẩm' },
        { path: '/manager/inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Quản lý kho' },
        { path: '/manager/warehouses', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Điểm kho' },
        { path: '/manager/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Lịch sử kho' },
        { path: '/manager/distribution', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', label: 'Phân phối' },
        { path: '/manager/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Báo cáo' },
    ];

    const currentPageTitle = navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Bảng điều khiển';

    return (
        <div className={`h-screen ${theme.bg} ${theme.text} flex overflow-hidden transition-all duration-500 ease-in-out font-sans relative`}>
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div
                    className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] transition-transform duration-300 ease-out"
                    style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)` }}
                />
                <div
                    className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] transition-transform duration-300 ease-out"
                    style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
                />
            </div>

            {/* Sidebar */}
            <aside className={`relative z-20 ${isSidebarOpen ? 'w-[260px]' : 'w-20'} flex-shrink-0 h-full ${theme.sidebarBg} ${theme.glassEffect} border-r ${theme.border} transition-all duration-500 ease-in-out flex flex-col`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-transparent mt-2 flex-shrink-0">
                    <div className="flex items-center gap-3 px-4 w-full cursor-pointer" onClick={() => navigate('/manager/dashboard')}>
                        <div className="relative w-10 h-10 bg-[#0F172A] border border-slate-700/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <svg className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                            </svg>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300">
                                <span className={`font-bold text-lg tracking-wide ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500' : 'text-slate-800'}`}>OverLut</span>
                                <span className={`text-[10px] ${theme.textMuted} font-medium`}>Manager Portal</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${isActive ? theme.navActiveNode : `${theme.textMuted} ${theme.navHover}`}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center justify-center flex-shrink-0">
                                        <svg className={`w-[22px] h-[22px] transition-colors duration-200 ${isActive ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : 'text-current group-hover:text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                    {isSidebarOpen && (
                                        <span className={`text-[15px] font-semibold whitespace-nowrap ${isActive ? (isDarkMode ? 'text-slate-100' : 'text-emerald-700') : (isDarkMode ? 'group-hover:text-slate-200' : 'group-hover:text-slate-700')}`}>{item.label}</span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* User Profile & Logout */}
                <div className={`mt-auto p-4 border-t ${theme.border} flex-shrink-0 flex flex-col gap-2`}>
                    <div
                        onClick={() => setIsProfileOpen(true)}
                        className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-500/10 active:scale-95`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0 uppercase shadow-lg shadow-emerald-500/20">
                            {localStorage.getItem('name')?.charAt(0)?.toUpperCase() || 'M'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-semibold truncate leading-tight">{localStorage.getItem('name') || 'Manager User'}</span>
                                <span className={`text-[11px] text-teal-500 hover:underline truncate mt-0.5`}>Hồ sơ cá nhân</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={async () => {
                            await logout();
                            navigate('/');
                        }}
                        className={`
                            flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2.5 rounded-xl transition-all duration-200
                            text-red-500 hover:bg-red-500/10 font-semibold text-sm
                        `}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isSidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
                {/* Header Navbar */}
                <header className={`h-20 flex-shrink-0 ${theme.cardBg} ${theme.glassEffect} border-b ${theme.border} flex items-center justify-between px-6 lg:px-10 z-20 transition-all duration-500 ease-in-out`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg ${theme.navHover} transition-colors focus:outline-none ${theme.textMuted}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{currentPageTitle}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Dark/Light mode toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center ${theme.textMuted}`}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* Notifications */}
                        <NotificationBell theme={theme} />
                    </div>
                </header>

                {/* Outlet for Nested Routes */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative z-10">
                    <Outlet context={{ isDarkMode, theme }} />
                </div>
            </main>

            {/* Global CSS for scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
                }
            `}} />
            <MyProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} isDarkMode={isDarkMode} theme={theme} />
        </div>
    );
};

export default ManagerLayout;
