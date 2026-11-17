// src/pages/NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  fetchNotifications,
  markAllAsRead,
  clearAllNotifications,
} from "../api/notifications";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Load notifications
  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();

      // ✔ Correct: backend returns { unread_count, notifications: [] }
      setData(res.data.notifications || []);
    } catch (err) {
      console.log("Notification load error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadNotifications();
      await markAllAsRead();  // mark unread → read
      loadNotifications();     // update UI
    };
    init();
  }, []);

  // Clear all notifications
  const handleClearAll = async () => {
    if (!window.confirm("Clear all notifications?")) return;

    try {
      await clearAllNotifications();
      setData([]); // instantly clear UI
    } catch (err) {
      console.log("Clear all error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "15px",
          background: "#444",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "5px",
          border: "none",
        }}
      >
        ← Back
      </button>

      <div className="d-flex justify-content-between align-items-center">
        <h3>Notifications</h3>

        {/* Clear all button */}
        <button
          onClick={handleClearAll}
          style={{
            background: "#d9534f",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      <hr style={{ opacity: 0.2 }} />

      {/* Notification list */}
      {data.length === 0 ? (
        <p>No notifications</p>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            style={{
              background: item.is_read ? "#222" : "#333",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "12px",
            }}
          >
            <h5>{item.title}</h5>
            <p>{item.message}</p>

            <small style={{ opacity: 0.6 }}>
              {item.created_at
                ? new Date(item.created_at).toLocaleString()
                : ""}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
