/* 🌐 src/components/user/StaffDirectory.jsx
   SMART RIDE — Staff Directory (Production Ready)
   - Fetches admin-added staff details
   - Displays name, role, phone, on-duty status
   - Clean glass UI, responsive
*/

import React, { useEffect, useState } from "react";
import { Card, Spinner, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

export default function StaffDirectory({ apiBase, token }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}staff/list/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setStaffList(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch staff:", err);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (loading)
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="info" />
        <p className="small text-muted mt-2">Loading staff details...</p>
      </div>
    );

  if (!staffList.length)
    return (
      <div className="text-center py-3">
        <p className="text-muted">No staff records available yet.</p>
      </div>
    );

  return (
    <div className="staff-grid mt-3">
      {staffList.map((s, i) => (
        <motion.div
          key={s.id || i}
          className="staff-card glass-card p-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="staff-avatar mb-2">
            <img
              src={s.avatar_url || "/default-staff.png"}
              alt={s.name}
              width="80"
              height="80"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 12px rgba(0,255,255,0.2)",
              }}
            />
          </div>

          <h6 className="fw-bold text-light mb-0">{s.name}</h6>
          <p className="small text-muted mb-1">{s.role || "Field Agent"}</p>
          <p className="small text-info mb-1">📞 {s.phone_number || "N/A"}</p>

          <Badge
            bg={s.on_duty ? "success" : "secondary"}
            className="mt-1 small px-3 py-1"
          >
            {s.on_duty ? "On Duty" : "Off Duty"}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}

