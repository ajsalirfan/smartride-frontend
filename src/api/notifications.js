// src/api/notifications.js
import axios from "axios";

const BASE = "http://127.0.0.1:8000/api/Users/";

// -------------------------
// 🔐 Helper: Get Token
// -------------------------
function getToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access") ||
    null
  );
}

// =====================================
// 📌 Fetch All Notifications
// Backend: GET /api/Users/notification-list/
// =====================================
export const fetchNotifications = () => {
  const token = getToken();
  return axios.get(BASE + "notification-list/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// =====================================
// 📌 Mark ALL as Read
// Backend: POST /api/Users/mark_all_notifications_read/
// =====================================
export const markAllAsRead = () => {
  const token = getToken();
  return axios.post(
    BASE + "mark_all_notifications_read/",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// =====================================
// 📌 Get Unread Count
// Backend: GET /api/Users/unread_count/
// =====================================
export const getUnreadCount = () => {
  const token = getToken();
  return axios.get(BASE + "unread_count/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// =====================================
// 📌 Clear ALL Notifications
// Backend: DELETE /api/Users/clear_all_notifications/
// =====================================
export const clearAllNotifications = () => {
  const token = getToken();
  return axios.delete(BASE + "clear_all_notifications/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
