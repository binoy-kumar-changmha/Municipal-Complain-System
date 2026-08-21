const STYLES = {
  Pending: "border-brass text-brass",
  Accepted: "border-forest text-forest",
  Resolved: "border-forest text-forest",
  Rejected: "border-rust text-rust",
};

export default function StatusStamp({ status }) {
  const cls = STYLES[status] || STYLES.Pending;
  return (
    <span
      className={`stamp inline-block shrink-0 rounded-sm border-[2.5px] px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] ${cls}`}
      style={{ mixBlendMode: "multiply" }}
    >
      {status}
    </span>
  );
}
