import React, { useEffect, useState } from 'react';
import { useRescueRequestByUserId } from '../../features/Rescue/hook/useRescueRequest';
import TaskBar from '../../components/TaskBar';

function RescueHistory() {
    const { getRescueRequestByUserId, loading, error } = useRescueRequestByUserId();
    const [history, setHistory] = useState([]);
    const userId = localStorage.getItem('userId');
    const isDarkMode = true;

    useEffect(() => {
        if (userId) {
            getRescueRequestByUserId(userId)
                .then(data => {
                    const records = data?.data?.data || data?.data || data || [];
                    setHistory(Array.isArray(records) ? records : []);
                })
                .catch(err => console.error(err));
        }
    }, [userId]);

    const theme = {
        bg: isDarkMode ? 'bg-[#0f1525]' : 'bg-[#f0f4f8]',
        text: isDarkMode ? 'text-white' : 'text-slate-800',
        cardBg: isDarkMode ? 'bg-[#1e253c]/80' : 'bg-white',
        border: isDarkMode ? 'border-white/10' : 'border-slate-200',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        tableHeader: isDarkMode ? 'bg-[#151b2e]' : 'bg-slate-100',
        tableRow: isDarkMode ? 'hover:bg-white/5 border-white/5' : 'hover:bg-slate-50 border-slate-100'
    };

    const urgencyMeta = {
        1: { label: 'Cần hỗ trợ', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        2: { label: 'Nguy hiểm', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        3: { label: 'SOS khẩn cấp', color: 'bg-purple-600/20 text-purple-400 border-purple-500/30' }
    };

    const statusMap = {
        'New': { label: 'Mới', class: 'bg-blue-500/20 text-blue-400' },
        'Assigned': { label: 'Đã phân công', class: 'bg-yellow-500/20 text-yellow-400' },
        'In Progress': { label: 'Đang xử lý', class: 'bg-cyan-500/20 text-cyan-400' },
        'Resolved': { label: 'Đã giải quyết', class: 'bg-green-500/20 text-green-400' },
        'Completed': { label: 'Hoàn thành', class: 'bg-green-600/20 text-green-500' },
        'Cancelled': { label: 'Đã hủy', class: 'bg-red-500/20 text-red-400' }
    };

    const getVal = (obj, keys, defaultVal = '') => {
        for (let k of keys) {
            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
        }
        return defaultVal;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} relative overflow-hidden font-sans transition-colors duration-500`}>
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="pt-4 px-4 sm:px-6">
                    <TaskBar isDarkMode={isDarkMode} />
                </div>

                <div className="flex-1 px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full mt-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className={`text-3xl font-bold ${theme.text}`}>Lịch sử cứu hộ</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
                            Không thể tải lịch sử cứu hộ.
                        </div>
                    ) : (
                        <div className={`${theme.cardBg} border ${theme.border} rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className={`${theme.tableHeader} border-b ${theme.border}`}>
                                            <th className="p-4 font-semibold text-sm">Người yêu cầu</th>
                                            <th className="p-4 font-semibold text-sm">Mức độ</th>
                                            <th className="p-4 font-semibold text-sm">Trạng thái</th>
                                            <th className="p-4 font-semibold text-sm text-center">Số người</th>
                                            <th className="p-4 font-semibold text-sm">Vị trí</th>
                                            <th className="p-4 font-semibold text-sm">Mô tả</th>
                                            <th className="p-4 font-semibold text-sm">Thời gian</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="p-8 text-center text-slate-400">
                                                    Chưa có lịch sử cứu hộ nào.
                                                </td>
                                            </tr>
                                        ) : (
                                            history.map((req, idx) => {
                                                const fullName = getVal(req, ['fullName', 'FullName', 'userName', 'UserName', 'requesterName']) || req?.user?.fullName || req?.User?.FullName || 'Chưa rõ';
                                                const urgency = getVal(req, ['urgencyLevel', 'UrgencyLevel'], 1);
                                                const status = getVal(req, ['status', 'Status'], 'New');
                                                const peopleCount = getVal(req, ['peopleCount', 'PeopleCount'], 1);
                                                const locationText = getVal(req, ['locationText', 'LocationText', 'location', 'Location'], 'Không có');
                                                const description = getVal(req, ['description', 'Description'], 'Không có mô tả');
                                                const createdAt = getVal(req, ['createdAt', 'CreatedAt', 'created_at']);

                                                const urgInfo = urgencyMeta[urgency] || urgencyMeta[1];
                                                const statusInfo = statusMap[status] || { label: status, class: 'bg-gray-500/20 text-gray-400' };

                                                return (
                                                    <tr key={req.id || req.Id || idx} className={`border-b border-white/5 transition-colors ${theme.tableRow}`}>
                                                        <td className="p-4 text-sm font-medium">{fullName}</td>
                                                        <td className="p-4 text-sm">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${urgInfo.color}`}>
                                                                {urgInfo.label}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm">
                                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusInfo.class}`}>
                                                                {statusInfo.label}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm text-center font-bold">{peopleCount}</td>
                                                        <td className="p-4 text-sm max-w-[200px] truncate" title={locationText}>{locationText}</td>
                                                        <td className="p-4 text-sm max-w-[250px] truncate text-slate-300" title={description}>{description}</td>
                                                        <td className="p-4 text-sm whitespace-nowrap text-slate-400">
                                                            {formatDate(createdAt)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RescueHistory;
