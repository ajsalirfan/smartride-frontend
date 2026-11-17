/* ==========================================================
   ⚙️ Footer.jsx — Smart Ride Professional Footer (Ajsal Edition)
   ========================================================== */

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, Instagram, Globe, Code } from "lucide-react";
import "../../styles/UserHome.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="smart-footer text-light pt-5 pb-3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="row gy-4 align-items-start">
          
          {/* Brand Section */}
          <div className="col-md-4">
            <h4 className="fw-bold text-gradient mb-3">Smart Ride</h4>
            <p className="small text-muted">
              Smart Ride is an intelligent e-scooter and bike-sharing system that connects people
              with eco-friendly rides using AI-powered demand prediction and optimization.
              Designed for a smarter, cleaner city travel experience.
            </p>
          </div>

          {/* Contact Section */}
          <div className="col-md-4">
            <h6 className="fw-semibold mb-3 text-uppercase">Contact</h6>
            <ul className="list-unstyled small">
              <li className="d-flex align-items-center gap-2 mb-2">
                <Phone size={16} /> <span>+91 85898 33473</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-2">
                <Mail size={16} /> <span>support@smartride.in</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <MapPin size={16} /> 
                <span>Perothayil House, Pattery, Perumpadappu, Kerala</span>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div className="col-md-4">
            <h6 className="fw-semibold mb-3 text-uppercase">Developer</h6>
            <p className="small mb-3">
              Crafted with precision by <strong>Ajsal Irfan</strong><br />
              Passionate full-stack developer focused on AI-driven mobility systems.
            </p>
            <div className="d-flex gap-3 mt-2">
              <a href="https://github.com/ajsalirfan" target="_blank" rel="noreferrer" className="footer-icon">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/in/ajsalirfan" target="_blank" rel="noreferrer" className="footer-icon">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com/ajsal_irfan" target="_blank" rel="noreferrer" className="footer-icon">
                <Instagram size={18} />
              </a>
              <a href="https://smartride.ai" target="_blank" rel="noreferrer" className="footer-icon">
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        {/* Bottom Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <div>© {year} Smart Ride — All rights reserved.</div>
          <div className="d-flex align-items-center gap-2">
            <Code size={14} /> <span>Developed by Ajsal Irfan</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
