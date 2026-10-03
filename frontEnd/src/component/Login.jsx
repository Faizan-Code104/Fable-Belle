import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { API_BASE_URL } from "../config";
import { BUSINESS_INFO } from "../storeInfo";

const apiBase = String(API_BASE_URL || "").replace(/\/+$/, "");
const REMEMBERED_EMAIL_KEY = "fablebelle-remembered-email";

const getRememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
  } catch {
    return "";
  }
};

const getRedirect = (from) => {
  const candidate =
    typeof from === "string"
      ? from
      : from && typeof from.pathname === "string"
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : "/";

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(candidate) ||
    /^\/(?:login|signup)(?:[/?#]|$)/i.test(candidate)
  ) {
    return "/";
  }

  return candidate;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirect(location.state?.from);

  const formRef = useRef(null);
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);
  const requestRef = useRef(null);
  const redirectTimer = useRef(null);

  const [formData, setFormData] = useState(() => {
    const email = getRememberedEmail();

    return {
      email,
      password: "",
      rememberEmail: Boolean(email),
    };
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);

    const firstField = Object.keys(nextErrors)[0];

    if (firstField) {
      formRef.current?.elements.namedItem(firstField)?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current || success) return;

    setServerError("");

    if (!validateForm()) return;

    submittingRef.current = true;
    setLoading(true);

    const controller = new AbortController();
    requestRef.current = controller;

    const email = formData.email.trim().toLowerCase();

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to sign in. Please check your details and try again."
        );
      }

      if (
        typeof data.token !== "string" ||
        !data.token.trim() ||
        !data.user ||
        typeof data.user !== "object" ||
        Array.isArray(data.user)
      ) {
        throw new Error("The server returned an incomplete login response.");
      }

      if (!mountedRef.current) return;

      try {
        localStorage.setItem("fablebelle-user", JSON.stringify(data.user));
        localStorage.setItem("fablebelle-token", data.token);
      } catch {
        try {
          localStorage.removeItem("fablebelle-user");
          localStorage.removeItem("fablebelle-token");
        } catch {
          // Storage may be blocked by the browser.
        }

        throw new Error(
          "Your browser could not save this login. Please allow site storage and try again."
        );
      }

      try {
        if (formData.rememberEmail) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch {
        // Remembering the email is optional.
      }

      setSuccess(true);
      setShowPassword(false);
      setFormData((current) => ({ ...current, password: "" }));

      redirectTimer.current = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 700);
    } catch (error) {
      if (mountedRef.current && error.name !== "AbortError") {
        setServerError(
          error instanceof TypeError
            ? "Unable to connect right now. Please try again."
            : error.message || "Unable to sign in. Please try again."
        );
      }
    } finally {
      submittingRef.current = false;

      if (mountedRef.current) setLoading(false);

      if (requestRef.current === controller) {
        requestRef.current = null;
      }
    }
  };

  return (
    <main className="fblogin">
      <style>{styles}</style>

      <div className="fblogin-wrap">
        <nav className="fblogin-top" aria-label="Login navigation">
          <Link to="/" className="fblogin-brand">
            {BUSINESS_INFO.businessName}
            <span aria-hidden="true">.</span>
          </Link>

          <Link to="/shop" className="fblogin-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to shopping
          </Link>
        </nav>

        <header className="fblogin-heading">
          <p className="fblogin-eyebrow">Your account / Welcome back</p>

          <h1>
            Pick up where<br />
            <span>you left off.</span>
          </h1>

          <p>
            Sign in to your {BUSINESS_INFO.businessName} account to continue.
          </p>
        </header>

        <section className="fblogin-panel" aria-labelledby="fblogin-title">
          <div className="fblogin-panel-heading">
            <h2 id="fblogin-title">Sign in</h2>
            <span>Good to see you again.</span>
          </div>

          {serverError && (
            <div className="fblogin-error-banner" role="alert">
              {serverError}
            </div>
          )}

          {success ? (
            <div className="fblogin-success">
              <span className="fblogin-success-icon" aria-hidden="true">
                <Check size={26} />
              </span>

              <h3>You’re signed in.</h3>

              <p role="status" aria-live="polite">
                Login successful. Redirecting…
              </p>

              <Link to={redirectTo} className="fblogin-submit">
                Continue
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-busy={loading}
            >
              <fieldset disabled={loading} className="fblogin-fieldset">
                <legend className="fblogin-sr-only">Login details</legend>

                <div className="fblogin-field">
                  <label htmlFor="fblogin-email">Email address</label>

                  <div
                    className={`fblogin-input ${
                      errors.email ? "has-error" : ""
                    }`}
                  >
                    <input
                      id="fblogin-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "fblogin-email-error" : undefined
                      }
                    />
                  </div>

                  {errors.email && (
                    <p id="fblogin-email-error" className="fblogin-field-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="fblogin-field">
                  <label htmlFor="fblogin-password">Password</label>

                  <div
                    className={`fblogin-input ${
                      errors.password ? "has-error" : ""
                    }`}
                  >
                    <input
                      id="fblogin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      minLength={6}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "fblogin-password-error" : undefined
                      }
                    />

                    <button
                      type="button"
                      className="fblogin-visibility"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      aria-controls="fblogin-password"
                    >
                      {showPassword ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="fblogin-password-error"
                      className="fblogin-field-error"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <label className="fblogin-remember">
                  <input
                    name="rememberEmail"
                    type="checkbox"
                    checked={formData.rememberEmail}
                    onChange={handleChange}
                  />
                  Remember my email on this device
                </label>

                <button
                  type="submit"
                  className="fblogin-submit"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in"}

                  {loading ? (
                    <Loader2
                      size={18}
                      className="fblogin-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowUpRight size={19} aria-hidden="true" />
                  )}
                </button>
              </fieldset>
            </form>
          )}

          <div className="fblogin-create">
            <div>
              <p className="fblogin-eyebrow">New here?</p>
              <p>Make yourself at home.</p>
            </div>

            <Link to="/signup">
              Create account
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <p className="fblogin-guest">
          An account is not required to continue as a guest during checkout.
        </p>

        <footer className="fblogin-footer">
          <span>
            © {new Date().getFullYear()} {BUSINESS_INFO.businessName}.
            All rights reserved.
          </span>

          <div>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-and-conditions">Terms</Link>
          </div>
        </footer>
      </div>
    </main>
  );
};

