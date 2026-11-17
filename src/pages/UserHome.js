// src/pages/UserHome.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Spinner,
  Modal,
  Button,
  Badge,
  ProgressBar,
  Card,
  Container,
  Row,
  Col,
  Navbar,
  NavDropdown,
  Tooltip,
  OverlayTrigger,
  Dropdown,
} from "react-bootstrap";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/UserHome.css";
import { useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaUser,
  FaSignOutAlt,
  FaCreditCard,
  FaLifeRing,
  FaExclamationTriangle,
  FaSearch,
  FaEdit,
  FaUpload,
  FaBolt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaMap,
  FaCar,
  FaBatteryFull,
  FaMoneyBillWave,
  FaIdCard,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaFileAlt,
  FaRoute,
  FaShieldAlt,
  FaLeaf,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaLock,
  FaInfoCircle,
  FaBell,
  FaHistory,
  FaStar,
  FaCog,
  FaQuestionCircle,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GiElectric } from "react-icons/gi";

// Fix default leaflet icons
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
} catch (e) {
  console.warn("Leaflet icon setup failed:", e);
}

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/Users/";
const DEFAULT_KOCHI = { lat: 9.931233, lng: 76.267303 };
const MIN_WALLET_BALANCE = 300;

// Enhanced token management
function getToken() {
  return localStorage.getItem("accessToken") || localStorage.getItem("access") || null;
}

function createAxios() {
  const t = getToken();
  console.log("Token retrieved:", t ? "Yes" : "No");
  
  const inst = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    headers: { 
      "Content-Type": "application/json",
    },
  });
  
  // Add token if exists
  if (t) {
    inst.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    console.log("Authorization header set");
  }
  
  // Add response interceptor to handle 401 errors
  inst.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.error("Authentication failed - 401 error");
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return inst;
}

// Custom vehicle icon
const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1791/1791965.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

