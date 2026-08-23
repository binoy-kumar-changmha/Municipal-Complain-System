import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const STEPS = [
    {
      n: "Step 1",
      title: isBn ? "সমস্যাটি বর্ণনা করুন" : "Describe the issue",
      body: isBn ? "রাস্তার সমস্যা, ময়লা বা অন্যান্য সমস্যা কোথায় হয়েছে তা আমাদের জানান।" : "A broken streetlight, an overflowing bin, a pothole that's grown teeth — tell us what, and exactly where.",
    },
    {
      n: "Step 2",
      title: isBn ? "টিকিট নম্বর পান" : "Get a ticket number",
      body: isBn ? "আপনার অভিযোগটি জমা দেওয়ার সাথে সাথে একটি ট্র্যাকিং নম্বর পাবেন।" : "Every report becomes a numbered stub in your ledger, stamped Pending the moment it lands.",
    },
    {
      n: "Step 3",
      title: isBn ? "সমাধান ট্র্যাক করুন" : "Watch the stamp change",
      body: isBn ? "কর্মকর্তারা কাজ শুরু করলে আপনার টিকিটের স্ট্যাটাস আপডেট হবে।" : "Municipal staff review, accept, and work the ticket. You'll see the stamp update — no phone tag required.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-7xl">
              {isBn ? (
                <>
                  পৌরসভা এখন
                  <br />
                  <span className="text-slate/40">
                    আপনার হাতের
                    <br />
                    মুঠোয়
                  </span>
                </>
              ) : (
                <>
                  Your municipality,
                  <br />
                  <span className="text-slate/40">
                    now in your
                    <br />
                    pocket
                  </span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-slate/80 md:text-xl md:leading-relaxed">
              {isBn
                ? "সহজেই অভিযোগ জানান। দ্রুত সমাধান পান।"
                : "Report issues easily. Track progress instantly."}
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                to="/signup"
                className="flex w-full items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-parchment transition hover:bg-ink-2 sm:w-auto sm:px-10"
              >
                Report an issue
              </Link>
              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-full border border-line bg-paper px-8 py-3.5 text-sm font-medium tracking-wide text-slate transition hover:border-slate/30 sm:w-auto sm:px-10"
              >
                Track status
              </Link>
            </div>
          </div>

          {/* Signature element: a fanned stack of ticket stubs */}
          <div className="relative mx-auto flex h-48 w-full max-w-sm items-center justify-center sm:h-56">
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
            How it works?
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
        <div className="flex flex-col items-center justify-center gap-1.5 font-mono text-sm tracking-widest text-brass md:flex-row md:gap-3">
          <span>{isBn ? "সহজে জানান" : "FILE IT ONCE."}</span>
          <span className="hidden h-1 w-1 rounded-full bg-brass/30 md:block" />
          <span>{isBn ? "সমাধান পান" : "WATCH IT GET FIXED."}</span>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-xl border border-line bg-ink px-6 py-8 text-parchment sm:flex-row sm:items-center sm:px-10">
          <div>
            <h3 className="font-display text-xl font-semibold sm:text-2xl">
              {isBn ? "পৌরসভার কর্মীদের জন্য" : "Work the queue as municipal staff"}
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-parchment/70">
              {isBn ? "পৌরসভার স্টাফ হিসেবে লগইন করে অভিযোগগুলোর সমাধান করুন।" : "Review every open ticket across the ward and accept the ones your crews are dispatching to."}
            </p>
          </div>
          <Link
            to="/admin/login"
            className="shrink-0 rounded-full bg-brass-light px-6 py-3 text-sm font-medium text-ink transition hover:bg-brass"
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
      className={`w-56 sm:w-60 rounded-xl border border-line bg-paper p-5 shadow-[0_8px_24px_rgba(24,38,54,0.12)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-slate/40">#{num}</span>
        <span
          className={`stamp rounded-sm border-2 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider ${stampColor}`}
        >
          {status}
        </span>
      </div>
      <p className="mt-4 font-display text-base font-semibold text-ink">
        {label}
      </p>
      <div className="mt-4 h-2 w-full rounded-full bg-line/70">
        <div
          className="h-2 rounded-full bg-brass"
          style={{
            width: status === "Pending" ? "20%" : status === "Accepted" ? "60%" : "100%",
          }}
        />
      </div>
    </div>
  );
}
