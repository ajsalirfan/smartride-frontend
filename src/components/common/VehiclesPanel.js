// src/components/panels/VehiclesPanel.jsx
import React, { useEffect, useState } from "react";
import { Offcanvas, Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import axios from "axios";
import VehicleCard from "../user/VehicleCard";

const API_BASE = process.env.REACT_APP_API_BASE ? (process.env.REACT_APP_API_BASE.endsWith("/") ? process.env.REACT_APP_API_BASE + "Users/" : process.env.REACT_APP_API_BASE + "/Users/") : "http://127.0.0.1:8000/api/Users/";

export default function VehiclesPanel({ show, onClose, onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}vehicles/available/`;
      const res = await axios.get(url);
      setVehicles(res.data || []);
    } catch (err) {
      console.error("fetchVehicles error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchVehicles();
  }, [show]);

  const filtered = vehicles.filter((v) => {
    const q = (query || "").toLowerCase();
    if (q && !(v.name || v.model_name || "").toLowerCase().includes(q)) return false;
    if (filterType && v.type && v.type !== filterType) return false;
    return true;
  });

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" style={{ width: 520 }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Available Vehicles</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="mb-3 d-flex gap-2">
          <InputGroup>
            <FormControl placeholder="Search vehicles..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </InputGroup>
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All</option>
            <option value="E-Scooter">E-Scooter</option>
            <option value="Bike">Bike</option>
            <option value="E-Bike">E-Bike</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" /> Loading...
          </div>
        ) : filtered.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {filtered.map((v) => (
              <VehicleCard key={v.vehicle_id || v.id} vehicle={v} onBook={() => onNavigate?.map?.()} onFavorite={() => {}} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No vehicles match.</p>
        )}

        <div className="mt-3 d-flex justify-content-between">
          <Button variant="outline-secondary" onClick={fetchVehicles}>Refresh</Button>
          <Button variant="primary" onClick={() => { onNavigate?.map?.(); onClose(); }}>Open Map</Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
