import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Users, Map, Layers } from 'lucide-react';

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

// ── Custom marker icons ────────────────────────────────────────────────
const createSOSIcon = () =>
    L.divIcon({
        className: '',
        html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(239,68,68,0.45);animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <span style="width:14px;height:14px;border-radius:9999px;background:#ef4444;border:2px solid #fff;position:relative;box-shadow:0 0 8px rgba(239,68,68,0.8);"></span>
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

// ── Layer Switcher UI Component ────────────────────────────────────────
function LayerSwitcher({ activeLayer, onChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="absolute top-4 left-4 z-[1000]">
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-center hover:bg-slate-800/90 transition-colors cursor-pointer"
                title="Chuyển lớp bản đồ"
            >
                <Layers className="w-5 h-5 text-white" />
            </button>

            {open && (
                <div className="mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[140px]">
                    {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                        <button
                            key={key}
                            onClick={() => { onChange(key); setOpen(false); }}
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
    );
}

// ── Main MapLayer Component ────────────────────────────────────────────
export default function MapLayer({ requests = [], teams = [], onDispatch }) {
    const [activeLayer, setActiveLayer] = useState('dark');
    const isDark = activeLayer === 'dark';

    const sosIcon = createSOSIcon();
    const teamIcon = createTeamIcon();
    const tileUrl = TILE_LAYERS[activeLayer].url;

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
                {requests.map((req) => {
                    const coords = req.currentLocation?.coordinates;
                    if (!coords || coords.length < 2) return null;
                    const pos = [coords[1], coords[0]];
                    return (
                        <Marker key={req.id ?? req.rescueRequestId} position={pos} icon={sosIcon}>
                            <Popup className="sos-popup" maxWidth={260} minWidth={220}>
                                <div className="p-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <span className="font-bold text-sm text-slate-800">
                                            {req.citizenName || 'Người dân'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">
                                        Loại: <span className="font-semibold text-slate-700">{STATUS_LABELS[req.requestType] || 'Cứu hộ'}</span>
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
                    const coords = team.currentLocation?.coordinates;
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
            </MapContainer>

            {/* Layer Switcher overlay — outside MapContainer so it's always on top */}
            <LayerSwitcher activeLayer={activeLayer} onChange={setActiveLayer} />
        </div>
    );
}
