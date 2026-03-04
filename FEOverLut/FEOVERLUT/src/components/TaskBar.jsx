import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskBar({ isDarkMode = true }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down beyond 50px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Glassmorphism parameters: Highly transparent, frosted look
  const barBg = isDarkMode
    ? 'bg-white/5'
    : 'bg-white/20';
  const barBorder = isDarkMode
    ? 'border border-white/10'
    : 'border border-white/30';
  const glassEffect = "backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]";

  // Interactive element base styles
  const btnBase = "flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all duration-300";
  // White glow on dark mode, Blue glow on light mode
  const btnHover = isDarkMode
    ? "hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
    : "hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]";

  return (
    <>
      <div className="h-[56px] w-full" aria-hidden="true"></div>
      <div className={`fixed top-4 left-4 right-4 sm:left-6 sm:right-6 mx-auto max-w-5xl ${barBg} border ${barBorder} ${glassEffect} rounded-full z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between px-2 py-2">
          {/* Left side - Logo and Text Button */}
          <div
            className={`${btnBase} ${btnHover}`}
            onClick={() => navigate('/')}
          >
            {/* Circular icon with water drop */}
            <div className="relative w-10 h-10 bg-[#1c2638] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.15)] z-10 flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#22d3ee]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Main droplet shape */}
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                {/* Small cut-out arc to simulate reflection */}
                <path d="M9.5 16a3.5 3.5 0 003.5 1.5" fill="none" stroke="#1c2638" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Text content */}
            <div className="flex flex-col ml-2">
              <h1 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} leading-tight transition-colors`}>
                Cứu Hộ Lũ Lụt
              </h1>
              <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} font-medium transition-colors`}>
                Chúng tôi luôn sẵn sàng
              </p>
            </div>
          </div>

          {/* Center Pill Buttons */}
          {/* <div className="flex items-center gap-2 md:gap-4 flex-1 justify-center px-4 hidden md:flex">
          <div className="w-16 h-6 rounded-full bg-white/20 dark:bg-slate-500/30"></div>
          <div className="w-16 h-6 rounded-full bg-white/20 dark:bg-slate-500/30"></div>
          <div className="w-16 h-6 rounded-full bg-white/20 dark:bg-slate-500/30"></div>
          <div className="w-16 h-6 rounded-full bg-white/20 dark:bg-slate-500/30"></div>
        </div> */}

          {/* Right side - User icon Button */}
          <div
            onClick={() => navigate('/')}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${btnBase} ${btnHover} !px-0 flex-shrink-0`}
            title="Đăng xuất / Đăng nhập"
          >
            <svg
              className={`w-[22px] h-[22px] ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} transition-colors duration-500`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskBar;
