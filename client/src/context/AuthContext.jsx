import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Set base URL for all API calls
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

const AuthContext = createContext(null);

function setAxiosToken(token) {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("ss_token");
    const storedUser = localStorage.getItem("ss_user");
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.role) {
          setToken(storedToken);
          setUser(parsed);
          setAxiosToken(storedToken);
        } else {
          localStorage.removeItem("ss_token");
          localStorage.removeItem("ss_user");
        }
      } catch {
        localStorage.removeItem("ss_token");
        localStorage.removeItem("ss_user");
      }
    }
    setInitialized(true);
  }, []);

  const _saveSession = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("ss_token", token);
    localStorage.setItem("ss_user", JSON.stringify(user));
    setAxiosToken(token);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      if (!data.user?.role) return { success: false, message: "Invalid account data." };
      _saveSession(data.token, data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", { name, email, password });
      _saveSession(data.token, data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ss_token");
    localStorage.removeItem("ss_user");
    setAxiosToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, initialized, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);