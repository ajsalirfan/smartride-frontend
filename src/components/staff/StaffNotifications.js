import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StaffNotifications() {
  const navigate = useNavigate();
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">🔔 Notifications</h2>
          <p className="text-muted">View system notifications and alerts</p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate("/staff/panel")}
        >
          <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <p>Notifications interface will be implemented here...</p>
        </div>
      </div>
    </div>
  );
}