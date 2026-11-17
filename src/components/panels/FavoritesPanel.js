/* src/components/panels/FavoritesPanel.jsx */
import React, { useEffect, useState } from "react";
import PanelShell from "../common/PanelShell";
import { Star } from "lucide-react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../components/auth/AuthContext";

const API_BASE = (process.env.REACT_APP_API_BASE?.endsWith("/") ? process.env.REACT_APP_API_BASE : (process.env.REACT_APP_API_BASE ? process.env.REACT_APP_API_BASE + "/" : "http://127.0.0.1:8000/")) + "api/Users/";

export default function FavoritesPanel({ show, onClose, onNavigateToVehicle }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}favorites/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setItems(res.data || []);
    } catch (err) {
      console.error("Favorites fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchFavs();
  }, [show]);

  return (
    <PanelShell show={show} onClose={onClose} title="Favorites" icon={<Star size={18} />}>
      <div>
        {loading ? (
          <div className="text-center py-3">Loading...</div>
        ) : items.length ? (
          items.map((f) => (
            <div key={f.id} className="uh-card mb-2 d-flex justify-content-between align-items-center">
              <div>
                <div style={{ fontWeight: 600 }}>{f.vehicle_name || f.name}</div>
                <div className="small text-muted">{f.location || f.note || ""}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button size="sm" variant="outline-light" onClick={() => onNavigateToVehicle?.(f)}>View</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-3">No favorites yet.</div>
        )}
      </div>
    </PanelShell>
  );
}
