import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import '../../styles/Auth.css';
import { 
  FaEnvelope, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaPaperPlane,
  FaShieldAlt,
  FaKey,
  FaArrowLeft,
  FaMobileAlt,
  FaQuestionCircle
} from "react-icons/fa";
import { GiElectric } from "react-icons/gi";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authAPI.forgotPassword(email);
            if (response.data.success) {
                setSuccess('Password reset instructions have been sent to your email!');
                // ⏳ Navigate to reset password page after 2 seconds
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 2000);
            } else {
                setError(response.data.error || 'Failed to send reset instructions.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            if (error.response?.data?.email) {
                setError(error.response.data.email[0]);
            } else if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Failed to send reset instructions. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            {/* Background Gradient */}
            <div className="forgot-background"></div>
            
            <div className="container-fluid h-100">
                <div className="row align-items-center justify-content-center h-100">
                    {/* Left Side - Instructions & Info */}
                    <div className="col-lg-6 col-md-8 d-none d-lg-block">
                        <div className="forgot-brand-section p-5">
                            <div className="brand-header mb-5">
                                <div className="d-flex align-items-center">
                                    <GiElectric className="text-warning" style={{ fontSize: '4rem' }} />
                                    <div className="ms-4">
                                        <h1 className="display-3 fw-bold text-white mb-1">
                                            Forgot <span className="text-warning">Password</span>
                                        </h1>
                                        <p className="text-light opacity-75 fs-5">
                                            Secure Account Recovery
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="instructions-list mb-5">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="instruction-icon bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                                        <FaEnvelope className="text-primary fs-2" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold text-white mb-1">Enter Your Email</h4>
                                        <p className="text-light opacity-75 mb-0">
                                            Provide your registered email address
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-4">
                                    <div className="instruction-icon bg-success bg-opacity-10 p-3 rounded-circle me-4">
                                        <FaMobileAlt className="text-success fs-2" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold text-white mb-1">Receive OTP</h4>
                                        <p className="text-light opacity-75 mb-0">
                                            Check your email for the 6-digit OTP
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center">
                                    <div className="instruction-icon bg-warning bg-opacity-10 p-3 rounded-circle me-4">
                                        <FaKey className="text-warning fs-2" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold text-white mb-1">Set New Password</h4>
                                        <p className="text-light opacity-75 mb-0">
                                            Create a strong new password
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Tips */}
                            <div className="security-tips p-4 bg-dark bg-opacity-25 rounded-3 border-start border-3 border-info">
                                <h4 className="fw-bold text-white mb-3">
                                    <FaShieldAlt className="me-2 text-info" />
                                    Account Security Tips
                                </h4>
                                <ul className="text-light opacity-75 mb-0 ps-3">
                                    <li className="mb-2">Use a unique password for your Smart Ride account</li>
                                    <li className="mb-2">Regularly update your password every 3-6 months</li>
                                    <li className="mb-2">Never share your OTP with anyone</li>
                                    <li>Contact support immediately if you suspect unauthorized access</li>
                                </ul>
                            </div>

                            {/* Support Info */}
                            <div className="support-info mt-5 pt-4">
                                <div className="d-flex align-items-center">
                                    <FaQuestionCircle className="text-light opacity-75 me-3" style={{ fontSize: '1.5rem' }} />
                                    <div>
                                        <h5 className="fw-bold text-white mb-1">Need Help?</h5>
                                        <p className="text-light opacity-75 mb-0">
                                            Contact our support team at support@smartride.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Forgot Password Form */}
                    <div className="col-lg-4 col-md-8">
                        <div className="forgot-form-container">
                            <div className="forgot-form-card p-4 p-md-5">
                                {/* Back to Login */}
                                <div className="mb-4">
                                    <button
                                        className="btn btn-link text-decoration-none d-flex align-items-center p-0"
                                        onClick={() => navigate('/login')}
                                    >
                                        <FaArrowLeft className="me-2" />
                                        <span className="text-light opacity-75">Back to Login</span>
                                    </button>
                                </div>

                                {/* Logo & Header */}
                                <div className="text-center mb-4">
                                    <div className="forgot-logo mb-4">
                                        <FaKey className="text-warning" style={{ fontSize: '3.5rem' }} />
                                    </div>
                                    <h2 className="fw-bold text-white mb-2">
                                        Forgot Password?
                                    </h2>
                                    <p className="text-light opacity-75">
                                        Enter your email to reset your password
                                    </p>
                                </div>

                                {/* Messages */}
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center fade-in-slow mb-4">
                                        <FaExclamationCircle className="me-2" />
                                        <span className="text-white">{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success d-flex align-items-center slide-down mb-4">
                                        <FaCheckCircle className="me-2" />
                                        <span className="text-white">{success}</span>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="fade-in">
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your registered email"
                                                required
                                                disabled={loading}
                                                className="form-control form-control-lg border-start-0"
                                            />
                                        </div>
                                        <small className="text-light opacity-75 mt-2 d-block">
                                            We'll send a 6-digit OTP to this email address
                                        </small>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold forgot-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="fa-spin me-2" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="me-2" />
                                                Send Reset Instructions
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Additional Info */}
                                <div className="additional-info mt-4 pt-3 border-top border-light border-opacity-25">
                                    <div className="text-center">
                                        <FaShieldAlt className="text-success me-2" />
                                        <small className="text-light opacity-75">
                                            Your email is secure and will only be used for password reset
                                        </small>
                                    </div>
                                </div>

                                {/* Already Remember? */}
                                <div className="text-center mt-4">
                                    <p className="text-light opacity-75 mb-3">
                                        Remember your password?
                                    </p>
                                    <button
                                        className="btn btn-outline-light w-100 py-2"
                                        onClick={() => navigate('/login')}
                                    >
                                        Back to Login
                                    </button>
                                </div>

                                {/* Didn't Receive? */}
                                <div className="text-center mt-3">
                                    <small className="text-light opacity-75">
                                        Didn't receive email?{' '}
                                        <button
                                            className="btn btn-link p-0 text-decoration-none"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            <span className="text-light opacity-75">Resend OTP</span>
                                        </button>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;