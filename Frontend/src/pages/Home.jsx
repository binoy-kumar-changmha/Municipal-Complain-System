import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  {
    n: "File",
    title: "Describe the issue",
    body: "A broken streetlight, an overflowing bin, a pothole that's grown teeth — tell us what, and exactly where.",
  },
  {
    n: "Track",
    title: "Get a ticket number",
    body: "Every report becomes a numbered stub in your ledger, stamped Pending the moment it lands.",
  },
  {
    n: "Resolve",
    title: "Watch the stamp change",
    body: "Municipal staff review, accept, and work the ticket. You'll see the stamp update — no phone tag required.",
  },
];

export default function Home() {
  const { citizen } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
              Office of Public Works · Ward Ledger
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              File it once.
              <br />
              <span className="italic text-brass">Watch</span> it get fixed.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate/80 sm:text-lg">
              CivicDesk turns every pothole, outage, and overflowing bin into a
              numbered ticket your municipality can't lose — and you can
              actually track.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={citizen.token ? "/dashboard" : "/signup"}
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-parchment shadow-sm transition hover:bg-ink-2"
              >
                {citizen.token ? "Go to my desk" : "Report an issue"}
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-ink underline decoration-brass decoration-2 underline-offset-4 hover:text-brass"
              >
                I already have an account
              </Link>
            </div>
          </div>

          {/* Signature element: a fanned stack of ticket stubs */}
          <div className="relative mx-auto h-72 w-full max-w-sm sm:h-80">
            <TicketStub
              className="absolute left-2 top-6 -rotate-6"
              status="Pending"
              label="STREETLIGHT"
              num="A4C21F"
            />
            <TicketStub
              className="absolute left-1/2 top-0 -translate-x-1/2 rotate-2"
              status="Accepted"
              label="POTHOLE"
              num="B119E2"
            />
            <TicketStub
              className="absolute right-2 top-10 rotate-8"
              status="Resolved"
              label="SANITATION"
              num="C90DA6"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line/80 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            How a report moves through the ledger
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="border-l-2 border-brass/70 pl-5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
                  {s.n}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate/75">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff callout */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-line bg-ink px-6 py-8 text-parchment sm:flex-row sm:items-center sm:px-10">
          <div>
            <h3 className="font-display text-xl font-semibold sm:text-2xl">
              Work the queue as municipal staff
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-parchment/70">
              Review every open ticket across the ward and accept the ones
              your crews are dispatching to.
            </p>
          </div>
          <Link
            to="/admin/login"
            className="shrink-0 rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-brass-light"
          >
            Staff sign-in
          </Link>
        </div>
      </section>
    </div>
  );
}

function TicketStub({ className, status, label, num }) {
  const stampColor =
    status === "Pending"
      ? "text-brass border-brass"
      : status === "Accepted"
      ? "text-forest border-forest"
      : "text-forest border-forest";
  return (
    <div
      className={`w-52 rounded-lg border border-line bg-paper p-4 shadow-[0_8px_24px_rgba(24,38,54,0.12)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-slate/40">#{num}</span>
        <span
          className={`stamp rounded-sm border-2 px-1.5 py-0.5 font-display text-[9px] font-semibold uppercase tracking-wider ${stampColor}`}
        >
          {status}
        </span>
      </div>
      <p className="mt-3 font-display text-sm font-semibold text-ink">
        {label}
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-line/70">
        <div
          className="h-1.5 rounded-full bg-brass"
          style={{
            width: status === "Pending" ? "20%" : status === "Accepted" ? "60%" : "100%",
          }}
        />
      </div>
    </div>
  );
}
