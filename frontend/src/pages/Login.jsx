import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(
        "https://forensishield-ai-backend.onrender.com/api/auth/login/",
        { username, password }
      );

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Login successful! Redirecting...");
      navigate("/");
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.error ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:grid md:grid-cols-2">

        {/* Left section */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-500 via-red-600 to-indigo-700 p-10 text-white md:flex">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold">
                🛡️
              </div>
              <span className="text-xl font-bold">ForensiShield AI</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">Secure your digital world with intelligent forensics.</h1>
            <p className="mt-5 leading-7 text-blue-100">Analyze security logs, investigate suspicious activity,and explore security insights from one workspace.</p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm text-blue-100">DIGITAL FORENSICS · THREAT ANALYSIS · AI</p>
            <p className="mt-2 text-lg font-semibold">Investigate smarter. Protect better.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 md:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-2xl font-bold text-white">
              F
            </div>
            <h1 className="text-2xl font-bold text-white">ForensiShield AI</h1>
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Sign in to your account</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Enter your credentials to access your security dashboard.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-14 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-cyan-400"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 5 8.5 5a13.5 13.5 0 01-3 3.5M6.2 6.2C3.9 7.8 2.5 10 2.5 10s3.5 5 9.5 5c.9 0 1.7-.1 2.4-.4"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div
                role="alert"
                className={`rounded-xl border px-4 py-3 text-sm ${
                  isError
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Create account
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-slate-500">ForensiShield AI · Digital Forensics Platform</p>
        </div>
      </div>
    </div>
  );
}

export default Login;