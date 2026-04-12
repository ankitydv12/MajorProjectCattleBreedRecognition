import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VetFinderPage.css';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const vetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function VetFinderPage() {
  const [userLoc, setUserLoc] = useState(null);
  const [vets, setVets] = useState([]);
  const [radius, setRadius] = useState(5000); // in meters
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualCity, setManualCity] = useState('');

  // Default to India center if no location
  const defaultCenter = [20.5937, 78.9629];

  const getLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLoc({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        setError('Location access denied. Please enter a city manually.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (userLoc) {
      fetchVets();
    }
  }, [userLoc, radius]);

  const fetchVets = async () => {
    if (!userLoc) return;

    setLoading(true);
    setError(null);

    const query = `
      [out:json];
      (
        node["amenity"="veterinary"](around:${radius},${userLoc.lat},${userLoc.lng});
        way["amenity"="veterinary"](around:${radius},${userLoc.lat},${userLoc.lng});
        relation["amenity"="veterinary"](around:${radius},${userLoc.lat},${userLoc.lng});
      );
      out center;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      const parsedVets = data.elements.map(el => {
        const lat = el.type === 'node' ? el.lat : el.center.lat;
        const lon = el.type === 'node' ? el.lon : el.center.lon;
        const name = el.tags.name || el.tags['name:en'] || 'Veterinary Clinic';

        // Calculate distance
        const R = 6371e3; // metres
        const φ1 = userLoc.lat * Math.PI/180; // φ, λ in radians
        const φ2 = lat * Math.PI/180;
        const Δφ = (lat - userLoc.lat) * Math.PI/180;
        const Δλ = (lon - userLoc.lng) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const distance = R * c; // in metres

        // Build address
        let addressParts = [];
        if (el.tags['addr:street']) addressParts.push(el.tags['addr:street']);
        if (el.tags['addr:city']) addressParts.push(el.tags['addr:city']);
        const address = addressParts.join(', ') || 'Address not available';

        return {
          id: el.id,
          lat,
          lon,
          name,
          distance,
          address,
          phone: el.tags.phone || el.tags['contact:phone'] || null
        };
      }).sort((a, b) => a.distance - b.distance);

      setVets(parsedVets);
      if (parsedVets.length === 0) {
        setError('No veterinarians found nearby. Try increasing the search radius.');
      }
    } catch (err) {
      setError('Error connecting to the veterinary database. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!manualCity) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualCity)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setUserLoc({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      } else {
        setError('City not found. Please try another name.');
      }
    } catch (err) {
       setError('Error searching for city.');
    } finally {
      setLoading(false);
    }
  };

  const getDirectionsUrl = (lat, lon) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  };

  return (
    <div className="page vet-finder-page">
      <header className="vet-finder-header">
        <h1 className="section-title">🏥 Find Nearby Veterinarian</h1>
        <p className="section-subtitle">Locate veterinary services near you</p>
      </header>

      <div className="vet-finder-controls glass-card">
        <div className="location-controls">
          <button onClick={getLocation} className="btn-primary use-location-btn" disabled={loading}>
            📍 Use My Location
          </button>

          <form onSubmit={handleManualSearch} className="manual-search-form">
            <input
              type="text"
              placeholder="Or enter city manually..."
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              className="manual-city-input"
            />
            <button type="submit" className="btn-secondary" disabled={loading || !manualCity}>Search</button>
          </form>
        </div>

        <div className="radius-selector">
          <label>Search Radius: </label>
          <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="radius-select">
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
          </select>
        </div>
      </div>

      {error && <div className="vet-error-message prediction-warning">{error}</div>}

      {loading && (
         <div className="loading-spinner">
           <div className="spinner"></div>
           <p>Searching for veterinarians...</p>
         </div>
      )}

      <div className="vet-finder-content">
        <div className="map-container glass-card">
          <MapContainer
            center={userLoc ? [userLoc.lat, userLoc.lng] : defaultCenter}
            zoom={userLoc ? 12 : 4}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-md)', zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLoc && (
              <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {vets.map(vet => (
              <Marker key={vet.id} position={[vet.lat, vet.lon]} icon={vetIcon}>
                <Popup>
                  <strong>{vet.name}</strong><br/>
                  {vet.address}
                </Popup>
              </Marker>
            ))}
            <MapUpdater center={userLoc ? [userLoc.lat, userLoc.lng] : null} />
          </MapContainer>
        </div>

        <div className="vet-list-container">
          <h2 className="vet-list-title">Nearby Veterinarians ({vets.length})</h2>
          {vets.length > 0 ? (
            <div className="vet-list">
              {vets.map(vet => (
                <div key={vet.id} className="vet-card card">
                  <div className="vet-card-header">
                    <h3 className="vet-name">{vet.name}</h3>
                    <span className="vet-distance">{(vet.distance / 1000).toFixed(1)} km</span>
                  </div>
                  <div className="vet-card-body">
                    <p className="vet-address">📍 {vet.address}</p>
                    {vet.phone && <p className="vet-phone">📞 <a href={`tel:${vet.phone}`}>{vet.phone}</a></p>}
                  </div>
                  <div className="vet-card-actions">
                     <a
                       href={getDirectionsUrl(vet.lat, vet.lon)}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="btn-primary directions-btn"
                     >
                       🗺️ Get Directions
                     </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             !loading && userLoc && !error && <p className="no-vets-msg">No veterinarians found within the selected radius.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VetFinderPage;
