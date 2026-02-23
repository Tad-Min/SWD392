import React from 'react';
import { useNavigate } from 'react-router-dom';

function TaskBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Text */}
        <div className="flex items-center gap-3">
          {/* Blue circular icon with shield */}
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
                  className="w-8 h-8 text-blue-600" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
              </svg>
          </div>
          
          {/* Text content */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-black">
              Cứu Hộ Lũ Lụt
            </h1>
            <p className="text-sm text-gray-500">
              Chúng tôi luôn sẵn sàng
            </p>
          </div>
        </div>

        {/* Right side - User icon */}
        <div onClick={() => navigate('/Login')} className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default TaskBar;
