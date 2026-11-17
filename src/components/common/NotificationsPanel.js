// src/components/panels/NotificationsPanel.jsx
import React, { useEffect, useState } from "react";
import { Offcanvas, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE ? (process.env.REACT_APP_API_BASE.endsWith("/") ? process.env.REACT_APP_API_BASE + "Users/" : process.env.REACT_APP_API_BASE + "/Users/") : "http://127.0.0.1:8000/api/Users/";

export default function NotificationsPanel({ show, onClose }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}notifications/`, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("fetchNotifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (show) fetchNotifications(); }, [show, token]);

  const markAsRead = async (id) => {
    try {
      await axios.post(`${API_BASE}notifications/mark-read/`, { id }, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${API_BASE}notifications/clear-all/`, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications([]);
    } catch (err) { console.error(err); }
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: 420 }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notifications</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="d-flex justify-content-between mb-3">
          <div />
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-secondary" onClick={fetchNotifications}>Refresh</Button>
            <Button size="sm" variant="danger" onClick={clearAll}>Clear All</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-3"><Spinner animation="border" /></div>
        ) : notifications.length ? (
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {notifications.map((n) => (
              <div key={n.id} className={`notif-item p-2 mb-2 rounded ${n.is_read ? "opacity-75" : "notif-unread"}`} onClick={() => markAsRead(n.id)} style={{ cursor: "pointer" }}>
                <strong>{n.title}</strong>
                <div className="small text-muted">{n.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No notifications yet.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
