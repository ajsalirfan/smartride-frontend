import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StaffTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api/StaffWork";

  // ===========================
  // LOAD TASKS
  // ===========================
  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(`${API_BASE}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ===========================
  // UPDATE TASK STATUS
  // ===========================
  const updateTaskStatus = async (task_id, newStatus) => {
    setUpdating(true);

    try {
      const token = localStorage.getItem("access");

      const res = await fetch(`${API_BASE}/tasks/${task_id}/status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Status update failed");
      } else {
        alert("Task updated successfully!");
        setSelectedTask(null);
        loadTasks();
      }
    } catch (error) {
      alert("Network error");
    }

    setUpdating(false);
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div className="container py-4">

      {/* TOP SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">📋 My Tasks</h2>
          <p className="text-muted">Manage your assigned tasks</p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/staff/panel")}
        >
          <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border"></div>
        </div>
      )}

      {/* NO TASKS */}
      {!loading && tasks.length === 0 && (
        <div className="alert alert-info text-center">
          No tasks assigned yet.
        </div>
      )}

      {/* TASK LIST */}
      <div className="row g-3">
        {tasks.map((task) => (
          <div className="col-md-6" key={task.task_id}>
            <div
              className="card shadow-sm p-3 border-0"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedTask(task)}
            >
              {/* TASK TITLE */}
              <h5 className="fw-semibold mb-2">{task.title || "Untitled Task"}</h5>

              {/* BADGES */}
              <div className="mb-2">
                <span className="badge bg-primary me-2">{task.task_type}</span>

                <span
                  className={`badge ${
                    task.priority === "high"
                      ? "bg-danger"
                      : task.priority === "medium"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {/* VEHICLE IMAGE */}
              {task.vehicle_photo && (
                <img
                  src={task.vehicle_photo}
                  alt="vehicle"
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              )}

              {/* LOCATION */}
              <p className="small text-muted mb-0">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {task.location_name || "No location"}
              </p>

              {/* STATUS */}
              <p className="small text-muted">
                <i className="bi bi-clock me-1"></i>
                Status: <strong>{task.status}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===========================
          TASK DETAILS MODAL
      =========================== */}
      {selectedTask && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow">

              <div className="modal-header">
                <h5 className="modal-title">
                  📝 {selectedTask.title}
                </h5>
                <button className="btn-close" onClick={() => setSelectedTask(null)}></button>
              </div>

              <div className="modal-body">

                {/* VEHICLE PHOTO */}
                {selectedTask.vehicle_photo && (
                  <img
                    src={selectedTask.vehicle_photo}
                    alt="task vehicle"
                    className="img-fluid mb-3 rounded"
                    style={{ maxHeight: "220px", objectFit: "cover" }}
                  />
                )}

                <p><strong>Type:</strong> {selectedTask.task_type}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Description:</strong> {selectedTask.description || "No description provided."}</p>

                <p><strong>Vehicle:</strong> {selectedTask.vehicle || "None"}</p>

                <hr />

                {/* UPDATE BUTTONS */}
                <h6>📌 Update Status</h6>
                <div className="d-flex gap-2 flex-wrap">

                  <button
                    className="btn btn-warning"
                    disabled={updating || selectedTask.status === "in_progress"}
                    onClick={() =>
                      updateTaskStatus(selectedTask.task_id, "in_progress")
                    }
                  >
                    {updating ? "Updating..." : "Start Task"}
                  </button>

                  <button
                    className="btn btn-success"
                    disabled={updating || selectedTask.status === "completed"}
                    onClick={() =>
                      updateTaskStatus(selectedTask.task_id, "completed")
                    }
                  >
                    {updating ? "Updating..." : "Mark Completed"}
                  </button>

                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
