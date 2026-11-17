import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function ComplaintsHistory() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = 'complaints/history/'; // ✅ axiosInstance auto adds /api/Users

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await axiosInstance.get(URL);
        if (mounted) setComplaints(res.data || []);
      } catch (err) {
        console.error('Error fetching complaints', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading complaints...</div>;
  if (!complaints || complaints.length === 0)
    return <div>No complaints found.</div>;

  return (
    <div className="complaints-history card p-3">
      <h3>Your Complaints</h3>

      <ul className="list-group mt-3">
        {complaints.map((c) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-start"
            key={c.id}
          >
            <div>
              <strong>{c.title}</strong>
              <div className="small text-muted">
                {c.status} •{' '}
                {c.created_at
                  ? new Date(c.created_at).toLocaleString()
                  : ''}
              </div>
            </div>

            <Link
              to={`/complaints/${c.id}`}
              className="btn btn-sm btn-outline-primary"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
