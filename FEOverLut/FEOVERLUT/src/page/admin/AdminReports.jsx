import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// --- MOCK DATA FOR REPORTS ---
const mockReportTypes = [
    { id: 'mission', title: 'Báo cáo Nhiệm Vụ', desc: 'Thống kê số lượng, trạng thái và hiệu quả cứu hộ', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'inventory', title: 'Báo cáo Kho Hàng', desc: 'Kiểm kê vật tư y tế, thực phẩm và tỷ lệ hao hụt', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'personnel', title: 'Báo cáo Nhân sự', desc: 'Đánh giá thời gian làm việc và hiệu suất đội', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
    { id: 'incident', title: 'Báo cáo Sự cố', desc: 'Biên bản tai nạn, hỏng hóc thiết bị, rủi ro an ninh', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500', bg: 'bg-red-500/10' },
];

const mockRecentReports = [
    { id: 1, title: 'Báo cáo tổng kết tuần 12 - Nhiệm vụ cứu hộ', type: 'Nhóm', generatedBy: 'Admin User', date: '10:30 AM, Hôm nay', format: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Bảng kê chi tiết xuất kho vật tư y tế tháng 3', type: 'Tài chính', generatedBy: 'Hệ thống tự động', date: '08:00 AM, Hôm nay', format: 'Excel', size: '1.1 MB' },
    { id: 3, title: 'Báo cáo thiệt hại thiết bị bay không người lái', type: 'Cá nhân', generatedBy: 'Nguyễn Văn A', date: 'Hôm qua', format: 'PDF', size: '850 KB' },
    { id: 4, title: 'Đánh giá năng lực đội cứu hộ bộ số 2', type: 'Nhóm', generatedBy: 'Trần Thị B', date: '21/03/2026', format: 'Docx', size: '3.5 MB' },
];

const AdminReports = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('mission');
    const [dateRange, setDateRange] = useState('month');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2500); // Simulate generation
    };

    const getFormatIcon = (format) => {
        if (format === 'PDF') return <span className="text-red-500 font-bold text-xs bg-red-500/10 px-2 py-1 rounded">PDF</span>;
        if (format === 'Excel') return <span className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">XLSX</span>;
        return <span className="text-blue-500 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded">DOCX</span>;
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className={`text-sm ${theme.textMuted} font-medium animate-pulse`}>Chuẩn bị dữ liệu báo cáo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Trích Xuất & Báo Cáo</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Tạo báo cáo phân tích đa chiều cho cấp trên hoặc đánh giá hiệu suất của hoạt động cứu trợ.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Report Builder Form */}
                <div className={`lg:col-span-2 space-y-6 flex flex-col`}>

                    {/* Select Report Type Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {mockReportTypes.map(type => (
                            <div
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`
                                    cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden
                                    ${selectedType === type.id
                                        ? `border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] ${isDarkMode ? 'bg-cyan-900/10' : 'bg-cyan-50'}`
                                        : `${theme.border} ${theme.cardBg} ${theme.glassEffect} hover:border-slate-400/50`
                                    }
                                `}
                            >
                                {/* Checkmark for selected */}
                                {selectedType === type.id && (
                                    <div className="absolute top-4 right-4 text-cyan-500">
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${type.bg} ${type.color}`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} /></svg>
                                </div>
                                <h3 className={`font-bold text-lg mb-1 ${theme.text}`}>{type.title}</h3>
                                <p className={`text-[13px] ${theme.textMuted}`}>{type.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Report Configuration & Actions */}
                    <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-6 shadow-sm`}>
                        <h3 className={`font-bold text-lg mb-4 ${theme.text}`}>Cấu hình trích xuất</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>Thời gian (Date Range)</label>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-black/5 dark:bg-slate-800 rounded-xl">
                                    <button
                                        onClick={() => setDateRange('week')}
                                        className={`py-2 text-sm font-semibold rounded-lg transition-all ${dateRange === 'week' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-cyan-400' : theme.textMuted}`}
                                    >Tuần này</button>
                                    <button
                                        onClick={() => setDateRange('month')}
                                        className={`py-2 text-sm font-semibold rounded-lg transition-all ${dateRange === 'month' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-cyan-400' : theme.textMuted}`}
                                    >Tháng này</button>
                                    <button
                                        onClick={() => setDateRange('custom')}
                                        className={`py-2 text-sm font-semibold rounded-lg transition-all ${dateRange === 'custom' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-cyan-400' : theme.textMuted}`}
                                    >Tùy chọn</button>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-[13px] font-semibold ${theme.text} mb-2`}>Định dạng File (Export format)</label>
                                <select className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-semibold ${theme.text}`}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                >
                                    <option>PDF Document (.pdf) - Chuẩn báo cáo</option>
                                    <option>Excel Spreadsheet (.xlsx) - Data thô</option>
                                    <option>Word Document (.docx) - Để chỉnh sửa</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                            <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm border ${theme.border} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                                Đặt lại thiết lập
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all
                                    ${isGenerating ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 active:scale-95'}
                                `}
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Đang tổng hợp...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Tạo Báo Cáo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Generated Reports */}
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl flex flex-col overflow-hidden h-fit mb-6 lg:mb-0`}>
                    <div className={`p-5 border-b ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                        <h3 className={`font-bold text-lg ${theme.text}`}>Tài liệu được tạo gần đây</h3>
                        <svg className={`w-5 h-5 ${theme.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[480px] p-2 custom-scrollbar">
                        {mockRecentReports.map(report => (
                            <div key={report.id} className={`p-4 rounded-xl hover:${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100/50'} transition-colors cursor-pointer group flex items-start gap-4 mb-1`}>
                                <div className="mt-1 flex-shrink-0">
                                    {getFormatIcon(report.format)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-semibold truncate ${theme.text} group-hover:text-blue-500 transition-colors`}>{report.title}</h4>
                                    <div className={`flex items-center gap-2 mt-1.5 text-[12px] font-medium ${theme.textMuted}`}>
                                        <span>{report.generatedBy}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                        <span>{report.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 dark:bg-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">{report.size}</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className={`p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-blue-400 tooltip-trigger`}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes fadeInUp {
                from {opacity: 0; transform: translateY(10px); }
            to {opacity: 1; transform: translateY(0); }
                }
            .animate-fade-in-up {
                animation: fadeInUp 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default AdminReports;
