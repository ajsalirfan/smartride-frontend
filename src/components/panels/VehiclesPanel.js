/* src/components/panels/VehiclesPanel.jsx */
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Spinner } from "react-bootstrap";
import { X, RefreshCcw, Star, StarOff, MapPinned } from "lucide-react";
import VehicleCard from "../user/VehicleCard";
import { useAuth } from "../auth/AuthContext";

/**
 * Desktop Off-canvas style panel (no dropdowns).
 * - Auto-refreshes vehicles every 10s
 * - Smooth add/remove animations
 * - Clicking a vehicle -> notifies parent with its coordinates to focus on map
 *
 * Props:
 *   open: boolean
 *   onClose: function
 *   onFocusVehicle: (vehicle) => void  // parent passes to MapSection
 *   favorites: array of { vehicle_id }
 *   onToggleFavorite: (vehicleId) => Promise<void>
 *   apiBase: string  // "http://127.0.0.1:8000/api/Users/"
 */
export default function VehiclesPanel({
  open,
  onClose,
  onFocusVehicle,
  favorites = [],
  onToggleFavorite,
  apiBase = "http://127.0.0.1:8000/api/Users/",
}) {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [error, setError] = useState("");

  const isFav = (id) => favorites?.some((f) => f.vehicle_id === id);

  // fetch vehicles (available endpoint)
  const fetchVehicles = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${apiBase}vehicles/available/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data || []);
    } catch (e) {
      setError("Failed to load vehicles.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // initial + interval refresh
  useEffect(() => {
    if (!open) return;
    fetchVehicles();
    const iv = setInterval(() => setRefreshTick((t) => t + 1), 10000);
    return () => clearInterval(iv);
  }, [open]);

  useEffect(() => {
    if (open) fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick]);

  // for smooth list enter/exit
  const list = useMemo(() => vehicles ?? [], [vehicles]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              zIndex: 1040,
            }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 420,
              background: "rgba(10,12,14,0.95)",
              backdropFilter: "blur(12px)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              zIndex: 1050,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Badge bg="info">Live</Badge>
                <h6 className="mb-0">Available Vehicles</h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  size="sm"
                  variant="outline-light"
                  onClick={fetchVehicles}
                  title="Refresh"
                >
                  <RefreshCcw size={16} />
                </Button>
                <Button size="sm" variant="outline-light" onClick={onClose}>
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 12, overflowY: "auto" }}>
              {loading && (
                <div className="text-center text-muted py-3">
                  <Spinner animation="border" size="sm" /> Loading…
                </div>
              )}
              {error && <div className="text-danger small mb-2">{error}</div>}

              <AnimatePresence mode="popLayout">
                {list.map((v) => {
                  const id = v.vehicle_id || v.id;
                  const fav = isFav(id);
                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="mb-2"
                    >
                      <Card className="uh-card p-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={v.image || "/assets/vehicle-placeholder.png"}
                            alt={v.name || v.vehicle_name || `Vehicle ${id}`}
                            style={{
                              width: 88,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginRight: 12,
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between">
                              <strong>{v.name || v.vehicle_name || `Vehicle ${id}`}</strong>
                              <Badge bg={v.is_available ? "success" : "secondary"}>
                                {v.is_available ? "Available" : "Busy"}
                              </Badge>
                            </div>
                            <div className="small text-muted">
                              {(v.vehicle_type || v.type) ?? "E-Scooter"} · Battery{" "}
                              {v.battery_level ?? "—"}%
                            </div>
                            <div className="d-flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => onFocusVehicle?.(v)}
                                title="Center on map"
                              >
                                <MapPinned size={16} className="me-1" />
                                Focus on Map
                              </Button>
                              <Button
                                size="sm"
                                variant={fav ? "warning" : "outline-secondary"}
                                onClick={() => onToggleFavorite?.(id)}
                                title={fav ? "Remove favorite" : "Add favorite"}
                              >
                                {fav ? <Star size={16} /> : <StarOff size={16} />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!loading && list.length === 0 && (
                <div className="text-center text-muted py-4">
                  No vehicles available right now.
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
