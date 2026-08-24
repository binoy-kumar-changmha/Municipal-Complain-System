import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthCard, { Field, inputClass } from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import toast from "react-hot-toast";

export default function CitizenSignup() {
  const { loginCitizen } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let toastId = toast.loading("Opening account...");
    try {
      const { data } = await api.post("/auth/sign-up", form);
      if (data.success) {
        toast.success("Account created!", { id: toastId });
        loginCitizen(data.token, { ...data.user, name: form.name });
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Signup failed. Please try again.", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      eyebrow={isBn ? "নতুন রেসিডেন্ট (New Resident)" : "New resident"}
      title={isBn ? "নতুন অ্যাকাউন্ট খুলুন" : "Open a ledger account"}
      subtitle={isBn ? "অভিযোগ জানাতে অ্যাকাউন্ট তৈরি করুন।" : "Register to file and track complaints with your municipality."}
      footer={
        <>
          {isBn ? "ইতিমধ্যেই অ্যাকাউন্ট আছে? " : "Already registered? "}
          <Link to="/login" className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-2 hover:text-brass">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <PasswordInput
            required
            minLength={6}
            placeholder="At least 6 characters"
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
