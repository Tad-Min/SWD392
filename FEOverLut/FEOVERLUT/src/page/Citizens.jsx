import TaskBar from '../components/TaskBar.jsx'

function Citizens() {
    




    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
            <TaskBar />
            
            <div className="px-4 py-6 space-y-6">
                {/* Top Section - Shield Icon, Question, and SOS Button */}
                <div className="flex flex-col items-center space-y-4">
                    {/* Shield Icon */}
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg 
                        className="w-10 h-10 text-blue-600" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        >
                        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                    </svg>
                    </div>
                    
                    {/* Question */}
                    <h2 className="text-2xl font-semibold text-black">
                        Bạn đang an toàn chứ?
                    </h2>
                    
                    {/* Instruction Text */}
                    <p className="text-sm text-gray-600 text-center px-4">
                        Nhấn nút bên dưới nếu cần hỗ trợ khẩn cấp
                    </p>
                    
                    {/* SOS Button */}
                    <button className="w-32 h-32 bg-red-500 rounded-full flex flex-col items-center justify-center shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors">
                        <svg 
                            className="w-8 h-8 text-white mb-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                            />
                        </svg>
                        <span className="text-3xl font-bold text-white">SOS</span>
                        <span className="text-sm text-white mt-1">Yêu cầu cứu hộ</span>
                    </button>
                </div>

                {/* Information Cards Section */}
                <div className="space-y-4">
                    {/* Location Card */}
                    <div className="bg-green-100 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg 
                                className="w-7 h-7 text-yellow-800" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                />
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 mb-1">Vị trí của bạn</p>
                            <p className="text-xl font-bold text-yellow-700 mb-1">Quận 1, TP.HCM</p>
                            <p className="text-xs text-gray-600">Mức độ rủi ro: Trung bình</p>
                        </div>
                    </div>

                    {/* Battery Card */}
                    <div className="bg-blue-100 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg 
                                className="w-7 h-7 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 mb-1">Pin điện thoại</p>
                            <p className="text-xl font-bold text-green-700 mb-1">78%</p>
                            <p className="text-xs text-gray-600">Khoảng 5 giờ còn lại</p>
                        </div>
                    </div>
                </div>

                {/* Support Options Section */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-black">
                        Loại hỗ trợ cần thiết
                    </h3>
                    <div className="flex gap-3">
                        {/* Evacuation Button */}
                        <button className="flex-1 bg-blue-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-colors">
                            <svg 
                                className="w-8 h-8 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                />
                            </svg>
                            <span className="text-sm text-white font-medium text-center">Cần sơ tán</span>
                        </button>

                        {/* Food Button */}
                        <button className="flex-1 bg-blue-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-colors">
                            <svg 
                                className="w-8 h-8 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                                />
                            </svg>
                            <span className="text-sm text-white font-medium text-center">Cần lương thực</span>
                        </button>

                        {/* Medical Button */}
                        <button className="flex-1 bg-blue-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-colors">
                            <svg 
                                className="w-8 h-8 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                                />
                            </svg>
                            <span className="text-sm text-white font-medium text-center">Cần y tế</span>
                        </button>
                    </div>
                </div>

                {/* Safety Guide Section */}
                <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg 
                                className="w-6 h-6 text-yellow-800" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-black">Hướng dẫn an toàn</p>
                            <p className="text-xs text-gray-600">Xem các mẹo quan trọng</p>
                        </div>
                    </div>
                    <svg 
                        className="w-5 h-5 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 15l7-7 7 7" 
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Citizens;
