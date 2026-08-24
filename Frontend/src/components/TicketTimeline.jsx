import { CheckCircle2, Circle, XCircle } from "lucide-react";

export default function TicketTimeline({ status }) {
  // Define the active step index based on status
  let stepIndex = 0;
  if (status === "Accepted") stepIndex = 1;
  if (status === "Resolved") stepIndex = 2;
  if (status === "Rejected") stepIndex = 1; // Rejected replaces Accepted in flow

  const isRejected = status === "Rejected";

  const steps = [
    { label: "Pending" },
    { label: isRejected ? "Rejected" : "Accepted" },
    ...(isRejected ? [] : [{ label: "Resolved" }]),
  ];

  return (
    <div className="mt-5 w-full">
      <div className="flex items-center justify-between relative z-10">
        {steps.map((step, idx) => {
          const isActive = idx === stepIndex;
          const isComplete = idx < stepIndex;

          let Icon = Circle;
          let iconColor = "text-slate/30";
          let labelColor = "text-slate/40";
          let bgColor = "bg-paper";

          if (isComplete) {
            Icon = CheckCircle2;
            iconColor = "text-forest";
            labelColor = "text-forest font-medium";
          } else if (isActive) {
            Icon = isRejected ? XCircle : Circle;
            iconColor = isRejected ? "text-rust" : "text-ink";
            labelColor = isRejected ? "text-rust font-semibold" : "text-ink font-semibold";
            if (isActive && !isRejected) {
              // we can use a filled dot for active non-rejected
              bgColor = "bg-ink";
            }
          }

          return (
            <div key={step.label} className="flex flex-col items-center bg-paper px-2">
              <div className="flex h-6 w-6 items-center justify-center">
                {isActive && !isRejected ? (
                  <div className={`h-3 w-3 rounded-full ${bgColor} shadow-sm ring-4 ring-ink/10`} />
                ) : (
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                )}
              </div>
              <span className={`mt-2 text-[10px] uppercase tracking-wider ${labelColor}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connecting Lines (Absolute positioned behind steps) */}
      <div className="relative -mt-[34px] px-8 mb-6 z-0">
        <div className="flex items-center w-full h-[2px]">
          {steps.map((_, idx) => {
            if (idx === steps.length - 1) return null;
            const isLineActive = idx < stepIndex;
            return (
              <div
                key={idx}
                className={`h-full flex-1 ${
                  isLineActive ? (isRejected && idx === 0 ? "bg-rust/40" : "bg-forest/40") : "bg-line/60"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
