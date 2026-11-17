/* src/components/common/PanelShell.jsx */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import "../../styles/UserHome.css";

export default function PanelShell({ show, title, icon, width = 420, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!show) return null;

  return (
    <>
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1200,
          background: "rgba(0,0,0,0.5)",
        }}
      />

      {/* panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.22 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: width,
          maxWidth: "100%",
          zIndex: 1250,
          background: "linear-gradient(180deg, rgba(6,8,12,0.98), rgba(8,10,14,0.98))",
          boxShadow: "0 10px 40px rgba(2,8,20,0.6)",
          padding: "18px",
          overflowY: "auto",
        }}
        aria-modal="true"
        role="dialog"
        aria-label={title}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {icon}
            <h5 style={{ margin: 0 }}>{title}</h5>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,0.04)", margin: "12px 0 18px" }} />
        <div>{children}</div>
      </motion.aside>
    </>
  );
}
