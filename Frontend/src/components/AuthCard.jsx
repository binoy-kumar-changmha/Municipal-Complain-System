export default function AuthCard({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center px-5 py-14 sm:px-8">
      <div className="w-full max-w-md animate-rise">
        <div className="mb-7 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
            {eyebrow}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate/70">{subtitle}</p>
          )}
        </div>
        <div className="rounded-xl border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(24,38,54,0.06)] sm:p-8">
          {children}
        </div>
        {footer && <div className="mt-5 text-center text-sm text-slate/70">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-rust">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-line bg-parchment/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/40 outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/25";
