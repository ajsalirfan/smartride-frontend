// src/pages/Complaints.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./../styles/complaints.css";

function ComplaintItem({ item, onEdit, onDelete }) {
  return (
    <div className="complaint-item">
      <div className="complaint-head">
        <strong>{item.title}</strong>
        <span className={`status-badge status-${item.status}`}>
          {item.status}
        </span>
      </div>

      <div className="complaint-meta">
        <small>{item.complaint_type}</small>
        <small>{new Date(item.created_at).toLocaleString()}</small>
      </div>

      <p className="complaint-desc">{item.description}</p>

      {item.photo && (
        <img src={item.photo} className="complaint-photo" alt="complaint" />
      )}

      {item.status === "open" && (
        <div className="complaint-actions mt-2">
          <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function Complaints() {
  const [editingId, setEditingId] = useState(null);
  const [complaintType, setComplaintType] = useState("vehicle_issue");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await axiosInstance.get("complaints/history/");
      setHistory(res.data || []);
    } catch (err) {
      setMsg({ type: "error", text: "Failed to load complaint history." });
    }
  }

  function handleFileChange(e) {
    setPhoto(e.target.files[0]);
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setComplaintType(item.complaint_type);
    setTitle(item.title);
    setDescription(item.description);
    setPhoto(null);
    window.scrollTo(0, 0);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axiosInstance.delete(`complaints/${id}/delete/`);
      setMsg({ type: "success", text: "Complaint deleted." });
      fetchHistory();
    } catch {
      setMsg({ type: "error", text: "Failed to delete complaint." });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);

    try {
      setLoading(true);

      const form = new FormData();
      form.append("complaint_type", complaintType);
      form.append("title", title);
      form.append("description", description);
      if (photo) form.append("photo", photo);

      if (editingId) {
        await axiosInstance.patch(`complaints/${editingId}/update/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg({ type: "success", text: "Complaint updated." });
      } else {
        await axiosInstance.post("complaints/create/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg({ type: "success", text: "Complaint submitted." });
      }

      setEditingId(null);
      setTitle("");
      setDescription("");
      setPhoto(null);

      fetchHistory();
    } catch (err) {
      setMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="complaints-page container">
      <h2>{editingId ? "Edit Complaint" : "Report a Problem"}</h2>

      {msg && (
        <div className={`alert ${msg.type === "error" ? "alert-danger" : "alert-success"}`}>
          {msg.text}
        </div>
      )}

      <form className="complaint-form" onSubmit={handleSubmit}>
        <label>Complaint type</label>
        <select value={complaintType} onChange={(e) => setComplaintType(e.target.value)}>
          <option value="vehicle_issue">Vehicle Issue</option>
          <option value="safety_concern">Safety Concern</option>
          <option value="payment_issue">Payment Issue</option>
          <option value="app_issue">App Issue</option>
          <option value="other">Other</option>
        </select>

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Photo (optional)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button className="btn btn-primary mt-2">
          {editingId ? "Update Complaint" : "Submit Complaint"}
        </button>
      </form>

      <hr />

      <h3>Your Complaints</h3>
      <div className="complaint-list">
        {history.map((c) => (
          <ComplaintItem key={c.id} item={c} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
