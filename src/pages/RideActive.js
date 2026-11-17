import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/Users/";

function getToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access") ||
    null
  );
}

export default function RideActive() {
  const [ride, setRide] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // Fetch current ride
  const loadRide = async () => {
    try {
      const res = await api.get("rides/current/");
      if (!res.data || !res.data.status) return;

      setRide(res.data);

      // Start timer
      const startTime = new Date(res.data.start_time).getTime();

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setSeconds(diff);
      }, 1000);

    } catch (err) {
      console.error("Ride fetch failed:", err);
    }
  };

  useEffect(() => {
    loadRide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const endRide = async () => {
    try {
      const res = await api.post("rides/end/", {
        ride_id: ride.id,
        end_location_lat: ride.start_location_lat,
        end_location_lng: ride.start_location_lng,
        end_location_name: "Completed",
      });

      if (timerRef.current) clearInterval(timerRef.current);

      alert("Ride completed!");
      window.location.href = "/user/home";
    } catch (err) {
      console.error(err);
      alert("Failed to end ride");
    }
  };

  if (!ride) return <div className="text-center mt-5">Loading Ride...</div>;

  // Time formatting
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ height: "100vh", position: "relative" }}>

      {/* Floating Timer */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "black",
          color: "white",
          padding: "8px 18px",
          borderRadius: 12,
          fontSize: 20,
          fontWeight: "bold",
          opacity: 0.9,
        }}
      >
        ⏱ {mins}:{secs.toString().padStart(2, "0")}
      </div>

      {/* Map */}
      <MapContainer
        center={[ride.start_location_lat, ride.start_location_lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[ride.start_location_lat, ride.start_location_lng]}>
          <Popup>Ride Started Here</Popup>
        </Marker>
      </MapContainer>

      {/* End Ride Button */}
      <div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center" }}>
        <Button
          onClick={endRide}
          variant="danger"
          size="lg"
          style={{
            width: "70%",
            padding: "12px",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: 14,
          }}
        >
          End Ride
        </Button>
      </div>

    </div>
  );
}
