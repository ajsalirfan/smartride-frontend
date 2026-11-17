import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { API_BASE_URL } from "../../services/apiConfig";
import { 
  FaMotorcycle, 
  FaEnvelope, 
  FaLock, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaUserPlus,
  FaKey,
  FaLeaf,
  FaBolt,
  FaShieldAlt
} from "react-icons/fa";
import { GiElectric } from "react-icons/gi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);

    if (location.state?.resetDone) {
      setSuccess("Password reset successful! You can log in now.");
      setTimeout(() => setSuccess(""), 4000);
    }

    // Check for remembered credentials
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Remember email if checkbox is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const res = await fetch(`${API_BASE_URL}Users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // Store tokens
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);

        // Save user
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);

        // Redirect logic
        if (data.user.is_superuser || data.user.user_type === "admin") {
          window.location.href = "http://127.0.0.1:8000/smartride-admin/";
          return;
        }

        if (data.user.user_type === "staff") {
          navigate("/staff/panel");
          return;
        }

        navigate("/user/home");
      } else {
        setError(data.error || "Invalid login details.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Gradient */}
      <div className="login-background"></div>
      
      <div className="container-fluid h-100">
        <div className="row align-items-center justify-content-center h-100">
          {/* Left Side - Branding & Quotes */}
          <div className="col-lg-6 col-md-8 d-none d-lg-block">
            <div className="login-brand-section p-5">
              <div className="brand-header mb-5">
                <div className="d-flex align-items-center">
                  <GiElectric className="text-warning" style={{ fontSize: '4rem' }} />
                  <div className="ms-4">
                    <h1 className="display-3 fw-bold text-white mb-1">
                      Smart<span className="text-warning">Ride</span>
                    </h1>
                    <p className="text-light opacity-75 fs-5">
                      Electric Mobility Platform
                    </p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="features-list mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="feature-icon bg-success bg-opacity-10 p-3 rounded-circle me-4">
                    <FaLeaf className="text-success fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Eco-Friendly</h4>
                    <p className="text-light opacity-75 mb-0">
                      Zero emissions, sustainable urban mobility
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="feature-icon bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <FaBolt className="text-primary fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Fast & Convenient</h4>
                    <p className="text-light opacity-75 mb-0">
                      Instant booking, real-time tracking
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-warning bg-opacity-10 p-3 rounded-circle me-4">
                    <FaShieldAlt className="text-warning fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Secure & Safe</h4>
                    <p className="text-light opacity-75 mb-0">
                      24/7 monitoring, verified users only
                    </p>
                  </div>
                </div>
              </div>

              {/* Quotes Carousel */}
              <div className="quote-carousel">
                <div className="quote-card p-4 bg-dark bg-opacity-25 rounded-3 border-start border-3 border-warning">
                  <p className="text-light fst-italic fs-5 mb-3">
                    "Ride the future, today. Experience sustainable mobility that's smart, fast, and environmentally conscious."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="author-avatar bg-primary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{ width: '50px', height: '50px' }}>
                      <GiElectric className="text-warning" />
                    </div>
                    <div>
                      <h6 className="fw-bold text-white mb-0">Smart Ride Team</h6>
                      <p className="text-light opacity-75 mb-0 small">Electric Mobility Experts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="row mt-5 pt-4">
                <div className="col-4 text-center">
                  <h3 className="fw-bold text-white display-5">10K+</h3>
                  <p className="text-light opacity-75 mb-0">Happy Riders</p>
                </div>
                <div className="col-4 text-center">
                  <h3 className="fw-bold text-white display-5">500+</h3>
                  <p className="text-light opacity-75 mb-0">Scooters</p>
                </div>
                <div className="col-4 text-center">
                  <h3 className="fw-bold text-white display-5">24/7</h3>
                  <p className="text-light opacity-75 mb-0">Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-4 col-md-8">
            <div className="login-form-container">
              <div className="login-form-card p-4 p-md-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <div className="login-logo mb-4">
                    <GiElectric className="text-warning" style={{ fontSize: '3.5rem' }} />
                  </div>
                  <h2 className="fw-bold text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-light opacity-75">
                    Sign in to continue your electric journey
                  </p>
                </div>

                {/* Messages */}
                {success && (
                  <div className="alert alert-success d-flex align-items-center fade-in-slow mb-4">
                    <FaCheckCircle className="me-2" />
                    {success}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger d-flex align-items-center slide-down mb-4">
                    <FaExclamationCircle className="me-2" />
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="fade-in">
                  <div className="form-group mb-4">
                    <label className="form-label text-light opacity-75 mb-2">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark bg-opacity-25 border-end-0">
                        <FaEnvelope className="text-light opacity-75" />
                      </span>
                      <input
                        type="email"
                        className="form-control form-control-lg border-start-0"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label text-light opacity-75 mb-2">
                      <FaLock className="me-2" />
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark bg-opacity-25 border-end-0">
                        <FaLock className="text-light opacity-75" />
                      </span>
                      <input
                        type="password"
                        className="form-control form-control-lg border-start-0"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label text-light opacity-75" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0"
                      onClick={() => navigate("/forgot-password")}
                    >
                      <FaKey className="me-1" />
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold login-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <FaMotorcycle className="me-2" />
                        Login to Smart Ride
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="divider my-4">
                  <span className="divider-text text-light opacity-75">OR</span>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-light opacity-75 mb-3">
                    Don't have an account?
                  </p>
                  <button
                    className="btn btn-outline-light w-100 py-3 rounded-3 fw-bold"
                    onClick={() => navigate("/register")}
                  >
                    <FaUserPlus className="me-2" />
                    Create New Account
                  </button>
                </div>

                {/* Security Info */}
                <div className="security-info mt-4 pt-3 border-top border-light border-opacity-25">
                  <div className="d-flex align-items-center justify-content-center">
                    <FaShieldAlt className="text-success me-2" />
                    <small className="text-light opacity-75">
                      Your data is securely encrypted
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}