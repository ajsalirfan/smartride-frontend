// src/pages/admin/AdminDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">🚀 Admin Dashboard</h2>
          <p className="text-muted">System administration and management</p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left me-2"></i> Go Back
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Admin Features</h5>
              <p className="card-text">
                This is the admin dashboard. Features for system administration will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}