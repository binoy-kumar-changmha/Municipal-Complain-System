import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
        Ticket not found
      </span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">404</h1>
      <p className="mt-2 text-sm text-slate/70">
        This page never made it into the ledger.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-2"
      >
        Back to CivicDesk
      </Link>
    </div>
  );
}
