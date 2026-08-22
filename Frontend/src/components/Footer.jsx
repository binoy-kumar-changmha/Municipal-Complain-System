export default function Footer() {
  return (
    <footer className="border-t border-line/80 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-slate/50 sm:flex-row sm:px-8">
        <p>CivicDesk — Municipal Complaint System</p>
        <p className="font-mono">Ledger closes nightly at 23:59</p>
      </div>
    </footer>
  );
}
