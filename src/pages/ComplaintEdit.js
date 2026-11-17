// src/pages/ComplaintEdit.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

export default function ComplaintEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const res = await axiosInstance.get(`complaints/${id}/`);
        
        // IMPORTANT FIX 👇
        const data = res.data.complaint;

        setTitle(data.title || "");
        setDescription(data.description || "");
      } catch (err) {
        console.error(err);
        setMsg({ type: "error", text: "Failed to load complaint details." });
      } finally {
        setLoading(false);
      }
    }
    fetchComplaint();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  async function handleUpdate(e) {
    e.preventDefault();
    setMsg(null);

    try {
      const payload = {
        title,
        description,
      };

      await axiosInstance.put(`complaints/${id}/update/`, payload);

      setMsg({ type: "success", text: "Complaint updated successfully!" });

      setTimeout(() => navigate("/complaints"), 1000);

    } catch (err) {
      console.error(err);
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Update failed.",
      });
    }
  }

  return (
    <div className="container mt-3">
      <h2>Edit Complaint</h2>

      {msg && (
        <div
          className={`alert alert-${
            msg.type === "error" ? "danger" : "success"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          className="form-control mt-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn btn-primary mt-3">Save Changes</button>
      </form>
    </div>
  );
}
