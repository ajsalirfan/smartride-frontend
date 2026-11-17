/* ==========================================================
   📢 ComplaintHistorySection.jsx
   Smart Ride — Complaint Tracking + Admin Replies Display
   ========================================================== */

import React, { useEffect, useState } from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/Users/";

export default function ComplaintHistorySection() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API_BASE}complaints/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [token]);

  const getStatusBadge = (status) => {
    const color =
      status === "resolved"
        ? "success"
        : status === "pending"
        ? "warning"
        : "secondary";
    return (
      <Badge bg={color} pill>
        {status?.toUpperCase() || "UNKNOWN"}
      </Badge>
    );
  };

  if (loading)
    return (
      <div className="text-center py-5 text-muted">
        <Spinner animation="border" size="sm" /> Loading your complaints...
      </div>
    );

  if (!complaints.length)
    return (
      <div className="text-center py-5 text-muted">
        No complaints found. Great job staying trouble-free! 😄
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="complaints-history"
    >
      {complaints.map((c, idx) => (
        <Card
          key={c.id || idx}
          className="mb-3 p-3 shadow-sm uh-card"
          style={{ borderLeft: "3px solid #00d4ff" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold text-info mb-0">📢 {c.title}</h6>
            {getStatusBadge(c.status)}
          </div>
          <p className="small text-light opacity-75 mb-2">{c.description}</p>

          {c.admin_reply ? (
            <motion.div
              className="p-2 rounded"
              style={{
                background: "rgba(0,255,200,0.05)",
                borderLeft: "2px solid #00ffcc",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <strong className="text-success">Admin Reply:</strong>
              <p className="small mb-0">{c.admin_reply}</p>
            </motion.div>
          ) : (
            <p className="small text-warning mb-0">⏳ Awaiting Admin Response...</p>
          )}

          <div className="small text-muted mt-1">
            Submitted: {new Date(c.created_at).toLocaleString()}
          </div>
        </Card>
      ))}
    </motion.div>
  );
}
