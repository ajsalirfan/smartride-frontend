import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StaffVehicles() {
  const navigate = useNavigate();
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">🚗 Vehicle Management</h2>
          <p className="text-muted">Manage and monitor vehicle fleet</p>
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
          <p>Vehicle management interface will be implemented here...</p>
        </div>
      </div>
    </div>
  );
}