// src/components/user/NotificationBell.jsx
import React, { useState, useEffect } from "react";
import { getUnreadCount, markAllAsRead } from "../../api/notifications";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  // Fetch unread count
  const fetchUnread = async () => {
    try {
      const res = await getUnreadCount();
      setCount(res.data.unread_count || 0);
    } catch (err) {
      console.log("Unread count error:", err);
    }
  };

  // Open notifications → only mark read (DON’T delete!)
  const openNotifications = async () => {
    try {
      await markAllAsRead();    // Mark unread as read
      setCount(0);              // Instantly update UI badge
    } catch (err) {
      console.log("Mark-all-read error:", err);
    }

    navigate("/notifications");
  };

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={openNotifications}
      style={{
        position: "relative",
        cursor: "pointer",
        display: "inline-block",
        transition: "transform 0.15s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Bell icon */}
      <i className="bi bi-bell-fill fs-4 text-warning"></i>

      {/* Notification badge */}
      {count > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: "0.7rem",
            padding: "4px 7px",
            animation: "notif-pulse 0.6s ease-out",
          }}
        >
          {count}
        </span>
      )}

      {/* Pulse Animation */}
      <style>
        {`
          @keyframes notif-pulse {
            0% { transform: scale(0.4); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
