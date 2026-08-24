import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthCard, { Field, inputClass } from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import toast from "react-hot-toast";

export default function CitizenLogin() {
  const { loginCitizen } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let toastId = toast.loading("Signing in...");
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.success) {
        toast.success("Welcome back!", { id: toastId });
        loginCitizen(data.token, data.user);
        navigate("/dashboard");
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
      eyebrow={isBn ? "রেসিডেন্ট লগইন (Resident Login)" : "Returning resident"}
      title={isBn ? "স্বাগতম (Welcome back)" : "Welcome back"}
      subtitle={isBn ? "নতুন অভিযোগ করতে বা স্ট্যাটাস দেখতে লগইন করুন।" : "Log in to file a new report or check on open tickets."}
      footer={
        <>
          {isBn ? "নতুন ব্যবহারকারী? " : "New here? "}
          <Link to="/signup" className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-2 hover:text-brass">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="mt-2 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-2 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
