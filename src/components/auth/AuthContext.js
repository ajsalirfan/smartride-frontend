import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

// 🌍 Backend API Base URL
const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/";

// ⚙️ Create Auth Context
const AuthContext = createContext();

// 🔐 Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("unknown"); // pending | approved | rejected | unknown

  // ==============================
  // 🔁 TOKEN REFRESH FUNCTION
  // ==============================
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return logout();

    try {
      const res = await axios.post(`${API_BASE}api/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccess = res.data.access;
      localStorage.setItem("accessToken", newAccess);
      setToken(newAccess);
      return newAccess;
    } catch (err) {
      console.error("⚠️ Token refresh failed:", err);
      logout();
    }
  }, [refreshToken]);

  // ==============================
  // 👤 LOAD USER INFO
  // ==============================
  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setRole(null);
      setVerificationStatus("unknown");
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE}users/profile/`, { headers });
      setUser(res.data);
      setRole(res.data.user_type || "user");

      // ✅ Get verification status
      if (res.data.is_verified) {
        setVerificationStatus("approved");
      } else {
        const verifyRes = await axios.get(`${API_BASE}users/verification/status/`, { headers });
        setVerificationStatus(verifyRes.data.verification_status || "pending");
      }
    } catch (err) {
      console.warn("⚠️ Failed to load user, trying token refresh...");
      await refreshAccessToken();
    } finally {
      setLoading(false);
    }
  }, [token, refreshAccessToken]);

  // ==============================
  // 🔓 LOGIN FUNCTION
  // ==============================
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}users/login/`, { email, password });
      const { access, refresh, user, role: userRole } = res.data.tokens
        ? {
            access: res.data.tokens.access,
            refresh: res.data.tokens.refresh,
            user: res.data.user,
            role: res.data.user.user_type || "user",
          }
        : { access: res.data.access, refresh: res.data.refresh, user: res.data.user, role: "user" };

      setToken(access);
      setRefreshToken(refresh);
      setUser(user);
      setRole(userRole);

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("role", userRole);

      await loadUser();
      return { success: true, role: userRole };
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      return { success: false, message: "Invalid credentials" };
    }
  };

  // ==============================
  // 🚪 LOGOUT FUNCTION
  // ==============================
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setRefreshToken(null);
    setVerificationStatus("unknown");
    localStorage.clear();
  };

  // ==============================
  // 🧠 AUTO LOAD ON STARTUP
  // ==============================
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        refreshToken,
        loading,
        login,
        logout,
        verificationStatus,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🪄 Easy Hook
export const useAuth = () => useContext(AuthContext);
