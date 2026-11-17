import React from "react";
import { motion } from "framer-motion";
import { Home, Map, Wallet, User } from "lucide-react";
import "../../styles/UserHome.css";

/* 🌌 Smart Ride — Bottom Navigation (Glass UI) */
export default function BottomNav({ onNavigate = {} }) {
  const navItems = [
    { label: "Home", icon: <Home size={20} />, action: onNavigate.home },
    { label: "Map", icon: <Map size={20} />, action: onNavigate.map },
    { label: "Wallet", icon: <Wallet size={20} />, action: onNavigate.wallet },
    { label: "Profile", icon: <User size={20} />, action: onNavigate.profile },
  ];

  return (
    <motion.div
      className="bottom-nav d-flex justify-content-around align-items-center py-2 px-2"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 -2px 15px rgba(0,0,0,0.3)",
        borderRadius: "20px 20px 0 0",
        position: "fixed",
        left: "50%",
        bottom: 0,
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        zIndex: 1000,
      }}
    >
      {navItems.map((item, index) => (
        <motion.div
          key={index}
          onClick={item.action}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          className="nav-item d-flex flex-column align-items-center text-light"
          style={{
            cursor: "pointer",
            textAlign: "center",
            minWidth: "60px",
            userSelect: "none",
          }}
        >
          <motion.div
            className="nav-icon mb-1"
            animate={{ y: [0, -2, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3 + index * 0.3,
              ease: "easeInOut",
            }}
            style={{
              color: "#00d4ff",
              textShadow: "0 0 8px rgba(0,255,255,0.6)",
            }}
          >
            {item.icon}
          </motion.div>

          <small
            className="nav-label text-light"
            style={{
              fontSize: "12px",
              letterSpacing: "0.5px",
              opacity: 0.85,
            }}
          >
            {item.label}
          </small>
        </motion.div>
      ))}
    </motion.div>
  );
}
