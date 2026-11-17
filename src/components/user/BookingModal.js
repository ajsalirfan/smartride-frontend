/* src/components/user/BookingModal.jsx */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Spinner, Badge, Card } from "react-bootstrap";
import { Wallet, Clock, Route, CheckCircle, XCircle } from "lucide-react";
import "../../styles/UserHome.css";

/**
 * BookingModal
 * - Shows ride confirmation details
 * - Displays wallet, fare, ETA
 * - Animates success receipt card
 *
 * Props:
 *   show: boolean
 *   handleClose: function
 *   vehicle: { vehicle_name, battery_level, vehicle_type }
 *   verified: boolean
 *   onConfirm: function
 *   loading: boolean
 *   walletBalance?: number
 */
export default function BookingModal({
  show,
  handleClose,
  vehicle,
  verified,
  onConfirm,
  loading,
  walletBalance = 0,
}) {
  const [confirming, setConfirming] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Estimated values (can later come from backend)
  const fare = Math.floor(Math.random() * 40) + 20;
  const eta = Math.floor(Math.random() * 15) + 5;

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirm?.();
    setTimeout(() => {
      setConfirming(false);
      setShowReceipt(true);
    }, 800);
  };

  useEffect(() => {
    if (!show) {
      setShowReceipt(false);
      setConfirming(false);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <Modal
          show={show}
          onHide={handleClose}
          centered
          backdrop="static"
          keyboard={false}
          contentClassName="uh-card text-light"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal.Header closeButton closeVariant="white">
              <Modal.Title className="fw-semibold">
                🚴 Confirm Ride
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {vehicle ? (
                !showReceipt ? (
                  <>
                    <h5 className="fw-bold text-info mb-3">
                      {vehicle.vehicle_name || vehicle.name}
                    </h5>
                    <p className="small text-muted mb-1">
                      Type: {vehicle.vehicle_type || "E-Scooter"}
                    </p>
                    <p className="small text-muted">
                      Battery: {vehicle.battery_level ?? 100}%
                    </p>

                    <hr className="border-secondary" />

                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-light">
                        <Wallet size={16} className="me-1 text-warning" />
                        Wallet Balance:
                      </span>
                      <strong>₹{walletBalance ?? 0}</strong>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <span className="text-light">
                        <Clock size={16} className="me-1 text-primary" />
                        ETA:
                      </span>
                      <strong>{eta} min</strong>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <span className="text-light">
                        <Route size={16} className="me-1 text-success" />
                        Estimated Fare:
                      </span>
                      <strong>₹{fare}</strong>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="text-center py-3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle size={64} className="text-success mb-3" />
                    <h5 className="fw-bold text-success">Ride Confirmed!</h5>
                    <p className="small text-muted mb-3">
                      You’re all set to go 🚴‍♂️
                    </p>

                    <motion.div
                      className="receipt-card mx-auto p-3 rounded-3 shadow-sm text-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        maxWidth: 320,
                      }}
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Vehicle</span>
                        <strong>{vehicle.vehicle_name || "E-Scooter"}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Fare</span>
                        <strong>₹{fare}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">ETA</span>
                        <strong>{eta} min</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Date</span>
                        <strong>{new Date().toLocaleDateString()}</strong>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              ) : (
                <p className="text-muted text-center">
                  No vehicle selected.
                </p>
              )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
              {!showReceipt ? (
                <>
                  <Button variant="outline-light" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    className="uh-btn-glow"
                    onClick={handleConfirm}
                    disabled={confirming || !verified || loading}
                  >
                    {confirming || loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Booking...
                      </>
                    ) : verified ? (
                      "Confirm Ride"
                    ) : (
                      "Locked"
                    )}
                  </Button>
                </>
              ) : (
                <Button variant="success" onClick={handleClose}>
                  Done
                </Button>
              )}
            </Modal.Footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
