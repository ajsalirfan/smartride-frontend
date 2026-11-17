/* ==========================================================
   🚗 VehicleCard.jsx — Smart Ride Final Production Edition
   ========================================================== */
import React from "react";
import { motion } from "framer-motion";
import { Heart, Battery, Wrench, Lock, Unlock } from "lucide-react";
import "../../styles/UserHome.css";

export default function VehicleCard({
  vehicle,
  onBook,
  onFavorite,
  isFavorite,
  locked,
}) {
  if (!vehicle) return null;

  const {
    vehicle_id,
    name,
    vehicle_type,
    battery_level,
    status,
    photo,
    current_zone,
  } = vehicle;

  /* 🧠 Determine status color & label */
  const getStatusBadge = () => {
    const s = (status || "").toLowerCase();
    if (s.includes("active")) return { color: "#00ffcc", label: "Active" };
    if (s.includes("maintenance")) return { color: "#ffaa00", label: "Under Service" };
    if (s.includes("in use")) return { color: "#ff6b6b", label: "In Use" };
    if (s.includes("offline")) return { color: "#888", label: "Offline" };
    return { color: "#ccc", label: "Unknown" };
  };
  const badge = getStatusBadge();

  /* 🔋 Battery level display */
  const getBatteryBar = () => {
    const color =
      battery_level >= 60
        ? "#00ffb2"
        : battery_level >= 30
        ? "#ffaa00"
        : "#ff5555";
    return (
      <div
        className="d-flex align-items-center mt-1"
        style={{ gap: 4, fontSize: "12px", color: color }}
      >
        <Battery size={14} />
        <div
          style={{
            flexGrow: 1,
            background: "rgba(255,255,255,0.08)",
            borderRadius: "4px",
            overflow: "hidden",
            height: "6px",
            width: "60%",
          }}
        >
          <div
            style={{
              width: `${battery_level}%`,
              height: "100%",
              background: color,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <span>{battery_level}%</span>
      </div>
    );
  };

  return (
    <motion.div
      className="vehicle-card uh-card position-relative text-light"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.6 : 1,
      }}
    >
      {/* 🖼️ Vehicle Image */}
      <div className="vehicle-media position-relative">
        <img
          src={photo || "/default_vehicle.jpg"}
          alt={name || vehicle_type}
          className="img-fluid rounded-top"
          style={{
            height: "150px",
            width: "100%",
            objectFit: "cover",
            filter:
              badge.label === "Under Service" || badge.label === "Offline"
                ? "grayscale(0.7) brightness(0.8)"
                : "none",
          }}
        />

        {/* 🔒 Locked Overlay */}
        {locked && (
          <div className="vehicle-overlay">
            <div className="vehicle-card-locked">
              <Lock size={20} className="me-1" />
              View Only
            </div>
          </div>
        )}

        {/* 💛 Favorite Button */}
        {!locked && (
          <motion.div
            whileTap={{ scale: 0.8 }}
            onClick={onFavorite}
            className="position-absolute top-0 end-0 m-2"
            style={{
              color: isFavorite ? "#ff4081" : "#bbb",
              cursor: "pointer",
              background: "rgba(0,0,0,0.35)",
              borderRadius: "50%",
              padding: "5px",
            }}
          >
            <Heart
              size={18}
              fill={isFavorite ? "#ff4081" : "none"}
              strokeWidth={1.8}
            />
          </motion.div>
        )}
      </div>

      {/* 🧾 Vehicle Info */}
      <div className="p-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0 text-truncate" title={name}>
            {name || vehicle_type}
          </h6>
          <span
            className="small fw-semibold"
            style={{
              color: badge.color,
              textShadow: `0 0 6px ${badge.color}`,
              fontSize: "12px",
            }}
          >
            {badge.label}
          </span>
        </div>

        <p className="small text-muted mb-1">
          📍 {current_zone || "Location unknown"}
        </p>

        {getBatteryBar()}

        {/* 🚗 Action Buttons */}
        <div className="mt-3 d-flex justify-content-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            disabled={locked || badge.label !== "Active"}
            onClick={onBook}
            className="btn btn-sm uh-btn-glow fw-semibold"
          >
            {locked ? <Lock size={14} /> : <Unlock size={14} />}{" "}
            {locked ? "Locked" : badge.label === "Active" ? "Book Ride" : "Unavailable"}
          </motion.button>

          {badge.label === "Under Service" && (
            <div className="d-flex align-items-center text-warning small">
              <Wrench size={14} className="me-1" /> Maintenance
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
