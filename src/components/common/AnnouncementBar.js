/* ==========================================================
   📢 AnnouncementBar.jsx
   Smart Ride — Global Admin Announcement Display
   ========================================================== */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/Users/";

export default function AnnouncementBar() {
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [visible, setVisible] = useState(true);

  /* 📨 Fetch announcements */
  useEffect(() => {
    if (!token) return;
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_BASE}notifications/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter for admin announcement types
        const filtered = (res.data || []).filter(
          (n) =>
            n.title?.toLowerCase().includes("announcement") ||
            n.message?.toLowerCase().includes("maintenance") ||
            n.message?.toLowerCase().includes("update")
        );
        setAnnouncements(filtered.slice(-3)); // keep latest 3
      } catch (err) {
        console.error("❌ Announcement fetch failed:", err);
      }
    };

    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 180000); // refresh every 3 min
    return () => clearInterval(interval);
  }, [token]);

  if (!announcements.length || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="announcement-bar text-light py-2"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,212,255,0.25), rgba(0,255,200,0.2))",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            textShadow: "0 0 8px rgba(0,255,255,0.4)",
            fontSize: "14px",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
          }}
        >
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="fw-semibold text-center"
          >
            📢{" "}
            {announcements.map((a, i) => (
              <span key={i} style={{ marginRight: 50 }}>
                {a.title ? `${a.title}: ` : ""}
                {a.message}
              </span>
            ))}
          </motion.div>

          <button
            onClick={() => setVisible(false)}
            className="btn btn-sm btn-outline-light position-absolute"
            style={{
              right: "15px",
              top: "4px",
              border: "none",
              fontSize: "12px",
              opacity: 0.7,
            }}
          >
            ✖
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
