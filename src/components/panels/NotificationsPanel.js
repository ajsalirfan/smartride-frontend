/* src/components/panels/NotificationsPanel.jsx */
import React, { useEffect, useState } from "react";
import PanelShell from "../common/PanelShell";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../components/auth/AuthContext";

const API_BASE = (process.env.REACT_APP_API_BASE?.endsWith("/") ? process.env.REACT_APP_API_BASE : (process.env.REACT_APP_API_BASE ? process.env.REACT_APP_API_BASE + "/" : "http://127.0.0.1:8000/")) + "api/Users/";

export default function NotificationsPanel({ show, onClose }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}notifications/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setItems(res.data || []);
    } catch (err) {
      console.error("NotificationsPanel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (show) fetchNotifs(); }, [show]);

  const markAllRead = async () => {
    try {
      await axios.post(`${API_BASE}notifications/mark-read/`, { all: true }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${API_BASE}notifications/clear-all/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setItems([]);
    } catch (err) { console.error(err); }
  };

  return (
    <PanelShell show={show} onClose={onClose} title="Notifications" icon={<Bell size={18} />}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div />
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="sm" variant="outline-success" onClick={markAllRead}><CheckCircle size={14} /></Button>
          <Button size="sm" variant="outline-danger" onClick={clearAll}><Trash2 size={14} /></Button>
        </div>
      </div>

      <div>
        {loading ? <div className="text-center py-3">Loading...</div> : items.length ? (
          items.map((n) => (
            <div key={n.id} className={`notif-item mb-2 ${!n.is_read ? "notif-unread" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <strong>{n.title}</strong>
                  <div className="small text-muted">{n.message}</div>
                </div>
                <div className="small text-muted">{new Date(n.created_at || n.timestamp || Date.now()).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : <div className="text-center text-muted py-3">No notifications yet.</div>}
      </div>
    </PanelShell>
  );
}
