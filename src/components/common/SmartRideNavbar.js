/* src/components/common/SmartRideNavbar.js */
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Offcanvas, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { Home, Wallet, Upload, LifeBuoy, LogOut, Menu, ShieldCheck, User, Bell } from "lucide-react";
import axios from "axios";
import "../../styles/UserHome.css";

export default function SmartRideNavbar({ user, wallet, onNavigate, onOpenVehicles, onOpenFavorites, onOpenNotifications }) {
  const { token, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  // quick fetch count
  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      if (!token) return;
      try {
        const API_BASE = (process.env.REACT_APP_API_BASE?.endsWith("/") ? process.env.REACT_APP_API_BASE : (process.env.REACT_APP_API_BASE ? process.env.REACT_APP_API_BASE + "/" : "http://127.0.0.1:8000/")) + "api/Users/";
        const res = await axios.get(`${API_BASE}notifications/`, { headers: { Authorization: `Bearer ${token}` } });
        if (!mounted) return;
        const count = (res.data || []).filter((n) => !n.is_read).length;
        setUnread(count);
      } catch (err) {
        // ignore
      }
    };
    fetchCount();
    const iv = setInterval(fetchCount, 60000);
    return () => { mounted = false; clearInterval(iv); };
  }, [token]);

  const badgeColor = user?.is_verified ? "success" : "warning";
  const badgeText = user?.is_verified ? "Verified" : "Pending";

  return (
    <>
      <Navbar expand="md" fixed="top" className="smart-navbar py-2 px-3 shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <motion.div className="d-flex align-items-center">
            <div className="logo-dot me-2"></div>
            <Navbar.Brand className="fw-bold text-light mb-0">SMART RIDE 🚴‍♂️</Navbar.Brand>
          </motion.div>

          <Nav className="ms-auto d-none d-md-flex align-items-center gap-3 text-light">
            <div className="nav-link text-light" onClick={onNavigate?.home} style={{ cursor: "pointer" }}><Home size={16} className="me-1" /> Home</div>
            <div className="nav-link text-light" onClick={onNavigate?.wallet} style={{ cursor: "pointer" }}><Wallet size={16} className="me-1" /> Wallet</div>
            <div className="nav-link text-light" onClick={onOpenVehicles} style={{ cursor: "pointer" }}><Upload size={16} className="me-1" /> Vehicles</div>
            <div className="nav-link text-light" onClick={onOpenFavorites} style={{ cursor: "pointer" }}><LifeBuoy size={16} className="me-1" /> Favorites</div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge bg={badgeColor} pill><ShieldCheck size={12} className="me-1" />{badgeText}</Badge>
              <div style={{ position: "relative", cursor: "pointer" }} onClick={onOpenNotifications}>
                <Bell size={16} />
                {unread > 0 && <Badge bg="danger" pill style={{ position: "absolute", top: -8, right: -10, fontSize: 10 }}>{unread}</Badge>}
              </div>
              <div className="nav-link text-danger fw-semibold" onClick={logout} style={{ cursor: "pointer" }}><LogOut size={16} className="me-1" /> Logout</div>
            </div>
          </Nav>

          {/* mobile menu fallback */}
          <Button variant="outline-light" size="sm" className="d-md-none rounded-circle" onClick={() => onNavigate?.help?.()}>
            <Menu size={18} />
          </Button>
        </Container>

        <motion.div className="gradient-line" initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} />
      </Navbar>
    </>
  );
}
