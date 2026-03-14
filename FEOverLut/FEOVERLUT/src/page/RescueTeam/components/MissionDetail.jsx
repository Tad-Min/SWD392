import React from 'react';
import { Navigation, MapPin, Clock, Send, PenTool, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const MissionDetail = ({ mission, onBack, teamIdLabel, theme }) => {
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

                {/* Left Side: Map Placeholder */}
                <div className="w-full md:w-1/2 h-[300px] bg-slate-800 relative">
                    <img
                        src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
                        alt="Map"
                        className="w-full h-full object-cover opacity-60"
                    />
                    {/* Placeholder Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                    w-10 h-10 bg-red-500 rounded-full border-4 border-white/20 flex items-center justify-center
                                    shadow-lg shadow-red-500/40 animate-bounce">
                        <span className="text-white font-bold text-lg">!</span>
                    </div>

                    {/* Direction Button Overlay */}
                    <button className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition-colors">
                        <Navigation size={18} />
                        Chỉ Đường
                    </button>
                </div>

                {/* Right Side: Mission Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-md text-xs font-bold tracking-wider">
                            KHẨN CẤP CAO
                        </span>
                        <span className="text-slate-500 text-sm font-semibold tracking-wider">
                            #{mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId || 'N/A'}
                        </span>
                    </div>

                    <h3 className={`text-2xl font-bold ${theme?.textTitle || 'text-white'} mb-3`}>
                        {mission.name || mission.title || `Nhiệm vụ #${mission.missionId || mission.MissionId || mission.id || mission.rescueMissionId}`}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-6 ${theme?.textMuted || 'text-slate-400'}`}>
                        {mission.description || mission.Description || mission.notes || 'Không có mô tả chi tiết'}
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <MapPin size={16} className="text-blue-500" />
                            <span className="text-sm">124 Nguyễn Văn Linh, Quận Thanh Khê</span>
                        </div>
                        <div className={`flex items-center gap-3 ${theme?.textMuted || 'text-slate-400'}`}>
                            <Clock size={16} className="text-blue-500" />
                            <span className="text-sm">Đã báo cáo: 10 phút trước</span>
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
