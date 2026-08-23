import { useState } from "react";
import { createPortal } from "react-dom";
import StatusStamp from "./StatusStamp";
import { ImageIcon, X } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  let textDesc = complaint.description || "";
  let imgUrl = null;
  const match = textDesc.match(/\[IMAGE:\s*(.*?)\]/);
  if (match) {
    imgUrl = match[1];
    textDesc = textDesc.replace(match[0], "").trim();
  }

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

        <p className="text-sm leading-relaxed text-slate/90 whitespace-pre-wrap break-words">{textDesc}</p>
        
        <div className="flex gap-2 text-sm mt-1">
          <span className="font-medium text-slate/50">Location:</span>
          <span className="text-slate break-all sm:break-words">{complaint.location}</span>
        </div>

        {imgUrl && (
          <div className="mt-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex w-fit items-center gap-2 rounded-md bg-paper px-3 py-1.5 text-sm font-medium text-slate transition hover:bg-slate/5 border border-line"
            >
              <ImageIcon className="h-4 w-4 text-slate/50" />
              View Photo
            </button>

            {isModalOpen && createPortal(
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-10"
                onClick={() => setIsModalOpen(false)}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-parchment transition hover:bg-paper/20 sm:right-8 sm:top-8"
                >
                  <X className="h-6 w-6" />
                </button>
                <img 
                  src={imgUrl} 
                  alt="Complaint attachment full size" 
                  className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>,
              document.body
            )}
          </div>
        )}

        {(showReporter || footer) && (
          <div className="mt-2 border-t border-dashed border-line pt-3 text-sm">
            {showReporter && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 mb-3">
                <div className="flex gap-2">
                  <span className="font-medium text-slate/50">Reported by:</span>
                  <span className="text-slate">{complaint.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-slate/50">Phone:</span>
                  <span className="text-slate">{complaint.phone}</span>
                </div>
              </div>
            )}
            {footer && <div>{footer}</div>}
          </div>
        )}



      </div>
    </div>
  );
}
