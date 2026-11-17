/* src/components/user/MapSection.js */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Spinner, Card, Button } from "react-bootstrap";
import L from "leaflet";
import axios from "axios";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import "./MapSection.css";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

// Custom map icons (unchanged)
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/855/855703.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Helper child to pan the map when coords change
function PanTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords?.lat != null && coords?.lng != null) {
      map.setView([coords.lat, coords.lng], Math.max(map.getZoom(), 15), {
        animate: true,
      });
    }
  }, [coords, map]);
  return null;
}

export default function MapSection({ verified, focusCoords }) {
  const [userPosition, setUserPosition] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);

  // get location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latLng = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(latLng);
        fetchVehicles(latLng[0], latLng[1]);
      },
      (err) => {
        console.error("❌ Location access denied:", err);
        setLoading(false);
      }
    );
  }, []);

  const fetchVehicles = async (lat, lng) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}vehicles/nearby/`, {
        headers,
        params: { latitude: lat, longitude: lng },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (vehicle) => {
    if (!verified) {
      alert("⚠️ Account not verified! Please wait for admin approval.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const body = {
        vehicle_id: vehicle.vehicle_id,
        vehicle_name: vehicle.vehicle_name,
        latitude: userPosition?.[0],
        longitude: userPosition?.[1],
      };
      const res = await axios.post(`${API_BASE}rides/book/`, body, { headers });
      setActiveRide(res.data);
      alert(`✅ ${res.data.message}\nVehicle: ${res.data.vehicle_name}`);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed! Please try again.");
    }
  };

  const handleEndRide = async () => {
    if (!activeRide) return;
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const body = {
        vehicle_name: activeRide.vehicle_name,
        duration: Math.floor(Math.random() * 20) + 5,
        distance: (Math.random() * 5 + 1).toFixed(2),
      };
      const res = await axios.post(`${API_BASE}rides/end/`, body, { headers });
      alert(`✅ Ride Completed!\nVehicle: ${res.data.vehicle_name}\nFare: ₹${res.data.total_fare}`);
      setActiveRide(null);
    } catch (err) {
      console.error("End Ride error:", err);
      alert("Failed to end ride!");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />{" "}
        <p className="mt-2 text-muted">Loading Map...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="map-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border-0 rounded-4 mb-4">
        <Card.Body>
          <h4 className="fw-bold text-dark mb-3">🗺️ Nearby Scooters & Bikes</h4>

          {activeRide && (
            <div className="active-ride text-center py-3 mb-3 rounded-3 shadow-sm bg-light">
              <h5>🚴 Active Ride: {activeRide.vehicle_name}</h5>
              <p className="text-muted mb-1">
                Started: {activeRide.start_time || "Just now"} | Status:{" "}
                <strong>{activeRide.status || "Ongoing"}</strong>
              </p>
              <Button variant="danger" size="sm" onClick={handleEndRide} className="mt-2">
                End Ride
              </Button>
            </div>
          )}

          {userPosition ? (
            <MapContainer
              center={userPosition}
              zoom={15}
              scrollWheelZoom
              className="rounded-4"
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Pan when focusCoords changes */}
              <PanTo coords={focusCoords} />

              <Marker position={userPosition} icon={userIcon}>
                <Popup>
                  <strong>You’re here</strong> <br /> Ready to ride 🚴‍♂️
                </Popup>
              </Marker>

              <Circle center={userPosition} radius={500} pathOptions={{ color: "#007bff", fillOpacity: 0.1 }} />

              {vehicles.length > 0 ? (
                vehicles.map((v, index) => (
                  <Marker key={index} position={[v.latitude, v.longitude]} icon={vehicleIcon}>
                    <Popup>
                      <strong>{v.vehicle_name}</strong>
                      <br />
                      Battery: {v.battery_level}%<br />
                      Status: {v.is_available ? (
                        <span className="text-success">Available</span>
                      ) : (
                        <span className="text-danger">In Use</span>
                      )}
                      <br />
                      <Button
                        className="btn btn-sm btn-primary mt-2"
                        disabled={!verified || !v.is_available}
                        onClick={() => handleBookRide(v)}
                      >
                        {verified ? "Book Ride" : "Locked"}
                      </Button>
                    </Popup>
                  </Marker>
                ))
              ) : (
                <p className="text-center text-muted mt-3">No vehicles nearby right now.</p>
              )}
            </MapContainer>
          ) : (
            <p className="text-center text-muted">📍 Location not available.</p>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
}
