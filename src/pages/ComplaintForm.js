import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';   // ✅ Use global axiosInstance
import { useNavigate } from 'react-router-dom';

export default function ComplaintForm() {
  const navigate = useNavigate();

  const [complaintType, setComplaintType] = useState('vehicle_issue');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const CREATE_URL = 'complaints/create/'; // axiosInstance base is already /api/Users/

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title.');
      return;
    }
    if (!description.trim()) {
      setError('Please describe the problem.');
      return;
    }

    const formData = new FormData();
    formData.append('complaint_type', complaintType);
    formData.append('title', title);
    formData.append('description', description);

    if (photo) formData.append('photo', photo);

    try {
      setLoading(true);
      setProgress(0);

      await axiosInstance.post(CREATE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });

      setLoading(false);
      setProgress(0);

      // redirect to history page
      navigate('/complaints/history');

    } catch (err) {
      setLoading(false);
      setProgress(0);
      console.error('Complaint create error', err);
      setError(err?.response?.data?.error || 'Upload failed. Try again.');
    }
  }

  return (
    <div className="complaint-form card p-3">
      <h3>Report a Complaint</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        <div className="form-group">
          <label>Type</label>
          <select
            className="form-control"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
          >
            <option value="vehicle_issue">Vehicle Issue</option>
            <option value="safety_concern">Safety Concern</option>
            <option value="payment_issue">Payment Issue</option>
            <option value="app_issue">App Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group mt-2">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title"
          />
        </div>

        <div className="form-group mt-2">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            rows={4}
          />
        </div>

        <div className="form-group mt-2">
          <label>Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {previewUrl && (
            <div style={{ marginTop: 8 }}>
              <img
                src={previewUrl}
                alt="preview"
                style={{ maxWidth: 220, maxHeight: 160, borderRadius: 6 }}
              />
            </div>
          )}
        </div>

        {progress > 0 && (
          <div className="progress mt-2">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger mt-2">{error}</div>}

        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
