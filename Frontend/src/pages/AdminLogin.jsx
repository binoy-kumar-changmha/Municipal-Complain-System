import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthCard, { Field, inputClass } from "../components/AuthCard";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/login/Admin", form);
      if (data.success) {
        loginAdmin(data.token, data.admin);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
        {error && (
          <p className="rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm font-medium text-rust">
            {error}
          </p>
        )}
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
          <input
            required
            type="password"
            placeholder="••••••••"
            className={inputClass}
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
