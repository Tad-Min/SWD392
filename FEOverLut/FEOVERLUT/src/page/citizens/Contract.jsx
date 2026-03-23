import { useState, useEffect } from 'react';
import TaskBar from '../../components/TaskBar.jsx';
import ScrollExpandMedia from '../../components/ui/ScrollExpandMedia.jsx';
import heroVideo from '../../assets/Tạo_Video_Logo_Cứu_Hộ (online-video-cutter.com).mp4';
import bgImage from '../../assets/w-ngap-lu8-1-603-921.jpg';

function Contract() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const theme = {
        bg: isDarkMode ? 'bg-[#0f1525]' : 'bg-[#f0f4f8]',
        text: isDarkMode ? 'text-white' : 'text-slate-800',
        textMuted: isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500',
        cardBg: isDarkMode
            ? 'bg-gradient-to-br from-[#1e253c]/80 to-[#1e253c]/10'
            : 'bg-gradient-to-br from-white/80 to-white/10',
        cardBorder: isDarkMode
            ? 'border-t-white/20 border-l-white/20 border-b-transparent border-r-transparent'
            : 'border-t-white/50 border-l-white/50 border-b-transparent border-r-transparent',
        glassEffect: 'backdrop-blur-[4px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]',
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} relative overflow-hidden font-sans transition-colors duration-500`}>
            {/* Dark/Light Mode Toggle */}
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors flex items-center justify-center z-50 backdrop-blur-md"
            >
                {isDarkMode ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>

            {/* TaskBar */}
            <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6">
                <TaskBar isDarkMode={isDarkMode} />
            </div>

            {/* Scroll Expansion Hero */}
            <ScrollExpandMedia
                mediaType="video"
                mediaSrc={heroVideo}
                bgImageSrc={bgImage}
                title="Cam Kết Cứu Hộ"
                date="Hợp Đồng Cứu Trợ"
                scrollToExpand="↓ Cuộn để xem chi tiết ↓"
                textBlend
            >
                {/* Contract Content after scroll expansion */}
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Section 1: Mission */}
                    <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-6 md:p-8`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                                </svg>
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>Sứ Mệnh Của Chúng Tôi</h2>
                        </div>
                        <p className={`text-base md:text-lg leading-relaxed ${theme.textMuted}`}>
                            Hệ thống Cứu Hộ Lũ Lụt được xây dựng với sứ mệnh bảo vệ tính mạng và tài sản của người dân trong các tình huống thiên tai.
                            Chúng tôi cam kết cung cấp dịch vụ cứu hộ nhanh chóng, hiệu quả và an toàn nhất có thể, sử dụng công nghệ hiện đại
                            để kết nối người cần trợ giúp với đội ngũ cứu hộ chuyên nghiệp.
                        </p>
                    </div>

                    {/* Section 2: Commitments */}
                    <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-6 md:p-8`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>Cam Kết An Toàn</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    icon: '⚡',
                                    title: 'Phản hồi nhanh chóng',
                                    desc: 'Tiếp nhận và xử lý yêu cầu cứu hộ trong thời gian ngắn nhất.'
                                },
                                {
                                    icon: '🛡️',
                                    title: 'An toàn tuyệt đối',
                                    desc: 'Đội ngũ cứu hộ được huấn luyện chuyên nghiệp, trang bị đầy đủ.'
                                },
                                {
                                    icon: '📍',
                                    title: 'Định vị chính xác',
                                    desc: 'Công nghệ GPS tiên tiến giúp xác định vị trí nhanh và chính xác.'
                                },
                                {
                                    icon: '🤝',
                                    title: 'Hỗ trợ toàn diện',
                                    desc: 'Từ cứu hộ khẩn cấp đến hỗ trợ lương thực và y tế sau thiên tai.'
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`rounded-xl p-4 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                                        <div>
                                            <h3 className={`font-bold text-sm mb-1 ${theme.text}`}>{item.title}</h3>
                                            <p className={`text-sm ${theme.textMuted}`}>{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Terms */}
                    <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-6 md:p-8`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>Điều Khoản Sử Dụng</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                'Người dùng cam kết cung cấp thông tin chính xác khi gửi yêu cầu cứu hộ.',
                                'Hệ thống không chịu trách nhiệm đối với các yêu cầu giả mạo hoặc thông tin sai lệch.',
                                'Dữ liệu cá nhân được bảo mật theo quy định pháp luật hiện hành.',
                                'Đội ngũ cứu hộ sẽ ưu tiên xử lý theo mức độ khẩn cấp của tình huống.',
                                'Người dùng cần tuân thủ hướng dẫn từ đội cứu hộ trong quá trình ứng cứu.',
                            ].map((term, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                                        <span className="text-white text-xs font-bold">{i + 1}</span>
                                    </div>
                                    <p className={`text-sm md:text-base ${theme.textMuted} leading-relaxed`}>{term}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Contact */}
                    <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-6 md:p-8 mb-12`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>Liên Hệ Hỗ Trợ</h2>
                        </div>
                        <p className={`text-base md:text-lg leading-relaxed ${theme.textMuted} mb-4`}>
                            Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về dịch vụ cứu hộ, vui lòng liên hệ với chúng tôi qua các kênh sau:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: '📞', label: 'Hotline', value: '1900-XXXX' },
                                { icon: '📧', label: 'Email', value: 'overlut@cuuho.vn' },
                                { icon: '🕐', label: 'Hoạt động', value: '24/7' },
                            ].map((info, i) => (
                                <div
                                    key={i}
                                    className={`text-center rounded-xl p-4 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}
                                >
                                    <span className="text-3xl block mb-2">{info.icon}</span>
                                    <p className={`text-xs ${theme.textMuted} mb-1`}>{info.label}</p>
                                    <p className={`text-sm font-bold ${theme.text}`}>{info.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollExpandMedia>
        </div>
    );
}

export default Contract;
