// src/components/panels/FavoritesPanel.jsx
import React, { useEffect, useState } from "react";
import { Offcanvas, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import VehicleCard from "../user/VehicleCard";
import { useAuth } from "../auth/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE ? (process.env.REACT_APP_API_BASE.endsWith("/") ? process.env.REACT_APP_API_BASE + "Users/" : process.env.REACT_APP_API_BASE + "/Users/") : "http://127.0.0.1:8000/api/Users/";

export default function FavoritesPanel({ show, onClose }) {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}favorites/`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(res.data || []);
    } catch (err) {
      console.error("fetchFavs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (show) fetchFavs(); }, [show, token]);

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: 480 }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Favorites</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" /></div>
        ) : favorites.length ? (
          <div className="d-grid gap-2">
            {favorites.map((f) => (
              <VehicleCard key={f.vehicle_id || f.id} vehicle={f} onBook={() => {}} onFavorite={() => {}} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No favorites yet — add by tapping ★ on a vehicle.</p>
        )}
        <div className="mt-3">
          <Button variant="outline-secondary" onClick={fetchFavs}>Refresh</Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
