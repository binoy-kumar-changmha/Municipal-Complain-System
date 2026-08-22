import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import TicketCard from "../components/TicketCard";
import { Field, inputClass } from "../components/AuthCard";

const TYPES = [
  "Pothole / Road damage",
  "Streetlight outage",
  "Garbage & sanitation",
  "Water supply",
  "Drainage / Waterlogging",
  "Illegal construction",
  "Noise disturbance",
  "Stray animals",
  "Other",
];

const emptyForm = { name: "", phone: "", type: TYPES[0], description: "", location: "" };

export default function CitizenDashboard() {
  const { citizen, logoutCitizen } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    ...emptyForm,
    name: citizen.user?.name || "",
    phone: citizen.user?.phone || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${citizen.token}` } }),
    [citizen.token]
  );

  const fetchComplaints = async () => {
    setListLoading(true);
    setListError("");
    try {
      const { data } = await api.get("/complain-list", authHeaders);
      if (data.success) {
        const mine = (data.complainList || []).filter(
          (c) => String(c.userId) === String(citizen.user?.id)
        );
        setComplaints(mine);
      } else {
        setListError(data.message || "Couldn't load your tickets.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logoutCitizen();
      }
      setListError(err.response?.data?.message || "Couldn't load your tickets.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setNotice("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/send-complain", form, authHeaders);
      if (data.success) {
        setNotice("Ticket filed. It now shows Pending below.");
        setForm({ ...emptyForm, name: form.name, phone: form.phone });
        fetchComplaints();
      } else {
        setFormError(data.message || "Couldn't file the complaint.");
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't file the complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/complains/${id}`, authHeaders);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setListError(err.response?.data?.message || "Couldn't withdraw that ticket.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
          Resident desk
        </span>
        <h1 className="mt-1.5 font-display text-3xl font-semibold text-ink">
          {citizen.user?.name ? `${citizen.user.name}'s ledger` : "My ledger"}
        </h1>
        <p className="mt-1 text-sm text-slate/70">
          File a new report or check the status of what's already in queue.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* File a complaint */}
        <div className="h-fit rounded-xl border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(24,38,54,0.06)] sm:p-7">
          <h2 className="font-display text-xl font-semibold text-ink">File a new report</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {formError && (
              <p className="rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm font-medium text-rust">
                {formError}
              </p>
            )}
            {notice && (
              <p className="rounded-md border border-forest/30 bg-forest/5 px-3 py-2 text-sm font-medium text-forest">
                {notice}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Your name">
                <input required type="text" className={inputClass} value={form.name} onChange={update("name")} />
              </Field>
              <Field label="Contact phone">
                <input
                  required
                  type="tel"
                  pattern="^01[3-9]\d{8}$"
                  className={inputClass}
                  value={form.phone}
                  onChange={update("phone")}
                />
              </Field>
            </div>
            <Field label="Issue type">
              <select required className={inputClass} value={form.type} onChange={update("type")}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <input
                required
                type="text"
                placeholder="Street, block, or landmark"
                className={inputClass}
                value={form.location}
                onChange={update("location")}
              />
            </Field>
            <Field label="Description">
              <textarea
                required
                rows={4}
                placeholder="What's happening, and since when?"
                className={inputClass}
                value={form.description}
                onChange={update("description")}
              />
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-2 disabled:opacity-60"
            >
              {submitting ? "Filing…" : "File ticket"}
            </button>
          </form>
        </div>

        {/* Tickets list */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">
              My tickets {complaints.length > 0 && `(${complaints.length})`}
            </h2>
            <button
              onClick={fetchComplaints}
              className="font-mono text-xs uppercase tracking-wide text-slate/50 hover:text-ink"
            >
              Refresh
            </button>
          </div>

          {listError && (
            <p className="mb-4 rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm font-medium text-rust">
              {listError}
            </p>
          )}

          {listLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg border border-line bg-paper" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-paper/60 px-6 py-14 text-center">
              <p className="font-display text-lg text-ink">No tickets yet</p>
              <p className="mt-1 text-sm text-slate/60">
                Whatever needs fixing on your street, file it on the left — it'll show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <TicketCard
                  key={c._id}
                  complaint={c}
                  footer={
                    <button
                      onClick={() => handleDelete(c._id)}
                      disabled={deletingId === c._id}
                      className="text-xs font-medium text-rust underline decoration-rust/40 decoration-2 underline-offset-2 hover:decoration-rust disabled:opacity-50"
                    >
                      {deletingId === c._id ? "Withdrawing…" : "Withdraw ticket"}
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
