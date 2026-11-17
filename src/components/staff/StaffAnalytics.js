import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StaffAnalytics() {
  const navigate = useNavigate();
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">📈 Analytics</h2>
          <p className="text-muted">View performance insights and reports</p>
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
          <p>Analytics dashboard will be implemented here...</p>
        </div>
      </div>
    </div>
  );
}