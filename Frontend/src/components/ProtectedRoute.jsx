import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function CitizenRoute({ children }) {
  const { citizen } = useAuth();
  if (!citizen.token) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { admin } = useAuth();
  if (!admin.token) return <Navigate to="/admin/login" replace />;
  return children;
}
