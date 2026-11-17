import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Spinner, Toast } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

export default function SmartRideUserExtras({ verified, hasDocs }) {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [aadhaar, setAadhaar] = useState(null);
  const [license, setLicense] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [complaint, setComplaint] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", variant: "info" });

  // Reusable toast
  const showToast = (msg, variant = "info") =>
    setToast({ show: true, msg, variant });

  // Upload documents
  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!aadhaar || !license) {
      return showToast("Please select both Aadhaar and License files.", "warning");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("aadhaar", aadhaar);
      formData.append("license", license);

      await axios.post(`${API_BASE}verification/upload-documents/`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      showToast("Documents uploaded successfully ✅", "success");
    } catch (err) {
      console.error("Doc upload error:", err);
      showToast("Upload failed — check file format or size.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Feedback submission
  const handleFeedback = async () => {
    if (!feedback.trim()) return showToast("Enter feedback first.", "warning");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}complaints/create/`, { message: feedback }, { headers });
      showToast("Thanks for your feedback 💬", "success");
      setFeedback("");
    } catch (err) {
      showToast("Feedback failed — please retry.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Complaint submission
  const handleComplaint = async () => {
    if (!complaint.trim()) return showToast("Enter complaint details.", "warning");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}complaints/create/`, { message: complaint }, { headers });
      showToast("Complaint submitted 🚨", "success");
      setComplaint("");
    } catch (err) {
      showToast("Complaint failed — please retry.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Emergency contact
  const handleEmergencyContact = async () => {
    if (!emergencyNumber.trim()) return showToast("Enter emergency number.", "warning");
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}emergency/contacts/add/`,
        { contact_number: emergencyNumber },
        { headers }
      );
      showToast("Emergency contact added 📞", "success");
      setEmergencyNumber("");
    } catch (err) {
      showToast("Could not save contact.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Row xs={1} md={2} className="g-4">
        {/* 🪪 Document Upload */}
        <Col>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="p-4 glass-card">
              <h5 className="fw-bold mb-3">📤 Upload Verification Documents</h5>
              {hasDocs ? (
                <div className="alert alert-success py-2 mb-0">
                  ✅ Documents submitted — awaiting admin approval.
                </div>
              ) : (
                <Form onSubmit={handleDocUpload}>
                  <Form.Group className="mb-3">
                    <Form.Label>Aadhaar Card</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setAadhaar(e.target.files[0])}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Driving License</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setLicense(e.target.files[0])}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Upload"}
                  </Button>
                </Form>
              )}
            </Card>
          </motion.div>
        </Col>

        {/* 💬 Feedback */}
        <Col>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="p-4 glass-card">
              <h5 className="fw-bold mb-3">💬 Feedback</h5>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Share your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button
                className="mt-3"
                variant="success"
                onClick={handleFeedback}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Send Feedback"}
              </Button>
            </Card>
          </motion.div>
        </Col>

        {/* 🚨 Complaint */}
        <Col>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="p-4 glass-card">
              <h5 className="fw-bold mb-3">🚨 File a Complaint</h5>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the issue..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
              />
              <Button
                className="mt-3"
                variant="danger"
                onClick={handleComplaint}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Submit Complaint"}
              </Button>
            </Card>
          </motion.div>
        </Col>

        {/* 📞 Emergency Contact */}
        <Col>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="p-4 glass-card">
              <h5 className="fw-bold mb-3">📞 Emergency Contact</h5>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={emergencyNumber}
                onChange={(e) => setEmergencyNumber(e.target.value)}
              />
              <Button
                className="mt-3"
                variant="warning"
                onClick={handleEmergencyContact}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Save Contact"}
              </Button>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Toast */}
      <div className="uh-toast-wrapper">
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body className="text-white">{toast.msg}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}
