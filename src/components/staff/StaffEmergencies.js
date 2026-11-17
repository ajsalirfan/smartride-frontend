import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StaffEmergencies({ mode = "view" }) {
  const navigate = useNavigate();
  
  if (mode === "report") {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">🚨 Report Emergency</h2>
            <p className="text-muted">Report a new emergency situation</p>
          </div>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate("/staff/emergencies")}
          >
            <i className="bi bi-arrow-left me-2"></i> Back to Emergencies
          </button>
        </div>
        
        <div className="card shadow-sm">
          <div className="card-body">
            <p>Emergency reporting form will be implemented here...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">🚨 Emergency Management</h2>
          <p className="text-muted">Handle urgent emergency alerts</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-danger"
            onClick={() => navigate("/staff/emergencies/report")}
          >
            <i className="bi bi-exclamation-triangle me-2"></i> Report Emergency
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate("/staff/panel")}
          >
            <i className="bi bi-arrow-left me-2"></i> Dashboard
          </button>
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <p>Emergency management interface will be implemented here...</p>
        </div>
      </div>
    </div>
  );
}