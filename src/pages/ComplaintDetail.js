import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams } from 'react-router-dom';

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getDetail() {
      try {
        const res = await axiosInstance.get(`complaints/${id}/`);  // ✅ correct path
        if (mounted) setComplaint(res.data);
      } catch (err) {
        console.error('Complaint detail error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div>Loading complaint...</div>;
  if (!complaint) return <div>Complaint not found.</div>;

  return (
    <div className="complaint-detail card p-3">
      <h3>{complaint.title}</h3>

      <div className="mb-2">
        <strong>Type:</strong> {complaint.complaint_type}
      </div>

      <div className="mb-2">
        <strong>Status:</strong> {complaint.status}
      </div>

      <div className="mb-3">
        <strong>Description:</strong>
        <p className="mt-1">{complaint.description}</p>
      </div>

      {/* ✅ support single photo */}
      {complaint.photo && (
        <div className="mb-3">
          <strong>Photo:</strong><br />
          <img
            src={complaint.photo}
            alt="complaint"
            style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 6 }}
          />
        </div>
      )}

      {/* ✅ support multiple photos if backend returns "photos": ["url1", "url2"] */}
      {complaint.photos?.length > 0 && (
        <div className="mb-3">
          <strong>Photos:</strong>
          <div className="d-flex gap-2 flex-wrap mt-2">
            {complaint.photos.map((p, idx) => (
              <img
                key={idx}
                src={p}
                alt={`complaint-${idx}`}
                style={{ width: 150, height: 120, objectFit: "cover", borderRadius: 6 }}
              />
            ))}
          </div>
        </div>
      )}

      {complaint.admin_reply && (
        <div className="alert alert-info mt-3">
          <strong>Admin Reply:</strong>
          <p className="mt-1">{complaint.admin_reply}</p>

          {complaint.replied_at && (
            <div className="small text-muted">
              Replied at: {new Date(complaint.replied_at).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
