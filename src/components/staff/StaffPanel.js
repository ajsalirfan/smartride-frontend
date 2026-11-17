// src/pages/StaffPanel.jsx
import React, { useEffect, useState } from "react";
import "./StaffPanel.css";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Container,
  Dropdown,
  Modal,
  Form,
  Spinner,
  InputGroup,
  Tabs,
  Tab,
  Alert,
  Toast,
  ToastContainer,
  Card,
  ProgressBar,
  Row,
  Col,
  Navbar,
  NavDropdown,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  FaUser,
  FaSignOutAlt,
  FaTools,
  FaExclamationTriangle,
  FaBell,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaClock,
  FaPlayCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaFileAlt,
  FaCar,
  FaFilter,
  FaEnvelope,
  FaUserMd,
  FaReply,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaFirstAid,
  FaCarCrash,
  FaWrench,
  FaAmbulance,
  FaUsers,
  FaTasks,
  FaHistory,
  FaCog,
  FaInfoCircle,
  FaCalendar,
  FaChartLine,
  FaBuilding,
  FaTachometerAlt,
  FaStar,
  FaLeaf,
  FaBolt,
  FaWallet,
  FaMotorcycle,
  FaMap,
  FaLifeRing,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaSync,
  FaPlus,
  FaEdit,
  FaTrash,
  FaHome,
  FaHeartbeat,
  FaCogs,
  FaRobot,
  FaShield,
  FaHeadset,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { GiElectric, GiMechanicGarage, GiBatteryPack, GiSpeedometer } from "react-icons/gi";

// ===============================
// HELPER FUNCTIONS
// ===============================

const getRelativeTime = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "danger";
    case "active":
    case "in_progress":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "secondary";
    default:
      return "secondary";
  }
};

const getEmergencyTypeBadge = (type) => {
  switch (type?.toLowerCase()) {
    case "accident":
      return "danger";
    case "harassment":
      return "warning";
    case "vehicle_breakdown":
      return "info";
    case "medical":
      return "success";
    case "theft":
      return "dark";
    case "other":
      return "secondary";
    default:
      return "primary";
  }
};

const getEmergencyTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'accident':
      return <FaCarCrash className="me-2" />;
    case 'harassment':
      return <FaShieldAlt className="me-2" />;
    case 'vehicle_breakdown':
      return <FaWrench className="me-2" />;
    case 'medical':
      return <FaFirstAid className="me-2" />;
    case 'theft':
      return <FaShieldAlt className="me-2" />;
    case 'other':
      return <FaExclamationTriangle className="me-2" />;
    default:
      return <FaExclamationTriangle className="me-2" />;
  }
};

const getImageUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  if (photoPath.startsWith('/media/')) {
    return `http://127.0.0.1:8000${photoPath}`;
  }
  return `http://127.0.0.1:8000/media/${photoPath}`;
};

// ===============================
// COMPONENTS
// ===============================

