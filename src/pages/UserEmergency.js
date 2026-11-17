import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import "./../styles/UserEmergency.css";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

export default function UserEmergency() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [error, setError] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  // Get user location + contacts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        fetchContacts();
      },
      (err) => {
        console.error("Location Error:", err);
        fetchContacts();
      }
    );
  }, []);

  // Fetch emergency contacts
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE}emergency/contacts/`, { headers });
      setContacts(res.data || []);
    } catch (err) {
      console.error("Contacts fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`${API_BASE}emergency/contacts/add/`, newContact, { headers });
      setContacts([...contacts, res.data]);
      setNewContact({ name: "", phone: "" });
    } catch (err) {
      console.error("Add contact error:", err);
      setError("Failed to add contact");
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE}emergency/contacts/${id}/delete/`, { headers });
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete contact");
    }
  };

  // Send SOS Alert
  const handleSOS = async () => {
    try {
      setAlertMsg("");
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`${API_BASE}emergency/alert/`, {
        latitude: userPos?.[0] || 0,
        longitude: userPos?.[1] || 0,
      }, { headers });

      setAlertMsg("🚨 SOS Alert Sent! Help is on the way.");
      console.log("SOS Alert:", res.data);
    } catch (err) {
      console.error("SOS error:", err);
      setError("Failed to send SOS alert");
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <motion.div
      className="user-emergency-page bg-light min-vh-100 py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <h2 className="text-center fw-bold mb-4 text-danger">🆘 Emergency & Safety Center</h2>

        {/* Alerts */}
        {alertMsg && <Alert variant="success" className="text-center">{alertMsg}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        {/* Live Map */}
        {userPos && (
          <Card className="shadow-sm mb-4 rounded-4 border-0">
            <Card.Body>
              <h5 className="text-secondary mb-3">📍 Your Live Location</h5>
              <MapContainer center={userPos} zoom={15} scrollWheelZoom={false} style={{ height: "350px" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <Marker position={userPos} icon={userIcon}>
                  <Popup>You’re here 🧭</Popup>
                </Marker>
              </MapContainer>
            </Card.Body>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card className="shadow-sm mb-4 rounded-4 border-0">
          <Card.Body>
            <h5 className="text-secondary mb-3">👨‍👩‍👧 Your Emergency Contacts</h5>

            {contacts.length === 0 ? (
              <p className="text-muted">No contacts added yet.</p>
            ) : (
              contacts.map((c, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <strong>{c.name}</strong> <br />
                    <small className="text-muted">{c.phone}</small>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c.id)}>
                    Remove
                  </Button>
                </div>
              ))
            )}

            <Form onSubmit={handleAddContact} className="mt-3">
              <Row>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    required
                  />
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    required
                  />
                </Col>
                <Col md={2}>
                  <Button type="submit" className="w-100 btn-add">Add</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* SOS Button */}
        <div className="text-center mt-4">
          <Button variant="danger" size="lg" className="sos-btn px-5 py-3 fw-bold" onClick={handleSOS}>
            🚨 SEND SOS ALERT
          </Button>
          <p className="text-muted mt-2">Your location will be shared with your saved contacts.</p>
        </div>
      </Container>
    </motion.div>
  );
}
