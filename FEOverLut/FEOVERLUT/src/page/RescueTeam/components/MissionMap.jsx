import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { toast } from 'react-toastify';

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

const createLabelIcon = (text, sizeClass) =>
    L.divIcon({
        className: '',
        html: `<div style="
      white-space:pre-line;
      text-align:center;
      font-weight:700;
      letter-spacing:2px;
      text-shadow:0 1px 4px rgba(0,0,0,0.5);
      color:rgba(255,255,255,0.6);
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

// ── Vietnamese Localization for Leaflet Routing Machine ───────────────
L.Routing.Localization = L.Routing.Localization || {};
L.Routing.Localization['vi'] = {
    directions: {
        N: 'hướng Bắc',
        NE: 'hướng Đông Bắc',
        E: 'hướng Đông',
        SE: 'hướng Đông Nam',
        S: 'hướng Nam',
        SW: 'hướng Tây Nam',
        W: 'hướng Tây',
        NW: 'hướng Tây Bắc'
    },
    instructions: {
        'Head': ['Đi thẳng {dir} trên {road}', 'Đi thẳng {dir}'],
        'Continue': ['Tiếp tục đi thẳng trên {road}', 'Tiếp tục đi thẳng'],
        'SlightRight': ['Chếch sang phải vào {road}', 'Chếch sang phải'],
        'Right': ['Rẽ phải vào {road}', 'Rẽ phải'],
        'SharpRight': ['Ngoặt sang phải vào {road}', 'Ngoặt sang phải'],
        'TurnAround': ['Quay đầu xe lại'],
        'SharpLeft': ['Ngoặt sang trái vào {road}', 'Ngoặt sang trái'],
        'Left': ['Rẽ trái vào {road}', 'Rẽ trái'],
        'SlightLeft': ['Chếch sang trái vào {road}', 'Chếch sang trái'],
        'WaypointReached': ['Đã đến điểm dừng'],
        'Roundabout': ['Đi vào vòng xuyến và rẽ sang lối ra {exitStr} vào {road}', 'Đi vào vòng xuyến rẽ sang lối ra {exitStr}'],
        'DestinationReached': ['Bạn đã đến đích'],
        'Fork': ['Tại ngã ba đi về phía {modifier} vào {road}', 'Tại ngã ba đi về phía {modifier}'],
        'Merge': ['Đi sát về phía {modifier} vào {road}', 'Đi sát về phía {modifier}'],
        'OnRamp': ['Đi theo lối rẽ về phía {modifier} vào {road}', 'Đi theo lối rẽ về phía {modifier}'],
        'OffRamp': ['Đi theo lối ra về phía {modifier} vào {road}', 'Đi theo lối ra về phía {modifier}'],
        'EndOfRoad': ['Đến cuối đường rẽ {modifier} vào {road}', 'Đến cuối đường rẽ {modifier}'],
        'Wait': ['Chờ tại đây']
    },
    formatOrder: function (n) {
        return 'thứ ' + n;
    },
    ui: {
        startPlaceholder: 'Điểm bắt đầu',
        viaPlaceholder: 'Điểm qua',
        endPlaceholder: 'Điểm đến'
    }
};

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon for User's Location
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Icon for Rescue Location
const rescueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const RoutingMachine = ({ userLocation, rescueLocation }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!userLocation || !rescueLocation) return;

        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        const waypoints = [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(rescueLocation[0], rescueLocation[1])
        ];

        routingControlRef.current = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8 }]
            },
            language: 'vi',
            show: false, // Hide the turn-by-turn instructions panel
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            createMarker: function () { return null; } // We provide our own markers
        }).addTo(map);

        // Make the routing container behave like a toggleable element
        let showInstructions = false;

        const updateInstructionsDisplay = () => {
            const containers = document.querySelectorAll('.leaflet-routing-container');
            containers.forEach(c => {
                if (!showInstructions) {
                    c.style.display = 'none';
                } else {
                    c.style.display = 'block';
                    c.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
                    c.style.color = 'white';
                    c.style.padding = '10px';
                    c.style.borderRadius = '8px';
                    c.style.maxHeight = '250px';
                    c.style.overflowY = 'auto';
                    c.style.backdropFilter = 'blur(4px)';
                }
            });
        };

        const _interval = setInterval(() => {
            const containers = document.querySelectorAll('.leaflet-routing-container');
            if (containers.length > 0) {
                updateInstructionsDisplay();
                clearInterval(_interval);
            }
        }, 100);

        // We create a global function attached to window just for this map instance to toggle
        window.toggleRoutingInstructions = () => {
            showInstructions = !showInstructions;
            updateInstructionsDisplay();
        };

        return () => {
            window.toggleRoutingInstructions = undefined;
            clearInterval(_interval);
            if (routingControlRef.current && map) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, userLocation, rescueLocation]);

    return null;
};

const MissionMap = ({ requestData, isNavigating, setIsNavigating, onUserLocationChange }) => {
    const [userLocation, setUserLocation] = useState(null);

    // Default center (e.g. general area if no coordinates available)
    const defaultCenter = [10.8231, 106.6297]; // Ho Chi Minh City roughly

    // Extract rescue location
    // Note: GeoJSON coordinates are [longitude, latitude], Leaflet needs [latitude, longitude]
    const rescueLocationArray = requestData?.location?.coordinates;
    const rescueLocation = rescueLocationArray && rescueLocationArray.length === 2
        ? [rescueLocationArray[1], rescueLocationArray[0]]
        : null;

    // Handle User Location Tracking
    useEffect(() => {
        let watchId;

        if (isNavigating) {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const loc = [position.coords.latitude, position.coords.longitude];
                        setUserLocation(loc);
                        onUserLocationChange?.(loc);
                    },
                    (error) => {
                        console.error('Error matching location:', error);
                        toast.error('Không thể lấy vị trí hiện tại của bạn.');
                        // Fall back to stopping navigation
                        setIsNavigating(false);
                    },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
                );
            } else {
                toast.error('Trình duyệt của bạn không hỗ trợ định vị.');
            }
        }

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isNavigating, setIsNavigating]);

    // Layer Switcher State
    const [activeLayer, setActiveLayer] = useState('dark');
    const [openLayer, setOpenLayer] = useState(false);
    const tileUrl = TILE_LAYERS[activeLayer].url;

    // Initial map center depends on whether we have task location
    const mapCenter = rescueLocation || defaultCenter;

    return (
        <div className="w-full h-full relative z-0 bg-slate-800">
            {/* Map Custom Controls (Layer Switcher) */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <div className="relative">
                    <button
                        onClick={() => setOpenLayer(!openLayer)}
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
                                    onClick={() => { setActiveLayer(key); setOpenLayer(false); }}
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
            </div>

            {/* Toggle Instructions Button */}
            {isNavigating && userLocation && rescueLocation && (
                <button
                    onClick={() => window.toggleRoutingInstructions?.()}
                    className="absolute top-4 right-4 z-[1000] bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 text-white px-4 py-2 rounded-xl shadow-lg border border-slate-600 font-bold transition-colors"
                >
                    Xem chi tiết chỉ đường
                </button>
            )}

            <MapContainer
                center={mapCenter}
                zoom={14}
                minZoom={5}
                maxZoom={18}
                maxBounds={VIETNAM_BOUNDS}
                maxBoundsViscosity={0.8}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                attributionControl={false}
            >
                <TileLayer
                    key={activeLayer}
                    url={tileUrl}
                />

                {/* Sovereignty labels */}
                {SOVEREIGNTY_LABELS.map((label) => (
                    <Marker
                        key={label.name}
                        position={label.position}
                        icon={createLabelIcon(label.name, label.size)}
                        interactive={false}
                    />
                ))}

                {/* Rescue Target Marker */}
                {rescueLocation && (
                    <Marker position={rescueLocation} icon={rescueIcon}>
                        <Popup>
                            <strong>Vị trí cứu hộ</strong><br />
                            {requestData?.locationText || 'Không có địa chỉ cụ thể'}
                        </Popup>
                    </Marker>
                )}

                {/* User Current Location Marker */}
                {userLocation && isNavigating && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup>Vị trí của bạn</Popup>
                    </Marker>
                )}

                {/* Routing Machine */}
                {userLocation && rescueLocation && isNavigating && (
                    <RoutingMachine userLocation={userLocation} rescueLocation={rescueLocation} />
                )}
            </MapContainer>
        </div>
    );
};

export default MissionMap;
