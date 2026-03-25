import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Users, Map, Layers, Filter, Package } from 'lucide-react';

// ── Vietnam map bounds ─────────────────────────────────────────────────
const VIETNAM_BOUNDS = [
    [7.5, 101.0],   // Southwest
    [23.5, 115.0],  // Northeast (includes Hoàng Sa, Trường Sa area)
];

// ── Sovereignty labels ─────────────────────────────────────────────────
const SOVEREIGNTY_LABELS = [
    { name: 'BIỂN ĐÔNG', position: [12.5, 112.0], size: 'text-lg' },
    { name: 'Quần đảo Hoàng Sa\n(Việt Nam)', position: [16.5, 112.0], size: 'text-xs' },
    { name: 'Quần đảo Trường Sa\n(Việt Nam)', position: [10.0, 114.0], size: 'text-xs' },
];

const createLabelIcon = (text, sizeClass, isDark) =>
    L.divIcon({
        className: '',
        html: `<div style="
      white-space:pre-line;
      text-align:center;
      font-weight:700;
      letter-spacing:2px;
      text-shadow:0 1px 4px rgba(0,0,0,0.5);
      color:${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,64,175,0.7)'};
      pointer-events:none;
      font-family:system-ui,sans-serif;
    " class="${sizeClass}">${text}</div>`,
        iconSize: [160, 50],
        iconAnchor: [80, 25],
    });

// ── Tile layers config ─────────────────────────────────────────────────
const TILE_LAYERS = {
    dark: {
        label: 'Tối',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        icon: '🌙',
    },
    light: {
        label: 'Sáng',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        icon: '☀️',
    },
    satellite: {
        label: 'Vệ tinh',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        icon: '🛰️',
    },
};

// ── Request Status Filters ─────────────────────────────────────────────
const REQUEST_LAYERS = {
    new: {
        label: 'Yêu cầu mới',
        statuses: [1, 2], // New, Verified
        icon: <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
    },
    inProgress: {
        label: 'Tiến trình',
        statuses: [3, 4, 5], // Assigned, EnRoute, OnSite
        icon: <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
    },
    resolved: {
        label: 'Đã xong',
        statuses: [6, 7, 8], // Resolved, Cancelled, DuplicateMerged
        icon: <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
    },
    warehouse: {
        label: 'Kho hàng',
        statuses: [], // Empty statuses array so requests don't match this
        icon: <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
    }
};

// ── Custom marker icons ────────────────────────────────────────────────
const createSOSIcon = (colorHex) =>
    L.divIcon({
        className: '',
        html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;inset:0;border-radius:9999px;background:${colorHex}80;animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <span style="width:14px;height:14px;border-radius:9999px;background:${colorHex};border:2px solid #fff;position:relative;box-shadow:0 0 8px ${colorHex};"></span>
      </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    });

const createTeamIcon = () =>
    L.divIcon({
        className: '',
        html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        <span style="width:14px;height:14px;border-radius:9999px;background:#22c55e;border:2px solid #fff;position:relative;box-shadow:0 0 6px rgba(34,197,94,0.7);"></span>
      </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
    });

const createWarehouseIcon = () =>
    L.divIcon({
        className: '',
        html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        <span style="width:16px;height:16px;border-radius:4px;background:#10b981;border:2px solid #fff;position:relative;box-shadow:0 0 6px rgba(16,185,129,0.7);"></span>
      </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
    });

// ── Inject keyframes once ──────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('sos-ping-style')) {
    const style = document.createElement('style');
    style.id = 'sos-ping-style';
    style.textContent = `@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}`;
    document.head.appendChild(style);
}

const STATUS_LABELS = {
    1: 'Cứu hộ',
    2: 'Cứu trợ',
    3: 'Cả hai',
};

const URGENCY_META = {
    1: { label: 'Cần hỗ trợ', colorHex: '#f59e0b', colorIcon: 'amber-500', colorText: 'amber-400', colorBg: 'amber-500/20', colorBorder: 'amber-500/30' }, // Amber
    2: { label: 'Nguy hiểm', colorHex: '#ef4444', colorIcon: 'red-500', colorText: 'red-400', colorBg: 'red-500/20', colorBorder: 'red-500/30' },       // Red
    3: { label: 'Khẩn cấp', colorHex: '#9333ea', colorIcon: 'purple-500', colorText: 'purple-400', colorBg: 'purple-500/20', colorBorder: 'purple-500/30' },// Purple
};