// Task Card Component
function TaskCard({ task, setSelectedTask }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="text-danger" />;
      case "in_progress":
        return <FaPlayCircle className="text-warning" />;
      case "completed":
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaInfoCircle className="text-secondary" />;
    }
  };

  return (
    <Card
      className="h-100 border-0 shadow-lg hover-shadow transition-all"
      style={{
        cursor: "pointer",
        borderRadius: "15px",
        transition: "all 0.3s ease",
      }}
      onClick={() => setSelectedTask(task)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
      }}
    >
      {/* Task Image */}
      <div className="position-relative" style={{ height: "180px", overflow: "hidden" }}>
        {task.vehicle_photo ? (
          <img
            src={getImageUrl(task.vehicle_photo)}
            alt="Vehicle"
            className="w-100 h-100"
            style={{
              objectFit: "cover",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/400x180/6c757d/ffffff?text=${task.task_type}`;
            }}
          />
        ) : (
          <div
            className="bg-gradient-primary w-100 h-100 d-flex justify-content-center align-items-center text-white"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
          >
            <GiMechanicGarage className="fs-1 opacity-50" />
          </div>
        )}

        {/* Priority Badge */}
        <div className="position-absolute top-3 end-3">
          <Badge bg={getStatusBadge(task.priority)} className="px-3 py-2 shadow">
            <FaBolt className="me-1" /> {task.priority}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="position-absolute top-3 start-3">
          <Badge bg={getStatusBadge(task.status)} className="px-3 py-2 shadow">
            {getStatusIcon(task.status)} {task.status?.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* Task Content */}
      <Card.Body className="d-flex flex-column p-4">
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-2 text-truncate">{task.title}</h5>

          <div className="mb-3">
            <Badge bg="light" text="dark" className="me-2 mb-1 px-3 py-2">
              <FaTools className="me-1" /> {task.task_type}
            </Badge>
            <Badge bg="info" className="me-2 mb-1 px-3 py-2">
              <FaMotorcycle className="me-1" /> {task.vehicle_model || "Vehicle"}
            </Badge>
          </div>

          <p className="text-muted small mb-3">
            {task.description?.slice(0, 120) || "No description available"}
            {task.description?.length > 120 && "..."}
          </p>
        </div>

        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FaCalendar className="text-primary me-2" />
              <small className="text-muted">
                {task.created_at ? new Date(task.created_at).toLocaleDateString() : "N/A"}
              </small>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTask(task);
              }}
            >
              <FaArrowRight className="me-1" /> View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// Emergency Card Component
function EmergencyCard({ emergency, setSelectedEmergency, setShowEmergencyModal }) {
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-danger border-2 shadow-lg h-100 hover-scale-105">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Badge bg={getEmergencyTypeBadge(emergency.alert_type)} className="mb-2 px-3 py-2">
              {getEmergencyTypeIcon(emergency.alert_type)}
              {emergency.alert_type}
            </Badge>
            <h6 className="fw-bold mb-1">
              {emergency.username || "User"} - {emergency.alert_type}
            </h6>
          </div>
          <Badge bg={emergency.is_resolved ? "success" : "danger"} className="px-3 py-2">
            {emergency.is_resolved ? (
              <>
                <FaCheck className="me-1" /> Resolved
              </>
            ) : (
              <>
                <FaExclamationTriangle className="me-1" /> Active
              </>
            )}
          </Badge>
        </div>

        <p className="text-muted small mb-4">
          {emergency.message?.slice(0, 150) || "No message provided"}...
        </p>

        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaMapMarkerAlt className="text-primary me-2" />
            <span className="small">
              <strong>Location:</strong> {emergency.location_name || "Unknown"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaUser className="text-primary me-2" />
            <span className="small">
              <strong>Reporter:</strong> {emergency.username || "User"}
            </span>
          </div>
          <div className="d-flex align-items-center">
            <FaEnvelope className="text-primary me-2" />
            <span className="small">
              <strong>Email:</strong> {emergency.user_email || "N/A"}
            </span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaClock className="text-muted me-2" />
            <small className="text-muted">
              {getRelativeTime(emergency.created_at)}
            </small>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setSelectedEmergency(emergency);
              setShowEmergencyModal(true);
            }}
          >
            <FaUserMd className="me-1" />
            Respond
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// Stats Card Component
function StatsCard({ icon, title, value, change, color, gradient }) {
  return (
    <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "15px" }}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-3">
          <div
            className="icon-wrapper p-3 rounded-circle me-3"
            style={{
              background: gradient,
              color: "white",
            }}
          >
            {icon}
          </div>
          <div>
            <h6 className="text-muted mb-0">{title}</h6>
            <h3 className="fw-bold mb-0">{value}</h3>
          </div>
        </div>
        {change && (
          <div className="d-flex align-items-center">
            <Badge bg={change > 0 ? "success" : "warning"} className="px-2 py-1">
              {change > 0 ? "+" : ""}{change}%
            </Badge>
            <span className="text-muted small ms-2">from last week</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

// Notification Dropdown Component - IMPROVED
function NotificationDropdown({
  showNotifications,
  setShowNotifications,
  notifications,
  notificationLoading,
  unreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  getRelativeTime,
}) {
  return (
    <Dropdown 
      show={showNotifications} 
      onToggle={setShowNotifications} 
      align="end"
      style={{ position: 'relative' }}
    >
      <Dropdown.Toggle 
        variant="light" 
        className="position-relative border-0 p-0"
        style={{ 
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div className="position-relative">
          <FaBell className="fs-5" style={{ 
            color: 'white',
            transition: 'color 0.3s ease'
          }} />
          {unreadNotifications > 0 && (
            <Badge 
              pill 
              bg="danger" 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ 
                fontSize: '0.65rem', 
                minWidth: '20px', 
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #1a237e',
                padding: '0'
              }}
            >
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </Badge>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu 
        className="notification-dropdown shadow-lg border-0 p-0" 
        style={{ 
          minWidth: '380px', 
          maxHeight: '500px', 
          overflow: 'hidden',
          borderRadius: '15px',
          marginTop: '10px',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-3 border-bottom bg-gradient-primary text-white"
             style={{ 
               background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
               borderRadius: '15px 15px 0 0'
             }}>
          <div>
            <h6 className="mb-0 fw-bold">Notifications</h6>
            <small className="opacity-75">{notifications.length} total</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            {notificationLoading && (
              <Spinner animation="border" size="sm" variant="light" />
            )}
            {unreadNotifications > 0 && (
              <Button 
                variant="light" 
                size="sm" 
                className="text-primary p-1 px-2"
                onClick={markAllNotificationsAsRead}
                style={{ fontSize: '0.75rem' }}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <div className="notification-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.slice(0, 8).map((notification) => (
              <Dropdown.Item 
                key={notification.id} 
                className={`py-3 px-4 border-bottom ${!notification.is_read ? 'bg-warning bg-opacity-10' : ''}`}
                onClick={() => markNotificationAsRead(notification.id)}
                style={{ 
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s',
                  borderLeft: notification.is_read ? 'none' : '4px solid #ff9800'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.is_read ? 'white' : 'rgba(255, 152, 0, 0.1)'}
              >
                <div className="d-flex">
                  <div className="notification-icon me-3">
                    <div className="rounded-circle p-2" 
                         style={{ 
                           background: notification.is_read ? '#e9ecef' : 'rgba(33, 150, 243, 0.1)',
                           color: notification.is_read ? '#6c757d' : '#2196F3'
                         }}>
                      <FaBell size={16} />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                        {notification.title || 'Notification'}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {getRelativeTime(notification.created_at)}
                      </div>
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                      {notification.message || 'No message'}
                    </div>
                    {!notification.is_read && (
                      <Badge pill bg="primary" className="mt-2" style={{ fontSize: '0.7rem' }}>
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <div className="text-center py-5">
              <div className="p-4 bg-light rounded-circle d-inline-flex mb-3">
                <FaBell className="text-muted fs-1 opacity-25" />
              </div>
              <h6 className="fw-bold mb-2">No notifications</h6>
              <p className="text-muted small mb-0">You're all caught up!</p>
              <small className="text-muted">Check back later for updates</small>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="px-4 py-3 border-top bg-light d-flex justify-content-between"
               style={{ borderRadius: '0 0 15px 15px' }}>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={clearAllNotifications}
              className="d-flex align-items-center"
            >
              <FaTrash className="me-2" />
              Clear All
            </Button>

          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================

export default function StaffPanel() {
  const navigate = useNavigate();

  // States
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // API Configuration
  const API_BASE = "http://127.0.0.1:8000";
  const API = `${API_BASE}/api/StaffWork`;

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Enhanced Search
  const [searchResults, setSearchResults] = useState({
    tasks: [],
    emergencies: [],
    users: []
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Emergencies
  const [emergencies, setEmergencies] = useState([]);
  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const [emergencyHistory, setEmergencyHistory] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [responding, setResponding] = useState(false);

  // Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({ username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const [showNavbarMenu, setShowNavbarMenu] = useState(false);

  // Active icon states
  const [activeIcon, setActiveIcon] = useState("dashboard");

  // Quotes for header
  const quotes = [
    "Efficiency is doing things right. Effectiveness is doing the right things.",
    "The best way to predict the future is to create it.",
    "Quality is not an act, it is a habit.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The only way to do great work is to love what you do.",
    "Operations keeps the lights on, strategy provides a light at the end of the tunnel.",
    "Good management is the art of making problems so interesting that everyone wants to solve them.",
  ];

  // Social media links
  const socialLinks = [
    { icon: FaFacebook, color: '#1877f2', label: 'Facebook' },
    { icon: FaTwitter, color: '#1da1f2', label: 'Twitter' },
    { icon: FaInstagram, color: '#e4405f', label: 'Instagram' },
    { icon: FaLinkedin, color: '#0a66c2', label: 'LinkedIn' },
    { icon: FaYoutube, color: '#ff0000', label: 'YouTube' },
  ];

  // Helper Functions
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const getCsrfToken = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      if (cookie.startsWith("csrftoken=")) {
        return cookie.split("=")[1];
      }
    }
    return null;
  };

  // Auth Fetch
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("access");
    const csrfToken = getCsrfToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    if (
      csrfToken &&
      (options.method === "POST" ||
        options.method === "PUT" ||
        options.method === "PATCH" ||
        options.method === "DELETE")
    ) {
      headers["X-CSRFToken"] = csrfToken;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          const newToken = localStorage.getItem("access");
          headers["Authorization"] = `Bearer ${newToken}`;
          return fetch(url, {
            ...options,
            headers,
          });
        } else {
          handleLogout();
          throw new Error("Authentication failed");
        }
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return false;

      const res = await fetch(`${API_BASE}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access", data.access);
        return true;
      }
      return false;
    } catch (err) {
      console.log("Token refresh error:", err);
      return false;
    }
  };

  // Initial Load
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return navigate("/login");

    const user = JSON.parse(userStr);
    if (user.user_type !== "staff") return navigate("/login");

    setStaff(user);
    setProfileForm({ username: user.username, email: user.email });

    loadTasks();
    loadNotifications();
    loadEmergencies();
    setLoading(false);
  }, []);

  // Load Tasks
  const loadTasks = async () => {
    setTaskLoading(true);
    try {
      const res = await fetchWithAuth(`${API}/tasks/`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setFilteredTasks(data.tasks || []);
      }
    } catch (err) {
      console.log("Task Load Error:", err);
    }
    setTaskLoading(false);
  };

  // Enhanced Search Function
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setShowSearchResults(false);
      setSearchResults({ tasks: [], emergencies: [], users: [] });
      return;
    }

    setSearchLoading(true);
    try {
      // Search tasks
      const taskResults = tasks.filter(task =>
        task.title?.toLowerCase().includes(term.toLowerCase()) ||
        task.description?.toLowerCase().includes(term.toLowerCase()) ||
        task.task_type?.toLowerCase().includes(term.toLowerCase())
      );

      // Search emergencies
      const emergencyResults = emergencies.filter(emergency =>
        emergency.alert_type?.toLowerCase().includes(term.toLowerCase()) ||
        emergency.message?.toLowerCase().includes(term.toLowerCase()) ||
        emergency.username?.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults({
        tasks: taskResults,
        emergencies: emergencyResults,
        users: [] // You can implement user search if needed
      });
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Update Task Status
  const updateTaskStatus = async (task_id, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetchWithAuth(`${API}/tasks/${task_id}/status/`, {
        method: "POST",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Status update failed", "danger");
      } else {
        showToast("Task status updated successfully!", "success");
        setSelectedTask(null);
        loadTasks();
      }
    } catch (err) {
      showToast("Network error", "danger");
    }
    setUpdating(false);
  };

  // Load Notifications
  const loadNotifications = async () => {
    setNotificationLoading(true);
    try {
      const res = await fetchWithAuth(`${API}/notifications/`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotifications(data.unread_count || 0);
      }
    } catch (err) {
      console.log("Notification Load Error:", err);
    }
    setNotificationLoading(false);
  };

  // Mark Notification as Read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const res = await fetchWithAuth(`${API}/notifications/${notificationId}/mark-read/`, {
        method: "POST",
      });

      if (res.ok) {
        loadNotifications();
        showToast("Notification marked as read", "success");
      }
    } catch (err) {
      console.log("Mark Read Error:", err);
    }
  };

  // Mark All Notifications as Read
  const markAllNotificationsAsRead = async () => {
    try {
      const res = await fetchWithAuth(`${API}/notifications/mark-all-read/`, {
        method: "POST",
      });

      if (res.ok) {
        loadNotifications();
        showToast("All notifications marked as read", "success");
      }
    } catch (err) {
      console.log("Mark All Read Error:", err);
    }
  };

  // Clear All Notifications - IMPROVED
  const clearAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    
    try {
      const res = await fetchWithAuth(`${API}/notifications/clear-all/`, {
        method: "POST", // Changed to POST as DELETE might need CORS handling
      });

      const data = await res.json();

      if (res.ok) {
        setNotifications([]);
        setUnreadNotifications(0);
        setShowNotifications(false);
        showToast("All notifications cleared", "success");
      } else {
        showToast(data.error || "Failed to clear notifications", "danger");
      }
    } catch (err) {
      console.log("Clear All Notifications Error:", err);
      showToast("Network error. Please try again.", "danger");
    }
  };

  // Load Emergencies
  const loadEmergencies = async () => {
    setEmergencyLoading(true);
    try {
      const res = await fetchWithAuth(`${API}/emergencies/`);
      if (res.ok) {
        const data = await res.json();
        const emergenciesData = data.emergencies || data || [];
        setEmergencies(emergenciesData);
        const active = emergenciesData.filter(e => !e.is_resolved) || [];
        const history = emergenciesData.filter(e => e.is_resolved) || [];
        setActiveEmergencies(active);
        setEmergencyHistory(history);
      }
    } catch (err) {
      console.log("Emergency Load Error:", err);
      showToast("Failed to load emergencies", "danger");
    }
    setEmergencyLoading(false);
  };

  // Respond to Emergency
  const respondToEmergency = async (alertId, adminResponse) => {
    setResponding(true);
    try {
      const res = await fetchWithAuth(`${API}/emergencies/${alertId}/update/`, {
        method: "POST",
        body: JSON.stringify({
          is_resolved: true,
          response: adminResponse
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to send response", "danger");
        return false;
      } else {
        showToast("Emergency response sent successfully!", "success");
        setSelectedEmergency(null);
        setShowEmergencyModal(false);
        loadEmergencies();
        loadNotifications();
        return true;
      }
    } catch (err) {
      console.error("Respond to emergency error:", err);
      showToast("Network error", "danger");
      return false;
    } finally {
      setResponding(false);
    }
  };

  // Profile Update
  const updateProfile = async () => {
    setSavingProfile(true);
    setProfileError("");

    try {
      const res = await fetchWithAuth(`${API}/profile/update/`, {
        method: "PATCH",
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Update failed");
      } else {
        setProfileSuccess("Profile updated successfully!");
        setStaff(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => setProfileSuccess(""), 3000);
      }
    } catch {
      setProfileError("Network error");
    }
    setSavingProfile(false);
  };

  const changePassword = async () => {
    setSavingPassword(true);
    setProfileError("");

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setProfileError("New passwords do not match!");
      setSavingPassword(false);
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setProfileError("Password must be at least 8 characters!");
      setSavingPassword(false);
      return;
    }

    try {
      const res = await fetchWithAuth(`${API}/profile/change-password/`, {
        method: "POST",
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Password change failed");
      } else {
        setProfileSuccess("Password changed successfully!");
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setProfileSuccess(""), 3000);
      }
    } catch {
      setProfileError("Network error");
    }
    setSavingPassword(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Refresh Data
  const refreshData = () => {
    loadTasks();
    loadNotifications();
    loadEmergencies();
    showToast("Data refreshed successfully!", "success");
  };

  // Filter Tasks
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.task_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-gradient-primary">
        <Spinner animation="border" variant="light" size="lg" />
        <h4 className="text-white mt-3">Loading Staff Portal...</h4>
        <p className="text-light opacity-75">Preparing your dashboard</p>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    activeTasks: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    activeEmergencies: activeEmergencies.length,
    totalUsers: 1,
  };

  // Navbar Icons Configuration
  const navbarIcons = [
    { 
      icon: FaTachometerAlt, 
      action: 'dashboard', 
      title: 'Dashboard', 
      activeGradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
      inactiveGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      activeColor: '#ffffff',
      inactiveColor: '#4CAF50'
    },
    { 
      icon: FaTasks, 
      action: 'tasks', 
      title: 'Tasks', 
      activeGradient: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)',
      inactiveGradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      activeColor: '#ffffff',
      inactiveColor: '#2196F3'
    },
    { 
      icon: FaExclamationTriangle, 
      action: 'emergencies', 
      title: 'Emergencies', 
      activeGradient: 'linear-gradient(135deg, #f44336 0%, #FF5722 100%)',
      inactiveGradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
      activeColor: '#ffffff',
      inactiveColor: '#f44336'
    },
  ];

  return (
    <div className="staff-panel-container">
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            show={true}
            delay={5000}
            autohide
            bg={toast.type}
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      {/* Enhanced Navbar */}
      <Navbar expand="lg" className="smart-navbar shadow-lg" fixed="top" style={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        borderBottom: '3px solid #ff9800',
        padding: '0.8rem 0'
      }}>
        <Container fluid>
          {/* Brand Logo */}
          <Navbar.Brand href="#" className="d-flex align-items-center text-white">
            <GiMechanicGarage className="text-warning fs-2 me-2" />
            <div>
              <span className="fw-bold fs-4">Smart</span>
              <span className="fw-bold text-warning fs-4">Ride</span>
              <span className="fs-6 ms-2 opacity-75">Staff Portal</span>
            </div>
          </Navbar.Brand>

          {/* Enhanced Search Bar */}
          <div className="search-bar mx-lg-4 flex-grow-1" style={{ position: 'relative' }}>
            <div className="input-group search-input-group" style={{ maxWidth: '500px' }}>
              <span className="input-group-text bg-white border-end-0 ps-3">
                <FaSearch className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 py-2 pe-4"
                placeholder="Search tasks, emergencies, users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchTerm && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                style={{ 
                  fontSize: '0.95rem',
                  borderRadius: '0 8px 8px 0'
                }}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => {
                    setSearchTerm('');
                    setShowSearchResults(false);
                  }}
                  style={{ marginLeft: '-1px' }}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (searchResults.tasks.length > 0 || searchResults.emergencies.length > 0) && (
              <div className="search-results shadow-lg border-0"
                   style={{
                     position: 'absolute',
                     top: '100%',
                     left: 0,
                     right: 0,
                     maxWidth: '500px',
                     backgroundColor: 'white',
                     borderRadius: '0 0 15px 15px',
                     zIndex: 1050,
                     maxHeight: '400px',
                     overflowY: 'auto',
                     border: '1px solid #dee2e6'
                   }}>
                <div className="p-3 border-bottom bg-light">
                  <h6 className="fw-bold mb-0">Search Results</h6>
                </div>
                
                {searchResults.tasks.length > 0 && (
                  <div className="p-3">
                    <h6 className="fw-bold text-primary mb-2">
                      <FaTasks className="me-2" /> Tasks ({searchResults.tasks.length})
                    </h6>
                    {searchResults.tasks.slice(0, 3).map(task => (
                      <div key={task.task_id} 
                           className="search-result-item p-2 border-bottom hover-bg-light"
                           onClick={() => {
                             setSelectedTask(task);
                             setShowSearchResults(false);
                             setSearchTerm('');
                           }}
                           style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">{task.title}</span>
                          <Badge bg={getStatusBadge(task.status)} className="ms-2">
                            {task.status}
                          </Badge>
                        </div>
                        <small className="text-muted">{task.task_type}</small>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.emergencies.length > 0 && (
                  <div className="p-3">
                    <h6 className="fw-bold text-danger mb-2">
                      <FaExclamationTriangle className="me-2" /> Emergencies ({searchResults.emergencies.length})
                    </h6>
                    {searchResults.emergencies.slice(0, 3).map(emergency => (
                      <div key={emergency.id} 
                           className="search-result-item p-2 border-bottom hover-bg-light"
                           onClick={() => {
                             setSelectedEmergency(emergency);
                             setShowEmergencyModal(true);
                             setShowSearchResults(false);
                             setSearchTerm('');
                           }}
                           style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">{emergency.alert_type}</span>
                          <Badge bg={emergency.is_resolved ? 'success' : 'danger'} className="ms-2">
                            {emergency.is_resolved ? 'Resolved' : 'Active'}
                          </Badge>
                        </div>
                        <small className="text-muted">{emergency.username}</small>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-light border-top">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => {
                      setActiveTab(searchResults.tasks.length > 0 ? 'tasks' : 'emergencies');
                      setShowSearchResults(false);
                    }}
                  >
                    View All Results
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Navbar Icons - IMPROVED WITH ACTIVE STATES */}
          <div className="d-flex align-items-center gap-3">
            {navbarIcons.map((item, index) => {
              const isActive = activeTab === item.action;
              return (
                <OverlayTrigger
                  key={index}
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-${index}`}>{item.title}</Tooltip>}
                >
                  <button 
                    className="navbar-icon-btn position-relative"
                    onClick={() => {
                      setActiveTab(item.action);
                      setActiveIcon(item.action);
                    }}
                    style={{ 
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: isActive ? item.activeGradient : item.inactiveGradient,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <item.icon className="fs-5" style={{ 
                      color: isActive ? item.activeColor : item.inactiveColor 
                    }} />
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="position-absolute bottom-0 start-50 translate-middle-x"
                           style={{
                             width: '20px',
                             height: '3px',
                             backgroundColor: '#ff9800',
                             borderRadius: '2px'
                           }}></div>
                    )}

                    {/* Live Indicators */}
                    {item.action === 'emergencies' && activeEmergencies.length > 0 && (
                      <span className="position-absolute top-0 end-0 translate-middle p-1 bg-danger border border-light rounded-circle"
                            style={{ fontSize: '0.5rem' }}>
                        <span className="visually-hidden">Active emergencies</span>
                      </span>
                    )}
                    {item.action === 'tasks' && stats.activeTasks > 0 && (
                      <span className="position-absolute top-0 end-0 translate-middle p-1 bg-warning border border-light rounded-circle"
                            style={{ fontSize: '0.5rem' }}>
                        <span className="visually-hidden">Active tasks</span>
                      </span>
                    )}
                  </button>
                </OverlayTrigger>
              );
            })}

            {/* Notification Bell - UPDATED STYLE */}
            <NotificationDropdown
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              notifications={notifications}
              notificationLoading={notificationLoading}
              unreadNotifications={unreadNotifications}
              markNotificationAsRead={markNotificationAsRead}
              markAllNotificationsAsRead={markAllNotificationsAsRead}
              clearAllNotifications={clearAllNotifications}
              getRelativeTime={getRelativeTime}
            />

            {/* User Profile Dropdown */}
            <NavDropdown
              title={
                <div 
                  className="user-avatar bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '46px', 
                    height: '46px', 
                    border: '2px solid #fff',
                    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                    cursor: 'pointer'
                  }}
                >
                  <FaUser className="fs-5" />
                </div>
              }
              id="user-nav-dropdown"
              align="end"
              show={showNavbarMenu}
              onToggle={(show) => setShowNavbarMenu(show)}
              className="profile-dropdown"
            >
              <div className="px-3 py-3 border-bottom bg-light">
                <div className="fw-bold text-primary">{staff?.username || "Staff"}</div>
                <div className="small text-muted">{staff?.email || ""}</div>
                <div className="mt-2">
                  <Badge bg="warning" className="px-2 py-1">
                    <GiMechanicGarage className="me-1" /> Operations Staff
                  </Badge>
                </div>
              </div>
              <NavDropdown.Item onClick={() => setShowProfileModal(true)} className="py-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <FaUser className="text-primary" />
                  </div>
                  <div>
                    <div className="fw-bold">Edit Profile</div>
                    <div className="small text-muted">Update your details</div>
                  </div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={refreshData} className="py-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-success bg-opacity-10 p-2 rounded-circle me-3">
                    <FaSync className="text-success" />
                  </div>
                  <div>
                    <div className="fw-bold">Refresh Data</div>
                    <div className="small text-muted">Update dashboard</div>
                  </div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item 
                onClick={handleLogout}
                className="py-3 text-danger"
              >
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                    <FaSignOutAlt className="text-danger" />
                  </div>
                  <div>
                    <div className="fw-bold">Logout</div>
                    <div className="small text-muted">Sign out of your account</div>
                  </div>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="main-content-wrapper mt-5 pt-5">
        {/* Hero Header with Updated Button */}
        <section className="hero-section py-5" style={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          borderRadius: '0 0 30px 30px'
        }}>
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="hero-content">
                  <Badge bg="warning" className="mb-3 px-3 py-2">
                    <GiMechanicGarage className="me-2" /> Operations Dashboard
                  </Badge>
                  <h1 className="display-5 fw-bold mb-3 text-white">
                    Welcome back, <span className="text-warning">{staff?.username}</span>! 🎯
                  </h1>
                  <div className="quote-box p-4 bg-white bg-opacity-10 rounded-3 shadow-sm mb-4 border-start border-4 border-warning">
                    <p className="lead fst-italic text-light mb-3">
                      "Efficiency is doing things right. Effectiveness is doing the right things."
                    </p>
                    <div className="d-flex align-items-center">
                      <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-3">
                        <FaStar className="text-warning" />
                      </div>
                      <div>
                        <div className="fw-bold text-white">Today's Focus</div>
                        <div className="text-light small">Managing {stats.activeTasks} active tasks</div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-3 flex-wrap">
                    {/* REPLACED: Refresh Dashboard with View All Emergency */}
                    <Button variant="danger" size="lg" className="px-4 py-3" onClick={() => setActiveTab('emergencies')}>
                      <FaExclamationTriangle className="me-2" /> View All Emergencies
                    </Button>
                    <Button variant="outline-light" size="lg" className="px-4 py-3" onClick={() => setActiveTab('tasks')}>
                      <FaTasks className="me-2" /> View All Tasks
                    </Button>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                {/* Live Stats Animation */}
                <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <div className="p-3 bg-primary bg-opacity-10 rounded-circle d-inline-flex mb-3">
                        <GiSpeedometer className="text-primary" style={{ fontSize: '3rem' }} />
                      </div>
                      <h4 className="fw-bold">Live Operations</h4>
                      <p className="text-muted">Real-time system monitoring</p>
                    </div>
                    
                    <div className="row g-4">
                      <Col xs={6}>
                        <div className="text-center p-3">
                          <div className="fs-1 fw-bold text-primary">{stats.activeTasks}</div>
                          <div className="text-muted">Active Tasks</div>
                          <div className="progress mt-2" style={{ height: '6px' }}>
                            <div className="progress-bar bg-primary" style={{ width: `${Math.min(stats.activeTasks * 10, 100)}%` }}></div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="text-center p-3">
                          <div className="fs-1 fw-bold text-danger">{stats.activeEmergencies}</div>
                          <div className="text-muted">Active Emergencies</div>
                          <div className="progress mt-2" style={{ height: '6px' }}>
                            <div className="progress-bar bg-danger" style={{ width: `${Math.min(stats.activeEmergencies * 20, 100)}%` }}></div>
                          </div>
                        </div>
                      </Col>
                    </div>
                    
                    <div className="mt-4 p-3 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <div className="p-2 bg-success bg-opacity-10 rounded-circle me-3">
                          <GiBatteryPack className="text-success" />
                        </div>
                        <div>
                          <div className="fw-bold">System Status</div>
                          <div className="text-success">
                            <FaCheckCircle className="me-1" /> All systems operational
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Dashboard Section */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <section className="stats-section py-5">
              <Container>
                <div className="section-header mb-5 text-center">
                  <h2 className="fw-bold display-6 mb-3">
                    <FaChartLine className="me-3 text-primary" />
                    Operations Overview
                  </h2>
                  <p className="lead text-muted">
                    Real-time insights into your operational performance
                  </p>
                </div>

                <Row className="g-4">
                  <Col xl={3} lg={6}>
                    <StatsCard
                      icon={<FaTasks />}
                      title="Active Tasks"
                      value={stats.activeTasks}
                      change={12}
                      color="primary"
                      gradient="linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)"
                    />
                  </Col>
                  <Col xl={3} lg={6}>
                    <StatsCard
                      icon={<FaCheckCircle />}
                      title="Completed Tasks"
                      value={stats.completedTasks}
                      change={8}
                      color="success"
                      gradient="linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)"
                    />
                  </Col>
                  <Col xl={3} lg={6}>
                    <StatsCard
                      icon={<FaExclamationTriangle />}
                      title="Active Emergencies"
                      value={stats.activeEmergencies}
                      change={-3}
                      color="danger"
                      gradient="linear-gradient(135deg, #f44336 0%, #FF5722 100%)"
                    />
                  </Col>
                  <Col xl={3} lg={6}>
                    <StatsCard
                      icon={<FaUsers />}
                      title="Total Users"
                      value={stats.totalUsers}
                      change={5}
                      color="info"
                      gradient="linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)"
                    />
                  </Col>
                </Row>
              </Container>
            </section>

            {/* Tasks Section */}
            <section className="tasks-section py-5">
              <Container>
                <div className="section-header mb-5">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h2 className="display-6 fw-bold mb-2">
                        <FaTasks className="me-3 text-primary" />
                        Recent Tasks
                      </h2>
                      <p className="lead text-muted">
                        {filteredTasks.length} tasks in the system • Manage and monitor task progress
                      </p>
                    </div>
                    <Button variant="outline-primary" onClick={() => setActiveTab('tasks')}>
                      <FaArrowRight className="me-2" /> View All Tasks
                    </Button>
                  </div>
                </div>

                {taskLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading tasks...</p>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <Card className="border-0 shadow-lg">
                    <Card.Body className="text-center py-5">
                      <FaTasks className="text-muted opacity-25 mb-4" style={{ fontSize: '5rem' }} />
                      <h3 className="fw-bold mb-3">No tasks found</h3>
                      <p className="text-muted lead mb-4">
                        You're all caught up! No tasks assigned at the moment.
                      </p>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row className="g-4">
                    {filteredTasks.slice(0, 6).map((task) => (
                      <Col xl={4} lg={6} key={task.task_id}>
                        <TaskCard
                          task={task}
                          setSelectedTask={setSelectedTask}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Container>
            </section>

            {/* Emergencies Section */}
            <section className="emergencies-section py-5">
              <Container>
                <div className="section-header mb-5">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h2 className="display-6 fw-bold mb-2">
                        <FaExclamationTriangle className="me-3 text-danger" />
                        Active Emergencies
                      </h2>
                      <p className="lead text-muted">
                        {activeEmergencies.length} emergencies requiring immediate attention
                      </p>
                    </div>
                    <Button variant="danger" onClick={() => setActiveTab('emergencies')}>
                      <FaArrowRight className="me-2" /> Manage Emergencies
                    </Button>
                  </div>
                </div>

                {emergencyLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" />
                    <p className="mt-2 text-muted">Loading emergencies...</p>
                  </div>
                ) : activeEmergencies.length === 0 ? (
                  <Alert variant="success" className="text-center py-4">
                    <FaCheckCircle className="me-2 fs-4" />
                    <h4 className="alert-heading">No active emergencies!</h4>
                    <p className="mb-0">All clear! No emergencies require immediate attention.</p>
                  </Alert>
                ) : (
                  <Row className="g-4">
                    {activeEmergencies.slice(0, 6).map((emergency) => (
                      <Col xl={4} lg={6} key={emergency.id}>
                        <EmergencyCard
                          emergency={emergency}
                          setSelectedEmergency={setSelectedEmergency}
                          setShowEmergencyModal={setShowEmergencyModal}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Container>
            </section>

            {/* Quick Actions Section */}
            <section className="actions-section py-5" style={{ 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}>
              <Container>
                <div className="section-header text-center mb-5">
                  <h2 className="fw-bold mb-3 text-primary">
                    <FaBolt className="me-2 text-warning" />
                    Quick Actions
                  </h2>
                  <p className="lead text-muted">
                    Essential tools for efficient operations management
                  </p>
                </div>
                
                <Row className="g-4 justify-content-center">
                  {[
                    {
                      icon: FaTasks,
                      title: 'Task Management',
                      description: 'Create, assign, and track maintenance tasks',
                      action: () => setActiveTab('tasks'),
                      color: 'primary',
                      gradient: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)'
                    },
                    {
                      icon: FaExclamationTriangle,
                      title: 'Emergency Response',
                      description: 'Handle urgent alerts and incidents',
                      action: () => setActiveTab('emergencies'),
                      color: 'danger',
                      gradient: 'linear-gradient(135deg, #f44336 0%, #FF5722 100%)'
                    },
                    {
                      icon: FaBell,
                      title: 'Notifications',
                      description: 'View and manage all alerts',
                      action: () => setShowNotifications(true),
                      color: 'warning',
                      gradient: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)'
                    },
                    {
                      icon: FaUser,
                      title: 'Profile Settings',
                      description: 'Update your account details',
                      action: () => setShowProfileModal(true),
                      color: 'success',
                      gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
                    },
                  ].map((item, index) => (
                    <Col xl={3} lg={6} key={index}>
                      <Card 
                        className="border-0 shadow-lg h-100 hover-scale-105" 
                        style={{ 
                          borderRadius: '15px',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={item.action}
                      >
                        <div className="card-header-gradient py-4 text-center text-white"
                             style={{ background: item.gradient }}>
                          <div className="action-icon-container d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-white bg-opacity-20 mb-3"
                               style={{ width: '70px', height: '70px' }}>
                            <item.icon className="text-white fs-3" />
                          </div>
                          <h5 className="fw-bold mb-0">{item.title}</h5>
                        </div>
                        
                        <Card.Body className="p-4">
                          <p className="text-muted mb-4 text-center">
                            {item.description}
                          </p>
                          
                          <div className="text-center">
                            <Button
                              variant={`outline-${item.color}`}
                              className="px-4 py-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                              }}
                            >
                              <item.icon className="me-2" />
                              Access Now
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </section>
          </>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <section className="tasks-section-full py-5">
            <Container>
              <div className="section-header mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h2 className="display-6 fw-bold mb-2">
                      <FaTasks className="me-3 text-primary" />
                      Task Management
                    </h2>
                    <p className="lead text-muted">
                      {filteredTasks.length} tasks assigned • Manage and update task status
                    </p>
                  </div>
                  <div className="d-flex gap-3 align-items-center">
                    <div className="search-box" style={{ width: '300px' }}>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <FaSearch className="text-primary" />
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search tasks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary">
                        <FaFilter className="me-2" />
                        {statusFilter === "all" ? "All Status" : statusFilter.replace("_", " ")}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setStatusFilter("all")}>All Status</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter("pending")}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter("in_progress")}>In Progress</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter("completed")}>Completed</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              {taskLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <Card.Body className="text-center py-5">
                    <FaTasks className="text-muted opacity-25 mb-4" style={{ fontSize: '5rem' }} />
                    <h3 className="fw-bold mb-3">No tasks found</h3>
                    <p className="text-muted lead mb-4">
                      {searchTerm || statusFilter !== "all"
                        ? "Try changing your search or filter"
                        : "You're all caught up! No tasks assigned."}
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                    >
                      <FaSearch className="me-2" />
                      Clear Search
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Row className="g-4">
                  {filteredTasks.map((task) => (
                    <Col xl={4} lg={6} key={task.task_id}>
                      <TaskCard
                        task={task}
                        setSelectedTask={setSelectedTask}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          </section>
        )}

        {/* Emergencies Tab */}
        {activeTab === "emergencies" && (
          <section className="emergencies-section-full py-5">
            <Container>
              <div className="section-header mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h2 className="display-6 fw-bold mb-2">
                      <FaExclamationTriangle className="me-3 text-danger" />
                      Emergency Management
                    </h2>
                    <p className="lead text-muted">
                      {activeEmergencies.length} active emergencies • Respond to user alerts
                    </p>
                  </div>
                  <Button variant="danger" onClick={refreshData}>
                    <FaSync className="me-2" />
                    Refresh Emergencies
                  </Button>
                </div>
              </div>

              {/* Active Emergencies */}
              <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-danger">
                    <FaExclamationTriangle className="me-2" />
                    Active Emergencies ({activeEmergencies.length})
                  </h3>
                </div>

                {emergencyLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" />
                    <p className="mt-2 text-muted">Loading emergencies...</p>
                  </div>
                ) : activeEmergencies.length === 0 ? (
                  <Alert variant="success" className="text-center py-4">
                    <FaCheckCircle className="me-2 fs-4" />
                    <h4 className="alert-heading">No active emergencies!</h4>
                    <p className="mb-0">All clear! No emergencies require attention.</p>
                  </Alert>
                ) : (
                  <Row className="g-4">
                    {activeEmergencies.map((emergency) => (
                      <Col xl={4} lg={6} key={emergency.id}>
                        <EmergencyCard
                          emergency={emergency}
                          setSelectedEmergency={setSelectedEmergency}
                          setShowEmergencyModal={setShowEmergencyModal}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>

              {/* Emergency History */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-secondary">
                    <FaHistory className="me-2" />
                    Emergency History ({emergencyHistory.length})
                  </h3>
                </div>

                {emergencyHistory.length === 0 ? (
                  <Alert variant="info" className="text-center py-4">
                    <FaInfoCircle className="me-2 fs-4" />
                    <h4 className="alert-heading">No emergency history</h4>
                    <p className="mb-0">No emergencies have been resolved yet.</p>
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>User</th>
                          <th>Message</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emergencyHistory.slice(0, 10).map((emergency) => (
                          <tr key={emergency.id}>
                            <td>
                              <Badge bg={emergency.is_resolved ? "success" : "danger"}>
                                {emergency.alert_type}
                              </Badge>
                            </td>
                            <td>{emergency.username}</td>
                            <td className="text-truncate" style={{ maxWidth: "200px" }}>
                              {emergency.message?.slice(0, 50)}...
                            </td>
                            <td>{emergency.location_name}</td>
                            <td>
                              <Badge bg={emergency.is_resolved ? "success" : "danger"}>
                                {emergency.is_resolved ? "Resolved" : "Active"}
                              </Badge>
                            </td>
                            <td>{getRelativeTime(emergency.created_at)}</td>
                            <td>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => {
                                  setSelectedEmergency(emergency);
                                  setShowEmergencyModal(true);
                                }}
                              >
                                <FaEye className="me-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* Enhanced Professional Footer */}
        <footer className="smart-footer bg-dark text-white py-5 mt-5">
          <Container>
            <Row className="g-5">
              <Col lg={4}>
                <div className="footer-brand mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <GiMechanicGarage className="text-warning fs-1 me-3" />
                    <div>
                      <h2 className="fw-bold mb-0">Smart Ride Operations</h2>
                      <p className="text-light opacity-75 mb-0">Staff Management Portal</p>
                    </div>
                  </div>
                  <p className="text-light opacity-75 mb-4">
                    Professional operations management portal for maintaining fleet efficiency, 
                    ensuring user safety, and delivering exceptional service quality.
                  </p>
                  <div className="quote-box p-3 bg-dark bg-opacity-50 rounded border-start border-3 border-warning">
                    <p className="mb-0 fst-italic text-light">
                      "{quotes[Math.floor(Math.random() * quotes.length)]}"
                    </p>
                  </div>
                </div>
              </Col>
              
              <Col lg={4}>
                <div className="contact-info mb-4">
                  <h4 className="fw-bold mb-4 text-warning">
                    <FaHeadset className="me-2" />
                    Staff Support
                  </h4>
                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="contact-icon bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                        <FaPhone className="text-primary" />
                      </div>
                      <div>
                        <div className="fw-bold">Staff Helpline</div>
                        <div className="text-light">1800-STAFF-123</div>
                      </div>
                    </div>
                  </div>
                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="contact-icon bg-success bg-opacity-10 p-2 rounded-circle me-3">
                        <FaEnvelope className="text-success" />
                      </div>
                      <div>
                        <div className="fw-bold">Support Email</div>
                        <div className="text-light">staff.support@smartride.com</div>
                      </div>
                    </div>
                  </div>
                  <div className="contact-item mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="contact-icon bg-info bg-opacity-10 p-2 rounded-circle me-3">
                        <FaShieldAlt className="text-info" />
                      </div>
                      <div>
                        <div className="fw-bold">Security Team</div>
                        <div className="text-light">security@smartride.com</div>
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="d-flex align-items-center mb-2">
                      <div className="contact-icon bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                        <FaMapMarkerAlt className="text-warning" />
                      </div>
                      <div>
                        <div className="fw-bold">Operations Center</div>
                        <div className="text-light">Smart Ride HQ, Kochi, Kerala</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col lg={4}>
                <div className="social-links mb-4">
                  <h4 className="fw-bold mb-4 text-warning">
                    <FaUsers className="me-2" />
                    Connect With Us
                  </h4>
                  <p className="text-light opacity-75 mb-4">
                    Follow us on social media for updates, training materials, and community engagement.
                  </p>
                  <div className="social-icons d-flex gap-3 mb-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href="#"
                        className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: social.color,
                          color: 'white',
                          textDecoration: 'none',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        title={social.label}
                      >
                        <social.icon className="fs-5" />
                      </a>
                    ))}
                  </div>
                  
                  <div className="operations-stats p-3 bg-dark bg-opacity-50 rounded">
                    <div className="d-flex align-items-center mb-2">
                      <FaChartLine className="text-info me-2" />
                      <span className="fw-bold">Operations Statistics</span>
                    </div>
                    <div className="text-light opacity-75 small">
                      This month: <span className="text-success fw-bold">{stats.completedTasks} tasks</span> completed
                    </div>
                    <div className="progress mt-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${(stats.completedTasks / (stats.completedTasks + stats.activeTasks) * 100) || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <hr className="my-4 opacity-25" />
            
            <Row className="align-items-center">
              <Col md={6}>
                <p className="mb-0 text-light opacity-75">
                  © {new Date().getFullYear()} Smart Ride Operations Portal. All rights reserved.
                  <span className="d-block d-md-inline ms-md-3 mt-2 mt-md-0">
                    Built with ❤️ for efficient fleet management.
                  </span>
                </p>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="d-flex gap-3 justify-content-md-end flex-wrap">
                  <span className="text-light opacity-75">Version 2.2.0</span>
                  <span className="text-light opacity-75">Staff ID: {staff?.id || 'N/A'}</span>
                  <span className="text-light opacity-75">Last Login: Today</span>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>

      {/* Profile Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            <FaUser className="me-2" /> Staff Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileError && <Alert variant="danger">{profileError}</Alert>}
          {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}

          {/* Tabs */}
          <div className="d-flex border-bottom mb-4">
            <button
              className={`flex-fill py-3 border-0 bg-transparent ${
                activeProfileTab === "profile"
                  ? "fw-bold text-primary border-bottom border-primary border-2"
                  : "text-muted"
              }`}
              onClick={() => setActiveProfileTab("profile")}
            >
              <FaUser className="me-2" /> Profile Info
            </button>

            <button
              className={`flex-fill py-3 border-0 bg-transparent ${
                activeProfileTab === "password"
                  ? "fw-bold text-primary border-bottom border-primary border-2"
                  : "text-muted"
              }`}
              onClick={() => setActiveProfileTab("password")}
            >
              <FaShieldAlt className="me-2" /> Change Password
            </button>
          </div>

          {/* Profile Tab */}
          {activeProfileTab === "profile" && (
            <div className="p-3">
              <div className="text-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <span className="fs-3 fw-bold">
                    {staff?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h5 className="fw-bold">{staff?.username}</h5>
                <p className="text-muted">{staff?.email}</p>
              </div>

              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Username</Form.Label>
                  <Form.Control
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, username: e.target.value })
                    }
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="py-3"
                  />
                </Form.Group>
              </Form>
            </div>
          )}

          {/* Password Tab */}
          {activeProfileTab === "password" && (
            <div className="p-3">
              <Alert variant="info" className="mb-4">
                <FaInfoCircle className="me-2" />
                Password must be at least 8 characters long and contain letters and numbers.
              </Alert>

              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Current Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          current_password: e.target.value,
                        })
                      }
                      className="py-3"
                      placeholder="Enter current password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          new_password: e.target.value,
                        })
                      }
                      className="py-3"
                      placeholder="Enter new password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirm_password: e.target.value,
                        })
                      }
                      className="py-3"
                      placeholder="Confirm new password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowProfileModal(false)}>
            Cancel
          </Button>

          {activeProfileTab === "profile" ? (
            <Button variant="primary" disabled={savingProfile} onClick={updateProfile}>
              {savingProfile ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          ) : (
            <Button variant="primary" disabled={savingPassword} onClick={changePassword}>
              {savingPassword ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
              </>
              ) : (
                "Change Password"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: "15px" }}>
              <div className="modal-header border-0 pb-0">
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="modal-title fw-bold">{selectedTask.title}</h5>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <Badge bg="primary" className="px-3 py-2">
                          {selectedTask.task_type}
                        </Badge>
                        <Badge bg={selectedTask.status === 'pending' ? 'warning' : 'success'} className="px-3 py-2">
                          {selectedTask.status}
                        </Badge>
                      </div>
                    </div>
                    <button className="btn-close" onClick={() => setSelectedTask(null)} />
                  </div>
                </div>
              </div>

              <div className="modal-body pt-0">
                {/* Task Image */}
                {selectedTask.vehicle_photo && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(selectedTask.vehicle_photo)}
                      alt="Vehicle"
                      className="w-100 rounded"
                      style={{ height: "250px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/800x250/6c757d/ffffff?text=${selectedTask.task_type}`;
                      }}
                    />
                  </div>
                )}

                <div className="row g-4">
                  <div className="col-md-8">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Task Details</h6>

                        <div className="mb-3">
                          <label className="text-muted small">Description</label>
                          <p className="mb-0">{selectedTask.description || "No description provided"}</p>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="text-muted small">Task Type</label>
                            <div className="d-flex align-items-center">
                              <FaTools className="me-2 text-primary" />
                              <span>{selectedTask.task_type}</span>
                            </div>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="text-muted small">Created Date</label>
                            <div className="d-flex align-items-center">
                              <FaCalendar className="me-2 text-primary" />
                              <span>{formatDate(selectedTask.created_at)}</span>
                            </div>
                          </div>

                          {selectedTask.location && (
                            <div className="col-12 mb-3">
                              <label className="text-muted small">Location</label>
                              <div className="d-flex align-items-center">
                                <FaMapMarkerAlt className="me-2 text-primary" />
                                <span>{selectedTask.location}</span>
                              </div>
                            </div>
                          )}

                          {selectedTask.vehicle_details && (
                            <div className="col-12">
                              <label className="text-muted small">Vehicle Details</label>
                              <p className="mb-0">{selectedTask.vehicle_details}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Update Status</h6>

                        <div className="d-grid gap-2">
                          <Button
                            variant="warning"
                            size="lg"
                            disabled={updating || selectedTask.status === "in_progress"}
                            onClick={() => updateTaskStatus(selectedTask.task_id, "in_progress")}
                            className="d-flex align-items-center justify-content-center py-3"
                          >
                            <FaPlayCircle className="me-2" />
                            {updating ? "Updating..." : "Start Task"}
                          </Button>

                          <Button
                            variant="success"
                            size="lg"
                            disabled={updating || selectedTask.status === "completed"}
                            onClick={() => updateTaskStatus(selectedTask.task_id, "completed")}
                            className="d-flex align-items-center justify-content-center py-3"
                          >
                            <FaCheckCircle className="me-2" />
                            {updating ? "Updating..." : "Mark Completed"}
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() => setSelectedTask(null)}
                            className="mt-2 py-3"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Detail Modal */}
      {selectedEmergency && (
        <Modal
          show={showEmergencyModal}
          onHide={() => {
            setShowEmergencyModal(false);
            setSelectedEmergency(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <FaExclamationTriangle className="me-2" />
              Emergency Alert Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="danger">
              <h5 className="alert-heading">
                {selectedEmergency.alert_type?.toUpperCase()} EMERGENCY
              </h5>
              <p className="mb-0">Immediate attention required!</p>
            </Alert>

            <div className="mb-4">
              <h5 className="fw-bold">
                From: {selectedEmergency.username || "User"} ({selectedEmergency.user_email || "No email"})
              </h5>
              <p className="text-muted">{selectedEmergency.message}</p>
            </div>

            <Row className="mb-4">
              <Col md={6}>
                <div className="mb-3">
                  <label className="fw-bold">Location</label>
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    <span>{selectedEmergency.location_name || "Unknown Location"}</span>
                  </div>
                  {selectedEmergency.location_lat && selectedEmergency.location_lng && (
                    <small className="text-muted">
                      Coordinates: {selectedEmergency.location_lat}, {selectedEmergency.location_lng}
                    </small>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <label className="fw-bold">Status</label>
                  <div>
                    <Badge bg={selectedEmergency.is_resolved ? "success" : "danger"} className="fs-6">
                      {selectedEmergency.is_resolved ? "RESOLVED" : "ACTIVE"}
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="mb-4">
              <label className="fw-bold">Admin Response</label>
              {!selectedEmergency.is_resolved ? (
                <>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter your response to the user..."
                    className="mb-3"
                    id="adminResponse"
                  />
                  <Alert variant="warning">
                    <FaInfoCircle className="me-2" />
                    This response will be sent to the user and mark the emergency as resolved.
                  </Alert>
                </>
              ) : (
                <Alert variant="success">
                  <p className="mb-0">{selectedEmergency.admin_response || "No response recorded"}</p>
                  {selectedEmergency.resolved_at && (
                    <small className="text-muted">
                      Resolved at: {formatDate(selectedEmergency.resolved_at)}
                    </small>
                  )}
                </Alert>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEmergencyModal(false);
                setSelectedEmergency(null);
              }}
            >
              Close
            </Button>

            {!selectedEmergency.is_resolved ? (
              <Button
                variant="primary"
                disabled={responding}
                onClick={() => {
                  const response = document.getElementById('adminResponse')?.value;
                  if (response) {
                    respondToEmergency(selectedEmergency.id, response);
                  }
                }}
              >
                {responding ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaReply className="me-2" />
                    Send Response & Mark Resolved
                  </>
                )}
              </Button>
            ) : (
              <Button variant="success" disabled>
                <FaCheckCircle className="me-2" />
                Already Resolved
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}