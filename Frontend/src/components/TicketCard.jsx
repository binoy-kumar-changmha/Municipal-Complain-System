import StatusStamp from "./StatusStamp";

function ticketNumber(id) {
  if (!id) return "------";
  return id.slice(-6).toUpperCase();
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketCard({ complaint, footer, showReporter = false }) {
  return (
    <div className="animate-rise flex overflow-hidden rounded-lg border border-line bg-paper shadow-[0_1px_2px_rgba(24,38,54,0.06)]">
      {/* stub */}
      <div className="ticket-notch flex w-16 shrink-0 flex-col items-center justify-between border-r-2 border-dashed border-line/80 bg-ink py-3 text-parchment sm:w-20">
        <span className="font-display text-[10px] uppercase tracking-[0.2em] text-parchment/60">
          No.
        </span>
        <span className="font-mono text-sm font-semibold tracking-wider [writing-mode:vertical-rl] sm:text-base">
          {ticketNumber(complaint._id)}
        </span>
        <span className="h-2 w-2 rounded-full bg-brass" />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-ink sm:text-xl">
              {complaint.type}
            </p>
            <p className="mt-0.5 font-mono text-xs text-slate/60">
              Filed {formatDate(complaint.createdAt)}
            </p>
          </div>
          <StatusStamp status={complaint.status} />
        </div>

        <p className="text-sm leading-relaxed text-slate/90">{complaint.description}</p>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-dashed border-line pt-3 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="font-medium text-slate/50">Location</dt>
            <dd className="text-slate">{complaint.location}</dd>
          </div>
          {showReporter && (
            <>
              <div className="flex gap-2">
                <dt className="font-medium text-slate/50">Reported by</dt>
                <dd className="text-slate">{complaint.name}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-slate/50">Phone</dt>
                <dd className="text-slate">{complaint.phone}</dd>
              </div>
            </>
          )}
        </dl>

        {footer && <div className="pt-1">{footer}</div>}
      </div>
    </div>
  );
}
