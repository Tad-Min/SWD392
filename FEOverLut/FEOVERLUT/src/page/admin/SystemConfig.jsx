import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSystemConfig } from '../../features/system_config/hook/useSystemConfig';
import GenericConfigTab from '../../features/system_config/components/GenericConfigTab';

const SystemConfig = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [activeTab, setActiveTab] = useState('emergency');

    // ── Hooks ─────────────────────────────────────────────────────────
    const systemConfigHooks = useSystemConfig();

    // ── Sub-menus ───────────────────────────────────────────────────────
    const subMenus = [
        { id: 'emergency', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', label: 'Mức độ khẩn cấp' },
        { id: 'request_type', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Loại sự cố (SOS)' },
        { id: 'vehicle', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', label: 'Loại phương tiện' },
        { id: 'status_vehicle', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Tình trạng xe' },
        { id: 'status_team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', label: 'Tình trạng đội cứu hộ' },
        { id: 'status_request', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Trạng thái yêu cầu' },
        { id: 'status_mission', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Trạng thái nhiệm vụ' },
    ];

    // ── Icon colours cycling ────────────────────────────────────────────
    const iconColors = [
        'bg-blue-500/10 text-blue-500',
        'bg-purple-500/10 text-purple-500',
        'bg-orange-500/10 text-orange-500',
        'bg-emerald-500/10 text-emerald-500',
        'bg-red-500/10 text-red-500',
        'bg-cyan-500/10 text-cyan-500',
    ];

    return (
        <div className="animate-fade-in-up h-full flex flex-col sm:flex-row gap-6">
            {/* Sub-menu Navigation Sidebar */}
            <div className={`w-full sm:w-64 shrink-0 ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-4 flex flex-col gap-2 h-fit`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.textMuted} mb-2 px-3`}>Tùy chọn</h3>
                {subMenus.map(menu => (
                    <button
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer
                            ${activeTab === menu.id
                                ? isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'
                                : `${theme.textMuted} ${theme.navHover} border border-transparent`
                            }
                        `}
                    >
                        <svg className={`w-5 h-5 ${activeTab === menu.id ? 'text-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={menu.icon} />
                        </svg>
                        <span className="text-sm font-semibold">{menu.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Configuration Content */}
            <div className={`flex-1 flex flex-col ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-6 sm:p-8 min-h-[500px]`}>

                {/* ── EMERGENCY LEVELS TAB ────────────────────────────────── */}
                {activeTab === 'emergency' && (
                    <GenericConfigTab
                        title="Mức Độ Khẩn Cấp (Urgency Levels)"
                        subtitle="Quản lý các cấp độ khẩn cấp để phân loại yêu cầu cứu hộ."
                        itemName="mức độ khẩn cấp"
                        nameHeader="Tên Mức Độ"
                        searchPlaceholder="Tìm theo tên mức độ..."
                        fetchApi={systemConfigHooks.getUrgencyLevels}
                        createApi={systemConfigHooks.createUrgencyLevel}
                        updateApi={systemConfigHooks.updateUrgencyLevel}
                        deleteApi={systemConfigHooks.deleteUrgencyLevel}
                        idField="urgencyLevelId"
                        nameField="urgencyName"
                    />
                )}

                {/* ── REQUEST TYPES TAB (SOS) ──────────────────────────────────── */}
                {activeTab === 'request_type' && (
                    <GenericConfigTab
                        title="Đặc Thù Loại Sự Cố (SOS)"
                        subtitle="Quản lý danh mục các loại yêu cầu cứu hộ từ người dân."
                        itemName="loại sự cố"
                        nameHeader="Tên Loại Sự Cố"
                        searchPlaceholder="Tìm theo tên sự cố..."
                        fetchApi={systemConfigHooks.getRescueRequestTypes}
                        createApi={systemConfigHooks.createRescueRequestType}
                        updateApi={systemConfigHooks.updateRescueRequestType}
                        deleteApi={systemConfigHooks.deleteRescueRequestType}
                        idField="rescueRequestsTypeId"
                        nameField="typeName"
                    />
                )}

                {/* ── VEHICLE TYPES TAB ──────────────────────────────────── */}
                {activeTab === 'vehicle' && (
                    <GenericConfigTab
                        title="Loại Phương Tiện Cứu Hộ"
                        subtitle="Quản lý danh mục loại phương tiện dùng trong các nhiệm vụ."
                        itemName="loại phương tiện"
                        nameHeader="Tên Loại Phương Tiện"
                        searchPlaceholder="Tìm theo tên loại..."
                        fetchApi={systemConfigHooks.getVehicleTypes}
                        createApi={systemConfigHooks.createVehicleType}
                        updateApi={systemConfigHooks.updateVehicleType}
                        deleteApi={systemConfigHooks.deleteVehicleType}
                        idField="vehicleTypeId"
                        nameField="typeName"
                    />
                )}

                {/* ── STATUS - VEHICLE ──────────────────────────────────── */}
                {activeTab === 'status_vehicle' && (
                    <GenericConfigTab
                        title="Tình Trạng Phương Tiện"
                        subtitle="Quản lý danh sách các trạng thái của phương tiện."
                        itemName="trạng thái xe"
                        nameHeader="Tên Trạng Thái"
                        searchPlaceholder="Tìm kiếm trạng thái..."
                        fetchApi={systemConfigHooks.getVehicleStatus}
                        createApi={systemConfigHooks.createVehicleStatus}
                        updateApi={systemConfigHooks.updateVehicleStatus}
                        deleteApi={systemConfigHooks.deleteVehicleStatus}
                        idField="vehiclesStatusId"
                        nameField="statusName"
                    />
                )}

                {/* ── STATUS - RESCUE TEAM ──────────────────────────────── */}
                {activeTab === 'status_team' && (
                    <GenericConfigTab
                        title="Tình Trạng Đội Cứu Hộ"
                        subtitle="Quản lý danh sách trạng thái của đội cứu hộ."
                        itemName="trạng thái đội"
                        nameHeader="Tên Trạng Thái"
                        searchPlaceholder="Tìm kiếm trạng thái..."
                        fetchApi={systemConfigHooks.getRescueTeamStatus}
                        createApi={systemConfigHooks.createRescueTeamStatus}
                        updateApi={systemConfigHooks.updateRescueTeamStatus}
                        deleteApi={systemConfigHooks.deleteRescueTeamStatus}
                        idField="rescueTeamsStatusId"
                        nameField="statusName"
                    />
                )}

                {/* ── STATUS - RESCUE REQUEST ───────────────────────────── */}
                {activeTab === 'status_request' && (
                    <GenericConfigTab
                        title="Trạng Thái Yêu Cầu Cứu Hộ"
                        subtitle="Quản lý các bước trạng thái xử lý yêu cầu."
                        itemName="trạng thái yêu cầu"
                        nameHeader="Tên Trạng Thái"
                        searchPlaceholder="Tìm kiếm trạng thái..."
                        fetchApi={systemConfigHooks.getRescueRequestStatus}
                        createApi={systemConfigHooks.createRescueRequestStatus}
                        updateApi={systemConfigHooks.updateRescueRequestStatus}
                        deleteApi={systemConfigHooks.deleteRescueRequestStatus}
                        idField="rescueRequestsStatusId"
                        nameField="statusName"
                    />
                )}

                {/* ── STATUS - RESCUE MISSION ───────────────────────────── */}
                {activeTab === 'status_mission' && (
                    <GenericConfigTab
                        title="Trạng Thái Nhiệm Vụ"
                        subtitle="Quản lý tiến độ và trạng thái nhiệm vụ."
                        itemName="trạng thái nhiệm vụ"
                        nameHeader="Tên Trạng Thái"
                        searchPlaceholder="Tìm kiếm trạng thái..."
                        fetchApi={systemConfigHooks.getRescueMissionStatus}
                        createApi={systemConfigHooks.createRescueMissionStatus}
                        updateApi={systemConfigHooks.updateRescueMissionStatus}
                        deleteApi={systemConfigHooks.deleteRescueMissionStatus}
                        idField="rescueMissionsStatusId"
                        nameField="statusName"
                    />
                )}

            </div>



            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            ` }} />
        </div>
    );
};

export default SystemConfig;
