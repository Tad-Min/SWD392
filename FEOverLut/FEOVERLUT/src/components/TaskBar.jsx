import React from 'react';
import { useNavigate } from 'react-router-dom';

function TaskBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-[#1e253c] border-t-[4px] border-blue-500 shadow-md relative z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Text */}
        <div className="flex items-center gap-3">
          {/* Circular icon with water drop */}
          <div className="relative w-12 h-12 bg-[#1c2638] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] z-10">
            <svg
              className="w-[22px] h-[22px] text-[#22d3ee]"
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
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white leading-tight">
              Cứu Hộ Lũ Lụt
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Chúng tôi luôn sẵn sàng
            </p>
          </div>
        </div>

        {/* Right side - User icon */}
        <div onClick={() => navigate('/Login')} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default TaskBar;