const styles = `
  .fblogin {
    --ink: #173f36;
    --deep: #102e28;
    --bone: #f5f0e6;
    --paper: #fffdf5;
    --brass: #a56e4f;
    --muted: #626e67;
    --line: rgba(23, 63, 54, .17);
    --error: #a13832;

    min-height: 100vh;
    background: var(--bone);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .fblogin *,
  .fblogin *::before,
  .fblogin *::after { box-sizing: border-box; }

  .fblogin a {
    color: inherit;
    text-decoration: none;
    text-underline-offset: 4px;
  }

  .fblogin input,
  .fblogin button { font: inherit; }

  .fblogin button { cursor: pointer; }
  .fblogin button:disabled { cursor: not-allowed; }

  .fblogin a:focus-visible,
  .fblogin button:focus-visible,
  .fblogin input:focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 4px;
  }

  .fblogin-wrap {
    width: min(100%, 1180px);
    margin-inline: auto;
    padding-inline: clamp(20px, 5vw, 64px);
  }

  .fblogin-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 88px;
    border-bottom: 1px solid var(--line);
  }

  .fblogin-brand {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -.055em;
    overflow-wrap: anywhere;
  }

  .fblogin-brand > span { color: var(--brass); }

  .fblogin-back {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 10px;
    min-height: 44px;
    font-size: 11px;
  }

  .fblogin-heading {
    max-width: 680px;
    margin-inline: auto;
    padding-block: 42px 30px;
    text-align: center;
    animation: fbloginEnter .45s ease both;
  }

  .fblogin-eyebrow {
    margin: 0;
    color: var(--brass);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fblogin-heading h1 {
    margin: 20px 0 18px;
    font-size: clamp(42px, 5.6vw, 64px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.06em;
  }

  .fblogin-heading h1 > span { color: var(--brass); }

  .fblogin-heading > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
  }

  .fblogin-panel {
    max-width: 560px;
    margin-inline: auto;
    padding: 34px;
    border: 1px solid var(--line);
    background: var(--paper);
    animation: fbloginEnter .55s ease both;
  }

  .fblogin-panel-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 18px;
    padding-bottom: 22px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--line);
  }

  .fblogin-panel-heading h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -.04em;
  }

  .fblogin-panel-heading > span {
    color: var(--muted);
    font-size: 10px;
  }

  .fblogin-fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .fblogin-field + .fblogin-field { margin-top: 22px; }

  .fblogin-field > label {
    display: block;
    margin-bottom: 9px;
    font-size: 12px;
    font-weight: 500;
  }

  .fblogin-input {
    display: flex;
    align-items: center;
    min-width: 0;
    border: 1px solid var(--line);
    background: #fff;
    transition: border-color .2s ease, box-shadow .2s ease;
  }

  .fblogin-input:focus-within {
    border-color: var(--ink);
    box-shadow: 0 0 0 3px rgba(23, 63, 54, .05);
  }

  .fblogin-input.has-error { border-color: var(--error); }

  .fblogin-input input {
    width: 100%;
    min-width: 0;
    min-height: 54px;
    padding: 14px 15px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fblogin-input input::placeholder {
    color: #7a817b;
    font-size: 12px;
  }

  .fblogin-visibility {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    margin-right: 4px;
    border: 0;
    background: transparent;
    color: var(--muted);
  }

  .fblogin-visibility:hover { color: var(--ink); }

  .fblogin-field-error {
    margin: 8px 0 0;
    color: var(--error);
    font-size: 11px;
    line-height: 1.7;
  }

  .fblogin-remember {
    display: flex;
    align-items: center;
    gap: 11px;
    min-height: 44px;
    margin-block: 16px 20px;
    color: var(--muted);
    font-size: 11px;
    cursor: pointer;
  }

  .fblogin-remember input {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
    margin: 0;
    accent-color: var(--ink);
  }

  .fblogin-submit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    min-height: 54px;
    padding: 15px 20px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff !important;
    font-size: 12px;
    font-weight: 500;
    transition: background .2s ease;
  }

  .fblogin-submit:hover:not(:disabled) { background: var(--deep); }
  .fblogin-submit:disabled { opacity: .65; }
  .fblogin-submit > svg { flex-shrink: 0; }

  .fblogin-error-banner {
    margin-bottom: 22px;
    padding: 14px 16px;
    border: 1px solid rgba(161, 56, 50, .25);
    background: #fbefec;
    color: var(--error);
    font-size: 12px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .fblogin-create {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
  }

  .fblogin-create > div > p:last-child {
    margin: 7px 0 0;
    color: var(--muted);
    font-size: 11px;
  }

  .fblogin-create > a {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
    min-height: 44px;
    font-size: 11px;
    font-weight: 500;
  }

  .fblogin-create > a:hover { text-decoration: underline; }

  .fblogin-success {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-block: 10px;
    text-align: center;
  }

  .fblogin-success-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: var(--bone);
  }

  .fblogin-success h3 {
    margin: 20px 0 10px;
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -.04em;
  }

  .fblogin-success p {
    margin: 0 0 24px;
    color: var(--muted);
    font-size: 12px;
  }

  .fblogin-guest {
    max-width: 440px;
    margin: 22px auto 36px;
    color: var(--muted);
    text-align: center;
    font-size: 11px;
    line-height: 1.8;
  }

  .fblogin-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px 25px;
    padding-block: 20px 28px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 10px;
  }

  .fblogin-footer > div { display: flex; gap: 24px; }

  .fblogin-footer a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }

  .fblogin-footer a:hover { text-decoration: underline; }

  .fblogin-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .fblogin-spin { animation: fbloginSpin 1s linear infinite; }

  @keyframes fbloginSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes fbloginEnter {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .fblogin-top { min-height: 76px; gap: 15px; }
    .fblogin-brand { font-size: 21px; }
    .fblogin-back { gap: 7px; font-size: 10px; }
    .fblogin-heading { padding-block: 34px 26px; }
    .fblogin-heading h1 { font-size: 44px; }
    .fblogin-panel { padding: 26px 22px; }
    .fblogin-guest { margin-bottom: 28px; }
  }

  @media (max-width: 380px) {
    .fblogin-brand { font-size: 19px; }
    .fblogin-back { font-size: 9px; }
    .fblogin-heading h1 { font-size: 38px; }
    .fblogin-panel { padding: 24px 18px; }
    .fblogin-panel-heading { flex-wrap: wrap; gap: 8px; }
    .fblogin-create { align-items: flex-start; flex-direction: column; gap: 8px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fblogin *,
    .fblogin *::before,
    .fblogin *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Login;