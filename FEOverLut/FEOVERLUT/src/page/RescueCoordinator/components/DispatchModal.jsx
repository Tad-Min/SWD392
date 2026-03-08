import { useState, useEffect } from 'react';
import { X, Send, MapPin, AlertTriangle, Users } from 'lucide-react';
import { getRescueRequestTypesApi } from '../../../features/system_config/api/systemConfigApi';

export default function DispatchModal({
    request,
    teams = [],
    onClose,
    onConfirm,
    loading = false,
}) {
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [note, setNote] = useState('');
    const [typeLabels, setTypeLabels] = useState({});

    // Fetch request types from API
    useEffect(() => {
        (async () => {
            try {
                const res = await getRescueRequestTypesApi();
                const data = res?.data ?? res;
                if (Array.isArray(data)) {
                    const map = {};
                    data.forEach((t) => {
                        const id = t.id ?? t.rescueRequestTypeId ?? t.typeId;
                        const name = t.typeName ?? t.name ?? t.label;
                        if (id != null && name) map[id] = name;
                    });
                    setTypeLabels(map);
                }
            } catch (err) {
                console.error('Failed to fetch request types:', err);
            }
        })();
    }, []);

    if (!request) return null;

    const availableTeams = teams.filter(
        (t) => t.status === 'Available' || t.status === 'Sẵn sàng'
    );

    const handleSubmit = () => {
        if (!selectedTeamId) return;
        onConfirm?.({
            rescueRequestId: request.id ?? request.rescueRequestId,
            rescueTeamId: selectedTeamId,
            note,
        });
    };

    const requestTypeLabel = typeLabels[request.requestType] || `Loại ${request.requestType}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Send className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-base font-bold text-white">Điều phối cứu hộ</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Request info */}
                <div className="px-5 py-4 space-y-3">
                    <div className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-semibold text-white">
                                {request.citizenName || 'Người dân'}
                            </span>
                            <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                                {requestTypeLabel}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Users className="w-3.5 h-3.5" />
                            <span>{request.peopleCount ?? 1} người cần hỗ trợ</span>
                        </div>
                        {request.locationText && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{request.locationText}</span>
                            </div>
                        )}
                        {request.description && (
                            <p className="text-xs text-slate-400 italic">&ldquo;{request.description}&rdquo;</p>
                        )}
                    </div>

                    {/* Team select */}
                    <div>
                        <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                            Chọn đội cứu hộ
                        </label>
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-slate-800/80 text-white border border-white/10 focus:border-blue-500 transition-colors"
                        >
                            <option value="">-- Chọn đội --</option>
                            {availableTeams.map((team) => (
                                <option key={team.id ?? team.rescueTeamId} value={team.id ?? team.rescueTeamId}>
                                    {team.teamName || team.name}
                                </option>
                            ))}
                        </select>
                        {availableTeams.length === 0 && (
                            <p className="text-[11px] text-amber-400 mt-1">
                                Không có đội nào đang sẵn sàng
                            </p>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                            Ghi chú (tuỳ chọn)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Thêm hướng dẫn cho đội cứu hộ..."
                            rows={2}
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none bg-slate-800/80 text-white placeholder-slate-500 border border-white/10 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 py-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedTeamId || loading}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Xác nhận điều phối
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
