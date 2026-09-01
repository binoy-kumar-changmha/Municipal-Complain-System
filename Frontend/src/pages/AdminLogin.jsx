import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthCard, { Field, inputClass } from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let toastId = toast.loading("Signing in...");
    try {
      const { data } = await api.post("/login/Admin", form);
      if (data.success) {
        toast.success("Welcome, Admin!", { id: toastId });
        loginAdmin(data.token, data.admin);
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message || "Login failed. Please try again.", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      eyebrow="Municipal staff"
      title="Staff sign-in"
      subtitle="Access the full ward ledger and work incoming tickets."
      footer={
        <Link to="/" className="font-medium text-slate/60 hover:text-ink">
          ← Back to CivicDesk
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Work email">
          <input
            required
            type="email"
            placeholder="you@municipality.gov"
            className={inputClass}
            value={form.email}
            onChange={update("email")}
          />
        </Field>
        <Field label="Password">
          <PasswordInput
            required
            placeholder="••••••••"
            value={form.password}
            onChange={update("password")}
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-md bg-brass py-2.5 text-sm font-medium text-ink transition hover:bg-brass-light disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in to the ledger"}
        </button>
      </form>
    </AuthCard>
  );
}
