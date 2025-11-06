  
    // initialize map
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // sample data with city, severity, status and image
    const sampleReports = [
      { id:1, title: 'Big pothole near market road', city: 'Mumbai', severity: 'high', status:'reported', description: 'Needs urgent repair', latitude: 19.0760, longitude: 72.8777, image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Pothole_in_asphalt.jpg' },
      { id:2, title: 'Cracked road near school', city: 'New Delhi', severity: 'medium', status:'in_progress', description: 'Deep crack across lane', latitude: 28.6139, longitude: 77.2090, image: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Pothole_in_a_road.jpg' },
      { id:3, title: 'Huge pit after rain', city: 'Bengaluru', severity: 'high', status:'reported', description: 'Dangerous for two-wheelers', latitude: 12.9716, longitude: 77.5946, image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Pothole_damage.jpg' },
      { id:4, title: 'Broken patch near hospital', city: 'Chennai', severity: 'medium', status:'fixed', description: 'Ambulances struggle here', latitude: 13.0827, longitude: 80.2707, image: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Deep_pothole.jpg' },
      { id:5, title: 'Uneven surface near bridge', city: 'Kolkata', severity: 'low', status:'reported', description: 'Needs leveling', latitude: 22.5726, longitude: 88.3639, image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Pothole_closeup.jpg' }
    ];

    // marker management
    let markersLayer = L.layerGroup().addTo(map);
    let clusterGroup = L.markerClusterGroup();
    let heatLayer = null;

    // populate city filter
    const citySet = new Set(sampleReports.map(r => r.city));
    const citySelect = document.getElementById('filterCity');
    citySet.forEach(c => { const opt = document.createElement('option'); opt.value=c; opt.textContent=c; citySelect.appendChild(opt); });

    function createMarker(r) {
      const marker = L.marker([r.latitude, r.longitude]);
      const popupHtml = `
        <div style="min-width:180px">
          <strong>${escapeHtml(r.title)}</strong><br>
          <small>${escapeHtml(r.city)} — ${r.severity} — ${statusLabel(r.status)}</small>
          <p style="margin:6px 0">${escapeHtml(r.description)}</p>
          <img src="${r.image}" class="popup-img" alt="pothole">
          <div style="margin-top:6px">
            <a target="_blank" rel="noopener" href="${streetViewUrl(r.latitude,r.longitude)}" class="text-sm text-blue-600">Open Street View</a>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      return marker;
    }

    function renderMarkers({useCluster=true, useHeat=false, filters={}} = {}) {
      // clear layers
      markersLayer.clearLayers();
      clusterGroup.clearLayers();
      if (heatLayer) { map.removeLayer(heatLayer); heatLayer = null; }

      const points = [];
      const filtered = sampleReports.filter(r => {
        if (filters.city && r.city !== filters.city) return false;
        if (filters.severity && r.severity !== filters.severity) return false;
        if (filters.status && r.status !== filters.status) return false;
        return true;
      });

      filtered.forEach(r => {
        if (r.latitude && r.longitude) {
          points.push([r.latitude, r.longitude, 1]);
          const m = createMarker(r);
          if (useCluster) clusterGroup.addLayer(m); else markersLayer.addLayer(m);
        }
      });

      if (useCluster) {
        if (!map.hasLayer(clusterGroup)) map.addLayer(clusterGroup);
        if (map.hasLayer(markersLayer)) map.removeLayer(markersLayer);
      } else {
        if (!map.hasLayer(markersLayer)) map.addLayer(markersLayer);
        if (map.hasLayer(clusterGroup)) map.removeLayer(clusterGroup);
      }

      if (useHeat && points.length) {
        heatLayer = L.heatLayer(points, {radius: 25, blur: 10, opacity: 0.9, maxZoom: 17,
        gradient:{
          0.1: 'blue',
          0.3: 'cyan',
          0.5: 'lime',
          0.7: 'yellow',
          0.9: 'orange',
          1.0: 'red'
        }}).addTo(map);
      }
    }

    // initial render
    renderMarkers({useCluster: document.getElementById('toggleCluster').checked, useHeat: document.getElementById('toggleHeat').checked, filters:{}});

    // control events
    document.getElementById('toggleCluster').addEventListener('change', () => {
      applyFiltersAndRender();
    });
    document.getElementById('toggleHeat').addEventListener('change', () => {
      applyFiltersAndRender();
    });

    document.getElementById('filterCity').addEventListener('change', applyFiltersAndRender);
    document.getElementById('filterSeverity').addEventListener('change', applyFiltersAndRender);
    document.getElementById('filterStatus').addEventListener('change', applyFiltersAndRender);

    function applyFiltersAndRender() {
      const filters = {
        city: document.getElementById('filterCity').value,
        severity: document.getElementById('filterSeverity').value,
        status: document.getElementById('filterStatus').value
      };
      renderMarkers({useCluster: document.getElementById('toggleCluster').checked, useHeat: document.getElementById('toggleHeat').checked, filters});
    }

    // search using Nominatim (OpenStreetMap)
    async function geocode(query) {
      const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query);
      const res = await fetch(url, { headers: { 'Accept': 'application/json' }});
      const json = await res.json();
      return json; // array of results
    }

    document.getElementById('searchBtn').addEventListener('click', async () => {
      const q = document.getElementById('searchInput').value.trim();
      if (!q) return;
      // if looks like coords
      const coordMatch = q.match(/^\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*$/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]); const lon = parseFloat(coordMatch[2]);
        map.setView([lat, lon], 16);
        L.popup().setLatLng([lat, lon]).setContent('Search location').openOn(map);
        return;
      }
      // else geocode
      try {
        const results = await geocode(q);
        if (results && results.length) {
          const r = results[0];
          const lat = parseFloat(r.lat); const lon = parseFloat(r.lon);
          map.setView([lat, lon], 16);
          L.popup().setLatLng([lat, lon]).setContent(r.display_name).openOn(map);
        } else {
          alert('No results found');
        }
      } catch (e) { alert('Geocoding failed'); }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('filterCity').value = '';
      document.getElementById('filterSeverity').value = '';
      document.getElementById('filterStatus').value = '';
      document.getElementById('searchInput').value = '';
      document.getElementById('toggleHeat').checked = false;
      document.getElementById('toggleCluster').checked = true;
      applyFiltersAndRender();
      map.setView([20.5937,78.9629],5);
    });

    // helpers
    function streetViewUrl(lat, lon) {
      return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
    }
    function statusLabel(s) {
      if (s === 'reported') return 'Pending';
      if (s === 'in_progress') return 'In Progress';
      if (s === 'fixed') return 'Fixed';
      return s;
    }
    function escapeHtml(unsafe) {
      return String(unsafe).replace(/[&<"'`=\/]/g, function (s) { return ({'&':'&amp;','<':'&lt;','"':'&quot;','\'':'&#39;','/':'&#47;','`':'&#96;','=':'&#61;'}[s]); });
    }
