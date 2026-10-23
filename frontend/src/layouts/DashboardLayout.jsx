import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const userName =
    user.first_name ||
    user.username ||
    user.name ||
    "Investigator";

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-cyan-500/10 text-cyan-400"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const navigation = (
    <>
      <p className="mb-3 text-xs font-semibold text-slate-500">WORKSPACE</p>

      <NavLink to="/" end onClick={closeMobileMenu} className={navLinkClass}>Dashboard</NavLink>
      <NavLink to="/assistant" onClick={closeMobileMenu} className={navLinkClass}>AI Assistant</NavLink>
      <NavLink to="/investigations" onClick={closeMobileMenu} className={navLinkClass}>Investigations</NavLink>
      <NavLink to="/log-analysis" onClick={closeMobileMenu} className={navLinkClass}>Log Analysis</NavLink>
      <NavLink to="/reports" onClick={closeMobileMenu} className={navLinkClass}>Reports</NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
        <h1 className="text-xl font-bold text-cyan-400">ForensiShield AI</h1>
        <p className="mt-2 text-xs text-slate-500">CYBER FORENSICS PLATFORM</p>
        <nav className="mt-10 space-y-2">{navigation}</nav>
        <div className="absolute bottom-6 left-6">
          <p className="text-sm text-slate-400">Investigator Workspace</p>
          <p className="mt-1 text-xs text-slate-600">Secure Investigation Portal</p>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        id="mobile-navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-slate-800 bg-slate-900 p-6 transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">ForensiShield AI</h1>
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">CYBER FORENSICS PLATFORM</p>

        <nav className="mt-10 space-y-2">{navigation}</nav>

        <div className="mt-12">
          <p className="text-sm text-slate-400">Investigator Workspace</p>
          <p className="mt-1 text-xs text-slate-600">Secure Investigation Portal</p>
        </div>
      </aside>

      <div className="min-w-0 md:ml-64">
        <header className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/80 px-3 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-controls="mobile-navigation"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-xl text-cyan-400 transition hover:bg-slate-800 md:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <p className="text-xs text-slate-400 sm:text-sm">Security Operations</p>
              <p className="truncate text-sm font-semibold sm:text-base">Investigation Center</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-2 sm:px-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-400 sm:h-8 sm:w-8">{userName.charAt(0).toUpperCase()}</span>
              <span className="hidden max-w-32 truncate text-sm text-slate-200 sm:inline">{userName}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/40 px-2 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 sm:px-4 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;