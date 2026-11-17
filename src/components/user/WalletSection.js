import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import "./WalletSection.css";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

export default function WalletSection({ verified }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 💰 Fetch wallet data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [walletRes, txRes] = await Promise.all([
          axios.get(`${API_BASE}wallet/balance/`, { headers }),
          axios.get(`${API_BASE}wallet/transactions/`, { headers }),
        ]);

        setBalance(walletRes.data.balance || 0);
        setTransactions(txRes.data || []);
      } catch (err) {
        console.error("Wallet fetch error:", err);
        setError("Failed to load wallet info");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  // 💸 Top-Up Function
  const handleTopUp = async () => {
    if (!verified) {
      setError("⚠️ You need admin verification to add funds.");
      return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.post(
        `${API_BASE}wallet/topup/`,
        { amount: parseFloat(amount) },
        { headers }
      );

      setSuccess(`✅ ₹${amount} added successfully!`);
      setBalance(res.data.new_balance || balance + parseFloat(amount));
      setShowTopup(false);
      setAmount("");
      setError("");
    } catch (err) {
      console.error("Top-up error:", err);
      setError("Failed to add funds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" /> <p>Loading Wallet...</p>
      </div>
    );
  }

  return (
    <div className="wallet-section py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="wallet-card shadow-sm border-0 rounded-4 mb-4">
          <Card.Body className="text-center">
            <h4 className="text-secondary mb-2">Wallet Balance</h4>
            <h1 className="fw-bold text-success mb-3">₹{balance.toFixed(2)}</h1>

            <Button
              variant="success"
              className="rounded-pill px-4"
              disabled={!verified}
              onClick={() => setShowTopup(true)}
            >
              + Add Funds
            </Button>

            {!verified && (
              <p className="small text-warning mt-2 mb-0">
                ⚠️ Verification required to use wallet.
              </p>
            )}
          </Card.Body>
        </Card>
      </motion.div>

      {/* 📜 Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="wallet-card shadow-sm border-0 rounded-4">
          <Card.Body>
            <h5 className="fw-bold mb-3 text-dark">Recent Transactions</h5>
            {transactions.length === 0 ? (
              <p className="text-muted text-center">No transactions yet.</p>
            ) : (
              transactions.slice(0, 5).map((tx, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between border-bottom py-2 small"
                >
                  <span>{tx.description}</span>
                  <span
                    className={
                      tx.amount > 0 ? "text-success fw-semibold" : "text-danger fw-semibold"
                    }
                  >
                    {tx.amount > 0 ? "+" : ""}
                    ₹{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </motion.div>

      {/* 💸 Top-Up Modal */}
      <Modal
        show={showTopup}
        onHide={() => setShowTopup(false)}
        centered
        className="wallet-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>💳 Add Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Enter amount (₹)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowTopup(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleTopUp}>
              Add Money
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
