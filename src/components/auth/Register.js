import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import '../../styles/Auth.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaUserPlus,
  FaShieldAlt,
  FaLeaf,
  FaBolt,
  FaKey,
  FaArrowLeft
} from "react-icons/fa";
import { GiElectric } from "react-icons/gi";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validations
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9@.+_-]{3,30}$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Username must be 3-30 characters. Letters, numbers, and @/./+/-/_ only');
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm
      };

      console.log('Sending registration data:', registerData);

      const response = await authService.register(registerData);
      setSuccess('Registration successful! Redirecting to login...');

      // ✅ Capture email & password BEFORE clearing the form
      const redirectState = {
        email: formData.email,
        password: formData.password
      };

      // Clear the form fields
      setFormData({
        username: '',
        email: '',
        password: '',
        password_confirm: ''
      });

      // ✅ Redirect to login with captured data
      setTimeout(() => {
        navigate('/login', { state: redirectState });
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.username) {
        setError(`Username: ${error.response.data.username[0]}`);
      } else if (error.response?.data?.email) {
        setError(`Email: ${error.response.data.email[0]}`);
      } else if (error.response?.data?.password) {
        setError(`Password: ${error.response.data.password[0]}`);
      } else if (error.response?.data?.password_confirm) {
        setError(`Password Confirm: ${error.response.data.password_confirm[0]}`);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Registration failed! Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="register-page">
      {/* Background Gradient */}
      <div className="register-background"></div>
      
      <div className="container-fluid h-100">
        <div className="row align-items-center justify-content-center h-100">
          {/* Left Side - Branding & Benefits */}
          <div className="col-lg-6 col-md-8 d-none d-lg-block">
            <div className="register-brand-section p-5">
              <div className="brand-header mb-5">
                <div className="d-flex align-items-center">
                  <GiElectric className="text-warning" style={{ fontSize: '4rem' }} />
                  <div className="ms-4">
                    <h1 className="display-3 fw-bold text-white mb-1">
                      Join <span className="text-warning">SmartRide</span>
                    </h1>
                    <p className="text-light opacity-75 fs-5">
                      Start Your Electric Journey Today
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="benefits-list mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="benefit-icon bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <FaLeaf className="text-success fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Eco-Friendly Rides</h4>
                    <p className="text-light opacity-75 mb-0">
                      Zero emissions, contribute to cleaner cities
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="benefit-icon bg-warning bg-opacity-10 p-3 rounded-circle me-4">
                    <FaBolt className="text-warning fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Instant Access</h4>
                    <p className="text-light opacity-75 mb-0">
                      Book electric scooters in seconds
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="benefit-icon bg-success bg-opacity-10 p-3 rounded-circle me-4">
                    <FaShieldAlt className="text-info fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Secure Platform</h4>
                    <p className="text-light opacity-75 mb-0">
                      Your data is encrypted and protected
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="benefit-icon bg-info bg-opacity-10 p-3 rounded-circle me-4">
                    <FaUser className="text-primary fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Verified Community</h4>
                    <p className="text-light opacity-75 mb-0">
                      Ride with verified, safe users
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-card p-4 bg-dark bg-opacity-25 rounded-3 border-start border-3 border-primary">
                <h4 className="fw-bold text-white mb-3">Why Join Smart Ride?</h4>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-item text-center p-3">
                      <div className="stat-value fw-bold text-white display-6">10K+</div>
                      <div className="stat-label text-light opacity-75">Active Riders</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-item text-center p-3">
                      <div className="stat-value fw-bold text-white display-6">500+</div>
                      <div className="stat-label text-light opacity-75">Scooters</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-item text-center p-3">
                      <div className="stat-value fw-bold text-white display-6">24/7</div>
                      <div className="stat-label text-light opacity-75">Support</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-item text-center p-3">
                      <div className="stat-value fw-bold text-white display-6">₹5/min</div>
                      <div className="stat-label text-light opacity-75">Starting Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="col-lg-4 col-md-8">
            <div className="register-form-container">
              <div className="register-form-card p-4 p-md-5">
                {/* Back to Login */}
                <div className="mb-4">
                  <button
                    className="btn btn-link text-decoration-none d-flex align-items-center p-0"
                    onClick={() => navigate('/login')}
                  >
                    <FaArrowLeft className="me-2 text-light opacity-75" />
                    <span className="text-light opacity-75">Back to Login</span>
                  </button>
                </div>

                {/* Logo & Header */}
                <div className="text-center mb-4">
                  <div className="register-logo mb-4">
                    <GiElectric className="text-warning" style={{ fontSize: '3.5rem' }} />
                  </div>
                  <h2 className="fw-bold text-white mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-light opacity-75">
                    Join the electric mobility revolution
                  </p>
                </div>

                {/* Messages */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center fade-in-slow mb-4">
                    <FaExclamationCircle className="me-2" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success d-flex align-items-center slide-down mb-4">
                    <FaCheckCircle className="me-2" />
                    {success}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="fade-in">
                  <div className="form-group mb-4">
                    <label className="form-label text-light opacity-75 mb-2">
                      <FaUser className="me-2" />
                      Username *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark bg-opacity-25 border-end-0">
                        <FaUser className="text-light opacity-75" />
                      </span>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username (3-30 characters)"
                        required
                        disabled={loading}
                        className="form-control form-control-lg border-start-0"
                        pattern="[a-zA-Z0-9@.+_-]{3,30}"
                        title="3-30 characters. Letters, numbers, and @/./+/-/_ only"
                      />
                    </div>
                    <small className="text-light opacity-75 mt-1" style={{ fontSize: '0.8rem' }}>
                      3-30 characters. Letters, numbers, and @/./+/-/_ only
                    </small>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label text-light opacity-75 mb-2">
                      <FaEnvelope className="me-2" />
                      Email Address *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark bg-opacity-25 border-end-0">
                        <FaEnvelope className="text-light opacity-75" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                        className="form-control form-control-lg border-start-0"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label text-light opacity-75 mb-2">
                      <FaLock className="me-2" />
                      Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark bg-opacity-25 border-end-0">
                        <FaLock className="text-light opacity-75" />
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password (min 8 characters)"
                        required
                        disabled={loading}
                        className="form-control form-control-lg border-start-0"
                        minLength="8"
                      />
                    </div>
                    <small className="text-light opacity-75 mt-1" style={{ fontSize: '0.8rem' }}>
                      Minimum 8 characters with letters and numbers
                    </small>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label text-light opacity-75 mb-2">
                      <FaKey className="me-2" />
                      Confirm Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark bg-opacity-25 border-end-0">
                        <FaKey className="text-light opacity-75" />
                      </span>
                      <input
                        type="password"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                        disabled={loading}
                        className="form-control form-control-lg border-start-0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold register-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" />
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Terms & Conditions */}
                <div className="terms-section mt-4 pt-3 border-top border-light border-opacity-25">
                  <div className="text-center">
                    <small className="text-light opacity-75 d-block">
                      By creating an account, you agree to our
                    </small>
                    <div className="d-flex justify-content-center gap-3 mt-2">
                      <a href="#" className="text-decoration-none small text-light opacity-75">
                        Terms of Service
                      </a>
                      <span className="text-light opacity-75">•</span>
                      <a href="#" className="text-decoration-none small text-light opacity-75">
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                </div>

                {/* Already Have Account */}
                <div className="text-center mt-4">
                  <p className="text-light opacity-75 mb-3">
                    Already have an account?
                  </p>
                  <Link 
                    to="/login" 
                    className="btn btn-outline-light w-100 py-2 rounded-3"
                  >
                    Sign In to Smart Ride
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;