import { useState } from 'react';
import { AlertTriangle, Clock, UserCheck } from 'lucide-react';

const urgencyMeta = {
    1: { label: 'Cần hỗ trợ', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    2: { label: 'Nguy hiểm', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    3: { label: 'Khẩn cấp', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

function timeAgo(dateStr) {
    if (!dateStr) return '';
    // Ensure the date is interpreted as UTC if it lacks timezone info (e.g. from .NET)
    const normalizedDate = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`;
    const diff = Date.now() - new Date(normalizedDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    return `${Math.floor(hrs / 24)} ngày trước`;
}

export default function QueuePanel({ requests = [], userMap = {}, onDispatch }) {

    return (
        <div className="absolute bottom-4 left-4 z-10 right-[22rem]">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h3 className="text-sm font-bold text-white">Hàng chờ cứu hộ</h3>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
                        {requests.length} yêu cầu
                    </span>
                </div>

                {/* Scrollable row */}
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    {requests.length === 0 && (
                        <p className="text-xs text-slate-500 py-3 w-full text-center">
                            Không có yêu cầu nào trong hàng chờ
                        </p>
                    )}
                    {requests.map((req) => {
                        const urgency = urgencyMeta[req.urgencyLevel] || { label: 'Không rõ', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
                        return (
                            <div
                                key={req.id ?? req.rescueRequestId}
                                className="flex-shrink-0 w-56 bg-slate-800/50 hover:bg-slate-800/80 border border-white/5 rounded-xl p-3 transition-colors group"
                            >
                                {/* Top: name + badge */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white truncate max-w-[110px]">
                                        {userMap[req.userReqId] || req.citizenName || 'Người dân'}
                                    </span>
                                    <span
                                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${urgency.color}`}
                                    >
                                        {urgency.label}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="space-y-1 mb-2.5">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                        <UserCheck className="w-3 h-3" />
                                        <span>{req.peopleCount ?? 1} người</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span>{timeAgo(req.createdAt || req.createdDate)}</span>
                                    </div>
                                </div>

                                {/* Dispatch button */}
                                <button
                                    onClick={() => onDispatch?.(req)}
                                    className="w-full py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                    Điều phối
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
