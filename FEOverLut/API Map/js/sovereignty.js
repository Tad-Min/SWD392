/**
 * Vietnam Sovereignty Markers
 * Draws Hoàng Sa, Trường Sa, Biển Đông labels and boundaries on the map
 */

function addSovereigntyMarkers(map) {
    const sovereigntyLayer = L.layerGroup();

    // --- Biển Đông (East Sea) label ---
    const bienDongLabel = L.divIcon({
        className: 'sovereignty-label bien-dong',
        html: BIEN_DONG.name,
        iconSize: [300, 40],
        iconAnchor: [150, 20],
    });
    L.marker([BIEN_DONG.position.lat, BIEN_DONG.position.lng], {
        icon: bienDongLabel,
        interactive: false,
        zIndexOffset: -100,
    }).addTo(sovereigntyLayer);

    // --- Hoàng Sa ---
    addIslandGroup(map, sovereigntyLayer, HOANG_SA, 'hoang-sa');

    // --- Trường Sa ---
    addIslandGroup(map, sovereigntyLayer, TRUONG_SA, 'truong-sa');

    sovereigntyLayer.addTo(map);
    return sovereigntyLayer;
}

function addIslandGroup(map, layer, data, className) {
    // Boundary dashed rectangle
    const boundary = L.polygon(data.boundary, {
        color: '#ff6b6b',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '8, 4',
        fillColor: '#ff6b6b',
        fillOpacity: 0.03,
        interactive: false,
        className: 'sovereignty-boundary',
    }).addTo(layer);

    // Main label
    const mainLabel = L.divIcon({
        className: `sovereignty-label ${className}`,
        html: `<div style="text-align:center">
      <div>🇻🇳 ${data.name}</div>
      <div style="font-size:9px;opacity:0.7;margin-top:2px">(${data.nameEn})</div>
      <div style="font-size:9px;opacity:0.6;margin-top:1px">Việt Nam</div>
    </div>`,
        iconSize: [200, 60],
        iconAnchor: [100, 30],
    });
    L.marker([data.center.lat, data.center.lng], {
        icon: mainLabel,
        interactive: false,
    }).addTo(layer);

    // Individual island markers
    data.islands.forEach(island => {
        // Small dot marker
        const dot = L.circleMarker([island.lat, island.lng], {
            radius: 4,
            fillColor: '#ffa94d',
            color: '#ff6b6b',
            weight: 1,
            fillOpacity: 0.9,
            opacity: 0.8,
        }).bindTooltip(island.name, {
            permanent: false,
            direction: 'top',
            className: 'island-tooltip',
            offset: [0, -6],
        }).addTo(layer);

        // Permanent name labels (visible at higher zoom)
        const nameLabel = L.divIcon({
            className: 'sovereignty-label island-name',
            html: island.name,
            iconSize: [120, 16],
            iconAnchor: [60, -4],
        });
        const nameLabelMarker = L.marker([island.lat, island.lng], {
            icon: nameLabel,
            interactive: false,
        });

        // Show island names only at certain zoom levels
        map.on('zoomend', () => {
            const zoom = map.getZoom();
            if (zoom >= 7) {
                if (!layer.hasLayer(nameLabelMarker)) {
                    nameLabelMarker.addTo(layer);
                }
            } else {
                if (layer.hasLayer(nameLabelMarker)) {
                    layer.removeLayer(nameLabelMarker);
                }
            }
        });
    });
}

// Navigate to sovereignty area
function flyToHoangSa(map) {
    map.flyTo([HOANG_SA.center.lat, HOANG_SA.center.lng], 8, {
        duration: 1.5,
        easeLinearity: 0.25,
    });
}

function flyToTruongSa(map) {
    map.flyTo([TRUONG_SA.center.lat, TRUONG_SA.center.lng], 7, {
        duration: 1.5,
        easeLinearity: 0.25,
    });
}
