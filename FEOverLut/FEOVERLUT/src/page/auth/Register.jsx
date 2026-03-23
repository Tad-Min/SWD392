import { useState, useEffect } from 'react';
import { useRegister } from '../../features/auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register, isLoading, error } = useRegister();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, phone, name, password, confirmPassword);
            navigate('/');
            toast.success('Đăng ký thành công');
        } catch (error) {
            toast.error("Số điện thoại, mật khẩu hoặc email đã tồn tại");
            console.log(error);
        }
    };

    // Background animation and theme state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Track mouse movement for background effect
        const handleMouseMove = (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x: xOffset, y: yOffset });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Theme Variables
    const theme = {
        bg: isDarkMode ? 'bg-[#0A1128]' : 'bg-[#f8fafc]',
        cardBg: isDarkMode ? 'bg-[#1E293B]' : 'bg-white',
        border: isDarkMode ? 'border-slate-700/50' : 'border-slate-200',
        text: isDarkMode ? 'text-white' : 'text-slate-800',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        inputBg: isDarkMode ? 'bg-[#0F172A]' : 'bg-slate-50',
        inputBorder: isDarkMode ? 'border-slate-700/80' : 'border-slate-300',
        inputText: isDarkMode ? 'text-slate-200' : 'text-slate-900',
        separatorBg: isDarkMode ? 'bg-[#1E293B]' : 'bg-white',
        svgFill: isDarkMode ? 'text-[#080d18]' : 'text-blue-100/50',
        glowStart: isDarkMode ? 'from-blue-900/30' : 'from-blue-200/50',
        glowEnd: isDarkMode ? 'to-[#0A1128]' : 'to-transparent',
    };

    return (
        <div className={`min-h-screen ${theme.bg} bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${theme.glowStart} via-transparent ${theme.glowEnd} flex items-center justify-center px-4 py-8 relative overflow-hidden transition-colors duration-500`}>
            {/* Ambient Background Glow and Wave Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {/* Radial glow center */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] transition-transform duration-300 ease-out"
                    style={{ transform: `translate(calc(-50% + ${mousePos.x * 2}px), calc(-50% + ${mousePos.y * 2}px))` }}
                ></div>

                {/* Wavy bottom SVG with mouse tracking parallax */}
                <div
                    className="absolute bottom-0 w-full transition-transform duration-300 ease-out"
                    style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -0.5}px) scale(1.05)` }}
                >
                    <svg className={`w-full ${theme.svgFill} fill-current transition-colors duration-500`} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,197.3C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Dark/Light Mode Toggle - Bottom Right */}
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

            {/* Main Card */}
            <div className={`w-full max-w-[420px] ${theme.cardBg} rounded-2xl ${isDarkMode ? 'shadow-[0_8px_30px_rgb(0,0,0,0.5)]' : 'shadow-xl'} border ${theme.border} p-8 relative z-10 my-4 sm:my-8 max-h-[90vh] overflow-y-auto scrollbar-hide transition-colors duration-500`}>
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-40 rounded-full"></div>
                        <div className="relative w-16 h-16 bg-[#0F172A] border border-slate-700 rounded-full flex items-center justify-center shadow-inner">
                            <svg
                                className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h1 className={`text-2xl font-bold ${theme.text} mb-2 tracking-wide text-center transition-colors duration-500`}>
                    Đăng ký tài khoản
                </h1>
                <p className={`text-xs ${theme.textMuted} text-center transition-colors duration-500`}>
                    Tham gia Hệ thống OverLut
                </p>

                {/* Form Section */}
                <div className="space-y-4">
                    <form onSubmit={handleSubmit}>
                        {error && <p className="bg-red-500 text-white p-2 mt-2 rounded-lg text-sm">{error}</p>}
                        {/* Full Name Field */}
                        <div>
                            <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5 transition-colors duration-500`}>
                                Họ và tên
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-[18px] h-[18px] text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg text-sm ${theme.inputText} placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-500`}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5 transition-colors duration-500`}>
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-[18px] h-[18px] text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg text-sm ${theme.inputText} placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-500`}
                                    placeholder="0912 345 678"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5 transition-colors duration-500`}>
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-[18px] h-[18px] text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg text-sm ${theme.inputText} placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-500`}
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5 transition-colors duration-500`}>
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-[18px] h-[18px] text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg text-sm ${theme.inputText} placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tracking-widest duration-500`}
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5 transition-colors duration-500`}>
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-[18px] h-[18px] text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg text-sm ${theme.inputText} placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tracking-widest duration-500`}
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        {/* Register Button */}
                        <button type='submit' disabled={isLoading} className="w-full bg-[#3B82F6] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 mt-4">
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>

                        {/* Separator */}
                        <div className="relative pt-4 pb-2">
                            <div className="absolute inset-0 flex items-center pt-2">
                                <div className={`w-full border-t ${theme.border} transition-colors duration-500`}></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-semibold">
                                <span className={`px-3 ${theme.separatorBg} ${theme.textMuted} rounded-full tracking-wider border ${theme.inputBorder} py-0.5 transition-colors duration-500`}>HOẶC</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-2">
                            <span className={`text-xs ${theme.textMuted} font-medium transition-colors duration-500`}>
                                Đã có tài khoản?{' '}
                            </span>
                            <a href="/" className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors">
                                Đăng nhập
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-4 sm:bottom-6 left-0 z-10 w-full pointer-events-none">
                <p className={`text-[10px] ${theme.textMuted} font-medium text-center transition-colors duration-500`}>
                    © 2024 FloodGuard System. Bảo mật và an toàn.
                </p>
            </div>
        </div>
    );
}

export default Register;
