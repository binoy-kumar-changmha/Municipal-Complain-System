import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import TicketCard from "../components/TicketCard";

const FILTERS = ["All", "Pending", "Accepted", "Resolved", "Rejected"];

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [filter, setFilter] = useState("All");

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${admin.token}` } }),
    [admin.token]
  );

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/complain-list/Admin", authHeaders);
      if (data.success) {
        setComplaints(data.complainList || []);
      } else {
        setError(data.message || "Couldn't load the ledger.");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutAdmin();
      }
      setError(err.response?.data?.message || "Couldn't load the ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      const { data } = await api.patch(`/complains/${id}/accept`, {}, authHeaders);
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: "Accepted" } : c))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't accept that ticket.");
    } finally {
      setAcceptingId(null);
    }
  };

  const counts = useMemo(() => {
    const base = { All: complaints.length, Pending: 0, Accepted: 0, Resolved: 0, Rejected: 0 };
    complaints.forEach((c) => {
      if (base[c.status] !== undefined) base[c.status] += 1;
    });
    return base;
  }, [complaints]);

  const visible = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
            Municipal staff
          </span>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-ink">
            Ward ledger
          </h1>
          <p className="mt-1 text-sm text-slate/70">
            Every ticket filed across the district, newest first.
          </p>
        </div>
        <button
          onClick={fetchComplaints}
          className="font-mono text-xs uppercase tracking-wide text-slate/50 hover:text-ink"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "border-ink bg-ink text-parchment"
                : "border-line bg-paper text-slate hover:border-ink/30"
            }`}
          >
            {f}
            <span className="ml-1.5 font-mono text-xs opacity-60">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm font-medium text-rust">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border border-line bg-paper" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-paper/60 px-6 py-14 text-center">
          <p className="font-display text-lg text-ink">Nothing here</p>
          <p className="mt-1 text-sm text-slate/60">
            No tickets currently match "{filter}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((c) => (
            <TicketCard
              key={c._id}
              complaint={c}
              showReporter
              footer={
                c.status === "Pending" ? (
                  <button
                    onClick={() => handleAccept(c._id)}
                    disabled={acceptingId === c._id}
                    className="rounded-full bg-forest px-4 py-1.5 text-xs font-medium text-parchment transition hover:bg-forest-light disabled:opacity-60"
                  >
                    {acceptingId === c._id ? "Accepting…" : "Accept ticket"}
                  </button>
                ) : (
                  <span className="font-mono text-xs text-slate/40">
                    No further action needed
                  </span>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
