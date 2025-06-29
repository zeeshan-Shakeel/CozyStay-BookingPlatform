
  const API_KEY = "Zru1Uihb5z1Nt4EZaiHh"; // or hardcoded string

  const map = L.map('map').setView(coords, 13);

  L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${API_KEY}`, {
    attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 9
  }).addTo(map);

  // ✅ Add a marker
  const marker = L.marker(coords).addTo(map);

  // ✅ Add a popup
  marker.bindPopup("<b>You are here!, Pakistan").openPopup();
