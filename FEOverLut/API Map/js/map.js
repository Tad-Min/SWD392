/**
 * Vietnam Map - Main Initialization
 * Entry point for the map application
 */

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Main initialization
function initMap() {
    // Create Leaflet map
    const map = L.map('map', {
        center: [VIETNAM_BOUNDS.center.lat, VIETNAM_BOUNDS.center.lng],
        zoom: VIETNAM_BOUNDS.defaultZoom,
        minZoom: 4,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: true,
        maxBounds: [
            [VIETNAM_BOUNDS.south - 5, VIETNAM_BOUNDS.west - 10],
            [VIETNAM_BOUNDS.north + 5, VIETNAM_BOUNDS.east + 10],
        ],
        maxBoundsViscosity: 0.8,
    });

    // Initialize modules
    const controls = new MapControls(map);
    const search = new MapSearch(map);
    const sovereigntyLayer = addSovereigntyMarkers(map);
    const routing = new MapRouting(map);

    // Update info panel
    updateInfoPanel(map);
    map.on('moveend zoomend', () => updateInfoPanel(map));

    // Hide loading overlay
    setTimeout(() => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    }, 800);

    // Store global ref for debugging
    window.__map = map;
    window.__search = search;
    window.__controls = controls;
    window.__routing = routing;

    console.log('🇻🇳 Vietnam Rescue Map initialized successfully!');
}

function updateInfoPanel(map) {
    const center = map.getCenter();
    const zoom = map.getZoom();

    const elLat = document.getElementById('info-lat');
    const elLng = document.getElementById('info-lng');
    const elZoom = document.getElementById('info-zoom');

    if (elLat) elLat.textContent = center.lat.toFixed(4) + '°';
    if (elLng) elLng.textContent = center.lng.toFixed(4) + '°';
    if (elZoom) elZoom.textContent = zoom;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMap);
