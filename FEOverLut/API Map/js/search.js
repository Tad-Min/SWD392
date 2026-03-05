/**
 * Search & Geocoding Module
 * Uses Nominatim (OpenStreetMap) for free geocoding
 */

class MapSearch {
    constructor(map) {
        this.map = map;
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchMarker = null;
        this.debounceTimer = null;
        this.init();
    }

    init() {
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            const query = e.target.value.trim();
            if (query.length < 2) {
                this.hideResults();
                return;
            }
            this.debounceTimer = setTimeout(() => this.search(query), 400);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults();
                this.searchInput.blur();
            }
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });
    }

    async search(query) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=8&accept-language=vi&addressdetails=1`;
            const res = await fetch(url, {
                headers: { 'User-Agent': 'VietnamRescueMap/1.0' }
            });
            const data = await res.json();

            if (data.length === 0) {
                this.showNoResults();
                return;
            }

            this.showResults(data);
        } catch (err) {
            console.error('Search error:', err);
            this.showError();
        }
    }

    showResults(results) {
        this.searchResults.innerHTML = results.map(r => {
            const name = r.display_name.split(',')[0];
            const detail = r.display_name.split(',').slice(1, 3).join(',').trim();
            const type = this.translateType(r.type);
            return `
        <div class="search-result-item" data-lat="${r.lat}" data-lng="${r.lon}" data-name="${name}">
          <div class="result-name">${name}</div>
          <div class="result-detail">${type} • ${detail}</div>
        </div>
      `;
        }).join('');

        // Add click handlers
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lng = parseFloat(item.dataset.lng);
                const name = item.dataset.name;
                this.selectResult(lat, lng, name);
            });
        });

        this.searchResults.classList.add('active');
    }

    showNoResults() {
        this.searchResults.innerHTML = `
      <div class="search-result-item" style="cursor:default">
        <div class="result-name" style="color: var(--text-muted)">Không tìm thấy kết quả</div>
        <div class="result-detail">Thử tìm kiếm với từ khóa khác</div>
      </div>
    `;
        this.searchResults.classList.add('active');
    }

    showError() {
        this.searchResults.innerHTML = `
      <div class="search-result-item" style="cursor:default">
        <div class="result-name" style="color: var(--danger)">Lỗi tìm kiếm</div>
        <div class="result-detail">Kiểm tra kết nối mạng</div>
      </div>
    `;
        this.searchResults.classList.add('active');
    }

    hideResults() {
        this.searchResults.classList.remove('active');
    }

    selectResult(lat, lng, name) {
        this.hideResults();
        this.searchInput.value = name;

        // Remove old marker
        if (this.searchMarker) {
            this.map.removeLayer(this.searchMarker);
        }

        // Add search result marker
        this.searchMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'search-marker-icon',
                html: `<div style="
          width: 32px; height: 32px;
          background: var(--accent);
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            })
        }).addTo(this.map)
            .bindPopup(`<strong>${name}</strong><br><small>${lat.toFixed(5)}, ${lng.toFixed(5)}</small>`)
            .openPopup();

        this.map.flyTo([lat, lng], 16, { duration: 1.2 });
        showToast(`Đã tìm thấy: ${name}`, 'success');
    }

    translateType(type) {
        const types = {
            'city': 'Thành phố',
            'town': 'Thị trấn',
            'village': 'Làng/Xã',
            'suburb': 'Quận/Phường',
            'road': 'Đường',
            'residential': 'Khu dân cư',
            'hamlet': 'Thôn',
            'administrative': 'Hành chính',
            'building': 'Tòa nhà',
            'hospital': 'Bệnh viện',
            'school': 'Trường học',
            'river': 'Sông',
            'stream': 'Suối',
            'peak': 'Đỉnh núi',
            'bridge': 'Cầu',
            'station': 'Ga/Trạm',
        };
        return types[type] || type || 'Địa điểm';
    }

    clearSearch() {
        this.searchInput.value = '';
        this.hideResults();
        if (this.searchMarker) {
            this.map.removeLayer(this.searchMarker);
            this.searchMarker = null;
        }
    }
}
