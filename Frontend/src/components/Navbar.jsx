import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { citizen, admin, logoutCitizen, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onAdminSide = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    if (onAdminSide) {
      logoutAdmin();
      navigate("/admin/login");
    } else {
      logoutCitizen();
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-parchment/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-ink text-parchment">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
              <path d="M6 12 12 5l6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="12" width="8" height="6" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            CivicDesk
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {!onAdminSide && (
            <>
              {citizen.token ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden font-medium text-sm text-slate hover:text-ink sm:inline"
                  >
                    {citizen.user?.name?.split(" ")[0] || "My desk"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink transition hover:border-ink/30 hover:bg-ink/5"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden font-medium text-sm text-slate hover:text-ink sm:inline"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-parchment transition hover:bg-ink-2"
                  >
                    Report an issue
                  </Link>
                </>
              )}
              <Link
                to="/admin/login"
                className="hidden font-mono text-xs uppercase tracking-wide text-slate/50 hover:text-slate md:inline"
              >
                Staff →
              </Link>
            </>
          )}

          {onAdminSide && admin.token && (
            <>
              <span className="hidden font-mono text-xs text-slate/60 sm:inline">
                {admin.admin?.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink transition hover:border-ink/30 hover:bg-ink/5"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
