import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import "./NotificationSection.css";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

export default function NotificationSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(`${API_BASE}notifications/`, { headers });
        setNotifications(res.data);
      } catch (err) {
        console.error("Notifications fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" /> <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notification-section py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm border-0 rounded-4 mb-4">
          <Card.Body>
            <h4 className="fw-bold mb-4 text-dark">🔔 Notifications</h4>

            {notifications.length === 0 ? (
              <p className="text-muted text-center">No notifications yet.</p>
            ) : (
              notifications.slice(0, 5).map((n, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Alert
                    variant="light"
                    className={`shadow-sm mb-3 notification-alert ${
                      n.is_read ? "" : "unread"
                    }`}
                  >
                    <div className="d-flex justify-content-between">
                      <span>{n.message}</span>
                      <small className="text-muted">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  </Alert>
                </motion.div>
              ))
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
}
