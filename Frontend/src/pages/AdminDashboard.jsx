import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import TicketCard from "../components/TicketCard";
import toast from "react-hot-toast";

const FILTERS = ["All", "Pending", "Accepted", "Resolved", "Rejected"];

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);
  const [filter, setFilter] = useState("All");

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${admin.token}` } }),
    [admin.token]
  );

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/complain-list/Admin", authHeaders);
      if (data.success) {
        setComplaints(data.complainList || []);
      } else {
        toast.error(data.message || "Couldn't load the ledger.");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutAdmin();
      }
      toast.error(err.response?.data?.message || "Couldn't load the ledger.");
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
    const toastId = toast.loading("Accepting ticket...");
    try {
      const { data } = await api.patch(`/complains/${id}/accept`, {}, authHeaders);
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: "Accepted" } : c))
        );
        toast.success("Ticket accepted", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't accept that ticket.", { id: toastId });
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (id) => {
    setRejectingId(id);
    const toastId = toast.loading("Rejecting ticket...");
    try {
      const { data } = await api.patch(`/complains/${id}/reject`, {}, authHeaders);
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: "Rejected" } : c))
        );
        toast.success("Ticket rejected", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't reject that ticket.", { id: toastId });
    } finally {
      setRejectingId(null);
    }
  };

  const handleResolve = async (id) => {
    setResolvingId(id);
    const toastId = toast.loading("Resolving ticket...");
    try {
      const { data } = await api.patch(`/complains/${id}/resolve`, {}, authHeaders);
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: "Resolved" } : c))
        );
        toast.success("Ticket resolved", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't resolve that ticket.", { id: toastId });
    } finally {
      setResolvingId(null);
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
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAccept(c._id)}
                      disabled={acceptingId === c._id || rejectingId === c._id}
                      className="rounded-full bg-forest px-4 py-1.5 text-xs font-medium text-parchment transition hover:bg-forest-light disabled:opacity-60"
                    >
                      {acceptingId === c._id ? "Accepting…" : "Accept ticket"}
                    </button>
                    <button
                      onClick={() => handleReject(c._id)}
                      disabled={acceptingId === c._id || rejectingId === c._id}
                      className="rounded-full border border-rust text-rust px-4 py-1.5 text-xs font-medium transition hover:bg-rust/5 disabled:opacity-60"
                    >
                      {rejectingId === c._id ? "Rejecting…" : "Reject ticket"}
                    </button>
                  </div>
                ) : c.status === "Accepted" ? (
                  <button
                    onClick={() => handleResolve(c._id)}
                    disabled={resolvingId === c._id}
                    className="rounded-full bg-brass px-4 py-1.5 text-xs font-medium text-ink transition hover:bg-brass-light disabled:opacity-60"
                  >
                    {resolvingId === c._id ? "Resolving…" : "Resolve ticket"}
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
