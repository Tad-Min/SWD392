/**
 * Map Controls Module
 * Zoom, GPS location, layer toggle, fullscreen, province navigation
 */

class MapControls {
    constructor(map) {
        this.map = map;
        this.currentLayer = 'roads';
        this.layers = {};
        this.initLayers();
        this.initControls();
        this.initProvinceSelector();
        this.initCoordinatesDisplay();
    }

    initLayers() {
        // Roads-focused layer (CartoDB Voyager - clean, minimal POIs)
        this.layers.roads = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
            }
        );

        // Light (Positron) - even cleaner
        this.layers.light = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
            }
        );

        // Dark mode
        this.layers.dark = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
            }
        );

        // Satellite (ESRI)
        this.layers.satellite = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
            }
        );

        // Set default layer
        this.layers.roads.addTo(this.map);
    }

    switchLayer(layerName) {
        if (this.currentLayer === layerName) return;
        if (!this.layers[layerName]) return;

        // Remove current
        this.map.removeLayer(this.layers[this.currentLayer]);

        // Add new
        this.layers[layerName].addTo(this.map);
        this.currentLayer = layerName;

        // Update UI buttons
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layer === layerName);
        });

        const layerNames = {
            roads: 'Bản đồ đường',
            light: 'Bản đồ sáng',
            dark: 'Bản đồ tối',
            satellite: 'Vệ tinh',
        };
        showToast(`Đổi sang: ${layerNames[layerName]}`, 'info');
    }

    initControls() {
        // Zoom controls
        document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
            this.map.zoomIn(1, { animate: true });
        });

        document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
            this.map.zoomOut(1, { animate: true });
        });

        // GPS Location
        document.getElementById('btn-location')?.addEventListener('click', () => {
            this.locateUser();
        });

        // Fullscreen
        document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Reset view
        document.getElementById('btn-reset')?.addEventListener('click', () => {
            this.map.flyTo(
                [VIETNAM_BOUNDS.center.lat, VIETNAM_BOUNDS.center.lng],
                VIETNAM_BOUNDS.defaultZoom,
                { duration: 1.2 }
            );
            showToast('Đã đặt lại vị trí bản đồ', 'info');
        });

        // Sidebar toggle
        document.getElementById('toggle-sidebar')?.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('collapsed');
            // Invalidate map size after transition
            setTimeout(() => this.map.invalidateSize(), 350);
        });

        // Layer buttons
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLayer(btn.dataset.layer);
            });
        });

        // Sovereignty navigation buttons
        document.getElementById('btn-hoangsa')?.addEventListener('click', () => {
            flyToHoangSa(this.map);
            showToast('Quần đảo Hoàng Sa - Việt Nam', 'info');
        });

        document.getElementById('btn-truongsa')?.addEventListener('click', () => {
            flyToTruongSa(this.map);
            showToast('Quần đảo Trường Sa - Việt Nam', 'info');
        });
    }

    initProvinceSelector() {
        const select = document.getElementById('province-select');
        if (!select) return;

        // Add "All" option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '-- Chọn tỉnh/thành phố --';
        select.appendChild(defaultOpt);

        // Add provinces grouped by region
        const regions = [
            { label: '━━ Thành phố trực thuộc TW', start: 0, end: 5 },
            { label: '━━ Đông Bắc Bộ', start: 5, end: 16 },
            { label: '━━ Tây Bắc Bộ', start: 16, end: 20 },
            { label: '━━ Đồng bằng Sông Hồng', start: 20, end: 28 },
            { label: '━━ Bắc Trung Bộ', start: 28, end: 34 },
            { label: '━━ Nam Trung Bộ', start: 34, end: 41 },
            { label: '━━ Tây Nguyên', start: 41, end: 46 },
            { label: '━━ Đông Nam Bộ', start: 46, end: 51 },
            { label: '━━ Đồng bằng Sông Cửu Long', start: 51, end: 63 },
        ];

        regions.forEach(region => {
            const groupOpt = document.createElement('option');
            groupOpt.disabled = true;
            groupOpt.textContent = region.label;
            groupOpt.style.fontWeight = 'bold';
            select.appendChild(groupOpt);

            for (let i = region.start; i < region.end; i++) {
                const p = VIETNAM_PROVINCES[i];
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = p.name;
                select.appendChild(opt);
            }
        });

        select.addEventListener('change', (e) => {
            const idx = parseInt(e.target.value);
            if (isNaN(idx)) return;
            const p = VIETNAM_PROVINCES[idx];
            this.map.flyTo([p.lat, p.lng], p.zoom, { duration: 1.2 });
            showToast(`Đang đi tới: ${p.name}`, 'info');
        });
    }

    initCoordinatesDisplay() {
        const coordsEl = document.getElementById('coords-display');
        if (!coordsEl) return;

        this.map.on('mousemove', (e) => {
            coordsEl.textContent = `${e.latlng.lat.toFixed(5)}° N, ${e.latlng.lng.toFixed(5)}° E | Zoom: ${this.map.getZoom()}`;
        });

        this.map.on('zoomend', () => {
            const center = this.map.getCenter();
            coordsEl.textContent = `${center.lat.toFixed(5)}° N, ${center.lng.toFixed(5)}° E | Zoom: ${this.map.getZoom()}`;
        });
    }

    locateUser() {
        if (!navigator.geolocation) {
            showToast('Trình duyệt không hỗ trợ GPS', 'error');
            return;
        }

        showToast('Đang xác định vị trí...', 'info');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                this.map.flyTo([latitude, longitude], 15, { duration: 1.2 });

                // Add user location marker
                L.circleMarker([latitude, longitude], {
                    radius: 8,
                    fillColor: '#3b82f6',
                    color: '#ffffff',
                    weight: 3,
                    fillOpacity: 1,
                }).addTo(this.map)
                    .bindPopup('<strong>Vị trí của bạn</strong>')
                    .openPopup();

                // Pulse animation ring
                L.circleMarker([latitude, longitude], {
                    radius: 20,
                    fillColor: '#3b82f6',
                    color: '#3b82f6',
                    weight: 1,
                    fillOpacity: 0.15,
                    opacity: 0.3,
                }).addTo(this.map);

                showToast('Đã xác định vị trí!', 'success');
            },
            (err) => {
                const messages = {
                    1: 'Bạn đã từ chối chia sẻ vị trí',
                    2: 'Không xác định được vị trí',
                    3: 'Hết thời gian xác định vị trí',
                };
                showToast(messages[err.code] || 'Lỗi GPS', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    toggleFullscreen() {
        const doc = document.documentElement;
        if (!document.fullscreenElement) {
            doc.requestFullscreen?.() || doc.webkitRequestFullscreen?.() || doc.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
        }
    }
}
