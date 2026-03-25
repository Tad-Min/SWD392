import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useVolunteerProfile } from '../features/volunteer/hook/useVolunteer';

// Role display names
const ROLE_NAMES = {
  1: 'Citizen',
  2: 'Rescue Team',
  3: 'Rescue Coordinator',
  4: 'Manager',
  5: 'Admin',
  6: 'Volunteer',
};

function TaskBar({ isDarkMode = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { profile, fetchProfile } = useVolunteerProfile();

  const roleId = parseInt(localStorage.getItem('roleId')) || null;
  const userName = localStorage.getItem('name') || 'Người dùng';
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    }

    const handleUpdate = () => {
      if (isLoggedIn) fetchProfile();
    };

    window.addEventListener('volunteer-updated', handleUpdate);
    return () => window.removeEventListener('volunteer-updated', handleUpdate);
  }, [isLoggedIn, fetchProfile]);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsDropdownOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsDropdownOpen(false);
    navigate('/');
    toast.success('Đăng xuất thành công');
  };

  // Glassmorphism styles
  const barBg = isDarkMode ? 'bg-white/5' : 'bg-white/20';
  const barBorder = isDarkMode ? 'border border-white/10' : 'border border-white/30';
  const glassEffect = 'backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]';
  const btnBase = 'flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all duration-300';
  const btnHover = isDarkMode
    ? 'hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]'
    : 'hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]';

  return (
    <>
      <div className="h-[56px] w-full" aria-hidden="true"></div>
      <div className={`fixed top-4 left-4 right-4 sm:left-6 sm:right-6 mx-auto max-w-5xl ${barBg} border ${barBorder} ${glassEffect} rounded-full z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between px-2 py-2">
          {/* Left side - Logo & Links */}
          <div className="flex items-center gap-2">
            <div
              className={`${btnBase} ${btnHover}`}
              onClick={() => {
                const homeRoutes = {
                  1: '/Citizens',
                  3: '/RescueCoordinator',
                  4: '/manager',
                  5: '/admin',
                  6: '/volunteer'
                };
                navigate(homeRoutes[roleId] || '/Citizens');
              }}
            >
              <div className="relative w-10 h-10 bg-[#1c2638] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.15)] z-10 flex-shrink-0">
                <svg className="w-5 h-5 text-[#22d3ee]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                  <path d="M9.5 16a3.5 3.5 0 003.5 1.5" fill="none" stroke="#1c2638" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col ml-2">
                <h1 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} leading-tight transition-colors`}>
                  Cứu Hộ Lũ Lụt
                </h1>
                <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} font-medium transition-colors`}>
                  Chúng tôi luôn sẵn sàng
                </p>
              </div>
            </div>

            {/* About Link */}
            {roleId !== 3 && !location.pathname.toLowerCase().includes('/rescuecoordinator') && (
              <div
                className={`${btnBase} ${btnHover} hidden md:flex cursor-pointer text-sm font-semibold ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                onClick={() => navigate('/about')}
              >
                <span>Về chúng tôi</span>
              </div>
            )}

            {/* Volunteer Status Nav Item */}
            {isLoggedIn && (roleId === 1 || roleId === 6) && (
              <div
                className={`${btnBase} ${btnHover} hidden md:flex cursor-pointer transition-all duration-500`}
                onClick={() => navigate('/profile')}
              >
                {!profile ? (
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}>Đăng ký TNV</span>
                  </div>
                ) : profile.applicationStatus === 0 ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-yellow-500">Chờ duyệt</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-tight">Chế độ TNV</span>
                  </div>
                )}
              </div>
            )}

            {/* Contract Link - Citizens only */}
            {(roleId === 1 || roleId === 6) && (
              <div
                className={`${btnBase} ${btnHover} hidden md:flex cursor-pointer text-sm font-semibold ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                onClick={() => navigate('/contract')}
              >
                <span>Hợp đồng</span>
              </div>
            )}

            {/* Rescue Team Link - Volunteers only */}
            {roleId === 6 && (
              <div
                className={`${btnBase} ${btnHover} hidden md:flex cursor-pointer text-sm font-semibold ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                onClick={() => navigate('/volunteer')}
              >
                <span>Nhiệm vụ cứu hộ</span>
              </div>
            )}
          </div>

          {/* Right side - User icon with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                if (isLoggedIn) {
                  setIsDropdownOpen(!isDropdownOpen);
                } else {
                  navigate('/');
                }
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${btnBase} ${btnHover} !px-0 flex-shrink-0 ${isDropdownOpen ? (isDarkMode ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-blue-500/10') : ''}`}
              title={isLoggedIn ? userName : 'Đăng nhập'}
            >
              <svg
                className={`w-[22px] h-[22px] ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} transition-colors duration-500`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-3 w-64 rounded-2xl overflow-hidden transition-all duration-300 origin-top-right ${isDropdownOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))',
                backdropFilter: 'blur(20px)',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: isDarkMode
                  ? '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.08)'
                  : '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              {/* User Info Header */}
              <div className={`px-4 pt-4 pb-3 border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                  {userName}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} mt-0.5`}>
                  {ROLE_NAMES[roleId] || 'Unknown Role'}
                </p>
              </div>

              {/* Profile & Logout */}
              <div className="py-1.5">
                {/* Xem Profile */}
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group ${isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Xem Profile</span>
                </button>

                {/* Bảng điều khiển TNV (Only for Volunteers) */}
                {profile && profile.applicationStatus === 1 && (
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group ${isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-200">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">Bảng điều khiển TNV</span>
                  </button>
                )}

                {/* Xem Lịch sử cứu hộ (For Citizen and Volunteer) */}
                {(roleId === 1 || roleId === 6) && (
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/rescue-history'); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group ${isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow duration-200">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">Lịch sử cứu hộ</span>
                  </button>
                )}

                {/* Đăng xuất */}
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group ${isDarkMode
                    ? 'text-gray-400 hover:text-red-400'
                    : 'text-slate-500 hover:text-red-500'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${isDarkMode ? 'bg-white/5 group-hover:bg-red-500/10' : 'bg-black/5 group-hover:bg-red-500/10'}`}>
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskBar;
