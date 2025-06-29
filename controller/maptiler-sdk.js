// maptiler-sdk.js
const axios = require('axios');

function maptilerGeocoding(apiKey) {
  const baseUrl = 'https://api.maptiler.com/geocoding';

  return {
    forwardGeocode: async (query, limit = 1) => {
      try {
        const url = `${baseUrl}/${encodeURIComponent(query)}.json`;
        const res = await axios.get(url, {
          params: {
            key: apiKey,
            limit
          }
        });

        // ✅ Return array of results
        return res.data.features.map(f => ({
          name: f.place_name,
          coordinates: f.geometry.coordinates
        }));

      } catch (err) {
        console.error('Geocoding error:', err.response?.data || err.message);
        return []; // return empty array to avoid crash
      }
    }
  };
}

module.exports = maptilerGeocoding;
