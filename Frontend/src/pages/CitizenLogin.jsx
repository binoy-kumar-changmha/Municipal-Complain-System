import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthCard, { Field, inputClass } from "../components/AuthCard";

export default function CitizenLogin() {
  const { loginCitizen } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.success) {
        loginCitizen(data.token, data.user);
        navigate("/dashboard");
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
      eyebrow="Returning resident"
      title="Welcome back"
      subtitle="Log in to file a new report or check on open tickets."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-2 hover:text-brass">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm font-medium text-rust">
            {error}
          </p>
        )}
        <Field label="Phone number">
          <input
            required
            type="tel"
            placeholder="01XXXXXXXXX"
            className={inputClass}
            value={form.phone}
            onChange={update("phone")}
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
          className="mt-2 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-2 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
