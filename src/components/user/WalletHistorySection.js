/* ==========================================================
   💳 WalletHistorySection.jsx
   Smart Ride — User Transaction & Payment History Display
   ========================================================== */

import React, { useEffect, useState } from "react";
import { Table, Spinner, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/Users/";

export default function WalletHistorySection() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${API_BASE}payments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

  const getStatusBadge = (status) => {
    let color = "secondary";
    if (status === "completed") color = "success";
    else if (status === "pending") color = "warning";
    else if (status === "failed") color = "danger";
    return (
      <Badge bg={color} pill>
        {status?.toUpperCase() || "UNKNOWN"}
      </Badge>
    );
  };

  if (loading)
    return (
      <div className="text-center py-4 text-muted">
        <Spinner animation="border" size="sm" /> Loading transactions…
      </div>
    );

  if (!payments.length)
    return (
      <div className="text-center py-4 text-muted">
        No transactions found yet.
      </div>
    );

  return (
    <motion.div
      className="wallet-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Table striped bordered hover variant="dark" responsive className="uh-card">
        <thead>
          <tr>
            <th>#</th>
            <th>Transaction ID</th>
            <th>Ride ID</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, idx) => (
            <tr key={p.transaction_id || idx}>
              <td>{idx + 1}</td>
              <td className="small">{p.transaction_id}</td>
              <td>{p.ride || "—"}</td>
              <td className="fw-bold text-success">{p.amount}</td>
              <td>{getStatusBadge(p.status)}</td>
              <td className="small">
                {new Date(p.created_at || p.date || Date.now()).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </motion.div>
  );
}
