import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [citizen, setCitizen] = useState(() => ({
    token: localStorage.getItem("citizenToken") || null,
    user: readJSON("citizenUser"),
  }));

  const [admin, setAdmin] = useState(() => ({
    token: localStorage.getItem("adminToken") || null,
    admin: readJSON("adminUser"),
  }));

  const loginCitizen = useCallback((token, user) => {
    localStorage.setItem("citizenToken", token);
    localStorage.setItem("citizenUser", JSON.stringify(user));
    setCitizen({ token, user });
  }, []);

  const logoutCitizen = useCallback(() => {
    localStorage.removeItem("citizenToken");
    localStorage.removeItem("citizenUser");
    setCitizen({ token: null, user: null });
  }, []);

  const loginAdmin = useCallback((token, adminInfo) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(adminInfo));
    setAdmin({ token, admin: adminInfo });
  }, []);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin({ token: null, admin: null });
  }, []);

  const value = {
    citizen,
    admin,
    loginCitizen,
    logoutCitizen,
    loginAdmin,
    logoutAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
