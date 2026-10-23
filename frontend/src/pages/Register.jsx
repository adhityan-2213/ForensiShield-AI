import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (password.length < 8) {
      setIsError(true);
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://forensishield-ai-backend.onrender.com/api/auth/register/",
        {
          username: username.trim(),
          email: email.trim(),
          password,
        }
      );

      setMessage(response.data.message || "Registration successful!");
      setIsError(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(()=>{
        navigate("/login");
      },1500);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const eyeIcon = (visible) =>
    visible ? (
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
    );

  const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

  const passwordInputClass = "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:grid-cols-2">
        {/* Left section */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-500 via-red-600 to-indigo-700 p-10 text-white md:flex">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold">
                🛡️
              </div>

              <span className="text-xl font-bold">ForensiShield AI</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">Begin your digital forensics journey.</h1>
            <p className="mt-5 leading-7 text-blue-100">Create your account to explore security log analysis, AI assistance, and digital investigation tools.</p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm text-blue-100">DIGITAL FORENSICS · THREAT ANALYSIS · AI</p>
            <p className="mt-2 text-lg font-semibold">Your security workspace starts here.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 md:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-2xl font-bold text-white">
              F
            </div>

            <h1 className="text-2xl font-bold text-white">ForensiShield AI</h1>
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Get started</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Fill in your details to register for ForensiShield AI.</p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className={passwordInputClass}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-cyan-400"
                >
                  {eyeIcon(showPassword)}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">Use at least 8 characters.</p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Retype your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={passwordInputClass}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-cyan-400"
                >
                  {eyeIcon(showConfirmPassword)}
                </button>
              </div>

              {confirmPassword && (
                <p
                  className={`mt-2 text-xs ${
                    password === confirmPassword
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {password === confirmPassword
                    ? "Passwords match."
                    : "Passwords do not match."}
                </p>
              )}
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-500">
            ForensiShield AI · Digital Forensics Platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;