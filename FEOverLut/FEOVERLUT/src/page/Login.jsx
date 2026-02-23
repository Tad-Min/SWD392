import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('canbo@cuuho.gov.vn');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8 relative">
            {/* Dark Mode Toggle - Bottom Right */}
            <button className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <svg 
                    className="w-5 h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                    />
                </svg>
            </button>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg 
                            className="w-10 h-10 text-blue-600" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        FloodGuard
                    </h1>
                    <p className="text-sm text-gray-500 text-center">
                        Hệ thống Điều phối Cứu trợ Lũ lụt
                    </p>
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                    />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="canbo@cuuho.gov.vn"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                                Quên mật khẩu?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                        Đăng nhập
                    </button>

                    {/* Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc</span>
                        </div>
                    </div>

                    {/* Registration Link */}
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                        </span>
                        <a href="/Register" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Đăng ký cứu trợ
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-xs text-gray-400 text-center">
                    © 2024 FloodGuard System. Bảo mật và an toàn.
                </p>
            </div>
        </div>
    );
}

export default Login;
