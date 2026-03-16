import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, Send, PenTool, CheckCircle, XCircle, ArrowLeft, Users, AlertTriangle, Info } from 'lucide-react';
import { useRescueRequestById } from '../../../features/Rescue/hook/useRescueRequest';
import { getRescueRequestTypesApi } from '../../../features/system_config/api/systemConfigApi';
import MissionMap from './MissionMap';

const MissionDetail = ({ mission, onBack, teamIdLabel, theme }) => {
    const { loading: requestLoading, getRescueRequestById } = useRescueRequestById();
    const [requestData, setRequestData] = useState(null);
    const [requestTypes, setRequestTypes] = useState({});
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (mission?.rescueRequestId) {
                const reqData = await getRescueRequestById(mission.rescueRequestId);
                if (reqData && reqData.data) {
                    setRequestData(reqData.data);
                } else if (reqData) {
                    setRequestData(reqData);
                }
            }

            try {
                const types = await getRescueRequestTypesApi();
                let typeArray = types?.data || types;
                if (Array.isArray(typeArray)) {
                    const map = {};
                    typeArray.forEach(t => {
                        const id = t.id ?? t.rescueRequestTypeId ?? t.typeId;
                        map[id] = t.name ?? t.requestTypeName ?? t.typeName;
                    });
                    setRequestTypes(map);
                }
            } catch (err) {
                console.error("Failed to fetch request types", err);
            }
        };
        fetchDetails();
    }, [mission]);

    const getUrgencyLabel = (level) => {
        switch (level) {
            case 3: return { label: 'KHẨN CẤP CAO', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
            case 2: return { label: 'NGUY HIỂM', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
            case 1:
            default: return { label: 'CẦN HỖ TRỢ', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
        }
    };

    const urgencyInfo = getUrgencyLabel(requestData?.urgencyLevel ?? mission?.priorityLv ?? 1);
    const requestTypeLabel = requestTypes[requestData?.requestType] || 'Cứu hộ';

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-blue-500 font-bold text-xs tracking-wider mb-1 uppercase">
                        {teamIdLabel || 'Mã đội: RT-ALPHA-01'}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-lg transition-colors ${theme?.iconHover || 'hover:bg-slate-700/50'} ${theme?.textMuted || 'text-slate-300'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className={`text-3xl font-extrabold ${theme?.textTitle || 'text-white'} tracking-tight`}>Nhiệm Vụ Cứu Hộ Của Tôi</h1>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wide">Trực Tuyến</span>
                </div>
            </div>

            <h2 className={`text-lg font-bold ${theme?.text || 'text-slate-200'} mb-4`}>Thông tin nhiệm vụ</h2>

            {/* Main Info Card */}
            <div className={`${theme?.cardBg || 'bg-[#121A22]'} border ${theme?.border || 'border-slate-800/80'} rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row mb-8`}>

                {/* Left Side: Real-time Map */}
                <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-slate-800 relative z-0">
                    <MissionMap
                        requestData={requestData}
                        isNavigating={isNavigating}
                        setIsNavigating={setIsNavigating}
                    />

                    {/* Direction Button Overlay */}
                    <button
                        onClick={() => setIsNavigating(!isNavigating)}
                        className={`absolute bottom-4 right-4 ${isNavigating ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition-colors z-[1000]`}
                    >
                        {isNavigating ? <XCircle size={18} /> : <Navigation size={18} />}
                        {isNavigating ? 'Dừng Chỉ Đường' : 'Chỉ Đường'}
                    </button>
                </div>

                {/* Right Side: Mission Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`${urgencyInfo.color} border px-3 py-1 rounded-md text-xs font-bold tracking-wider`}>
                            {urgencyInfo.label}
                        </span>
                        <span className="text-slate-500 text-sm font-semibold tracking-wider">
                            #{mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId || 'N/A'}
                        </span>
                    </div>

                    <h3 className={`text-2xl font-bold ${theme?.textTitle || 'text-white'} mb-2`}>
                        {mission.name || mission.title || `Nhiệm vụ #${mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId}`}
                    </h3>

                    <div className="flex flex-col gap-2 mb-4">
                        <div className={`flex items-center gap-2 ${theme?.text || 'text-slate-300'} text-sm font-medium`}>
                            <Info size={16} className="text-blue-500" />
                            <span>Loại yêu cầu: <span className="font-bold">{requestTypeLabel}</span></span>
                        </div>
                        <div className={`flex items-center gap-2 ${theme?.text || 'text-slate-300'} text-sm font-medium`}>
                            <AlertTriangle size={16} className="text-orange-500" />
                            <span>Phụ trách: <span className="font-bold">{teamIdLabel.replace('MÃ ĐỘI: ', '')}</span></span>
                        </div>
                    </div>

                    <p className={`text-sm leading-relaxed mb-6 ${theme?.textMuted || 'text-slate-400'}`}>
                        {requestData?.description || mission.description || mission.Description || mission.notes || 'Không có mô tả chi tiết'}
                    </p>

                    <div className="flex flex-col gap-3 bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
                        <div className={`flex items-center gap-3 ${theme?.text || 'text-slate-300'}`}>
                            <Users size={16} className="text-blue-500" />
                            <span className="text-sm font-semibold">Cần cứu hộ: {requestData?.peopleCount ?? 1} người</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <MapPin size={16} className="text-red-500" />
                            <span className="text-sm line-clamp-2">{requestData?.locationText || 'Chưa có thông tin địa chỉ'}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <Clock size={16} className="text-green-500" />
                            <span className="text-sm">Yêu cầu lúc: {requestData?.createdAt ? new Intl.DateTimeFormat('vi-VN', {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit'
                            }).format(new Date(requestData.createdAt)) : 'Chưa rõ'}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <Clock size={16} className="text-blue-500" />
                            <span className="text-sm">Giao lúc: {mission.assignedAt || mission.AssignedAt ? new Intl.DateTimeFormat('vi-VN', {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit'
                            }).format(new Date(mission.assignedAt || mission.AssignedAt)) : 'Chưa rõ thời gian'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Actions */}
            <h2 className={`text-lg font-bold ${theme?.text || 'text-slate-200'} mb-4`}>Cập nhật trạng thái</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-[#2A3441] hover:bg-[#344050] text-[#8BA1B8] hover:text-white py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all font-bold border border-slate-700/50">
                    <Send size={24} />
                    Đã đến nơi
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-blue-600/20">
                    <PenTool size={24} />
                    Đang xử lý
                </button>
                <button className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-green-600/20">
                    <CheckCircle size={24} />
                    Hoàn thành
                </button>
                <button className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-red-600/20">
                    Thất Bại
                </button>
            </div>

        </div>
    );
};

export default MissionDetail;
