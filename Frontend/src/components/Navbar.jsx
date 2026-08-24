import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Globe, Menu, X } from "lucide-react";

export default function Navbar() {
  const { citizen, admin, logoutCitizen, logoutAdmin } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const onAdminSide = location.pathname.startsWith("/admin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (onAdminSide) {
      logoutAdmin();
      navigate("/admin/login");
    } else {
      logoutCitizen();
      navigate("/");
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-parchment/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 z-50">
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

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/30 hover:bg-ink/5 uppercase tracking-widest mr-2"
          >
            <Globe className="h-3.5 w-3.5" />
            {language}
          </button>

          {!onAdminSide && (
            <>
              {citizen.token ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-medium text-sm text-slate hover:text-ink"
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
                    className="font-medium text-sm text-slate hover:text-ink"
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
                className="font-mono text-xs uppercase tracking-wide text-slate/50 hover:text-slate"
              >
                Staff →
              </Link>
            </>
          )}

          {onAdminSide && admin.token && (
            <>
              <span className="font-mono text-xs text-slate/60">
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

        {/* Mobile Controls & Hamburger */}
        <div className="flex sm:hidden items-center gap-2 z-50">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-ink/15 px-2 py-1 text-xs font-semibold text-ink uppercase tracking-widest"
          >
            <Globe className="h-3 w-3" />
            {language}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-ink rounded-md hover:bg-ink/5"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full border-b border-line bg-parchment p-5 shadow-lg sm:hidden flex flex-col gap-4 animate-rise">
          {!onAdminSide && (
            <>
              {citizen.token ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-medium text-lg text-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {citizen.user?.name?.split(" ")[0] || "My desk"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left font-medium text-lg text-rust"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-medium text-lg text-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="font-medium text-lg text-brass-light"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Report an issue
                  </Link>
                  <div className="border-t border-line/50 my-1 pt-3">
                    <Link
                      to="/admin/login"
                      className="font-mono text-sm uppercase tracking-wide text-slate/70"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Staff Sign-in →
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
          {onAdminSide && admin.token && (
            <>
              <span className="font-mono text-sm text-slate/60 pb-2 border-b border-line/50">
                {admin.admin?.email}
              </span>
              <button
                onClick={handleLogout}
                className="w-full text-left font-medium text-lg text-rust"
              >
                Log out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
