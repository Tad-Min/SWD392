import TaskBar from '../components/TaskBar.jsx'
import { useBatteryStatus } from 'react-haiku';

function Citizens() {
    const { level, isCharging } = useBatteryStatus();
    // Use fallback percentage if level is undefined or unavailable
    const batteryPercentage = level !== undefined ? Math.round(level * 1) : 78;

    return (
        <div className="min-h-screen bg-[#0f1525] text-white relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {/* Radial glow center-left */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1d4ed8]/20 rounded-full blur-[120px]"></div>
                {/* Radial glow bottom-right */}
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1d4ed8]/15 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>
                {/* Bottom dark wave pattern overlay to give the wavy bottom look */}
                <svg className="absolute bottom-0 w-full text-[#080d18] fill-current" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,197.3C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <TaskBar />

                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full space-y-10">
                    {/* Top Section - Question and SOS Button */}
                    <div className="flex flex-col items-center space-y-1.5 mt-2">
                        {/* Small water drop icon */}
                        <div className="relative w-14 h-14 flex flex-col items-center justify-center mb-2">
                            {/* Soft outer glow */}
                            <div className="absolute inset-0 bg-[#06b6d4] rounded-full blur-md opacity-20"></div>

                            {/* Inner circle background */}
                            <div className="relative w-16 h-16 bg-[#1c2638] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] z-10">
                                <svg
                                    className="w-[30px] h-[30px] text-[#22d3ee]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {/* Main droplet shape */}
                                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                                    {/* Small cut-out arc to simulate reflection */}
                                    <path d="M9.5 16a3.5 3.5 0 003.5 1.5" fill="none" stroke="#1c2638" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-[32px] font-bold text-white text-center tracking-tight leading-tight">
                            Bạn đang an toàn chứ?
                        </h2>

                        <p className="text-[15px] text-[#94a3b8] text-center">
                            Nhấn nút bên dưới nếu cần hỗ trợ khẩn cấp
                        </p>

                        {/* SOS Button Area */}
                        <div className="relative mt-12 mb-10 py-8 flex flex-col items-center justify-center w-full max-w-[320px] mx-auto group">
                            {/* Outer pulsing ring 1 */}
                            <div className="absolute w-[260px] h-[260px] bg-[#ef4444]/20 rounded-full flex items-center justify-center -z-10 shadow-[0_0_80px_rgba(239,68,68,0.4)] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] group-hover:scale-75 group-hover:animate-none transition-transform duration-500 ease-in-out"></div>
                            {/* Outer pulsing ring 2 */}
                            <div className="absolute w-[220px] h-[220px] bg-[#ef4444]/30 rounded-full flex items-center justify-center -z-10 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] group-hover:scale-90 transition-transform duration-500 ease-in-out"></div>

                            {/* Inner SOS Button */}
                            <button className="relative w-40 h-40 bg-[#ef4444] rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.6)] hover:bg-red-500 active:scale-95 transition-all outline-none border-[3px] border-[#fb7185]/40 z-10 cursor-pointer">
                                <svg
                                    className="w-10 h-10 text-white/90 mb-1"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                                <span className="text-[38px] font-extrabold text-white tracking-widest leading-none drop-shadow-md">SOS</span>
                                <span className="text-[11px] font-bold text-white/90 mt-1.5 uppercase tracking-wide">YÊU CẦU CỨU HỘ</span>
                            </button>
                        </div>
                    </div>

                    {/* Information Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Location Card */}
                        <div className="bg-[#1c2438] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-lg h-[92px]">
                            <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-[22px] h-[22px] text-[#854d0e]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-[13px] text-[#94a3b8] font-medium mb-0.5">Vị trí của bạn</p>
                                <p className="text-[16px] font-bold text-white leading-tight mb-1">Quận 1, TP.HCM</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 box-content border border-yellow-200/20"></div>
                                    <p className="text-[13px] text-[#94a3b8]">Mức độ rủi ro: <span className="text-[#cbd5e1] font-medium">Trung bình</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Battery Card */}
                        <div className="bg-[#1c2438] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-lg h-[92px]">
                            <div className={`w-12 h-12 ${batteryPercentage <= 20 && !isCharging ? 'bg-red-500' : 'bg-[#10b981]'} rounded-full flex items-center justify-center flex-shrink-0 text-white transition-colors`}>
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isCharging ? (
                                        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5H9l4-9v5h2l-4 9z" />
                                    ) : (
                                        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                                    )}
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-[13px] text-[#94a3b8] font-medium mb-0.5">Pin điện thoại</p>
                                <p className="text-[16px] font-bold text-white leading-tight mb-1">{batteryPercentage}%</p>
                                <p className="text-[13px] text-[#94a3b8]">
                                    {isCharging ? "Đang sạc pin" : (batteryPercentage <= 20 ? "Pin yếu" : "Đang sử dụng pin")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support Options Section */}
                    <div className="space-y-4">
                        <h3 className="text-[16px] font-bold text-white px-1">
                            Loại hỗ trợ cần thiết
                        </h3>
                        <div className="flex flex-row flex-nowrap gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {/* Evacuation Button */}
                            <button className="flex-1 min-w-[140px] bg-[#2f5ae6] hover:bg-[#254acc] rounded-[18px] p-5 flex flex-col items-center justify-center gap-2.5 shadow-lg shadow-blue-900/40 transition-all active:scale-95 group min-h-[110px]">
                                <div className="text-white group-hover:scale-110 transition-transform">
                                    <svg className="w-[30px] h-[30px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-white font-bold text-center">Cần sơ tán</span>
                            </button>

                            {/* Food Button */}
                            <button className="flex-1 min-w-[140px] bg-[#2f5ae6] hover:bg-[#254acc] rounded-[18px] p-5 flex flex-col items-center justify-center gap-2.5 shadow-lg shadow-blue-900/40 transition-all active:scale-95 group min-h-[110px]">
                                <div className="text-white group-hover:scale-110 transition-transform">
                                    <svg className="w-[30px] h-[30px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-white font-bold text-center">Cần lương thực</span>
                            </button>

                            {/* Medical Button */}
                            <button className="flex-1 min-w-[140px] bg-[#2f5ae6] hover:bg-[#254acc] rounded-[18px] p-5 flex flex-col items-center justify-center gap-2.5 shadow-lg shadow-blue-900/40 transition-all active:scale-95 group min-h-[110px]">
                                <div className="text-white group-hover:scale-110 transition-transform">
                                    <svg className="w-[30px] h-[30px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-white font-bold text-center">Cần y tế</span>
                            </button>
                        </div>
                    </div>

                    {/* Safety Guide Section */}
                    <div className="bg-[#1c2438] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg border border-white/5 cursor-pointer hover:bg-[#232d43] transition-colors mt-2 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-[46px] h-[46px] bg-[#36211c] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-[#fbbf24]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[15px] font-bold text-white mb-0.5">Hướng dẫn an toàn</p>
                                <p className="text-[13px] text-[#94a3b8]">Xem các mẹo quan trọng</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center px-1">
                            <svg
                                className="w-5 h-5 text-[#94a3b8]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Citizens;
