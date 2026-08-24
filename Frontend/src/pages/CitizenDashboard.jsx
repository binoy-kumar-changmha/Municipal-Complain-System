import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import TicketCard from "../components/TicketCard";
import { Field, inputClass } from "../components/AuthCard";
import { UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";

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

  const [form, setForm] = useState({
    ...emptyForm,
    name: citizen.user?.name || "",
    phone: citizen.user?.phone || "",
  });
  
  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${citizen.token}` } }),
    [citizen.token]
  );

  const fetchComplaints = async () => {
    setListLoading(true);
    try {
      const { data } = await api.get("/complain-list", authHeaders);
      if (data.success) {
        const mine = (data.complainList || []).filter(
          (c) => String(c.userId) === String(citizen.user?.id)
        );
        setComplaints(mine);
      } else {
        toast.error(data.message || "Couldn't load your tickets.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logoutCitizen();
      }
      toast.error(err.response?.data?.message || "Couldn't load your tickets.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleDragOver = (e) => e.preventDefault();

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key is missing in .env (VITE_IMGBB_API_KEY)");
    
    const formData = new FormData();
    formData.append("image", file);
    
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let toastId;
    try {
      let finalDescription = form.description;
      if (imageFile) {
        toastId = toast.loading("Uploading image...");
        const imgUrl = await uploadImageToImgBB(imageFile);
        finalDescription += `\n\n[IMAGE: ${imgUrl}]`;
        toast.dismiss(toastId);
        toastId = toast.loading("Filing ticket...");
      } else {
        toastId = toast.loading("Filing ticket...");
      }

      const payload = { ...form, description: finalDescription };
      const { data } = await api.post("/send-complain", payload, authHeaders);
      
      if (data.success) {
        toast.success("Ticket filed. It now shows Pending below.", { id: toastId });
        setForm({ ...emptyForm, name: form.name, phone: form.phone });
        removeImage();
        fetchComplaints();
      } else {
        toast.error(data.message || "Couldn't file the complaint.", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || "Couldn't file the complaint.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const toastId = toast.loading("Withdrawing ticket...");
    try {
      await api.delete(`/complains/${id}`, authHeaders);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      toast.success("Ticket withdrawn", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't withdraw that ticket.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="mt-1.5 font-display text-3xl font-semibold text-ink">
          {citizen.user?.name ? `${citizen.user.name}'s ledger` : "My ledger"}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* File a complaint */}
        <div className="h-fit rounded-xl border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(24,38,54,0.06)] sm:p-7">
          <h2 className="font-display text-xl font-semibold text-ink">File a new report</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input readOnly type="text" className={`${inputClass} bg-slate/5 opacity-70 cursor-not-allowed`} value={form.name} />
              </Field>
              <Field label="Contact phone">
                <input
                  readOnly
                  type="tel"
                  className={`${inputClass} bg-slate/5 opacity-70 cursor-not-allowed`}
                  value={form.phone}
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
            
            <Field label="Attach Photo (Optional)">
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative mt-1 flex justify-center rounded-lg border border-dashed border-line px-6 py-6 transition-colors hover:border-brass focus:outline-none"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-md object-contain" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rust text-white shadow-sm hover:bg-rust/90"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-slate/40" />
                    <div className="mt-2 flex text-sm leading-6 text-slate/60">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-paper font-semibold text-brass focus-within:outline-none hover:text-brass-light"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-slate/50">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-2 disabled:opacity-60"
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
                      className="rounded-md border border-rust px-3 py-1.5 text-sm font-medium text-rust transition hover:bg-rust/5 disabled:opacity-50"
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

