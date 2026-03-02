import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('canbo@cuuho.gov.vn');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen bg-[#0A1128] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0A1128] to-[#0A1128] flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Dark/Light Mode Toggle - Bottom Right */}
            <button className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center justify-center z-10 shadow-lg">
                <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            </button>

            {/* Main Card */}
            <div className="w-full max-w-[420px] bg-[#1E293B] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 p-8 relative z-10">
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
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
                        OverLut
                    </h1>
                    <p className="text-xs text-slate-400 text-center">
                        Hệ thống Điều phối Cứu trợ Lũ lụt
                    </p>
                </div>

                {/* Form Section */}
                <div className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="canbo@cuuho.gov.vn"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-slate-300">
                                Mật khẩu
                            </label>
                            <a href="#" className="text-xs font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>
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
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tracking-widest"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button className="w-full bg-[#3B82F6] text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 mt-2">
                        Đăng nhập
                    </button>

                    {/* Separator */}
                    <div className="relative pt-4 pb-2">
                        <div className="absolute inset-0 flex items-center pt-2">
                            <div className="w-full border-t border-slate-700/80"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-semibold">
                            <span className="px-3 bg-[#1E293B] text-slate-500 rounded-full tracking-wider border border-slate-700/80 py-0.5">HOẶC</span>
                        </div>
                    </div>

                    {/* Registration Link */}
                    <div className="text-center pt-2">
                        <span className="text-xs text-slate-400 font-medium">
                            Chưa có tài khoản?{' '}
                        </span>
                        <a href="/Register" className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors">
                            Đăng ký cứu trợ
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-full">
                <p className="text-[10px] text-slate-500 font-medium text-center">
                    © 2024 FloodGuard System. Bảo mật và an toàn.
                </p>
            </div>
        </div>
    );
}

export default Login;
