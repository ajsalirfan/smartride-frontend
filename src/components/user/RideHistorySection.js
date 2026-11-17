import React, { useEffect, useState } from "react";
import { Card, Spinner, Row, Col, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import "./RideHistorySection.css";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

export default function RideHistorySection() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(`${API_BASE}rides/history/`, { headers });
        setRides(res.data);
      } catch (err) {
        console.error("Ride history fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" /> <p>Loading ride history...</p>
      </div>
    );
  }

  return (
    <div className="ride-history-section py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm border-0 rounded-4 mb-4">
          <Card.Body>
            <h4 className="fw-bold mb-4 text-dark">🛵 Ride History</h4>
            {rides.length === 0 ? (
              <p className="text-muted text-center">No rides yet.</p>
            ) : (
              rides.map((ride, index) => (
                <motion.div
                  key={index}
                  className="ride-item p-3 rounded-4 mb-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Row>
                    <Col md={8}>
                      <h6 className="fw-semibold text-dark mb-1">
                        {ride.vehicle_name || "Unnamed Vehicle"}
                      </h6>
                      <small className="text-secondary">
                        {ride.start_location || "Start"} → {ride.end_location || "End"}
                      </small>
                    </Col>
                    <Col md={4} className="text-end">
                      <Badge bg="light" text="dark" className="mb-2">
                        {new Date(ride.start_time).toLocaleDateString()}
                      </Badge>
                      <p className="fw-bold text-success mb-0">
                        ₹{ride.total_fare?.toFixed(2) || "0.00"}
                      </p>
                    </Col>
                  </Row>
                </motion.div>
              ))
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
}
