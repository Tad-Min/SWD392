import { useState, useEffect, useRef } from 'react';
import TaskBar from '../../components/TaskBar.jsx';
import { useBatteryStatus } from 'react-haiku';
import { useCreateRescueRequest } from '../../features/Rescue/hook/useRescueRequest.js';
import '../../css/index.css';

function Citizens() {
    const { level, isCharging } = useBatteryStatus();
    // Use fallback percentage if level is undefined or unavailable
    const batteryPercentage = level !== undefined ? Math.round(level * 1) : 78;

    const [location, setLocation] = useState('Đang lấy vị trí...');
    const [riskLevel, setRiskLevel] = useState('Đang cập nhật');
    const [riskColor, setRiskColor] = useState('gray');

    // SOS / Rescue Request state
    const { loading: sosLoading, error: sosError, createRescueRequest } = useCreateRescueRequest();
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [sosDescription, setSosDescription] = useState('');
    const [sosPeopleCount, setSosPeopleCount] = useState(1);
    const [sosRequestType, setSosRequestType] = useState(1);
    const [sosStatus, setSosStatus] = useState(null); // 'success' | 'error' | null
    const [sosMessage, setSosMessage] = useState('');
    const coordsRef = useRef(null); // store latest coords { latitude, longitude }

    // Urgency assessment questions
    const [hasVulnerable, setHasVulnerable] = useState(false);   // Q1: elderly/children/sick
    const [waterLevel, setWaterLevel] = useState(0);              // Q2: 0=knee, 1=floor1, 2=roof

    // Background animation and theme state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDarkMode, setIsDarkMode] = useState(true);

    // ── Calculate urgency score & level ──
    const urgencyScore = (hasVulnerable ? 1 : 0) + waterLevel + (sosPeopleCount > 5 ? 1 : 0);
    // Map score → UrgencyLevel ID matching DB: 1=Normal, 2=High, 3=Critical
    const urgencyLevel = urgencyScore >= 3 ? 3 : urgencyScore === 2 ? 2 : 1;
    const urgencyMeta = {
        1: { label: 'Cần hỗ trợ', color: 'bg-amber-500', textColor: 'text-amber-400', emoji: '🟠' },
        2: { label: 'Nguy hiểm', color: 'bg-red-500', textColor: 'text-red-400', emoji: '🔴' },
        3: { label: 'SOS khẩn cấp', color: 'bg-purple-600', textColor: 'text-purple-400', emoji: '🟣' },
    };

    useEffect(() => {
        // Track mouse movement for background effect
        const handleMouseMove = (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x: xOffset, y: yOffset });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Geocoding logics
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    coordsRef.current = { latitude, longitude };
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                        const data = await response.json();
                        const address = data.address;
                        const district = address.county || address.suburb || address.city_district || "";
                        const city = address.city || address.province || address.state || "";
                        const displayAddress = [district, city].filter(Boolean).join(', ');
                        setLocation(displayAddress || 'Không xác định được vị trí');
                        setRiskLevel('Trung bình');
                        setRiskColor('yellow');
                    } catch (error) {
                        console.error("Error fetching location details:", error);
                        setLocation('Lỗi khi lấy địa chỉ');
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocation('Không thể lấy vị trí');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocation('Trình duyệt không hỗ trợ định vị');
        }
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Auto-hide SOS toast after 4 seconds
    useEffect(() => {
        if (sosStatus) {
            const timer = setTimeout(() => {
                setSosStatus(null);
                setSosMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [sosStatus]);

    // Handle SOS button click – open confirmation modal
    const handleSOSClick = () => {
        setSosDescription('');
        setSosPeopleCount(1);
        setSosRequestType(1);
        setHasVulnerable(false);
        setWaterLevel(0);
        setShowSOSModal(true);
    };

    // Submit rescue request
    const handleSOSConfirm = async () => {
        try {
            const coords = coordsRef.current;
            const payload = {
                description: sosDescription || 'Yêu cầu cứu hộ khẩn cấp',
                requestType: sosRequestType,
                urgencyLevel: 1, // Mặc định mức độ cao
                peopleCount: sosPeopleCount,
                currentlocation: coords
                    ? {
                        type: 'Point',
                        coordinates: [coords.longitude, coords.latitude],
                    }
                    : {
                        type: 'Point',
                        coordinates: [106.7725, 10.9024],
                    },
                locationText: location,
            };

            console.log('SOS Payload:', JSON.stringify(payload, null, 2));
            await createRescueRequest(payload);

            setSosStatus('success');
            setSosMessage('Yêu cầu cứu hộ đã được gửi thành công!');
            setShowSOSModal(false);
        } catch (err) {
            console.error('SOS request failed:', err);
            setSosStatus('error');
            setSosMessage(sosError?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
        }
    };

    // Theme Variables
    const theme = {
        bg: isDarkMode ? 'bg-[#0f1525]' : 'bg-[#f0f4f8]',
        text: isDarkMode ? 'text-white' : 'text-slate-800',
        cardBg: isDarkMode
            ? 'bg-gradient-to-br from-[#1e253c]/80 to-[#1e253c]/10'
            : 'bg-gradient-to-br from-white/80 to-white/10',
        cardBorder: isDarkMode
            ? 'border-t-white/20 border-l-white/20 border-b-transparent border-r-transparent'
            : 'border-t-white/50 border-l-white/50 border-b-transparent border-r-transparent',
        glassEffect: 'backdrop-blur-[4px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]',
        buttonGlass: isDarkMode
            ? 'bg-gradient-to-br from-[#2f5ae6]/80 to-[#2f5ae6]/10 border-t-white/30 border-l-white/30 border-b-transparent border-r-transparent'
            : 'bg-gradient-to-br from-[#254acc]/80 to-[#254acc]/10 border-t-white/50 border-l-white/50 border-b-transparent border-r-transparent',
        textMuted: isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500',
        svgFill: isDarkMode ? 'text-[#080d18]' : 'text-blue-100',
    };

    // Shared input/select styles
    const inputCls = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors ${isDarkMode ? 'bg-[#151b2e] text-white border border-white/10 focus:border-blue-500' : 'bg-slate-100 text-slate-800 border border-slate-200 focus:border-blue-500'}`;
    const labelCls = `text-sm font-medium mb-1.5 block ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`;

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} relative overflow-hidden font-sans transition-colors duration-500`}>
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1d4ed8]/20 rounded-full blur-[120px] transition-transform duration-300 ease-out"
                    style={{ transform: `translate(calc(-50% + ${mousePos.x * 2}px), calc(-50% + ${mousePos.y * 2}px))` }}
                ></div>
                <div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1d4ed8]/15 rounded-full blur-[100px] transition-transform duration-300 ease-out"
                    style={{ transform: `translate(calc(25% + ${mousePos.x}px), calc(25% + ${mousePos.y}px))` }}
                ></div>
                <div
                    className="absolute bottom-0 w-full transition-transform duration-300 ease-out"
                    style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -0.5}px) scale(1.05)` }}
                >
                    <svg className={`w-full ${theme.svgFill} fill-current`} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,197.3C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

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

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="pt-4 px-4 sm:px-6">
                    <TaskBar isDarkMode={isDarkMode} />
                </div>

                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-5xl mx-auto w-full space-y-10">
                    {/* Top Section - Question and SOS Button */}
                    <div className="flex flex-col items-center space-y-1.5 mt-2">
                        {/* Small water drop icon */}
                        <div className="relative w-14 h-14 flex flex-col items-center justify-center mb-2">
                            <div className="absolute inset-0 bg-[#06b6d4] rounded-full blur-md opacity-20"></div>
                            <div className="relative w-16 h-16 bg-[#1c2638] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] z-10">
                                <svg className="w-[30px] h-[30px] text-[#22d3ee]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
                                    <path d="M9.5 16a3.5 3.5 0 003.5 1.5" fill="none" stroke="#1c2638" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <h2 className={`text-[32px] font-bold ${theme.text} text-center tracking-tight leading-tight transition-colors duration-500`}>
                            Bạn đang an toàn chứ?
                        </h2>

                        <p className={`text-[15px] ${theme.textMuted} text-center transition-colors duration-500`}>
                            Nhấn nút bên dưới nếu cần hỗ trợ khẩn cấp
                        </p>

                        {/* SOS Button Area */}
                        <div className="relative mt-12 mb-10 py-8 flex flex-col items-center justify-center w-full max-w-[320px] mx-auto group">
                            <div className="absolute w-[260px] h-[260px] bg-[#ef4444]/20 rounded-full flex items-center justify-center -z-10 shadow-[0_0_80px_rgba(239,68,68,0.4)] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] group-hover:scale-75 group-hover:animate-none transition-transform duration-500 ease-in-out"></div>
                            <div className="absolute w-[220px] h-[220px] bg-[#ef4444]/30 rounded-full flex items-center justify-center -z-10 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] group-hover:scale-90 transition-transform duration-500 ease-in-out"></div>

                            <button
                                onClick={handleSOSClick}
                                disabled={sosLoading}
                                className="relative w-40 h-40 bg-[#ef4444] rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.6)] hover:bg-red-500 active:scale-95 transition-all outline-none border-[3px] border-[#fb7185]/40 z-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {sosLoading ? (
                                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-10 h-10 text-white/90 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                    </svg>
                                )}
                                <span className="text-[38px] font-extrabold text-white tracking-widest leading-none drop-shadow-md">SOS</span>
                                <span className="text-[11px] font-bold text-white/90 mt-1.5 uppercase tracking-wide">YÊU CẦU CỨU HỘ</span>
                            </button>
                        </div>
                    </div>

                    {/* ═══════════ SOS Confirmation Modal ═══════════ */}
                    {showSOSModal && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
                            <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-[#1e253c] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Đánh giá tình huống khẩn cấp</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Trả lời các câu hỏi để hệ thống xác định mức độ</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* ── Q1: Vulnerable people ── */}
                                    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#151b2e]' : 'bg-slate-50'}`}>
                                        <p className={labelCls}>
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2">1</span>
                                            Có người già, trẻ em hoặc người bệnh không?
                                        </p>
                                        <div className="flex gap-3 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setHasVulnerable(false)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${!hasVulnerable
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                    : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                                    }`}
                                            >
                                                Không
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHasVulnerable(true)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${hasVulnerable
                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                                    : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                                    }`}
                                            >
                                                Có
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Q2: Water level ── */}
                                    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#151b2e]' : 'bg-slate-50'}`}>
                                        <p className={labelCls}>
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2">2</span>
                                            Mức nước hiện tại ở đâu?
                                        </p>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {[
                                                { value: 0, label: 'Đến đầu gối', icon: '🌊' },
                                                { value: 1, label: 'Đang ngập tầng 1', icon: '🏠' },
                                                { value: 2, label: 'Lên tới nóc nhà / Không còn chỗ đứng', icon: '🆘' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setWaterLevel(opt.value)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${waterLevel === opt.value
                                                        ? opt.value === 2
                                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                                            : opt.value === 1
                                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                                                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                                        }`}
                                                >
                                                    <span className="text-lg">{opt.icon}</span>
                                                    <span className="flex-1">{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Q3: People count ── */}
                                    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#151b2e]' : 'bg-slate-50'}`}>
                                        <p className={labelCls}>
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2">3</span>
                                            Số người cần hỗ trợ
                                        </p>
                                        <input
                                            type="number"
                                            min={1}
                                            value={sosPeopleCount}
                                            onChange={(e) => setSosPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                                            className={inputCls + ' mt-2'}
                                        />
                                    </div>

                                    {/* ── Description ── */}
                                    <div>
                                        <label className={labelCls}>Mô tả tình huống</label>
                                        <textarea
                                            value={sosDescription}
                                            onChange={(e) => setSosDescription(e.target.value)}
                                            placeholder="Ví dụ: Nước ngập cao, cần di tản gấp..."
                                            rows={2}
                                            className={inputCls + ' resize-none ' + (isDarkMode ? 'placeholder-slate-500' : 'placeholder-slate-400')}
                                        />
                                    </div>

                                    {/* ── Request Type ── */}
                                    <div>
                                        <label className={labelCls}>Loại hỗ trợ</label>
                                        <select
                                            value={sosRequestType}
                                            onChange={(e) => setSosRequestType(parseInt(e.target.value))}
                                            className={inputCls}
                                        >
                                            <option value={1}>Cứu hộ (Rescue)</option>
                                            <option value={2}>Cứu trợ (Relief)</option>
                                            <option value={3}>Cả hai (Both)</option>
                                        </select>
                                    </div>

                                    {/* ── Location preview ── */}
                                    <div className={`text-xs px-3 py-2 rounded-lg ${isDarkMode ? 'bg-[#151b2e] text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                        📍 Vị trí: <span className="font-medium">{location}</span>
                                    </div>

                                    {/* ── Buttons ── */}
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={() => setShowSOSModal(false)}
                                            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            onClick={handleSOSConfirm}
                                            disabled={sosLoading}
                                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {sosLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                `Gửi yêu cầu ${urgencyMeta[urgencyLevel].emoji}`
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SOS Toast Notification */}
                    {sosStatus && (
                        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[110] px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold transition-all animate-[slideDown_0.3s_ease-out] ${sosStatus === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}>
                            {sosStatus === 'success' ? (
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            {sosMessage}
                        </div>
                    )}

                    {/* Information Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Location Card */}
                        <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-5 flex items-center gap-4 min-h-[92px] transition-all duration-500 relative overflow-hidden`}>
                            <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex flex-shrink-0 items-center justify-center">
                                <svg className="w-[22px] h-[22px] text-[#854d0e]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center w-full min-w-0">
                                <p className={`text-[13px] ${theme.textMuted} font-medium mb-0.5 transition-colors`}>Vị trí của bạn</p>
                                <p className={`text-[16px] font-bold ${theme.text} leading-tight mb-1 break-words transition-colors`}>{location}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className={`w-2 h-2 rounded-full bg-${riskColor}-500 box-content border border-${riskColor}-200/20 flex-shrink-0`}></div>
                                    <p className={`text-[13px] ${theme.textMuted} transition-colors`}>Mức độ rủi ro: <span className={`${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-700'} font-medium`}>{riskLevel}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Battery Card */}
                        <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-5 flex items-center gap-4 min-h-[92px] transition-all duration-500 relative overflow-hidden`}>
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
                                <p className={`text-[13px] ${theme.textMuted} font-medium mb-0.5 transition-colors`}>Pin thiết bị</p>
                                <p className={`text-[16px] font-bold ${theme.text} leading-tight mb-1 transition-colors`}>{batteryPercentage}%</p>
                                <p className={`text-[13px] ${theme.textMuted} transition-colors`}>
                                    {isCharging ? "Đang sạc pin" : (batteryPercentage <= 20 ? "Pin yếu" : "Đang sử dụng pin")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support Options Section */}
                    <div className="space-y-4">
                        <h3 className={`text-[16px] font-bold ${theme.text} px-1 transition-colors duration-500`}>
                            Loại hỗ trợ cần thiết
                        </h3>
                        <div className="flex flex-row flex-nowrap gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {/* Evacuation Button */}
                            <button className={`flex-1 min-w-[140px] ${theme.buttonGlass} ${theme.glassEffect} border shadow-lg rounded-[18px] p-5 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 group min-h-[110px] c-button c-button--gooey relative overflow-hidden isolate`}>
                                <div className="text-white group-hover:scale-110 transition-transform relative z-10">
                                    <svg className="w-[30px] h-[30px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-white font-bold text-center relative z-10">Cần sơ tán</span>
                                <div className="c-button__blobs"><div></div><div></div><div></div></div>
                            </button>

                            {/* Food Button */}
                            <button className={`flex-1 min-w-[140px] ${theme.buttonGlass} ${theme.glassEffect} border shadow-lg rounded-[18px] p-5 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 group min-h-[110px] c-button c-button--gooey relative overflow-hidden isolate`}>
                                <div className="text-white group-hover:scale-110 transition-transform relative z-10">
                                    <svg className="w-[30px] h-[30px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-white font-bold text-center relative z-10">Cần lương thực</span>
                                <div className="c-button__blobs"><div></div><div></div><div></div></div>
                            </button>

                            {/* Medical Button */}
                            <button className={`flex-1 min-w-[140px] ${theme.buttonGlass} ${theme.glassEffect} border shadow-lg rounded-[18px] p-5 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 group min-h-[110px] c-button c-button--gooey relative overflow-hidden isolate`}>
                                <div className="text-white group-hover:scale-110 transition-transform relative z-10">
                                    <svg className="w-[30px] h-[30px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-white font-bold text-center relative z-10">Cần y tế</span>
                                <div className="c-button__blobs"><div></div><div></div><div></div></div>
                            </button>
                        </div>
                    </div>

                    {/* Safety Guide Section */}
                    <div className={`${theme.cardBg} border ${theme.cardBorder} ${theme.glassEffect} rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all mt-2 mb-8 relative overflow-hidden`}>
                        <div className="flex items-center gap-4">
                            <div className="w-[46px] h-[46px] bg-[#fef3c7] dark:bg-[#36211c] rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                                <svg
                                    className="w-6 h-6 text-[#fbbf24]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <p className={`text-[15px] font-bold ${theme.text} mb-0.5 transition-colors`}>Hướng dẫn an toàn</p>
                                <p className={`text-[13px] ${theme.textMuted} transition-colors`}>Xem các mẹo quan trọng</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center px-1">
                            <svg
                                className={`w-5 h-5 ${theme.textMuted} transition-colors`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Gooey Filter SVG */}
                    <svg style={{ display: 'none' }} version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="goo">
                                <feGaussianBlur result="blur" stdDeviation={10} in="SourceGraphic" />
                                <feColorMatrix result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" mode="matrix" in="blur" />
                                <feBlend in2="goo" in="SourceGraphic" />
                            </filter>
                        </defs>
                    </svg>

                </div>
            </div>
        </div>
    )
}

export default Citizens;
