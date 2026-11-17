import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StaffProfile() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: ""
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get CSRF token from Django
  const getCsrfToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return token ? token.split('=')[1] : '';
  };

  // ================= LOGOUT FUNCTION =================
  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfToken();
      await fetch("http://localhost:8000/staffwork/legacy/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include"
      });
    } catch (error) {
      console.log("Logout API failed, continuing with client-side logout");
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  // ================= AUTHENTICATION CHECK =================
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      if (!user.user_type || user.user_type !== "staff") {
        localStorage.clear();
        navigate("/login");
        return;
      }
      
      setStaff(user);
      // Initialize form data with current user info
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || ""
      });
      setLoading(false);
      
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  // ================= FETCH LATEST PROFILE DATA =================
  const fetchProfileData = async () => {
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch("http://localhost:8000/staffwork/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data fetched:", data);
        
        if (data.user) {
          // Update local state
          setStaff(data.user);
          setFormData({
            first_name: data.user.first_name || "",
            last_name: data.user.last_name || "",
            email: data.user.email || "",
            username: data.user.username || ""
          });
          
          // Update localStorage
          localStorage.setItem("user", JSON.stringify({
            ...JSON.parse(localStorage.getItem("user")),
            ...data.user,
            user_type: "staff"
          }));
        }
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const csrfToken = getCsrfToken();
      const response = await fetch("http://localhost:8000/staffwork/profile/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        
        // Update staff state with new data
        if (data.user) {
          setStaff(data.user);
          
          // Update localStorage
          localStorage.setItem("user", JSON.stringify({
            ...JSON.parse(localStorage.getItem("user")),
            ...data.user,
            user_type: "staff"
          }));
        }
        
        // Refresh profile data
        fetchProfileData();
        
        // Clear form after successful update
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
      console.error("Update error:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrorMessage("New passwords do not match");
      setLoadingPassword(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      setLoadingPassword(false);
      return;
    }

    try {
      const csrfToken = getCsrfToken();
      const response = await fetch("http://localhost:8000/staffwork/profile/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password changed successfully!");
        
        // Clear password form
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(data.error || "Failed to change password");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
      console.error("Password change error:", error);
    } finally {
      setLoadingPassword(false);
    }
  };

  // ================= HANDLE INPUT CHANGES =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-light justify-content-center align-items-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading profile...</p>
      </div>
    );
  }

  // ================= MAIN RENDER =================
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* ================= NAVBAR (SAME AS DASHBOARD) ================= */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <button 
            className="navbar-brand fw-bold d-flex align-items-center btn btn-link text-white p-0"
            onClick={() => navigate("/staff/panel")}
            style={{ textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </button>
          
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              <i className="bi bi-person-circle me-1"></i>
              {staff?.username}
            </span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          {/* Profile Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary p-3 me-4">
                      <i className="bi bi-person-fill text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <div>
                      <h1 className="fw-bold mb-1">
                        {staff?.first_name} {staff?.last_name}
                      </h1>
                      <p className="text-muted mb-0">Staff Profile</p>
                      <div className="d-flex gap-3 mt-2">
                        <span className="badge bg-primary">
                          <i className="bi bi-person-badge me-1"></i> Staff
                        </span>
                        <span className="badge bg-secondary">
                          <i className="bi bi-calendar me-1"></i> Joined: {staff?.date_joined}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="row">
            <div className="col-lg-3 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    <button
                      className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile Information
                    </button>
                    <button
                      className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'password' ? 'active' : ''}`}
                      onClick={() => setActiveTab('password')}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              {/* Messages */}
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mb-4">
                  <i className="bi bi-check-circle me-2"></i>
                  {successMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSuccessMessage("")}
                  ></button>
                </div>
              )}
              
              {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show mb-4">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {errorMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setErrorMessage("")}
                  ></button>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0">
                      <i className="bi bi-person-lines-fill me-2"></i>
                      Profile Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleUpdateProfile}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-envelope me-1"></i> Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-person-badge me-1"></i> Username
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                // Reset form to original values
                                setFormData({
                                  first_name: staff?.first_name || "",
                                  last_name: staff?.last_name || "",
                                  email: staff?.email || "",
                                  username: staff?.username || ""
                                });
                              }}
                            >
                              <i className="bi bi-arrow-clockwise me-1"></i> Reset
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={loadingProfile}
                            >
                              {loadingProfile ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i> Update Profile
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Read-only Info */}
                    <div className="mt-5 pt-4 border-top">
                      <h6 className="text-muted mb-3">Account Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">User ID</small>
                          <p className="mb-0">{staff?.id}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Account Type</small>
                          <p className="mb-0">
                            <span className="badge bg-primary">Staff</span>
                          </p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Date Joined</small>
                          <p className="mb-0">{staff?.date_joined || "N/A"}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Last Login</small>
                          <p className="mb-0">{staff?.last_login || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0">
                      <i className="bi bi-shield-lock me-2"></i>
                      Change Password
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleChangePassword}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">
                            <i className="bi bi-lock me-1"></i> Current Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-key me-1"></i> New Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            required
                            minLength="8"
                          />
                          <small className="form-text text-muted">
                            Must be at least 8 characters long
                          </small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-key-fill me-1"></i> Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            required
                            minLength="8"
                          />
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                setPasswordData({
                                  current_password: "",
                                  new_password: "",
                                  confirm_password: ""
                                });
                              }}
                            >
                              <i className="bi bi-x-circle me-1"></i> Clear
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={loadingPassword}
                            >
                              {loadingPassword ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Changing Password...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-shield-check me-1"></i> Change Password
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Password Tips */}
                    <div className="mt-5 pt-4 border-top">
                      <h6 className="text-muted mb-3">
                        <i className="bi bi-lightbulb me-2"></i> Password Tips
                      </h6>
                      <ul className="list-unstyled text-muted">
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Use at least 8 characters
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Include numbers and special characters
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Don't reuse old passwords
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Avoid common words and patterns
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <small>© {new Date().getFullYear()} SmartRide Staff Portal</small>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Secure Profile • Last updated: Just now
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}