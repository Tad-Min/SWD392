/**
 * Routing Module
 * Uses OSRM (Open Source Routing Machine) for free route finding
 * Supports: current location → destination, or point A → point B
 */

class MapRouting {
    constructor(map) {
        this.map = map;
        this.routeLayer = L.layerGroup().addTo(map);
        this.startMarker = null;
        this.endMarker = null;
        this.startCoords = null;
        this.endCoords = null;
        this.routeLine = null;
        this.routeCoords = null; // Store route coordinates for navigation
        this.pickingMode = null; // 'start' or 'end'
        this.debounceTimers = {};

        // Real-time navigation state
        this.isNavigating = false;
        this.watchId = null;
        this.navMarker = null;
        this.navAccuracyCircle = null;
        this.navTraveledLine = null;
        this.navRemainingLine = null;
        this.navArrowLayer = L.layerGroup();
        this.navPositionHistory = [];
        this.lastNavUpdate = 0;
        this.offRouteCount = 0;
        this.OFF_ROUTE_THRESHOLD = 50; // meters
        this.OFF_ROUTE_REROUTE_COUNT = 3; // reroute after 3 consecutive off-route

        this.OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

        this.init();
    }

    init() {
        // UI references
        this.panel = document.getElementById('routing-panel');
        this.startInput = document.getElementById('route-start');
        this.endInput = document.getElementById('route-end');
        this.startResults = document.getElementById('route-start-results');
        this.endResults = document.getElementById('route-end-results');
        this.routeInfo = document.getElementById('route-info');
        this.routeSteps = document.getElementById('route-steps');

        // Toggle button
        document.getElementById('btn-toggle-routing')?.addEventListener('click', () => {
            this.togglePanel();
        });

        // Use my location button
        document.getElementById('btn-use-my-location')?.addEventListener('click', () => {
            this.useMyLocation();
        });

        // Pick on map buttons
        document.getElementById('btn-pick-start')?.addEventListener('click', () => {
            this.startPickMode('start');
        });
        document.getElementById('btn-pick-end')?.addEventListener('click', () => {
            this.startPickMode('end');
        });

        // Swap button
        document.getElementById('btn-swap-route')?.addEventListener('click', () => {
            this.swapPoints();
        });

        // Find route button
        document.getElementById('btn-find-route')?.addEventListener('click', () => {
            this.findRoute();
        });

        // Clear route button
        document.getElementById('btn-clear-route')?.addEventListener('click', () => {
            this.clearRoute();
        });

        // Search autocomplete for start/end inputs
        this.startInput?.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value, 'start');
        });
        this.endInput?.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value, 'end');
        });

        // Close results on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.route-input-group')) {
                this.startResults?.classList.remove('active');
                this.endResults?.classList.remove('active');
            }
        });

        // Map click handler for pick mode
        this.map.on('click', (e) => {
            if (this.pickingMode) {
                this.handleMapPick(e.latlng);
            }
        });
    }

    togglePanel() {
        const isVisible = this.panel.classList.toggle('active');
        if (isVisible) {
            showToast('Mở chế độ tìm đường', 'info');
        }
    }

    // ============== PICK ON MAP ==============

    startPickMode(type) {
        this.pickingMode = type;
        this.map.getContainer().style.cursor = 'crosshair';
        const label = type === 'start' ? 'điểm xuất phát' : 'điểm đến';
        showToast(`Nhấn vào bản đồ để chọn ${label}`, 'info');
    }

    stopPickMode() {
        this.pickingMode = null;
        this.map.getContainer().style.cursor = '';
    }

    handleMapPick(latlng) {
        const { lat, lng } = latlng;

        if (this.pickingMode === 'start') {
            this.setStart(lat, lng);
            this.reverseGeocode(lat, lng, 'start');
        } else if (this.pickingMode === 'end') {
            this.setEnd(lat, lng);
            this.reverseGeocode(lat, lng, 'end');
        }

        this.stopPickMode();

        // Auto-find route if both points are set
        if (this.startCoords && this.endCoords) {
            this.findRoute();
        }
    }

    // ============== SET POINTS ==============

    setStart(lat, lng) {
        this.startCoords = { lat, lng };

        if (this.startMarker) {
            this.routeLayer.removeLayer(this.startMarker);
        }

        this.startMarker = L.marker([lat, lng], {
            icon: this.createMarkerIcon('A', '#22c55e'),
            draggable: true,
            zIndexOffset: 1000,
        }).addTo(this.routeLayer);

        this.startMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.startCoords = { lat: pos.lat, lng: pos.lng };
            this.reverseGeocode(pos.lat, pos.lng, 'start');
            if (this.endCoords) this.findRoute();
        });
    }

    setEnd(lat, lng) {
        this.endCoords = { lat, lng };

        if (this.endMarker) {
            this.routeLayer.removeLayer(this.endMarker);
        }

        this.endMarker = L.marker([lat, lng], {
            icon: this.createMarkerIcon('B', '#ef4444'),
            draggable: true,
            zIndexOffset: 1000,
        }).addTo(this.routeLayer);

        this.endMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.endCoords = { lat: pos.lat, lng: pos.lng };
            this.reverseGeocode(pos.lat, pos.lng, 'end');
            if (this.startCoords) this.findRoute();
        });
    }

    createMarkerIcon(letter, color) {
        return L.divIcon({
            className: 'route-marker-icon',
            html: `<div style="
        width: 36px; height: 36px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        font-weight: 700; font-size: 14px; color: white;
        font-family: 'Inter', sans-serif;
      "><span style="transform: rotate(45deg)">${letter}</span></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
        });
    }

    // ============== USE MY LOCATION ==============

    useMyLocation() {
        if (!navigator.geolocation) {
            showToast('Trình duyệt không hỗ trợ GPS', 'error');
            return;
        }

        showToast('Đang xác định vị trí...', 'info');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                this.setStart(latitude, longitude);
                this.startInput.value = 'Vị trí hiện tại của tôi';
                this.map.flyTo([latitude, longitude], 14, { duration: 1 });
                showToast('Đã xác định vị trí!', 'success');

                if (this.endCoords) this.findRoute();
            },
            (err) => {
                const msgs = {
                    1: 'Bạn đã từ chối chia sẻ vị trí',
                    2: 'Không xác định được vị trí',
                    3: 'Hết thời gian chờ',
                };
                showToast(msgs[err.code] || 'Lỗi GPS', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    // ============== SWAP ==============

    swapPoints() {
        // Swap coords
        const tmpCoords = this.startCoords;
        this.startCoords = this.endCoords;
        this.endCoords = tmpCoords;

        // Swap input values
        const tmpVal = this.startInput.value;
        this.startInput.value = this.endInput.value;
        this.endInput.value = tmpVal;

        // Swap markers
        const tmpMarker = this.startMarker;
        this.startMarker = this.endMarker;
        this.endMarker = tmpMarker;

        // Recreate marker icons
        if (this.startMarker && this.startCoords) {
            this.routeLayer.removeLayer(this.startMarker);
            this.setStart(this.startCoords.lat, this.startCoords.lng);
        }
        if (this.endMarker && this.endCoords) {
            this.routeLayer.removeLayer(this.endMarker);
            this.setEnd(this.endCoords.lat, this.endCoords.lng);
        }

        if (this.startCoords && this.endCoords) {
            this.findRoute();
        }

        showToast('Đã đổi chiều tuyến đường', 'info');
    }

    // ============== SEARCH AUTOCOMPLETE ==============

    handleSearchInput(query, type) {
        clearTimeout(this.debounceTimers[type]);
        const resultsEl = type === 'start' ? this.startResults : this.endResults;

        if (query.trim().length < 2) {
            resultsEl?.classList.remove('active');
            return;
        }

        this.debounceTimers[type] = setTimeout(async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5&accept-language=vi&addressdetails=1`;
                const res = await fetch(url, {
                    headers: { 'User-Agent': 'VietnamRescueMap/1.0' }
                });
                const data = await res.json();

                if (data.length === 0) {
                    resultsEl.innerHTML = `<div class="search-result-item" style="cursor:default">
            <div class="result-name" style="color:var(--text-muted)">Không tìm thấy</div>
          </div>`;
                    resultsEl.classList.add('active');
                    return;
                }

                resultsEl.innerHTML = data.map(r => {
                    const name = r.display_name.split(',')[0];
                    const detail = r.display_name.split(',').slice(1, 3).join(',').trim();
                    return `<div class="search-result-item" data-lat="${r.lat}" data-lng="${r.lon}" data-name="${name}" data-type="${type}">
            <div class="result-name">${name}</div>
            <div class="result-detail">${detail}</div>
          </div>`;
                }).join('');

                resultsEl.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const lat = parseFloat(item.dataset.lat);
                        const lng = parseFloat(item.dataset.lng);
                        const name = item.dataset.name;
                        const t = item.dataset.type;

                        if (t === 'start') {
                            this.setStart(lat, lng);
                            this.startInput.value = name;
                        } else {
                            this.setEnd(lat, lng);
                            this.endInput.value = name;
                        }

                        resultsEl.classList.remove('active');

                        if (this.startCoords && this.endCoords) {
                            this.findRoute();
                        }
                    });
                });

                resultsEl.classList.add('active');
            } catch (err) {
                console.error('Geocode error:', err);
            }
        }, 400);
    }

    // ============== REVERSE GEOCODE ==============

    async reverseGeocode(lat, lng, type) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`;
            const res = await fetch(url, {
                headers: { 'User-Agent': 'VietnamRescueMap/1.0' }
            });
            const data = await res.json();
            const name = data.display_name?.split(',').slice(0, 2).join(',').trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            if (type === 'start') {
                this.startInput.value = name;
            } else {
                this.endInput.value = name;
            }
        } catch (err) {
            const input = type === 'start' ? this.startInput : this.endInput;
            input.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    }

    // ============== FIND ROUTE (OSRM) ==============

    async findRoute() {
        if (!this.startCoords || !this.endCoords) {
            showToast('Vui lòng chọn cả điểm xuất phát và điểm đến', 'error');
            return;
        }

        showToast('Đang tìm đường...', 'info');

        // Remove old route line
        if (this.routeLine) {
            this.routeLayer.removeLayer(this.routeLine);
        }

        try {
            const { lng: sLng, lat: sLat } = this.startCoords;
            const { lng: eLng, lat: eLat } = this.endCoords;

            const url = `${this.OSRM_URL}/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson&steps=true&alternatives=true`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                showToast('Không tìm được đường đi. Thử vị trí khác.', 'error');
                return;
            }

            const route = data.routes[0];

            // Draw alternative routes first (thinner, dimmer)
            if (data.routes.length > 1) {
                for (let i = 1; i < data.routes.length; i++) {
                    const altCoords = data.routes[i].geometry.coordinates.map(c => [c[1], c[0]]);
                    L.polyline(altCoords, {
                        color: '#64748b',
                        weight: 5,
                        opacity: 0.4,
                        dashArray: '10, 8',
                        lineJoin: 'round',
                    }).addTo(this.routeLayer);
                }
            }

            // Draw main route
            const routeCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            this.routeCoords = routeCoords; // Store for navigation
            this.routeLine = L.polyline(routeCoords, {
                color: '#3b82f6',
                weight: 6,
                opacity: 0.85,
                lineJoin: 'round',
                lineCap: 'round',
            }).addTo(this.routeLayer);

            // Add animated direction arrows
            this.addRouteArrows(routeCoords);

            // Fit map to route
            this.map.fitBounds(this.routeLine.getBounds(), {
                padding: [60, 60],
                maxZoom: 16,
            });

            // Show route info
            this.showRouteInfo(route);

            // Show turn-by-turn steps
            this.showRouteSteps(route);

            // Show navigation start button
            this.showNavButton();

            showToast('Đã tìm thấy đường đi!', 'success');
        } catch (err) {
            console.error('Routing error:', err);
            showToast('Lỗi kết nối. Kiểm tra mạng.', 'error');
        }
    }

    addRouteArrows(coords) {
        // Add direction arrow markers along the route
        const step = Math.max(1, Math.floor(coords.length / 20));
        for (let i = step; i < coords.length - 1; i += step) {
            const p1 = coords[i];
            const p2 = coords[Math.min(i + 1, coords.length - 1)];
            const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI);

            L.marker(p1, {
                icon: L.divIcon({
                    className: 'route-arrow',
                    html: `<div style="
            transform: rotate(${90 - angle}deg);
            color: #3b82f6; font-size: 14px;
            text-shadow: 0 0 3px white, 0 0 6px white;
            font-weight: bold;
          ">▲</div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7],
                }),
                interactive: false,
            }).addTo(this.routeLayer);
        }
    }

    // ============== ROUTE INFO DISPLAY ==============

    showRouteInfo(route) {
        const distance = route.distance; // meters
        const duration = route.duration; // seconds

        const distText = distance >= 1000
            ? `${(distance / 1000).toFixed(1)} km`
            : `${Math.round(distance)} m`;

        const hours = Math.floor(duration / 3600);
        const mins = Math.ceil((duration % 3600) / 60);
        let timeText = '';
        if (hours > 0) timeText += `${hours} giờ `;
        timeText += `${mins} phút`;

        this.routeInfo.innerHTML = `
      <div class="route-info-cards">
        <div class="route-info-card">
          <div class="route-info-icon">📏</div>
          <div class="route-info-value">${distText}</div>
          <div class="route-info-label">Khoảng cách</div>
        </div>
        <div class="route-info-card">
          <div class="route-info-icon">⏱️</div>
          <div class="route-info-value">${timeText}</div>
          <div class="route-info-label">Thời gian</div>
        </div>
      </div>
    `;
        this.routeInfo.style.display = 'block';
    }

    showRouteSteps(route) {
        const legs = route.legs;
        if (!legs || legs.length === 0) {
            this.routeSteps.style.display = 'none';
            return;
        }

        let stepsHtml = '<h4>📋 Chỉ dẫn đường đi</h4><div class="steps-list">';

        legs.forEach(leg => {
            leg.steps.forEach((step, idx) => {
                const dist = step.distance >= 1000
                    ? `${(step.distance / 1000).toFixed(1)} km`
                    : `${Math.round(step.distance)} m`;

                const icon = this.getStepIcon(step.maneuver?.type, step.maneuver?.modifier);
                const name = step.name || 'đường không tên';
                const instruction = this.buildInstruction(step);

                stepsHtml += `
          <div class="step-item" data-lat="${step.maneuver?.location?.[1]}" data-lng="${step.maneuver?.location?.[0]}">
            <div class="step-icon">${icon}</div>
            <div class="step-content">
              <div class="step-instruction">${instruction}</div>
              <div class="step-detail">${name} • ${dist}</div>
            </div>
          </div>
        `;
            });
        });

        stepsHtml += '</div>';
        this.routeSteps.innerHTML = stepsHtml;
        this.routeSteps.style.display = 'block';

        // Click to fly to step location
        this.routeSteps.querySelectorAll('.step-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lng = parseFloat(item.dataset.lng);
                if (!isNaN(lat) && !isNaN(lng)) {
                    this.map.flyTo([lat, lng], 17, { duration: 0.8 });
                }
            });
        });
    }

    buildInstruction(step) {
        const type = step.maneuver?.type || '';
        const modifier = step.maneuver?.modifier || '';
        const name = step.name || '';

        const instructions = {
            'depart': `Xuất phát${name ? ' trên ' + name : ''}`,
            'arrive': `Đã đến điểm đến${name ? ' tại ' + name : ''}`,
            'turn': {
                'left': `Rẽ trái${name ? ' vào ' + name : ''}`,
                'right': `Rẽ phải${name ? ' vào ' + name : ''}`,
                'slight left': `Rẽ nhẹ trái${name ? ' vào ' + name : ''}`,
                'slight right': `Rẽ nhẹ phải${name ? ' vào ' + name : ''}`,
                'sharp left': `Rẽ gấp trái${name ? ' vào ' + name : ''}`,
                'sharp right': `Rẽ gấp phải${name ? ' vào ' + name : ''}`,
                'uturn': `Quay đầu${name ? ' trên ' + name : ''}`,
                'straight': `Đi thẳng${name ? ' trên ' + name : ''}`,
            },
            'new name': `Tiếp tục${name ? ' trên ' + name : ''}`,
            'merge': `Nhập vào${name ? ' ' + name : ' đường chính'}`,
            'fork': {
                'left': `Đi theo nhánh trái${name ? ' vào ' + name : ''}`,
                'right': `Đi theo nhánh phải${name ? ' vào ' + name : ''}`,
            },
            'roundabout': `Đi vào bùng binh${name ? ', rẽ vào ' + name : ''}`,
            'rotary': `Đi vào bùng binh${name ? ', rẽ vào ' + name : ''}`,
            'end of road': {
                'left': `Cuối đường, rẽ trái${name ? ' vào ' + name : ''}`,
                'right': `Cuối đường, rẽ phải${name ? ' vào ' + name : ''}`,
            },
            'continue': `Tiếp tục${name ? ' trên ' + name : ''}`,
        };

        if (type === 'turn' || type === 'fork' || type === 'end of road') {
            return instructions[type]?.[modifier] || `${type} ${modifier}${name ? ' trên ' + name : ''}`;
        }

        return instructions[type] || `Tiếp tục${name ? ' trên ' + name : ''}`;
    }

    getStepIcon(type, modifier) {
        if (type === 'depart') return '🚩';
        if (type === 'arrive') return '🏁';
        if (type === 'roundabout' || type === 'rotary') return '🔄';

        if (modifier?.includes('left')) return '⬅️';
        if (modifier?.includes('right')) return '➡️';
        if (modifier === 'uturn') return '↩️';
        if (modifier === 'straight' || type === 'new name' || type === 'continue') return '⬆️';

        return '➡️';
    }

    // ============== NAVIGATION BUTTON ==============

    showNavButton() {
        const navBar = document.getElementById('nav-bar');
        const btnStart = document.getElementById('btn-start-nav');
        const btnStop = document.getElementById('btn-stop-nav');
        if (navBar) navBar.style.display = 'flex';
        if (btnStart) btnStart.style.display = 'inline-flex';
        if (btnStop) btnStop.style.display = 'none';
    }

    hideNavButton() {
        const navBar = document.getElementById('nav-bar');
        if (navBar) navBar.style.display = 'none';
    }

    // ============== REAL-TIME NAVIGATION ==============

    startNavigation() {
        if (!this.routeCoords || this.routeCoords.length === 0) {
            showToast('Chưa có tuyến đường. Hãy tìm đường trước.', 'error');
            return;
        }

        if (!navigator.geolocation) {
            showToast('Trình duyệt không hỗ trợ GPS', 'error');
            return;
        }

        this.isNavigating = true;
        this.navPositionHistory = [];
        this.offRouteCount = 0;

        // Update UI
        const btnStart = document.getElementById('btn-start-nav');
        const btnStop = document.getElementById('btn-stop-nav');
        const navStatus = document.getElementById('nav-status');
        if (btnStart) btnStart.style.display = 'none';
        if (btnStop) btnStop.style.display = 'inline-flex';
        if (navStatus) {
            navStatus.style.display = 'block';
            navStatus.innerHTML = '<span class="nav-pulse"></span> Đang định vị...';
        }

        showToast('🧭 Bắt đầu dẫn đường! Di chuyển để cập nhật vị trí.', 'success', 4000);

        // Start watching position
        this.watchId = navigator.geolocation.watchPosition(
            (pos) => this.onNavigationUpdate(pos),
            (err) => this.onNavigationError(err),
            {
                enableHighAccuracy: true,
                maximumAge: 2000,
                timeout: 10000,
            }
        );
    }

    stopNavigation() {
        this.isNavigating = false;

        // Stop watching
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        // Remove nav-specific layers
        if (this.navMarker) {
            this.map.removeLayer(this.navMarker);
            this.navMarker = null;
        }
        if (this.navAccuracyCircle) {
            this.map.removeLayer(this.navAccuracyCircle);
            this.navAccuracyCircle = null;
        }
        if (this.navTraveledLine) {
            this.map.removeLayer(this.navTraveledLine);
            this.navTraveledLine = null;
        }
        if (this.navRemainingLine) {
            this.map.removeLayer(this.navRemainingLine);
            this.navRemainingLine = null;
        }
        this.navArrowLayer.clearLayers();
        this.navPositionHistory = [];

        // Update UI
        const btnStart = document.getElementById('btn-start-nav');
        const btnStop = document.getElementById('btn-stop-nav');
        const navStatus = document.getElementById('nav-status');
        if (btnStart) btnStart.style.display = 'inline-flex';
        if (btnStop) btnStop.style.display = 'none';
        if (navStatus) navStatus.style.display = 'none';

        // Restore original route line visibility
        if (this.routeLine) {
            this.routeLine.setStyle({ opacity: 0.85 });
        }

        showToast('Đã dừng dẫn đường', 'info');
    }

    onNavigationUpdate(pos) {
        if (!this.isNavigating) return;

        const { latitude: lat, longitude: lng, accuracy, heading, speed } = pos.coords;
        const now = Date.now();

        // Throttle updates to max 1 per second
        if (now - this.lastNavUpdate < 1000) return;
        this.lastNavUpdate = now;

        // Store position history
        this.navPositionHistory.push({ lat, lng, time: now });

        // Update user marker
        this.updateNavMarker(lat, lng, accuracy, heading);

        // Find nearest point on route
        const nearest = this.findNearestRoutePoint(lat, lng);

        // Check off-route
        if (nearest.distance > this.OFF_ROUTE_THRESHOLD) {
            this.offRouteCount++;
            if (this.offRouteCount >= this.OFF_ROUTE_REROUTE_COUNT) {
                this.handleOffRoute(lat, lng);
                return;
            } else {
                this.updateNavStatus('off-route', nearest.distance);
            }
        } else {
            this.offRouteCount = 0;
            this.updateNavStatus('on-route', nearest.distance);
        }

        // Update traveled / remaining lines
        this.updateRouteProgress(nearest.index);

        // Update remaining distance/time info
        this.updateNavInfo(nearest.index);

        // Center map on user (with slight offset ahead)
        this.map.panTo([lat, lng], { animate: true, duration: 0.5 });

        // Highlight current step
        this.highlightCurrentStep(lat, lng);
    }

    onNavigationError(err) {
        if (!this.isNavigating) return;
        const msgs = {
            1: 'Bạn đã từ chối chia sẻ vị trí',
            2: 'Không xác định được vị trí',
            3: 'Hết thời gian xác định vị trí',
        };
        showToast(msgs[err.code] || 'Lỗi GPS', 'error');
    }

    // ============== NAV MARKER ==============

    updateNavMarker(lat, lng, accuracy, heading) {
        // Heading arrow rotation
        const rotation = (heading !== null && !isNaN(heading)) ? heading : 0;

        if (!this.navMarker) {
            // Create user position marker
            this.navMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'nav-user-marker',
                    html: `<div class="nav-dot" style="transform:rotate(${rotation}deg)">
                        <div class="nav-dot-inner"></div>
                        <div class="nav-dot-arrow"></div>
                        <div class="nav-dot-pulse"></div>
                    </div>`,
                    iconSize: [44, 44],
                    iconAnchor: [22, 22],
                }),
                zIndexOffset: 2000,
                interactive: false,
            }).addTo(this.map);

            // Accuracy circle
            this.navAccuracyCircle = L.circle([lat, lng], {
                radius: Math.min(accuracy || 30, 100),
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.08,
                weight: 1,
                opacity: 0.3,
                interactive: false,
            }).addTo(this.map);
        } else {
            // Smoothly update position
            this.navMarker.setLatLng([lat, lng]);
            this.navMarker.setIcon(L.divIcon({
                className: 'nav-user-marker',
                html: `<div class="nav-dot" style="transform:rotate(${rotation}deg)">
                    <div class="nav-dot-inner"></div>
                    <div class="nav-dot-arrow"></div>
                    <div class="nav-dot-pulse"></div>
                </div>`,
                iconSize: [44, 44],
                iconAnchor: [22, 22],
            }));
            this.navAccuracyCircle.setLatLng([lat, lng]);
            this.navAccuracyCircle.setRadius(Math.min(accuracy || 30, 100));
        }
    }

    // ============== ROUTE PROGRESS ==============

    findNearestRoutePoint(lat, lng) {
        let minDist = Infinity;
        let nearestIdx = 0;

        for (let i = 0; i < this.routeCoords.length; i++) {
            const d = this.haversineDistance(lat, lng, this.routeCoords[i][0], this.routeCoords[i][1]);
            if (d < minDist) {
                minDist = d;
                nearestIdx = i;
            }
        }

        return { index: nearestIdx, distance: minDist };
    }

    haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    updateRouteProgress(nearestIdx) {
        if (!this.routeCoords) return;

        // Hide original route line
        if (this.routeLine) {
            this.routeLine.setStyle({ opacity: 0 });
        }

        // Traveled portion (green)
        const traveled = this.routeCoords.slice(0, nearestIdx + 1);
        if (this.navTraveledLine) {
            this.navTraveledLine.setLatLngs(traveled);
        } else {
            this.navTraveledLine = L.polyline(traveled, {
                color: '#22c55e',
                weight: 7,
                opacity: 0.7,
                lineJoin: 'round',
                lineCap: 'round',
            }).addTo(this.map);
        }

        // Remaining portion (blue)
        const remaining = this.routeCoords.slice(nearestIdx);
        if (this.navRemainingLine) {
            this.navRemainingLine.setLatLngs(remaining);
        } else {
            this.navRemainingLine = L.polyline(remaining, {
                color: '#3b82f6',
                weight: 6,
                opacity: 0.85,
                lineJoin: 'round',
                lineCap: 'round',
            }).addTo(this.map);
        }
    }

    updateNavInfo(nearestIdx) {
        if (!this.routeCoords) return;

        // Calculate remaining distance
        let remaining = 0;
        for (let i = nearestIdx; i < this.routeCoords.length - 1; i++) {
            remaining += this.haversineDistance(
                this.routeCoords[i][0], this.routeCoords[i][1],
                this.routeCoords[i + 1][0], this.routeCoords[i + 1][1]
            );
        }

        // Rough time estimate (assume avg 40 km/h in city)
        const avgSpeedMps = 40 * 1000 / 3600; // ~11 m/s
        const timeRemaining = remaining / avgSpeedMps;

        const distText = remaining >= 1000
            ? `${(remaining / 1000).toFixed(1)} km`
            : `${Math.round(remaining)} m`;

        const hours = Math.floor(timeRemaining / 3600);
        const mins = Math.ceil((timeRemaining % 3600) / 60);
        let timeText = '';
        if (hours > 0) timeText += `${hours} giờ `;
        timeText += `${mins} phút`;

        // Progress percentage
        const progress = Math.round((nearestIdx / (this.routeCoords.length - 1)) * 100);

        // Update info panel
        if (this.routeInfo) {
            this.routeInfo.innerHTML = `
                <div class="route-info-cards">
                    <div class="route-info-card">
                        <div class="route-info-icon">📏</div>
                        <div class="route-info-value">${distText}</div>
                        <div class="route-info-label">Còn lại</div>
                    </div>
                    <div class="route-info-card">
                        <div class="route-info-icon">⏱️</div>
                        <div class="route-info-value">${timeText}</div>
                        <div class="route-info-label">Ước tính</div>
                    </div>
                </div>
                <div class="nav-progress-bar">
                    <div class="nav-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="nav-progress-text">${progress}% hoàn thành</div>
            `;
            this.routeInfo.style.display = 'block';
        }

        // Check if arrived
        if (remaining < 30) {
            this.onArrived();
        }
    }

    // ============== NAV STATUS ==============

    updateNavStatus(status, distance) {
        const navStatus = document.getElementById('nav-status');
        if (!navStatus) return;

        if (status === 'on-route') {
            navStatus.innerHTML = `<span class="nav-pulse on-route"></span> Đang dẫn đường • ${Math.round(distance)}m từ tuyến`;
            navStatus.className = 'nav-status on-route';
        } else {
            navStatus.innerHTML = `<span class="nav-pulse off-route"></span> Lệch tuyến ${Math.round(distance)}m — Đang tính lại...`;
            navStatus.className = 'nav-status off-route';
        }
    }

    highlightCurrentStep(lat, lng) {
        const stepItems = this.routeSteps?.querySelectorAll('.step-item');
        if (!stepItems || stepItems.length === 0) return;

        let minDist = Infinity;
        let closestStep = null;

        stepItems.forEach(item => {
            item.classList.remove('step-active');
            const sLat = parseFloat(item.dataset.lat);
            const sLng = parseFloat(item.dataset.lng);
            if (isNaN(sLat) || isNaN(sLng)) return;
            const d = this.haversineDistance(lat, lng, sLat, sLng);
            if (d < minDist) {
                minDist = d;
                closestStep = item;
            }
        });

        if (closestStep) {
            closestStep.classList.add('step-active');
            closestStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // ============== OFF-ROUTE & REROUTE ==============

    async handleOffRoute(lat, lng) {
        showToast('⚠️ Bạn đã lệch tuyến. Đang tìm đường mới...', 'warning');
        this.offRouteCount = 0;

        // Update start to current position
        this.startCoords = { lat, lng };
        this.startInput.value = 'Vị trí hiện tại';

        // Remove old lines
        if (this.navTraveledLine) {
            this.map.removeLayer(this.navTraveledLine);
            this.navTraveledLine = null;
        }
        if (this.navRemainingLine) {
            this.map.removeLayer(this.navRemainingLine);
            this.navRemainingLine = null;
        }

        // Recalculate route from current position
        try {
            const { lng: sLng, lat: sLat } = this.startCoords;
            const { lng: eLng, lat: eLat } = this.endCoords;

            const url = `${this.OSRM_URL}/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson&steps=true`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.code === 'Ok' && data.routes?.length > 0) {
                const route = data.routes[0];
                this.routeCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);

                // Update route line
                if (this.routeLine) {
                    this.routeLayer.removeLayer(this.routeLine);
                }
                this.routeLine = L.polyline(this.routeCoords, {
                    color: '#3b82f6',
                    weight: 6,
                    opacity: 0,
                    lineJoin: 'round',
                    lineCap: 'round',
                }).addTo(this.routeLayer);

                // Rebuild remaining line
                this.navRemainingLine = L.polyline(this.routeCoords, {
                    color: '#3b82f6',
                    weight: 6,
                    opacity: 0.85,
                    lineJoin: 'round',
                    lineCap: 'round',
                }).addTo(this.map);

                // Update steps
                this.showRouteSteps(route);
                showToast('✅ Đã tìm đường mới!', 'success');
            }
        } catch (err) {
            console.error('Reroute error:', err);
            showToast('Không thể tính lại đường. Kiểm tra mạng.', 'error');
        }
    }

    // ============== ARRIVED ==============

    onArrived() {
        showToast('🎉 Bạn đã đến nơi!', 'success', 5000);
        this.stopNavigation();

        const navStatus = document.getElementById('nav-status');
        if (navStatus) {
            navStatus.style.display = 'block';
            navStatus.innerHTML = '🎉 Đã đến nơi!';
            navStatus.className = 'nav-status arrived';
        }
    }

    // ============== CLEAR ==============

    clearRoute() {
        // Stop navigation if active
        if (this.isNavigating) {
            this.stopNavigation();
        }

        this.routeLayer.clearLayers();
        this.startMarker = null;
        this.endMarker = null;
        this.startCoords = null;
        this.endCoords = null;
        this.routeLine = null;
        this.routeCoords = null;

        if (this.startInput) this.startInput.value = '';
        if (this.endInput) this.endInput.value = '';
        if (this.routeInfo) {
            this.routeInfo.innerHTML = '';
            this.routeInfo.style.display = 'none';
        }
        if (this.routeSteps) {
            this.routeSteps.innerHTML = '';
            this.routeSteps.style.display = 'none';
        }

        this.hideNavButton();
        this.stopPickMode();
        showToast('Đã xóa tuyến đường', 'info');
    }
}
