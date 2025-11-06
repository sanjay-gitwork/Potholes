
    const toast = document.getElementById('toast');
    toast.style.display = 'none';

    // Initialize Map
    const mapmark = L.map('mapmark').setView([23.3441, 85.3096], 13); // Default Ranchi
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapmark);

    let marker;

    // On map click - select coordinates
    mapmark.on('click', function(e) {
      if (marker) marker.remove();
      marker = L.marker(e.latlng).addTo(mapmark);
      document.getElementById('latitude').value = e.latlng.lat.toFixed(6);
      document.getElementById('longitude').value = e.latlng.lng.toFixed(6);
    });

    // City coordinates
    const cityCoords = {
      Ranchi: [23.3441, 85.3096],
      Patna: [25.5941, 85.1376],
      Kolkata: [22.5726, 88.3639],
      Delhi: [28.6139, 77.2090],
      Mumbai: [19.0760, 72.8777]
    };

    // When city changes, move map to that city
    document.getElementById('citySelect').addEventListener('change', function() {
      const city = this.value;
      if (city && cityCoords[city]) {
        const [lat, lng] = cityCoords[city];
        mapmark.setView([lat, lng], 13);

        if (marker) marker.remove();
        marker = L.marker([lat, lng]).addTo(mapmark);
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
      }
    });

    // Location Button
    document.getElementById('geoBtn').addEventListener('click', () => {
      const msg = document.getElementById('toast');
      msg.textContent = 'Fetching location...';
      msg.style.background = '#2563eb';
      showToast();

      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);

        mapmark.setView([lat, lng], 16);
        if (marker) marker.remove();
        marker = L.marker([lat, lng]).addTo(mapmark);

        msg.textContent = 'Location added!';
        msg.style.background = '#16a34a';
        showToast();
      }, err => {
        msg.textContent = 'Error: ' + err.message;
        msg.style.background = '#dc2626';
        showToast();
      });
    });

    // Image Preview
    document.getElementById('photo').addEventListener('change', e => {
      const file = e.target.files[0];
      const preview = document.getElementById('preview');
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          preview.src = e.target.result;
          preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      } else {
        preview.classList.add('hidden');
      }
    });

    // Submit Form
    document.getElementById('reportForm').addEventListener('submit', (e) => {
      e.preventDefault();
      toast.textContent = 'Report submitted successfully (demo only).';
      toast.style.background = '#16a34a';
      showToast();
      e.target.reset();
      document.getElementById('preview').classList.add('hidden');
      if (marker) marker.remove();
    });

    // Toast Function
    function showToast() {
      toast.style.display = 'block';
      setTimeout(() => toast.classList.add('show'), 50);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.style.display = 'none', 400);
      }, 3000);
    }
  