// ── Map Controls UI Component ────────────────────────────────────────
function MapControls({ activeLayer, onLayerChange, activeFilters, onFilterChange }) {
    const [openLayer, setOpenLayer] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);

    return (
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            {/* Layer Switcher */}
            <div className="relative">
                <button
                    onClick={() => { setOpenLayer(!openLayer); setOpenFilter(false); }}
                    className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-center hover:bg-slate-800/90 transition-colors cursor-pointer"
                    title="Chuyển lớp bản đồ"
                >
                    <Layers className="w-5 h-5 text-white" />
                </button>

                {openLayer && (
                    <div className="absolute top-0 left-12 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[140px]">
                        {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                            <button
                                key={key}
                                onClick={() => { onLayerChange(key); setOpenLayer(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${activeLayer === key
                                    ? 'bg-blue-600/30 text-blue-300'
                                    : 'text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-base">{layer.icon}</span>
                                {layer.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Request Filter */}
            <div className="relative">
                <button
                    onClick={() => { setOpenFilter(!openFilter); setOpenLayer(false); }}
                    className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-center hover:bg-slate-800/90 transition-colors cursor-pointer"
                    title="Lọc trạng thái yêu cầu"
                >
                    <Filter className="w-4 h-4 text-white" />
                    {activeFilters.length < 3 && (
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                    )}
                </button>

                {openFilter && (
                    <div className="absolute top-0 left-12 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[170px] p-2 space-y-1">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Lớp Hiển Thị
                        </div>
                        {Object.entries(REQUEST_LAYERS).map(([key, layer]) => {
                            const isActive = activeFilters.includes(key);
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        if (isActive) {
                                            onFilterChange(activeFilters.filter((k) => k !== key));
                                        } else {
                                            onFilterChange([...activeFilters, key]);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-center w-4 h-4">
                                        {isActive ? layer.icon : <span className="w-3 h-3 rounded-full bg-slate-700 shadow-inner" />}
                                    </div>
                                    {layer.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main MapLayer Component ────────────────────────────────────────────
export default function MapLayer({ requests = [], teams = [], warehouses = [], userMap = {}, requestStatusMap = {}, onDispatch }) {
    const [activeLayer, setActiveLayer] = useState('dark');
    const [activeFilters, setActiveFilters] = useState(['new', 'inProgress', 'resolved', 'warehouse']); // All visible by default
    const isDark = activeLayer === 'dark';

    const teamIcon = createTeamIcon();
    const warehouseIcon = createWarehouseIcon();
    const tileUrl = TILE_LAYERS[activeLayer].url;

    const filteredRequests = requests.filter(req => {
        const reqStatusId = req.status || 1; // Default to 1 (New) if undefined
        return activeFilters.some(filterKey =>
            REQUEST_LAYERS[filterKey].statuses.includes(reqStatusId)
        );
    });

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[16.047079, 108.20623]}
                zoom={6}
                minZoom={5}
                maxZoom={18}
                maxBounds={VIETNAM_BOUNDS}
                maxBoundsViscosity={0.8}
                className="w-full h-full z-0"
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer key={activeLayer} url={tileUrl} />

                {/* Sovereignty labels */}
                {SOVEREIGNTY_LABELS.map((label) => (
                    <Marker
                        key={label.name}
                        position={label.position}
                        icon={createLabelIcon(label.name, label.size, isDark)}
                        interactive={false}
                    />
                ))}

                {/* SOS Markers */}
                {filteredRequests.map((req) => {
                    const coords = (req.location ?? req.currentLocation)?.coordinates;
                    if (!coords || coords.length < 2) return null;
                    const pos = [coords[1], coords[0]];

                    const urgency = URGENCY_META[req.urgencyLevel] || URGENCY_META[1]; // Fallback to normal if undefined
                    const currentSOSIcon = createSOSIcon(urgency.colorHex);

                    return (
                        <Marker key={req.id ?? req.rescueRequestId} position={pos} icon={currentSOSIcon}>
                            <Popup className="sos-popup" maxWidth={260} minWidth={220}>
                                <div className="p-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className={`w-4 h-4 text-${urgency.colorIcon}`} />
                                        <span className="font-bold text-sm text-slate-800">
                                            {userMap[req.userReqId] || req.citizenName || 'Người dân'}
                                        </span>
                                        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md border bg-${urgency.colorBg} text-${urgency.colorText} border-${urgency.colorBorder}`}>
                                            {urgency.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">
                                        ID yêu cầu: <span className="font-semibold text-slate-700">#{req.rescueRequestId ?? req.id}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mb-1">
                                        Trạng thái: <span className="font-semibold text-slate-700">{requestStatusMap[req.status] || 'Không rõ'}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mb-1">
                                        Loại hỗ trợ: <span className="font-semibold text-slate-700">{STATUS_LABELS[req.requestType] || 'Cứu hộ'}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mb-1">
                                        Số người: <span className="font-semibold text-slate-700">{req.peopleCount ?? 1}</span>
                                    </p>
                                    {req.description && (
                                        <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                                            {req.description}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => onDispatch?.(req)}
                                        className="w-full mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Điều phối
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Team Markers */}
                {teams.map((team) => {
                    const coords = (team.location ?? team.currentLocation)?.coordinates;
                    if (!coords || coords.length < 2) return null;
                    const pos = [coords[1], coords[0]];
                    return (
                        <Marker key={team.id ?? team.rescueTeamId} position={pos} icon={teamIcon}>
                            <Popup maxWidth={220} minWidth={180}>
                                <div className="p-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-4 h-4 text-green-500" />
                                        <span className="font-bold text-sm text-slate-800">
                                            {team.teamName || team.name || 'Đội cứu hộ'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Trạng thái: <span className="font-semibold text-slate-700">{team.status || 'Sẵn sàng'}</span>
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Warehouse Markers */}
                {activeFilters.includes('warehouse') && warehouses.map((wh) => {
                    const coords = wh.location?.coordinates;
                    if (!coords || coords.length < 2) return null;
                    const pos = [coords[1], coords[0]];
                    return (
                        <Marker key={wh.warehouseId} position={pos} icon={warehouseIcon}>
                            <Popup maxWidth={260} minWidth={220}>
                                <div className="p-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-emerald-500" />
                                        <span className="font-bold text-sm text-slate-800">
                                            {wh.warehouseName || 'Kho hàng'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">
                                        ID: <span className="font-semibold text-slate-700">#{wh.warehouseId}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mb-1">
                                        Địa chỉ: <span className="font-semibold text-slate-700">{wh.address || 'Không có địa chỉ'}</span>
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Trạng thái: <span className="font-semibold text-emerald-600">{wh.isActive ? 'Hoạt động' : 'Tạm dừng'}</span>
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Map Controls overlay — outside MapContainer so it's always on top */}
            <MapControls
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
            />
        </div>
    );
}
