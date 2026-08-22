import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthCard, { Field, inputClass } from "../components/AuthCard";

export default function CitizenSignup() {
  const { loginCitizen } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/sign-up", form);
      if (data.success) {
        loginCitizen(data.token, { ...data.user, name: form.name });
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      eyebrow="New resident"
      title="Open a ledger account"
      subtitle="Register to file and track complaints with your municipality."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-2 hover:text-brass">
            Log in
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
        <Field label="Full name">
          <input
            required
            type="text"
            placeholder="Jamal Uddin"
            className={inputClass}
            value={form.name}
            onChange={update("name")}
          />
        </Field>
        <Field label="Phone number">
          <input
            required
            type="tel"
            placeholder="01XXXXXXXXX"
            pattern="^01[3-9]\d{8}$"
            title="Enter a valid 11-digit phone number, e.g. 01812345678"
            className={inputClass}
            value={form.phone}
            onChange={update("phone")}
          />
        </Field>
        <Field label="Password">
          <input
            required
            type="password"
            minLength={6}
            placeholder="At least 6 characters"
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
          {loading ? "Opening account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