export default function UserHome() {
  const navigate = useNavigate();

  // Core state
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [verifiedStatus, setVerifiedStatus] = useState("not_uploaded");
  const [vehicles, setVehicles] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [history, setHistory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showNavbarMenu, setShowNavbarMenu] = useState(false);
  
  // Form states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editErrors, setEditErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [bookingSecondsLeft, setBookingSecondsLeft] = useState(null);
  const [rideSeconds, setRideSeconds] = useState(0);
  const [rideRate, setRideRate] = useState(0);
  const [alertType, setAlertType] = useState("accident");
  const [alertMessage, setAlertMessage] = useState("");
  const [sendingAlert, setSendingAlert] = useState(false);
  const [toast, setToast] = useState("");

  // File refs
  const mainDLRef = useRef(null);
  const mainIDRef = useRef(null);
  const modalDLRef = useRef(null);
  const modalIDRef = useRef(null);

  // File previews
  const [mainFilesPreview, setMainFilesPreview] = useState({ dl: null, idp: null });
  const [modalFilesPreview, setModalFilesPreview] = useState({ dl: null, idp: null });

  // API Endpoints
  const ENDPOINTS = {
    profile: "profile/",
    verificationStatus: "verification/status/",
    uploadDocuments: "verification/upload-documents/",
    vehiclesAvailable: "vehicles/available/",
    walletBalance: "wallet/balance/",
    ridesHistory: "rides/history/",
    staffDirectory: "staff/directory/",
    currentRide: "rides/current/",
    startRide: "rides/start/",
    bookRide: "rides/book/",
    endRide: "rides/end/",
    cancelBooking: "rides/cancel/",
    checkCancellation: "rides/",
  };

  // Create axios instance with auth
  const api = createAxios();

  // Utility functions
  const showToast = (msg, type = "info") => {
    if (!msg) return;
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRideDuration = (seconds) => {
    const s = seconds % 60;
    const totalMinutes = Math.floor(seconds / 60);
    const m = totalMinutes % 60;
    const h = Math.floor(totalMinutes / 60);
    const pad = (n) => String(n).padStart(2, "0");
    if (h > 0) {
      return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    }
    if (m > 0) {
      return `${pad(m)}m ${pad(s)}s`;
    }
    return `${pad(s)}s`;
  };

  // ===============================
  // NOTIFICATION FUNCTIONS
  // ===============================

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");
      const [notifRes, countRes] = await Promise.all([
        api.get("notification-list/"),
        api.get("unread_count/"),
      ]);
      console.log("Notifications fetched:", notifRes.data?.length);
      
      // Handle both response formats: {notifications: []} or just []
      const notificationsData = notifRes.data?.notifications || notifRes.data || [];
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      setUnreadCount(countRes.data?.unread_count || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post("mark_notification_read/", { notification_id: notificationId });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("mark_all_notifications_read/");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    
    try {
      await api.delete("clear_all_notifications/");
      setNotifications([]);
      setUnreadCount(0);
      setShowNotificationDropdown(false);
      showToast("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (notification) => {
    const type = notification?.type || notification?.notification_type || 'info';
    
    switch(type.toLowerCase()) {
      case 'success':
      case 'booking_success':
      case 'ride_completed':
        return <FaCheckCircle className="text-success fs-5" />;
      case 'warning':
      case 'low_battery':
      case 'maintenance':
        return <FaExclamationTriangle className="text-warning fs-5" />;
      case 'error':
      case 'emergency':
      case 'payment_failed':
        return <FaTimesCircle className="text-danger fs-5" />;
      default:
        return <FaInfoCircle className="text-info fs-5" />;
    }
  };

  // Format date for notification
  const formatNotificationDate = (dateString) => {
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // ===============================
  // CORE FUNCTIONS
  // ===============================

  // Fetch all data
  const fetchAll = async () => {
    setLoading(true);
    
    // Check authentication first
    const token = getToken();
    if (!token) {
      console.error("No token found, redirecting to login");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      console.log("Fetching user data...");
      
      // Add authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const [
        p,
        vs,
        veh,
        wal,
        his,
        st,
        current,
      ] = await Promise.allSettled([
        api.get(ENDPOINTS.profile),
        api.get(ENDPOINTS.verificationStatus),
        api.get(ENDPOINTS.vehiclesAvailable),
        api.get(ENDPOINTS.walletBalance),
        api.get(ENDPOINTS.ridesHistory),
        api.get(ENDPOINTS.staffDirectory),
        api.get(ENDPOINTS.currentRide),
      ]);

      console.log("Data fetched:", {
        profile: p.status,
        verification: vs.status,
        vehicles: veh.status,
        wallet: wal.status
      });

      if (p.status === "fulfilled") setProfile(p.value.data);
      if (vs.status === "fulfilled") {
        const v = vs.value.data;
        setVerifiedStatus(
          v?.verification_status ||
            (v?.is_verified ? "approved" : "not_uploaded")
        );
      }
      if (veh.status === "fulfilled")
        setVehicles(Array.isArray(veh.value.data) ? veh.value.data : []);
      if (wal.status === "fulfilled") {
        const raw = wal.value.data?.balance;
        const num = parseFloat(raw);
        setWallet(!isNaN(num) ? num : 0);
      }

      if (his.status === "fulfilled") setHistory(his.value.data || []);
      if (st.status === "fulfilled") setStaff(st.value.data || []);
      if (current.status === "fulfilled") {
        const r = current.value.data || null;
        setCurrentRide(r);
        const backendRate =
          r?.price_per_minute ||
          r?.per_minute_price ||
          r?.vehicle?.price_per_minute ||
          5;
        setRideRate(Number(backendRate) || 5);
      }

      // Fetch notifications separately
      await fetchNotifications();
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast("Failed to load some data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    
    // Poll for new notifications every 30 seconds
    const notificationInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(notificationInterval);
  }, []);

  // Booking timer
  useEffect(() => {
    if (!bookingInfo || !bookingInfo.expires_at) {
      setBookingSecondsLeft(null);
      return;
    }

    const expiryMs = new Date(bookingInfo.expires_at).getTime();

    const tick = () => {
      const diff = Math.floor((expiryMs - Date.now()) / 1000);
      if (diff <= 0) {
        setBookingSecondsLeft(0);
        setBookingInfo(null);
        showToast("Booking expired. Please book again.");
        return;
      }
      setBookingSecondsLeft(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [bookingInfo]);

  // Ride timer
  useEffect(() => {
    if (!currentRide || currentRide.status !== "active") {
      setRideSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setRideSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRide?.id, currentRide?.status]);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v =>
    (v.name || v.model_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map center
  const mapCenter = [
    profile?.last_known_location?.lat ?? DEFAULT_KOCHI.lat,
    profile?.last_known_location?.lng ?? DEFAULT_KOCHI.lng,
  ];

  // Razorpay payment
  const openRazorpay = async () => {
    if (!addAmount || addAmount < 1) {
      showToast("Enter a valid amount");
      return;
    }

    if (walletLoading) {
      showToast("Payment already in progress...");
      return;
    }

    try {
      setWalletLoading(true);

      const orderRes = await api.post("payments/create-order/", {
        amount: addAmount,
      });

      const { order_id, amount, key } = orderRes.data;

      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "Smart Ride Wallet",
        description: "Add Money",
        order_id: order_id,

        handler: async function (response) {
          try {
            await api.post("payments/success/", {
              order_id: order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: addAmount,
            });

            showToast("✅ Wallet updated successfully!");
            setAddAmount("");
            fetchAll();
          } catch (error) {
            console.error("Payment verification error:", error);
            showToast("❌ Payment verification failed. Contact support if amount was deducted.");
          } finally {
            setWalletLoading(false);
          }
        },

        modal: {
          ondismiss: function() {
            setWalletLoading(false);
            showToast("ℹ️ Payment cancelled");
          }
        },

        theme: {
          color: "#00b4ff",
        },
      };

      const razor = new window.Razorpay(options);
      
      razor.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setWalletLoading(false);
        showToast(`❌ Payment failed: ${response.error.description}`);
      });

      razor.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      setWalletLoading(false);
      showToast("❌ Payment initialization failed. Please try again.");
    }
  };

  // Emergency alert
  const sendEmergencyAlert = async () => {
    if (sendingAlert) return;
    setSendingAlert(true);

    const FALLBACK_LAT = 9.931233;
    const FALLBACK_LNG = 76.267303;

    const sendRequest = async (lat, lng, locationName) => {
      try {
        await api.post("emergency/alert/", {
          alert_type: alertType,
          message: alertMessage,
          location_lat: lat,
          location_lng: lng,
          location_name: locationName
        });

        setSendingAlert(false);
        setShowSOSModal(false);
        setAlertMessage("");
        setAlertType("accident");
        showToast("🚨 Emergency alert sent successfully! Help is on the way.");
      } catch (err) {
        setSendingAlert(false);
        console.error("Emergency alert error:", err);
        showToast("❌ Failed to send alert. Please try again or call emergency services directly.");
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        sendRequest(lat, lng, "User Current GPS Location");
      },
      (err) => {
        console.error("GPS failed, using Kochi fallback:", err);
        sendRequest(FALLBACK_LAT, FALLBACK_LNG, "Kochi, Kerala (Fallback)");
      }
    );
  };

  // Check cancellation eligibility
  const checkCancellationEligibility = async (bookingId) => {
    try {
      const response = await api.get(`${ENDPOINTS.checkCancellation}${bookingId}/check-cancellation/`);
      return response.data;
    } catch (error) {
      console.error("Check cancellation error:", error);
      return { can_cancel: false, refund_eligible: false, refund_amount: "0.00" };
    }
  };

  // Booking functions
  const attemptBook = (vehicle) => {
    if (!vehicle) return;

    if (!verifiedStatus || verifiedStatus === "not_uploaded") {
      setSelectedVehicle(vehicle);
      setShowVerificationModal(true);
      return;
    }
    if (verifiedStatus === "pending") {
      setSelectedVehicle(vehicle);
      setShowVerificationModal(true);
      return;
    }
    if (verifiedStatus === "approved") {
      if (wallet < MIN_WALLET_BALANCE) {
        showToast(`Minimum ${formatCurrency(MIN_WALLET_BALANCE)} required in wallet. Please top up.`);
        setShowTopupModal(true);
        return;
      }
      setSelectedVehicle(vehicle);
      setShowBookingModal(true);
      return;
    }
    showToast("Verification required.");
  };

  const confirmBooking = async () => {
    if (!selectedVehicle) return;

    try {
      const resp = await api.post(ENDPOINTS.bookRide, {
        vehicle_id: selectedVehicle.vehicle_id ?? selectedVehicle.id,
      });

      const data = resp.data;

      showToast(
        data.message ||
          "Vehicle booked successfully. ₹300 advance debited from wallet."
      );

      setShowBookingModal(false);

      setBookingInfo({
        booking_id: data.booking_id,
        vehicle: selectedVehicle,
        expires_at: data.expires_at,
      });

      if (data.wallet_balance !== undefined && data.wallet_balance !== null) {
        setWallet(Number(data.wallet_balance));
      } else {
        fetchAll();
      }

      setSelectedVehicle(null);
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const backendError = err?.response?.data;
      const msg =
        backendError?.error ||
        backendError?.message ||
        backendError?.detail ||
        err.message;

      if (
        backendError?.error &&
        backendError.error
          .toLowerCase()
          .includes("insufficient wallet balance")
      ) {
        const bal = backendError.wallet_balance;
        showToast(
          `Not enough balance! Minimum ₹300 required. Your wallet: ₹${
            bal !== undefined ? bal : "0"
          }. Please top up your wallet.`
        );
      } else {
        showToast(msg || "Booking failed.");
      }
    }
  };

  const handleStartRide = async () => {
    if (!bookingInfo) return;

    try {
      const lat = profile?.last_known_location?.lat ?? DEFAULT_KOCHI.lat;
      const lng = profile?.last_known_location?.lng ?? DEFAULT_KOCHI.lng;
      const name =
        profile?.last_known_location?.label ||
        profile?.last_known_location?.name ||
        "Current Location";

      const resp = await api.post(ENDPOINTS.startRide, {
        booking_id: bookingInfo.booking_id,
        vehicle_id: bookingInfo.vehicle.vehicle_id ?? bookingInfo.vehicle.id,
        qr_code: "DUMMY",
        start_location_lat: lat,
        start_location_lng: lng,
        start_location_name: name,
      });

      const rideData = resp?.data?.ride || resp?.data;

      setCurrentRide(rideData || null);
      setBookingInfo(null);
      showToast("Ride started! ₹300 advance confirmed.");

      const rate =
        rideData?.price_per_minute ||
        rideData?.per_minute_price ||
        bookingInfo?.vehicle?.price_per_minute ||
        5;
      setRideRate(Number(rate) || 5);
      setRideSeconds(0);

      fetchAll();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      showToast(err?.response?.data?.error || "Failed to start ride.");
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingInfo) return;

    try {
      const eligibility = await checkCancellationEligibility(bookingInfo.booking_id);
      
      let confirmMessage = "Are you sure you want to cancel this booking?";
      if (eligibility.refund_eligible) {
        confirmMessage += ` You will get ₹${eligibility.refund_amount} refund.`;
      } else {
        confirmMessage += " No refund will be issued (cancelled after 1 hour).";
      }
      
      if (!window.confirm(confirmMessage)) {
        return;
      }

      const response = await api.post(ENDPOINTS.cancelBooking, {
        booking_id: bookingInfo.booking_id
      });

      const data = response.data;
      
      showToast(data.message || "Booking cancelled successfully.");
      
      if (data.refund_details?.refund_amount) {
        const refundAmount = parseFloat(data.refund_details.refund_amount);
        setWallet(prev => prev + refundAmount);
      } else if (data.wallet_balance) {
        setWallet(Number(data.wallet_balance));
      }
      
      setBookingInfo(null);
      setBookingSecondsLeft(null);
      
      fetchAll();
      
    } catch (error) {
      console.error("Cancel booking error:", error);
      if (error.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      showToast(error.response?.data?.error || "Failed to cancel booking.");
    }
  };

  const handleEndRide = async () => {
    if (!currentRide) {
      showToast("No active ride found.");
      return;
    }

    try {
      const rideDurationMinutes = Math.ceil(rideSeconds / 60);
      
      let rideIdToSend;
      if (currentRide.ride_id) {
        rideIdToSend = currentRide.ride_id;
      } else if (currentRide.id) {
        rideIdToSend = currentRide.id;
      } else {
        throw new Error("No ride ID found in current ride data");
      }

      const userLat = parseFloat(profile?.last_known_location?.lat ?? DEFAULT_KOCHI.lat);
      const userLng = parseFloat(profile?.last_known_location?.lng ?? DEFAULT_KOCHI.lng);
      const userLocName = profile?.last_known_location?.name || "Kochi (Fallback Location)";

      const endRideData = {
        ride_id: rideIdToSend,
        end_location_lat: userLat,
        end_location_lng: userLng,
        end_location_name: userLocName,
      };

      const resp = await api.post(ENDPOINTS.endRide, endRideData);
      const data = resp.data;

      setCurrentRide(null);
      setRideSeconds(0);

      const updatedBalance =
        data?.fare_summary?.wallet_balance ??
        data?.wallet_balance ??
        data?.ride?.wallet_balance ??
        wallet;

      setWallet(Number(updatedBalance));

      setTimeout(() => fetchAll(), 300);
      
      const fare = data.fare_summary?.total_fare || data.total_fare;
      const additionalFare = data.fare_summary?.additional_fare || "0";
      
      let successMsg = `Ride ended! Total fare: ₹${fare}. `;
      if (parseFloat(additionalFare) > 0) {
        successMsg += `Extra paid: ₹${additionalFare}. `;
      }
      successMsg += `Wallet updated.`;
      
      showToast(successMsg);
      
      fetchAll();

    } catch (err) {
      console.error("❌ End ride error:", err);
      
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      
      if (err.response) {
        const backendError = err.response.data;
        
        let errorMessage = "Failed to end ride. Please try again.";
        
        if (backendError.ride_id) {
          if (Array.isArray(backendError.ride_id)) {
            errorMessage = `Ride ID error: ${backendError.ride_id.join(', ')}`;
          } else {
            errorMessage = `Ride ID: ${backendError.ride_id}`;
          }
        } else if (backendError.error) {
          errorMessage = backendError.error;
        } else if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.detail) {
          errorMessage = backendError.detail;
        } else if (typeof backendError === 'string') {
          errorMessage = backendError;
        }
        
        showToast(errorMessage);
        
        if (errorMessage.toLowerCase().includes('not found') || 
            errorMessage.toLowerCase().includes('no active') ||
            errorMessage.toLowerCase().includes('invalid')) {
          setCurrentRide(null);
          setRideSeconds(0);
          fetchAll();
        }
      } else {
        showToast(err.message || "Network error. Please check your connection.");
      }
    }
  };

  // Document upload
  const performUpload = async ({ drivingLicenseFile, idProofFile }) => {
    if (!drivingLicenseFile || !idProofFile) {
      showToast("Both Driving License and Aadhaar/ID proof are required.");
      return null;
    }

    const form = new FormData();
    form.append("driving_license", drivingLicenseFile);
    form.append("id_proof", idProofFile);
    form.append("aadhaar_card", idProofFile);

    setUploading(true);
    setUploadProgress(0);

    try {
      const resp = await api.post(ENDPOINTS.uploadDocuments, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });

      setVerifiedStatus("pending");
      showToast(
        resp?.data?.message ||
          "Documents uploaded successfully. Awaiting admin approval."
      );
      fetchAll();
      return resp;
    } catch (err) {
      console.error("Upload failed:", err);
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return null;
      }
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Upload failed.";
      showToast(message);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadDocs = async () => {
    const dlFile = mainDLRef.current?.files?.[0];
    const idFile = mainIDRef.current?.files?.[0];

    setMainFilesPreview({
      dl: dlFile ? dlFile.name : null,
      idp: idFile ? idFile.name : null,
    });

    const resp = await performUpload({
      drivingLicenseFile: dlFile,
      idProofFile: idFile,
    });

    if (resp && mainDLRef.current && mainIDRef.current) {
      mainDLRef.current.value = "";
      mainIDRef.current.value = "";
      setMainFilesPreview({ dl: null, idp: null });
    }
  };

  const uploadDocsFromModal = async () => {
    const dlFile = modalDLRef.current?.files?.[0];
    const idFile = modalIDRef.current?.files?.[0];

    setModalFilesPreview({
      dl: dlFile ? dlFile.name : null,
      idp: idFile ? idFile.name : null,
    });

    const resp = await performUpload({
      drivingLicenseFile: dlFile,
      idProofFile: idFile,
    });

    if (resp) {
      setShowVerificationModal(false);
      if (modalDLRef.current) modalDLRef.current.value = "";
      if (modalIDRef.current) modalIDRef.current.value = "";
      setModalFilesPreview({ dl: null, idp: null });
    }
  };

  // Profile functions
  const openEditProfileModal = () => {
    setEditUsername(profile?.username ?? "");
    setEditEmail(profile?.email ?? "");
    setEditErrors({});
    setShowEditProfileModal(true);
  };

  const validateEdit = () => {
    const errs = {};
    if (!editUsername || editUsername.trim().length < 3) {
      errs.username = "Username must be at least 3 characters.";
    }
    if (!editEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      errs.email = "Enter a valid email address.";
    }
    return errs;
  };

  const saveProfile = async () => {
    const errs = validateEdit();
    if (Object.keys(errs).length) {
      setEditErrors(errs);
      return;
    }

    setSavingProfile(true);
    try {
      const resp = await api.put(ENDPOINTS.profile, {
        username: editUsername.trim(),
        email: editEmail.trim(),
      });

      setProfile(prev => ({ ...prev, ...(resp?.data ?? {}) }));
      showToast("Profile updated successfully.");
      setShowEditProfileModal(false);
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      const data = err?.response?.data;
      if (data) {
        const fieldErrs = {};
        if (data.username)
          fieldErrs.username = Array.isArray(data.username)
            ? data.username.join(" ")
            : data.username;
        if (data.email)
          fieldErrs.email = Array.isArray(data.email)
            ? data.email.join(" ")
            : data.email;
        if (data.detail) fieldErrs.non_field = data.detail;
        setEditErrors(fieldErrs);
      } else {
        showToast("Failed to update profile.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // Estimated fare calculation
  const estimatedFare = rideRate && rideSeconds > 0 
    ? ((rideSeconds / 60) * rideRate).toFixed(2)
    : null;

  // Navbar Icons Functions
  const handleNavbarIconClick = (action) => {
    switch(action) {
      case 'wallet':
        setShowTopupModal(true);
        break;
      case 'vehicle':
        document.getElementById('vehicles-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'map':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'documents':
        setShowVerificationModal(true);
        break;
      case 'emergency':
        setShowSOSModal(true);
        break;
      case 'reports':
        navigate("/complaints");
        break;
      default:
        break;
    }
  };

  // Get random quotes for footer
  const quotes = [
    "Ride the future, today.",
    "Sustainable mobility for a greener tomorrow.",
    "Every ride makes the world cleaner.",
    "Smart rides, safer journeys.",
    "Electric is the new normal.",
    "Join the green revolution, one ride at a time.",
    "Your journey, powered by clean energy.",
    "Making cities smarter, one scooter at a time.",
  ];

  const [randomQuote] = useState(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-gradient-primary">
        <Spinner animation="border" variant="light" size="lg" />
        <h4 className="text-white mt-3">Loading Smart Ride...</h4>
        <p className="text-light opacity-75">Preparing your dashboard</p>
      </div>
    );
  }

  return (
    <div className="user-home-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 9999 }}>
          <div className="alert alert-info shadow-lg" role="alert">
            <div className="d-flex align-items-center">
              <span className="fs-5 me-2">🔔︎</span>
              <span>{toast}</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Navbar with Notification Bell */}
      <Navbar expand="lg" className="smart-navbar shadow-lg" fixed="top" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container fluid>
          <Navbar.Brand href="#home" className="d-flex align-items-center text-white">
            <GiElectric className="text-warning fs-2 me-2" />
            <div>
              <span className="fw-bold fs-4">Smart</span>
              <span className="fw-bold text-warning fs-4">Ride</span>
            </div>
          </Navbar.Brand>

          {/* Google-style Search Bar */}
          <div className="search-bar mx-lg-4 flex-grow-1">
            <div className="input-group search-input-group" style={{ maxWidth: '500px' }}>
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 py-3"
                placeholder="Search vehicles by name, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '1rem' }}
              />
            </div>
          </div>

          {/* Navbar Icons with Tooltips - UPDATED WITH NOTIFICATION BELL */}
          <div className="d-flex align-items-center gap-3">
            {[
              { icon: FaWallet, action: 'wallet', title: 'Wallet', color: '#28a745' },
              { icon: FaMotorcycle, action: 'vehicle', title: 'Vehicles', color: '#007bff' },
              { icon: FaMap, action: 'map', title: 'Live Map', color: '#17a2b8' },
              { icon: FaFileAlt, action: 'documents', title: 'Documents', color: '#6f42c1' },
              { icon: FaExclamationTriangle, action: 'reports', title: 'Reports', color: '#fd7e14' },
              { icon: FaLifeRing, action: 'emergency', title: 'Emergency SOS', color: '#dc3545' },
            ].map((item, index) => (
              <OverlayTrigger
                key={index}
                placement="bottom"
                overlay={<Tooltip id={`tooltip-${index}`}>{item.title}</Tooltip>}
              >
                <button 
                  className="navbar-icon-btn"
                  onClick={() => handleNavbarIconClick(item.action)}
                  style={{ 
                    color: item.color,
                    position: 'relative'
                  }}
                >
                  <item.icon className="navbar-icon fs-5" />
                  {item.action === 'emergency' && (
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                      <span className="visually-hidden">Emergency</span>
                    </span>
                  )}
                </button>
              </OverlayTrigger>
            ))}

            {/* Notification Bell with Integrated Dropdown */}
            <Dropdown 
              show={showNotificationDropdown} 
              onToggle={setShowNotificationDropdown} 
              align="end"
            >
              <Dropdown.Toggle 
                variant="light" 
                className="position-relative border-0 bg-transparent p-0"
                style={{ boxShadow: 'none' }}
              >
                <div className="position-relative">
                  <FaBell className="navbar-icon fs-5" style={{ 
                    color: unreadCount > 0 ? '#ff6b6b' : '#6c757d',
                    transition: 'color 0.3s ease'
                  }} />
                  {unreadCount > 0 && (
                    <Badge 
                      pill 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ 
                        fontSize: '0.65rem', 
                        minWidth: '18px', 
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white'
                      }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu 
                className="notification-dropdown shadow-lg border-0 p-0" 
                style={{ 
                  minWidth: '350px', 
                  maxHeight: '500px', 
                  overflow: 'hidden'
                }}
              >
                <div className="d-flex justify-content-between align-items-center px-3 pt-3 pb-2 border-bottom">
                  <h6 className="mb-0 fw-bold">Notifications</h6>
                  <div className="d-flex align-items-center gap-2">
                    {notificationLoading && (
                      <Spinner animation="border" size="sm" className="text-primary" />
                    )}
                    {unreadCount > 0 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-primary p-0 text-decoration-none"
                        onClick={markAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.slice(0, 8).map((notif) => (
                        <Dropdown.Item 
                          key={notif.id} 
                          className={`py-3 px-3 border-bottom d-block ${!notif.is_read ? 'bg-light bg-opacity-50' : ''}`}
                          onClick={() => markAsRead(notif.id)}
                          style={{ 
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          <div className="d-flex">
                            <div className="notification-icon me-3">
                              {getNotificationIcon(notif)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="fw-bold small" style={{ fontSize: '0.9rem' }}>
                                  {notif.title || 'Notification'}
                                </div>
                                <div className="text-muted very-small" style={{ fontSize: '0.75rem' }}>
                                  {formatNotificationDate(notif.created_at)}
                                </div>
                              </div>
                              <div className="text-muted small mt-1" style={{ fontSize: '0.85rem' }}>
                                {notif.message || notif.description || 'No message'}
                              </div>
                              {!notif.is_read && (
                                <Badge pill bg="primary" className="mt-1" style={{ fontSize: '0.7rem' }}>
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))}
                      
                      {notifications.length > 8 && (
                        <div className="text-center py-2 border-top">
                          <small className="text-muted">
                            Showing 8 of {notifications.length} notifications
                          </small>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <FaBell className="text-muted fs-1 mb-3 opacity-25" />
                      <p className="text-muted mb-0">No notifications yet</p>
                      <small className="text-muted">Check back later for updates</small>
                    </div>
                  )}
                </div>
                
                <div className="px-3 py-2 border-top bg-light">
                  <div className="d-flex gap-2">
                    {notifications.length > 0 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="flex-fill"
                        onClick={clearAllNotifications}
                      >
                        <FaTrash className="me-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <NavDropdown
              title={
                <div className="user-avatar bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '45px', height: '45px', border: '2px solid #fff' }}>
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
                <div className="fw-bold text-primary">{profile?.username || "User"}</div>
                <div className="small text-muted">{profile?.email || ""}</div>
                <div className="mt-2">
                  <Badge bg={verifiedStatus === "approved" ? "success" : "warning"} className="px-2 py-1">
                    {verifiedStatus === "approved" ? "✓ Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              <NavDropdown.Item onClick={openEditProfileModal} className="py-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <FaEdit className="text-primary" />
                  </div>
                  <div>
                    <div className="fw-bold">Edit Profile</div>
                    <div className="small text-muted">Update your details</div>
                  </div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setShowVerificationModal(true)} className="py-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-info bg-opacity-10 p-2 rounded-circle me-3">
                    <FaIdCard className="text-info" />
                  </div>
                  <div>
                    <div className="fw-bold">Documents</div>
                    <div className="small text-muted">Upload/View status</div>
                  </div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setShowTopupModal(true)} className="py-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-success bg-opacity-10 p-2 rounded-circle me-3">
                    <FaWallet className="text-success" />
                  </div>
                  <div>
                    <div className="fw-bold">Wallet</div>
                    <div className="small text-muted">Add money, view balance</div>
                  </div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item 
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
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
        {/* Hero Section */}
        <section className="hero-section py-5" style={{ 
          background: 'linear-gradient(135deg, #667eea1a 0%, #764ba21a 100%)',
          borderRadius: '0 0 30px 30px'
        }}>
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="hero-content">
                  <Badge bg="primary" className="mb-3 px-3 py-2">
                    <GiElectric className="me-2" /> Electric Mobility
                  </Badge>
                  <h1 className="display-5 fw-bold mb-3">
                    Smart Electric<br />
                    <span className="text-primary">Scooter</span> Sharing
                  </h1>
                  <p className="lead mb-4">
                    Experience convenient, eco-friendly urban mobility with our electric scooter network. 
                    Find, book, and ride electric scooters across the city with real-time tracking.
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <Button variant="primary" size="lg" className="px-4 py-3" onClick={() => handleNavbarIconClick('vehicle')}>
                      <FaMotorcycle className="me-2" /> Find Scooters
                    </Button>
                    <Button variant="outline-primary" size="lg" className="px-4 py-3" onClick={() => document.getElementById('nearby-vehicles')?.scrollIntoView({ behavior: 'smooth' })}>
                      <FaMap className="me-2" /> Nearby Vehicles
                    </Button>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="hero-stats p-4 bg-white rounded-3 shadow-lg">
                  <div className="text-center mb-4">
                    <FaMotorcycle className="text-primary fs-1 mb-3" />
                    <h4 className="fw-bold">Live Dashboard</h4>
                  </div>
                  <Row className="g-4">
                    <Col xs={6}>
                      <div className="stat-card p-3 text-center">
                        <div className="stat-icon bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                          <FaMotorcycle className="text-primary fs-4" />
                        </div>
                        <h3 className="fw-bold text-primary">{vehicles.length}</h3>
                        <p className="text-muted mb-0">Available Scooters</p>
                        <div className="small text-success">
                          <FaBolt className="me-1" /> Live Updates
                        </div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="stat-card p-3 text-center">
                        <div className="stat-icon bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                          <FaWallet className="text-success fs-4" />
                        </div>
                        <h3 className="fw-bold text-success">{formatCurrency(wallet)}</h3>
                        <p className="text-muted mb-0">Wallet Balance</p>
                        <div className="small text-info">
                          <FaLock className="me-1" /> Secure
                        </div>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* FIXED: Active Ride Card with improved timer layout */}
                  <div className="mt-4">
                    {currentRide && currentRide.status === "active" && (
                      <Card className="border-primary border-start border-5 h-100 shadow-sm">
                        <Card.Body className="p-4">
                          <div className="d-flex align-items-center mb-4">
                            <div className="icon-wrapper bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                              <FaRoute className="text-primary fs-3" />
                            </div>
                            <div>
                              <h5 className="fw-bold mb-0">Active Ride</h5>
                              <p className="text-muted mb-0">Journey in progress</p>
                            </div>
                          </div>
                          
                          {/* FIXED: Timer with proper layout - no overlay */}
                          <div className="text-center mb-4">
                            <div className="timer-container d-flex justify-content-center align-items-center mb-3">
                              <div className="timer-icon me-4">
                                <FaMotorcycle className="text-primary" style={{ fontSize: '3.5rem', opacity: 0.7 }} />
                              </div>
                              <div className="timer-display">
                                <div className="timer-value">
                                  <h2 className="fw-bold text-primary mb-0 display-4">
                                    {formatRideDuration(rideSeconds)}
                                  </h2>
                                </div>
                                <div className="timer-label text-muted small">
                                  Ride Duration
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ride-details mb-4">
                            <Row className="g-3">
                              <Col xs={6}>
                                <div className="detail-card p-3 bg-light rounded text-center">
                                  <div className="text-muted small mb-1">Rate per min</div>
                                  <div className="fw-bold fs-4">₹{rideRate}</div>
                                </div>
                              </Col>
                              <Col xs={6}>
                                <div className="detail-card p-3 bg-light rounded text-center">
                                  <div className="text-muted small mb-1">Est. Total</div>
                                  <div className="fw-bold fs-4 text-primary">₹{estimatedFare || "0.00"}</div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          
                          <Button
                            variant="danger"
                            size="lg"
                            className="w-100 py-3 fw-bold"
                            onClick={handleEndRide}
                          >
                            <FaTimesCircle className="me-2" />
                            End Ride & Pay {estimatedFare > 300 ? `₹${(estimatedFare - 300).toFixed(2)}` : ''}
                          </Button>
                          
                          <div className="text-center mt-3">
                            <div className="text-muted small">
                              Wallet balance: <span className="fw-bold text-success">{formatCurrency(wallet)}</span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    )}
                    
                    {/* Booking Timer */}
                    {bookingInfo && bookingSecondsLeft !== null && (
                      <div className="booking-timer-card p-4 bg-warning bg-opacity-10 rounded-3 border border-warning shadow-sm mt-4">
                        <div className="d-flex align-items-center mb-3">
                          <FaClock className="text-warning fs-3 me-3" />
                          <div>
                            <h6 className="fw-bold mb-1">Active Booking</h6>
                            <div className="small text-muted">
                              Vehicle: <span className="fw-bold">{bookingInfo.vehicle?.name || "Selected Vehicle"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center mb-4">
                          <div className="booking-timer-display">
                            <div className="timer-countdown text-warning fw-bold display-5 mb-2">
                              {Math.floor(bookingSecondsLeft / 60)}:{String(bookingSecondsLeft % 60).padStart(2, "0")}
                            </div>
                            <div className="text-warning small">Time left to start ride</div>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-3">
                          <Button
                            variant="success"
                            size="lg"
                            onClick={handleStartRide}
                            className="flex-fill py-3"
                          >
                            <FaArrowRight className="me-2" />
                            Start Ride
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="lg"
                            onClick={handleCancelBooking}
                            className="flex-fill py-3"
                          >
                            <FaTimesCircle className="me-2" />
                            Cancel
                          </Button>
                        </div>
                        
                        <div className="text-center mt-3">
                          <div className="text-muted very-small">
                            ₹300 advance already deducted. No refund after ride start.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <GiElectric className="text-warning fs-3 me-2" />
                      <div>
                        <div className="fw-bold">Eco-Friendly Rides</div>
                        <div className="text-success">🌱 Zero emissions • ♻️ Sustainable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Nearby Vehicles Map Section */}
        <section id="nearby-vehicles" className="map-section py-5">
          <Container>
            <div className="section-header mb-5 text-center">
              <h2 className="fw-bold display-6 mb-3">
                <FaMap className="me-3 text-primary" />
                Nearby Vehicles Map
              </h2>
              <p className="lead text-muted">
                Real-time tracking of available electric scooters near you
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                <Badge bg="success" className="px-3 py-2">
                  <FaBatteryFull className="me-1" /> Live Battery Status
                </Badge>
                <Badge bg="info" className="px-3 py-2">
                  <FaMapMarkerAlt className="me-1" /> Your Location
                </Badge>
                <Badge bg="warning" className="px-3 py-2">
                  <FaMotorcycle className="me-1" /> Available Scooters
                </Badge>
              </div>
            </div>
            
            <Card className="border-0 shadow-lg overflow-hidden">
              <Card.Body className="p-0">
                <div style={{ height: '500px', borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* User Location */}
                    <Marker position={mapCenter}>
                      <Popup>
                        <div className="text-center p-3">
                          <div className="user-marker bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                               style={{ width: '50px', height: '50px' }}>
                            <FaUser className="fs-4" />
                          </div>
                          <h6 className="fw-bold mb-2">Your Location</h6>
                          <p className="text-muted mb-2">You are here</p>
                          <Badge bg="info" className="px-2 py-1">
                            <FaMapMarkerAlt className="me-1" /> Live Tracking
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Vehicles */}
                    {filteredVehicles.map(vehicle => (
                      vehicle.latitude && vehicle.longitude && (
                        <Marker
                          key={vehicle.vehicle_id ?? vehicle.id}
                          position={[vehicle.latitude, vehicle.longitude]}
                          icon={vehicleIcon}
                        >
                          <Popup className="vehicle-popup-enhanced">
                            <div className="p-4" style={{ minWidth: '300px' }}>
                              <div className="d-flex align-items-center mb-4">
                                <div className="vehicle-image me-3">
                                  {vehicle.photo_url ? (
                                    <img
                                      src={vehicle.photo_url}
                                      alt={vehicle.name}
                                      className="rounded"
                                      style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="bg-light rounded d-flex align-items-center justify-content-center"
                                         style={{ width: '80px', height: '60px' }}>
                                      <FaMotorcycle className="text-muted fs-3" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h5 className="fw-bold mb-1">{vehicle.name}</h5>
                                  <Badge bg={vehicle.status === "available" ? "success" : "warning"} className="mb-2">
                                    {vehicle.status}
                                  </Badge>
                                  <div className="small text-muted">{vehicle.vehicle_type}</div>
                                </div>
                              </div>
                              
                              <div className="vehicle-details mb-4">
                                <Row className="g-2">
                                  <Col xs={6}>
                                    <div className="detail-item p-2 bg-light rounded">
                                      <div className="d-flex align-items-center">
                                        <FaBatteryFull className="text-warning me-2" />
                                        <div>
                                          <div className="fw-bold">{vehicle.battery_level}%</div>
                                          <div className="very-small text-muted">Battery</div>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                  <Col xs={6}>
                                    <div className="detail-item p-2 bg-light rounded">
                                      <div className="d-flex align-items-center">
                                        <FaMoneyBillWave className="text-success me-2" />
                                        <div>
                                          <div className="fw-bold">₹{vehicle.price_per_minute}</div>
                                          <div className="very-small text-muted">Per minute</div>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                              
                              <div className="d-grid gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => attemptBook(vehicle)}
                                  className="w-100"
                                >
                                  <FaArrowRight className="me-2" />
                                  Book This Scooter
                                </Button>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </section>

        {/* Enhanced Vehicles List Section */}
        <section id="vehicles-section" className="vehicles-section py-5">
          <Container>
            <div className="section-header mb-5">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h2 className="display-6 fw-bold mb-2">
                    <FaMotorcycle className="me-3 text-primary" />
                    Available Electric Scooters
                  </h2>
                  <p className="lead text-muted">
                    {filteredVehicles.length} eco-friendly scooters ready to ride
                    <span className="text-success ms-2">
                      <FaLeaf className="me-1" /> Carbon Neutral
                    </span>
                  </p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                  <div className="search-box" style={{ width: '350px' }}>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-white">
                        <FaSearch className="text-primary" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search by name, type, battery..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <FaClock className="me-1" /> Live Updates
                  </Badge>
                </div>
              </div>
            </div>
            
            {filteredVehicles.length > 0 ? (
              <Row className="g-4">
                {filteredVehicles.map(vehicle => {
                  const vehicleId = vehicle.vehicle_id ?? vehicle.id;
                  return (
                    <Col xl={4} lg={6} key={vehicleId}>
                      <Card className="vehicle-card-enhanced h-100 border-0 shadow-lg hover-lift">
                        <Card.Body className="p-0">
                          {/* Vehicle Image */}
                          <div className="vehicle-image-container position-relative">
                            {vehicle.photo_url ? (
                              <img
                                src={vehicle.photo_url}
                                alt={vehicle.name}
                                className="img-fluid rounded-top"
                                style={{ height: '220px', width: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="d-flex flex-column align-items-center justify-content-center bg-light rounded-top"
                                   style={{ height: '220px' }}>
                                <FaMotorcycle className="text-muted opacity-25" style={{ fontSize: '5rem' }} />
                                <span className="text-muted mt-2">{vehicle.name}</span>
                              </div>
                            )}
                            
                            {/* Status Badge */}
                            <div className="position-absolute top-0 start-0 m-3">
                              <Badge bg={vehicle.status === "available" ? "success" : "warning"} className="px-3 py-2">
                                {vehicle.status}
                              </Badge>
                            </div>
                            
                            {/* Battery Indicator */}
                            <div className="position-absolute bottom-0 start-0 w-100 p-3"
                                 style={{ 
                                   background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                   borderBottomLeftRadius: '12px',
                                   borderBottomRightRadius: '12px'
                                 }}>
                              <div className="d-flex align-items-center text-white">
                                <FaBatteryFull className="me-2" />
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between">
                                    <span>Battery</span>
                                    <span className="fw-bold">{vehicle.battery_level}%</span>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar ${vehicle.battery_level > 50 ? 'bg-success' : vehicle.battery_level > 20 ? 'bg-warning' : 'bg-danger'}`}
                                      style={{ width: `${vehicle.battery_level}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Vehicle Details */}
                          <div className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h4 className="fw-bold mb-1">{vehicle.name}</h4>
                                <p className="text-muted mb-2">
                                  <FaMotorcycle className="me-2" />
                                  {vehicle.vehicle_type}
                                </p>
                              </div>
                              <div className="text-end">
                                <div className="text-primary fw-bold fs-4">₹{vehicle.price_per_minute}<span className="fs-6 text-muted">/min</span></div>
                                <div className="small text-muted">Per minute rate</div>
                              </div>
                            </div>
                            
                            <div className="vehicle-specs mb-4">
                              <Row className="g-3">
                                <Col xs={6}>
                                  <div className="spec-item p-3 bg-light rounded text-center">
                                    <div className="spec-icon mb-2">
                                      <GiElectric className="text-success fs-4" />
                                    </div>
                                    <div className="fw-bold">Electric</div>
                                    <div className="small text-muted">Zero Emissions</div>
                                  </div>
                                </Col>
                                <Col xs={6}>
                                  <div className="spec-item p-3 bg-light rounded text-center">
                                    <div className="spec-icon mb-2">
                                      <FaBolt className="text-warning fs-4" />
                                    </div>
                                    <div className="fw-bold">Fast</div>
                                    <div className="small text-muted">Quick Pickup</div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            
                            <div className="d-grid">
                              <Button
                                variant="primary"
                                size="lg"
                                className="py-3"
                                onClick={() => attemptBook(vehicle)}
                              >
                                <FaArrowRight className="me-2" />
                                Book This Scooter
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Card className="border-0 shadow-lg">
                <Card.Body className="text-center py-5">
                  <FaMotorcycle className="text-muted opacity-25 mb-4" style={{ fontSize: '5rem' }} />
                  <h3 className="fw-bold mb-3">No scooters available</h3>
                  <p className="text-muted lead mb-4">Check back soon or try adjusting your search</p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setSearchQuery("");
                      document.getElementById('vehicles-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <FaSearch className="me-2" />
                    Clear Search
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Container>
        </section>

        {/* Compact Quick Actions Section */}
<section className="actions-section py-3" style={{ 
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
}}>
  <Container>
    <div className="section-header text-center mb-3">
      <h4 className="fw-bold mb-2 text-primary">
        <FaBolt className="me-2 text-warning" />
        Quick Actions
      </h4>
      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
        Everything you need at your fingertips
        <span className="text-success d-block d-md-inline ms-md-2 mt-1 mt-md-0">
          <FaLeaf className="me-1" /> Fast & Eco-Friendly
        </span>
      </p>
    </div>
    
    <Row className="g-3 justify-content-center">
      {[
        {
          icon: FaWallet,
          title: 'Smart Wallet',
          description: 'Add money, check balance',
          action: 'wallet',
          color: 'success',
          gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
        },
        {
          icon: FaFileAlt,
          title: 'Documents',
          description: 'Upload ID, check status',
          action: 'documents',
          color: 'info',
          gradient: 'linear-gradient(135deg, #17a2b8 0%, #0dcaf0 100%)'
        },
        {
          icon: FaExclamationTriangle,
          title: 'Report Issue',
          description: 'Report problems',
          action: 'reports',
          color: 'warning',
          gradient: 'linear-gradient(135deg, #fd7e14 0%, #ffc107 100%)'
        },
        {
          icon: FaLifeRing,
          title: 'Emergency SOS',
          description: '24/7 assistance',
          action: 'emergency',
          color: 'danger',
          gradient: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
        },
      ].map((item, index) => (
        <Col xl={3} lg={6} md={6} key={index}>
          <Card className="border-0 shadow-lg h-100 hover-scale-105" 
                style={{ 
                  borderRadius: '15px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}>
            {/* Card Header with Gradient */}
            <div className="card-header-gradient py-3 text-center text-white"
                 style={{ background: item.gradient }}>
              <div className="action-icon-container d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-white bg-opacity-20 mb-2"
                   style={{ width: '60px', height: '60px' }}>
                <item.icon className="text-white fs-4" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
              </div>
              <h6 className="fw-bold mb-0 text-white">{item.title}</h6>
            </div>
            
            <Card.Body className="p-3">
              <p className="text-muted mb-3 text-center" style={{ 
                fontSize: '0.85rem',
                minHeight: '40px',
                lineHeight: '1.4'
              }}>
                {item.description}
              </p>
              
              {/* Features List */}
              <div className="features-list mb-3">
                <div className="d-flex align-items-center mb-1">
                  <div className="feature-dot bg-success rounded-circle me-2" 
                       style={{ width: '6px', height: '6px' }}></div>
                  <span className="small text-dark" style={{ fontSize: '0.8rem' }}>Quick Access</span>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <div className="feature-dot bg-success rounded-circle me-2" 
                       style={{ width: '6px', height: '6px' }}></div>
                  <span className="small text-dark" style={{ fontSize: '0.8rem' }}>Secure & Safe</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="feature-dot bg-success rounded-circle me-2" 
                       style={{ width: '6px', height: '6px' }}></div>
                  <span className="small text-dark" style={{ fontSize: '0.8rem' }}>24/7 Available</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="quick-stats p-2 rounded mb-3" 
                   style={{ 
                     backgroundColor: `var(--bs-${item.color}-bg-subtle)`,
                     fontSize: '0.85rem'
                   }}>
                <div className="row text-center">
                  <div className="col-6">
                    <div className="fw-bold fs-6">24/7</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Available</div>
                  </div>
                  <div className="col-6">
                    <div className="fw-bold fs-6">
                      {item.action === 'wallet' ? '₹' : ''}
                      {item.action === 'wallet' ? wallet : 'Fast'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {item.action === 'wallet' ? 'Balance' : 'Access'}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                variant={`outline-${item.color}`}
                className="w-100 py-2 fw-bold"
                onClick={() => handleNavbarIconClick(item.action)}
                style={{ 
                  borderRadius: '8px',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `var(--bs-${item.color})`;
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = `var(--bs-${item.color})`;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <item.icon className="me-2" />
                Access Now
              </Button>
            </Card.Body>
            
            {/* Card Footer */}
            <div className="card-footer bg-transparent border-0 py-2">
              <div className="text-center">
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  <FaClock className="me-1" />
                  Instant Access
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    
    {/* Additional Info Section - Made Smaller */}
    <div className="mt-4 pt-3">
      <Row className="g-3">
        <Col md={4}>
          <div className="text-center p-3 bg-white rounded-2 shadow-sm border">
            <div className="icon-wrapper bg-primary bg-opacity-10 p-2 rounded-circle d-inline-flex mb-2">
              <FaShieldAlt className="text-primary" style={{ fontSize: '1.2rem' }} />
            </div>
            <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>Secure & Safe</h6>
            <p className="text-muted mb-0 small" style={{ fontSize: '0.8rem' }}>
              Encrypted and secure actions
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="text-center p-3 bg-white rounded-2 shadow-sm border">
            <div className="icon-wrapper bg-success bg-opacity-10 p-2 rounded-circle d-inline-flex mb-2">
              <FaBolt className="text-success" style={{ fontSize: '1.2rem' }} />
            </div>
            <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>Fast Access</h6>
            <p className="text-muted mb-0 small" style={{ fontSize: '0.8rem' }}>
              Quick actions for needs
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="text-center p-3 bg-white rounded-2 shadow-sm border">
            <div className="icon-wrapper bg-info bg-opacity-10 p-2 rounded-circle d-inline-flex mb-2">
              <FaUser className="text-info" style={{ fontSize: '1.2rem' }} />
            </div>
            <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>User-Friendly</h6>
            <p className="text-muted mb-0 small" style={{ fontSize: '0.8rem' }}>
              Easy navigation design
            </p>
          </div>
        </Col>
      </Row>
    </div>
  </Container>
</section>
      {/* Enhanced Professional Footer */}
      <footer className="smart-footer bg-dark text-white py-5 mt-5">
        <Container>
          <Row className="g-5">
            <Col lg={4}>
              <div className="footer-brand mb-4">
                <div className="d-flex align-items-center mb-3">
                  <GiElectric className="text-warning fs-1 me-3" />
                  <div>
                    <h2 className="fw-bold mb-0">Smart Ride</h2>
                    <p className="text-light opacity-75 mb-0">Electric Mobility Platform</p>
                  </div>
                </div>
                <p className="text-light opacity-75 mb-4">
                  Transforming urban mobility with sustainable, intelligent, and accessible 
                  electric scooter solutions. Join us in creating cleaner, smarter cities.
                </p>
                <div className="quote-box p-3 bg-dark bg-opacity-50 rounded border-start border-3 border-warning">
                  <p className="mb-0 fst-italic text-light">
                    "{randomQuote}"
                  </p>
                </div>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="contact-info mb-4">
                <h4 className="fw-bold mb-4 text-warning">
                  <FaPhone className="me-2" />
                  Contact Information
                </h4>
                <div className="contact-item mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="contact-icon bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                      <FaPhone className="text-primary" />
                    </div>
                    <div>
                      <div className="fw-bold">Emergency Helpline</div>
                      <div className="text-light">112 / 911</div>
                    </div>
                  </div>
                </div>
                <div className="contact-item mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="contact-icon bg-success bg-opacity-10 p-2 rounded-circle me-3">
                      <FaPhone className="text-success" />
                    </div>
                    <div>
                      <div className="fw-bold">Customer Support</div>
                      <div className="text-light">1800-123-4567 (24/7)</div>
                    </div>
                  </div>
                </div>
                <div className="contact-item mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="contact-icon bg-info bg-opacity-10 p-2 rounded-circle me-3">
                      <FaEnvelope className="text-info" />
                    </div>
                    <div>
                      <div className="fw-bold">Email Support</div>
                      <div className="text-light">support@smartride.com</div>
                    </div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="d-flex align-items-center mb-2">
                    <div className="contact-icon bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                      <FaMapMarkerAlt className="text-warning" />
                    </div>
                    <div>
                      <div className="fw-bold">Headquarters</div>
                      <div className="text-light">Smart Ride Tower, Kochi, Kerala, India - 682024</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="social-links mb-4">
                <h4 className="fw-bold mb-4 text-warning">
                  <span className="fs-5 me-2">🔔︎</span>
                  Connect With Us
                </h4>
                <p className="text-light opacity-75 mb-4">
                  Follow us on social media for updates, tips, and community news.
                </p>
                <div className="social-icons d-flex gap-3 mb-4">
                  {[
                    { icon: FaFacebook, color: '#1877f2', label: 'Facebook' },
                    { icon: FaTwitter, color: '#1da1f2', label: 'Twitter' },
                    { icon: FaInstagram, color: '#e4405f', label: 'Instagram' },
                    { icon: FaLinkedin, color: '#0a66c2', label: 'LinkedIn' },
                    { icon: FaYoutube, color: '#ff0000', label: 'YouTube' },
                  ].map((social, index) => (
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
                
                <div className="environment-stats p-3 bg-dark bg-opacity-50 rounded">
                  <div className="d-flex align-items-center mb-2">
                    <FaLeaf className="text-success me-2" />
                    <span className="fw-bold">Environmental Impact</span>
                  </div>
                  <div className="text-light opacity-75 small">
                    Together we've saved: <span className="text-success fw-bold">12,450 kg</span> of CO₂
                  </div>
                  <div className="progress mt-2" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          <hr className="my-4 opacity-25" />
          
          <Row className="align-items-center">
            <Col md={6}>
              <p className="mb-0 text-light opacity-75">
                © {new Date().getFullYear()} Smart Ride Technologies. All rights reserved.
                <span className="d-block d-md-inline ms-md-3 mt-2 mt-md-0">
                  Made with ajsal_irfan for a greener planet.
                </span>
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="d-flex gap-3 justify-content-md-end flex-wrap">
                <a href="#" className="text-light opacity-75 text-decoration-none">Privacy Policy</a>
                <a href="#" className="text-light opacity-75 text-decoration-none">Terms of Service</a>
                <a href="#" className="text-light opacity-75 text-decoration-none">Cookie Policy</a>
                <a href="#" className="text-light opacity-75 text-decoration-none">Safety Guidelines</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* All Modals (same as before) */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-primary">
          <Modal.Title className="text-primary">
            <FaMotorcycle className="me-2" />
            Confirm Booking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedVehicle && (
            <div className="booking-confirmation">
              <div className="d-flex align-items-center mb-4">
                <div className="booking-vehicle-image me-4">
                  {selectedVehicle.photo_url ? (
                    <img
                      src={selectedVehicle.photo_url}
                      alt={selectedVehicle.name}
                      className="rounded"
                      style={{ width: '150px', height: '120px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center"
                         style={{ width: '150px', height: '120px' }}>
                      <FaMotorcycle className="text-muted fs-1" />
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <h4 className="fw-bold mb-2">{selectedVehicle.name}</h4>
                  <div className="d-flex gap-3 mb-3">
                    <Badge bg="primary" className="px-3 py-2">{selectedVehicle.vehicle_type}</Badge>
                    <Badge bg="success" className="px-3 py-2">
                      <FaBatteryFull className="me-1" /> {selectedVehicle.battery_level}%
                    </Badge>
                  </div>
                  <div className="text-muted">
                    ₹{selectedVehicle.price_per_minute} per minute • {selectedVehicle.status}
                  </div>
                </div>
              </div>
              
              <Card className="border-warning mb-4">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <FaWallet className="text-warning fs-4 me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Advance Payment Required</h6>
                      <p className="text-muted mb-0">
                        ₹300 will be debited from your wallet and held as security deposit.
                        This amount will be adjusted against your final ride fare.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="booking-summary p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">Booking Summary</h6>
                <div className="row">
                  <div className="col-6">
                    <div className="text-muted small">Current Wallet</div>
                    <div className="fw-bold">{formatCurrency(wallet)}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">After Booking</div>
                    <div className="fw-bold">{formatCurrency(wallet - 300)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowBookingModal(false)} size="lg">
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmBooking} size="lg" className="px-5">
            <FaCheckCircle className="me-2" />
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Verification Modal (same as before) */}
      <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-info">
          <Modal.Title className="text-info">
            <FaShieldAlt className="me-2" />
            {verifiedStatus !== "approved" ? "Document Verification" : "Verification Status"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {verifiedStatus !== "approved" ? (
            <>
              <div className="verification-intro mb-4">
                <div className="d-flex align-items-center mb-3">
                  <FaShieldAlt className="text-info fs-1 me-3" />
                  <div>
                    <h5 className="fw-bold">Secure Your Account</h5>
                    <p className="text-muted">Upload required documents to start booking vehicles</p>
                  </div>
                </div>
              </div>
              
              <div className="row g-4">
                <Col md={6}>
                  <Card className="border-info h-100">
                    <Card.Body className="text-center p-4">
                      <FaIdCard className="text-info fs-1 mb-3" />
                      <h6 className="fw-bold mb-2">Driving License</h6>
                      <p className="text-muted small mb-3">Upload a clear photo of your valid driving license</p>
                      <Form.Control
                        ref={modalDLRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="mb-3"
                        onChange={(e) =>
                          setModalFilesPreview({
                            ...modalFilesPreview,
                            dl: e.target.files?.[0]?.name,
                          })
                        }
                      />
                      {modalFilesPreview.dl && (
                        <div className="alert alert-success small mb-0">
                          <FaCheckCircle className="me-2" />
                          Selected: {modalFilesPreview.dl}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-info h-100">
                    <Card.Body className="text-center p-4">
                      <FaUser className="text-info fs-1 mb-3" />
                      <h6 className="fw-bold mb-2">ID Proof</h6>
                      <p className="text-muted small mb-3">Upload Aadhaar, PAN, or other government ID</p>
                      <Form.Control
                        ref={modalIDRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="mb-3"
                        onChange={(e) =>
                          setModalFilesPreview({
                            ...modalFilesPreview,
                            idp: e.target.files?.[0]?.name,
                          })
                        }
                      />
                      {modalFilesPreview.idp && (
                        <div className="alert alert-success small mb-0">
                          <FaCheckCircle className="me-2" />
                          Selected: {modalFilesPreview.idp}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </div>
              
              {uploading && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">Uploading...</span>
                    <span className="fw-bold">{uploadProgress}%</span>
                  </div>
                  <ProgressBar now={uploadProgress} animated striped variant="info" />
                </div>
              )}
              
              <div className="alert alert-info mt-4">
                <FaShieldAlt className="me-2" />
                Our team will verify your documents within 24 hours. You'll receive an email notification.
              </div>
            </>
          ) : verifiedStatus === "pending" ? (
            <>
              <div className="text-center py-4">
                <div className="verification-status-icon mb-4">
                  <FaHourglassHalf className="text-warning" style={{ fontSize: '5rem' }} />
                </div>
                <h4 className="fw-bold text-warning mb-3">Verification in Progress</h4>
                <p className="text-muted mb-4">
                  Your documents are being reviewed by our verification team. 
                  This usually takes 1-2 business days.
                </p>
                <div className="progress-steps mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="step active">
                      <div className="step-number">1</div>
                      <div className="step-label">Uploaded</div>
                    </div>
                    <div className="step-line active"></div>
                    <div className="step active">
                      <div className="step-number">2</div>
                      <div className="step-label">Reviewing</div>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-label">Verified</div>
                    </div>
                  </div>
                </div>
                <div className="alert alert-warning">
                  <FaClock className="me-2" />
                  You'll receive an email notification once your verification is complete.
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <div className="verification-status-icon mb-4">
                  <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
                </div>
                <h4 className="fw-bold text-success mb-3">Verification Complete!</h4>
                <p className="text-muted mb-4">
                  Your account has been successfully verified. You can now book vehicles and enjoy all features.
                </p>
                <div className="verified-badges d-flex justify-content-center gap-3 mb-4">
                  <Badge bg="success" className="px-3 py-2">
                    <FaIdCard className="me-2" /> ID Verified
                  </Badge>
                  <Badge bg="success" className="px-3 py-2">
                    <FaUser className="me-2" /> Account Active
                  </Badge>
                </div>
                <Card className="bg-success bg-opacity-10 border-success">
                  <Card.Body>
                    <h6 className="fw-bold">What's Next?</h6>
                    <ul className="text-start mb-0">
                      <li>Book your first scooter</li>
                      <li>Add money to your wallet</li>
                      <li>Explore the live map</li>
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowVerificationModal(false)}>
            {verifiedStatus === "approved" ? "Close" : "Cancel"}
          </Button>
          {verifiedStatus !== "approved" && (
            <Button variant="info" onClick={uploadDocsFromModal} disabled={uploading} size="lg">
              {uploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="me-2" />
                  Upload & Verify
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal (same as before) */}
      <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Enter username"
              />
              {editErrors.username && (
                <div className="text-danger small mt-1">{editErrors.username}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter email"
              />
              {editErrors.email && (
                <div className="text-danger small mt-1">{editErrors.email}</div>
              )}
            </Form.Group>

            {editErrors.non_field && (
              <div className="text-danger small mt-2">{editErrors.non_field}</div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditProfileModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Topup Modal (same as before) */}
      <Modal show={showTopupModal} onHide={() => setShowTopupModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-success">
          <Modal.Title className="text-success">
            <FaWallet className="me-2" />
            Add Money to Wallet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="wallet-icon-container mb-3">
              <FaWallet className="text-success" style={{ fontSize: '4rem' }} />
            </div>
            <h4 className="fw-bold">Current Balance</h4>
            <h1 className="display-4 fw-bold text-success mb-4">{formatCurrency(wallet)}</h1>
            <div className="alert alert-info">
              <FaInfoCircle className="me-2" />
              Minimum ₹{MIN_WALLET_BALANCE} required for booking
            </div>
          </div>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Amount to Add (₹)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              min="1"
              size="lg"
              className="py-3"
            />
            <Form.Text className="text-muted">
              Enter the amount you want to add to your wallet
            </Form.Text>
          </Form.Group>
          
          <div className="quick-amounts mb-4">
            <h6 className="fw-bold mb-3">Quick Top-up</h6>
            <div className="d-flex gap-2 flex-wrap">
              {[100, 300, 500, 1000, 2000].map(amount => (
                <Button
                  key={amount}
                  variant={addAmount === amount.toString() ? "success" : "outline-success"}
                  onClick={() => setAddAmount(amount.toString())}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowTopupModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={openRazorpay}
            disabled={walletLoading || !addAmount || addAmount < 1}
            size="lg"
          >
            {walletLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard className="me-2" />
                Proceed to Payment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SOS Modal (same as before) */}
      <Modal show={showSOSModal} onHide={() => setShowSOSModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-danger bg-danger text-white">
          <Modal.Title>
            <FaLifeRing className="me-2" />
            Emergency SOS
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <div className="emergency-icon-container mb-3">
              <FaLifeRing className="text-danger" style={{ fontSize: '4rem' }} />
            </div>
            <h3 className="fw-bold text-danger mb-3">Emergency Assistance</h3>
            <p className="text-muted">
              Help will be notified immediately with your location. Please provide details:
            </p>
          </div>
          
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Emergency Type</Form.Label>
              <Form.Select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                size="lg"
                className="py-3"
              >
                <option value="accident">🚑 Accident / Crash</option>
                <option value="harassment">🚨 Harassment / Safety Threat</option>
                <option value="vehicle_breakdown">🛵 Vehicle Breakdown</option>
                <option value="medical">🩺 Medical Emergency</option>
                <option value="theft">🚔 Theft / Robbery</option>
                <option value="other">⚠️ Other Emergency</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Emergency Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Please describe what happened, your location, and any other important details..."
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="py-3"
              />
            </Form.Group>
            
            <Card className="border-warning mb-4">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt className="text-warning fs-4 me-3" />
                  <div>
                    <h6 className="fw-bold mb-1">Your Location</h6>
                    <p className="text-muted mb-0">
                      {profile?.last_known_location?.name || "Kochi, Kerala"} 
                      (Coordinates: {mapCenter[0].toFixed(6)}, {mapCenter[1].toFixed(6)})
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <div className="alert alert-warning text-center">
              <FaExclamationTriangle className="me-2" />
              <strong>Important:</strong> In case of immediate danger, please call local emergency services directly.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowSOSModal(false)} disabled={sendingAlert}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={sendEmergencyAlert}
            disabled={sendingAlert || !alertMessage.trim()}
            size="lg"
          >
            {sendingAlert ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending Alert...
              </>
            ) : (
              <>
                <FaLifeRing className="me-2" />
                Send Emergency Alert
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🚨 Floating SOS Button */}
      <button 
        className="sos-btn position-fixed" 
        onClick={() => setShowSOSModal(true)}
        style={{
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
          color: 'white',
          border: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(220, 53, 69, 0.5)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.15)';
          e.target.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.7)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.5)';
        }}
      >
        <FaLifeRing className="me-1" />
        SOS
      </button>
      </div>
    </div>
  );
}
