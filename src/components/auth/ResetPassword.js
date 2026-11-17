import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import '../../styles/Auth.css';
import { 
  FaEnvelope, 
  FaLock, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaUnlockAlt,
  FaShieldAlt,
  FaLeaf,
  FaBolt,
  FaKey,
  FaArrowLeft
} from "react-icons/fa";
import { GiElectric } from "react-icons/gi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Auto-fill email if passed from ForgotPassword
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(email, otpCode, newPassword, confirmPassword);

      if (response.data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        
        // 🧹 Clear any stored login data before redirect
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        sessionStorage.clear();

        // Redirect to login with flag to show success banner
        setTimeout(() => {
          navigate('/login', { replace: true, state: { resetDone: true } });
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Something went wrong. Please check the OTP or try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      {/* Background Gradient */}
      <div className="reset-background"></div>
      
      <div className="container-fluid h-100">
        <div className="row align-items-center justify-content-center h-100">
          {/* Left Side - Branding & Benefits */}
          <div className="col-lg-6 col-md-8 d-none d-lg-block">
            <div className="reset-brand-section p-5">
              <div className="brand-header mb-5">
                <div className="d-flex align-items-center">
                  <GiElectric className="text-warning" style={{ fontSize: '4rem' }} />
                  <div className="ms-4">
                    <h1 className="display-3 fw-bold text-white mb-1">
                      Reset <span className="text-warning">Password</span>
                    </h1>
                    <p className="text-light opacity-75 fs-5">
                      Secure Your Smart Ride Account
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="security-features mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="security-icon bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <FaShieldAlt className="text-primary fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Secure Reset</h4>
                    <p className="text-light opacity-75 mb-0">
                      OTP verification ensures account security
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="security-icon bg-success bg-opacity-10 p-3 rounded-circle me-4">
                    <FaLock className="text-success fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Strong Password</h4>
                    <p className="text-light opacity-75 mb-0">
                      Minimum 8 characters for maximum security
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="security-icon bg-warning bg-opacity-10 p-3 rounded-circle me-4">
                    <FaBolt className="text-warning fs-2" />
                  </div>
                  <div>
                    <h4 className="fw-bold text-white mb-1">Instant Access</h4>
                    <p className="text-light opacity-75 mb-0">
                      Get back to riding in seconds
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="security-tips p-4 bg-dark bg-opacity-25 rounded-3 border-start border-3 border-success">
                <h4 className="fw-bold text-white mb-3">
                  <FaShieldAlt className="me-2 text-success" />
                  Password Safety Tips
                </h4>
                <ul className="text-light opacity-75 mb-0 ps-3">
                  <li className="mb-2">Use a mix of uppercase and lowercase letters</li>
                  <li className="mb-2">Include numbers and special characters</li>
                  <li className="mb-2">Avoid using personal information</li>
                  <li>Don't reuse passwords from other sites</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Password Form */}
          <div className="col-lg-4 col-md-8">
            <div className="reset-form-container">
              <div className="reset-form-card p-4 p-md-5">
                {/* Back to Login */}
                <div className="mb-4">
                  <button
                    className="btn btn-link text-decoration-none d-flex align-items-center p-0"
                    onClick={() => navigate('/login')}
                  >
                    <FaArrowLeft className="me-2" />
                    <span>Back to Login</span>
                  </button>
                </div>

                {/* Logo & Header */}
                <div className="text-center mb-4">
                  <div className="reset-logo mb-4">
                    <FaUnlockAlt className="text-warning" style={{ fontSize: '3.5rem' }} />
                  </div>
                  <h2 className="fw-bold mb-2">
                    Reset Your Password
                  </h2>
                  <p className="text-muted">
                    Enter the OTP and set your new password
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
                    <label className="form-label mb-2">
                      <FaEnvelope className="me-2" />
                      Email Address *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        required
                        disabled={loading}
                        className="form-control form-control-lg"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label mb-2">
                      <FaKey className="me-2" />
                      OTP Code *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaKey />
                      </span>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        required
                        disabled={loading}
                        maxLength="6"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <small className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                      Check your email for the 6-digit OTP code
                    </small>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label mb-2">
                      <FaLock className="me-2" />
                      New Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 8 characters)"
                        required
                        disabled={loading}
                        className="form-control form-control-lg"
                      />
                    </div>
                    <small className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                      Minimum 8 characters with letters and numbers
                    </small>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label mb-2">
                      <FaLock className="me-2" />
                      Confirm Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        disabled={loading}
                        className="form-control form-control-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold reset-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <FaUnlockAlt className="me-2" />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>

                {/* Security Info */}
                <div className="security-info mt-4 pt-3 border-top">
                  <div className="text-center">
                    <FaShieldAlt className="text-success me-2" />
                    <small className="text-muted">
                      Your password is encrypted and securely stored
                    </small>
                  </div>
                </div>

                {/* Additional Links */}
                <div className="text-center mt-4">
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/forgot-password" className="text-decoration-none small">
                      <FaArrowLeft className="me-1" />
                      Resend OTP
                    </Link>
                    <span className="text-muted">•</span>
                    <Link to="/login" className="text-decoration-none small">
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;