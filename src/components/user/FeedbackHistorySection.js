/* ==========================================================
   💬 FeedbackHistorySection.jsx
   Smart Ride — User Feedback + Admin Reply History
   ========================================================== */

import React, { useEffect, useState } from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/Users/";

export default function FeedbackHistorySection() {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📡 Fetch feedback history */
  useEffect(() => {
    if (!token) return;
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${API_BASE}feedbacks/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch feedback history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [token]);

  const getRatingBadge = (rating) => {
    const color =
      rating >= 4 ? "success" : rating >= 3 ? "warning" : "danger";
    return (
      <Badge bg={color} pill>
        {rating} ★
      </Badge>
    );
  };

  if (loading)
    return (
      <div className="text-center py-5 text-muted">
        <Spinner animation="border" size="sm" /> Loading feedback...
      </div>
    );

  if (!feedbacks.length)
    return (
      <div className="text-center py-5 text-muted">
        No feedbacks yet. Share your first experience 🚴‍♂️
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="feedback-history"
    >
      {feedbacks.map((fb, idx) => (
        <Card
          key={fb.id || idx}
          className="mb-3 p-3 uh-card shadow-sm"
          style={{ borderLeft: "3px solid #00b4ff" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold text-info mb-0">
              🛵 Ride #{fb.ride || "—"}
            </h6>
            {getRatingBadge(fb.rating)}
          </div>

          <p className="small text-light opacity-75 mb-2">{fb.comment}</p>

          {fb.admin_reply ? (
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
              <strong className="text-success">Admin Reply :</strong>
              <p className="small mb-0">{fb.admin_reply}</p>
              {fb.replied_at && (
                <div className="text-muted small mt-1">
                  Replied on {new Date(fb.replied_at).toLocaleString()}
                </div>
              )}
            </motion.div>
          ) : (
            <p className="small text-warning mb-0">
              ⏳ Awaiting admin reply...
            </p>
          )}

          <div className="small text-muted mt-2">
            Feedback submitted on {new Date(fb.created_at).toLocaleString()}
          </div>
        </Card>
      ))}
    </motion.div>
  );
}
