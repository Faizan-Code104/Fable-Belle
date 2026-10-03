import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const Signup = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const requestRef = useRef(null);
  const redirectRef = useRef(null);
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      clearTimeout(redirectRef.current);
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

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
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

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.terms) {
      nextErrors.terms =
        "Please accept the Terms & Conditions and Privacy Policy.";
    }

    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      formRef.current?.elements.namedItem(firstInvalidField)?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current || successMessage) return;

    setServerError("");

    if (!validateForm()) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create your account. Please try again."
        );
      }

      if (!mountedRef.current) return;

      setSuccessMessage(
        `Your ${BUSINESS_INFO.businessName} account has been created successfully.`
      );

      setFormData(initialForm);
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);

      redirectRef.current = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      if (mountedRef.current && error.name !== "AbortError") {
        setServerError(
          error.message || "Unable to create your account. Please try again."
        );
      }
    } finally {
      submittingRef.current = false;

      if (mountedRef.current) {
        setIsSubmitting(false);
      }

      if (requestRef.current === controller) {
        requestRef.current = null;
      }
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full name",
      type: "text",
      placeholder: "Enter your full name",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Minimum 6 characters",
      autoComplete: "new-password",
      visible: showPassword,
      toggle: () => setShowPassword((current) => !current),
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Re-enter your password",
      autoComplete: "new-password",
      visible: showConfirmPassword,
      toggle: () => setShowConfirmPassword((current) => !current),
    },
  ];

  return (
    <main className="fbsignup">
      <style>{styles}</style>

      <div className="fbsignup-wrap">
        <nav className="fbsignup-top" aria-label="Account navigation">
          <Link to="/" className="fbsignup-brand">
            {BUSINESS_INFO.businessName}
            <span aria-hidden="true">.</span>
          </Link>

          <Link to="/shop" className="fbsignup-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to shopping
          </Link>
        </nav>

        <header className="fbsignup-heading">
          <p className="fbsignup-eyebrow">Your style starts here</p>

          <h1>
            A little more <span>you.</span>
          </h1>

          <p>
            Create your {BUSINESS_INFO.businessName} account for a faster,
            more convenient shopping experience.
          </p>
        </header>

        <section
          className="fbsignup-registration"
          aria-labelledby="fbsignup-form-title"
        >
          <div className="fbsignup-form-heading">
            <div>
              <span className="fbsignup-section-number" aria-hidden="true">
                01
              </span>
              <h2 id="fbsignup-form-title">Create your account</h2>
            </div>

            <p>
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </div>

          {serverError && (
            <div className="fbsignup-error-banner" role="alert">
              {serverError}
            </div>
          )}

          {successMessage ? (
            <div className="fbsignup-success">
              <span className="fbsignup-success-icon" aria-hidden="true">
                <Check size={25} />
              </span>

              <h3>You’re all set.</h3>

              <p role="status" aria-live="polite">
                {successMessage}
              </p>

              <p className="fbsignup-redirect">
                Taking you to sign in…
              </p>

              <Link to="/login" className="fbsignup-submit">
                Continue to sign in
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
            >
              <fieldset
                className="fbsignup-fieldset"
                disabled={isSubmitting}
              >
                <legend className="fbsignup-sr-only">
                  Registration details
                </legend>

                <div className="fbsignup-fields">
                  {fields.map((field) => (
                    <div className="fbsignup-field" key={field.name}>
                      <label htmlFor={`fbsignup-${field.name}`}>
                        {field.label}
                      </label>

                      <div
                        className={`fbsignup-input-wrap ${
                          errors[field.name] ? "has-error" : ""
                        }`}
                      >
                        <input
                          id={`fbsignup-${field.name}`}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name]}
                          onChange={handleChange}
                          autoComplete={field.autoComplete}
                          placeholder={field.placeholder}
                          required
                          minLength={
                            field.name === "name"
                              ? 2
                              : field.toggle
                              ? 6
                              : undefined
                          }
                          autoCapitalize={
                            field.name === "email" || field.toggle
                              ? "none"
                              : "words"
                          }
                          spellCheck={field.name === "name"}
                          aria-invalid={Boolean(errors[field.name])}
                          aria-describedby={
                            errors[field.name]
                              ? `fbsignup-${field.name}-error`
                              : field.name === "password"
                              ? "fbsignup-password-hint"
                              : undefined
                          }
                        />

                        {field.toggle && (
                          <button
                            type="button"
                            className="fbsignup-visibility"
                            onClick={field.toggle}
                            aria-label={`${
                              field.visible ? "Hide" : "Show"
                            } ${
                              field.name === "confirmPassword"
                                ? "confirm password"
                                : "password"
                            }`}
                            aria-pressed={field.visible}
                            aria-controls={`fbsignup-${field.name}`}
                          >
                            {field.visible ? (
                              <EyeOff size={18} aria-hidden="true" />
                            ) : (
                              <Eye size={18} aria-hidden="true" />
                            )}
                          </button>
                        )}
                      </div>

                      {errors[field.name] ? (
                        <p
                          id={`fbsignup-${field.name}-error`}
                          className="fbsignup-field-error"
                        >
                          {errors[field.name]}
                        </p>
                      ) : field.name === "password" ? (
                        <p
                          id="fbsignup-password-hint"
                          className="fbsignup-field-hint"
                        >
                          Use at least 6 characters.
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="fbsignup-consent">
                  <div className="fbsignup-consent-row">
                    <input
                      id="fbsignup-terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                      required
                      aria-invalid={Boolean(errors.terms)}
                      aria-describedby={
                        errors.terms ? "fbsignup-terms-error" : undefined
                      }
                    />

                    <div>
                      <label htmlFor="fbsignup-terms">
                        I agree to the
                      </label>{" "}
                      <Link to="/terms-and-conditions">
                        Terms &amp; Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy-policy">Privacy Policy</Link>.
                    </div>
                  </div>

                  {errors.terms && (
                    <p
                      id="fbsignup-terms-error"
                      className="fbsignup-field-error"
                    >
                      {errors.terms}
                    </p>
                  )}
                </div>

                <div className="fbsignup-form-bottom">
                  <p>
                    Your account, ready for your next favourite.
                  </p>

                  <button
                    type="submit"
                    className="fbsignup-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Creating account…
                        <Loader2
                          size={18}
                          className="fbsignup-spin"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowUpRight size={19} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </section>

        <div className="fbsignup-login-note">
          <span>Already part of {BUSINESS_INFO.businessName}?</span>

          <Link to="/login">
            Sign in to your account
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <footer className="fbsignup-footer">
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
  .fbsignup {
    --ink: #173f36;
    --deep: #102e28;
    --paper: #fffdf5;
    --bone: #f5f0e6;
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

  .fbsignup *,
  .fbsignup *::before,
  .fbsignup *::after {
    box-sizing: border-box;
  }

  .fbsignup a {
    color: inherit;
    text-decoration: none;
    text-underline-offset: 4px;
  }

  .fbsignup button,
  .fbsignup input {
    font: inherit;
  }

  .fbsignup button {
    cursor: pointer;
  }

  .fbsignup button:disabled {
    cursor: not-allowed;
  }

  .fbsignup a:focus-visible,
  .fbsignup button:focus-visible,
  .fbsignup input:focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 4px;
  }

  .fbsignup-wrap {
    width: min(100%, 1180px);
    margin-inline: auto;
    padding-inline: clamp(20px, 5vw, 64px);
  }

  .fbsignup-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 88px;
    border-bottom: 1px solid var(--line);
  }

  .fbsignup-brand {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -.055em;
    overflow-wrap: anywhere;
  }

  .fbsignup-brand > span {
    color: var(--brass);
  }

  .fbsignup-back {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 10px;
    min-height: 44px;
    font-size: 11px;
  }

  .fbsignup-heading {
    max-width: 680px;
    margin-inline: auto;
    padding-block: 52px 38px;
    text-align: center;
    animation: fbsignupEnter .45s ease both;
  }

  .fbsignup-eyebrow {
    margin: 0;
    color: var(--brass);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .14em;
  }

  .fbsignup-heading h1 {
    margin: 20px 0 18px;
    font-size: clamp(42px, 6vw, 66px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -.06em;
  }

  .fbsignup-heading h1 > span {
    color: var(--brass);
  }

  .fbsignup-heading > p:last-child {
    max-width: 460px;
    margin-inline: auto;
    margin-bottom: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
  }

  .fbsignup-registration {
    max-width: 820px;
    margin-inline: auto;
    padding: clamp(24px, 4vw, 42px);
    border: 1px solid var(--line);
    background: var(--paper);
    animation: fbsignupEnter .55s ease both;
  }

  .fbsignup-form-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 26px;
    margin-bottom: 28px;
    border-bottom: 1px solid var(--line);
  }

  .fbsignup-form-heading > div {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .fbsignup-section-number {
    color: var(--brass);
    font-size: 10px;
  }

  .fbsignup-form-heading h2 {
    margin: 0;
    font-size: 21px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -.035em;
  }

  .fbsignup-form-heading > p {
    flex-shrink: 0;
    margin: 0;
    color: var(--muted);
    font-size: 11px;
  }

  .fbsignup-form-heading a {
    margin-left: 5px;
    color: var(--ink);
    font-weight: 600;
    text-decoration: underline;
  }

  .fbsignup-fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .fbsignup-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .fbsignup-field {
    min-width: 0;
  }

  .fbsignup-field > label {
    display: block;
    margin-bottom: 9px;
    font-size: 12px;
    font-weight: 500;
  }

  .fbsignup-input-wrap {
    display: flex;
    align-items: center;
    min-width: 0;
    border: 1px solid var(--line);
    background: #fff;
    transition:
      border-color .2s ease,
      box-shadow .2s ease;
  }

  .fbsignup-input-wrap:focus-within {
    border-color: var(--ink);
    box-shadow: 0 0 0 3px rgba(23, 63, 54, .05);
  }

  .fbsignup-input-wrap.has-error {
    border-color: var(--error);
  }

  .fbsignup-input-wrap input {
    width: 100%;
    min-width: 0;
    min-height: 54px;
    padding: 14px 15px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fbsignup-input-wrap input::placeholder {
    color: #7a817b;
    font-size: 12px;
  }

  .fbsignup-visibility {
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

  .fbsignup-visibility:hover {
    color: var(--ink);
  }

  .fbsignup-field-hint,
  .fbsignup-field-error {
    margin: 8px 0 0;
    font-size: 11px;
    line-height: 1.6;
  }

  .fbsignup-field-hint {
    color: var(--muted);
  }

  .fbsignup-field-error {
    color: var(--error);
  }

  .fbsignup-consent {
    margin-top: 28px;
  }

  .fbsignup-consent-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .fbsignup-consent-row > input {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin: 3px 0 0;
    accent-color: var(--ink);
    cursor: pointer;
  }

  .fbsignup-consent-row > div {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.9;
  }

  .fbsignup-consent label {
    cursor: pointer;
  }

  .fbsignup-consent a {
    color: var(--ink);
    font-weight: 500;
    text-decoration: underline;
  }

  .fbsignup-form-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 28px;
    padding-top: 26px;
    border-top: 1px solid var(--line);
  }

  .fbsignup-form-bottom > p {
    max-width: 230px;
    margin: 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.8;
  }

  .fbsignup-submit {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 35px;
    min-width: 220px;
    min-height: 54px;
    padding: 15px 20px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff !important;
    font-size: 12px;
    font-weight: 500;
    transition: background .2s ease;
  }

  .fbsignup-submit:hover:not(:disabled) {
    background: var(--deep);
  }

  .fbsignup-submit:disabled {
    opacity: .65;
  }

  .fbsignup-submit > svg {
    flex-shrink: 0;
  }

  .fbsignup-error-banner {
    margin-bottom: 24px;
    padding: 14px 16px;
    border: 1px solid rgba(161, 56, 50, .25);
    background: #fbefec;
    color: var(--error);
    font-size: 12px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .fbsignup-success {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 20px 0 10px;
    text-align: center;
  }

  .fbsignup-success-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: var(--bone);
  }

  .fbsignup-success h3 {
    margin: 20px 0 10px;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: -.045em;
  }

  .fbsignup-success > p {
    max-width: 420px;
    margin: 0;
    color: var(--muted);
    font-size: 13px;
  }

  .fbsignup-success .fbsignup-redirect {
    margin-top: 12px;
    font-size: 11px;
  }

  .fbsignup-success .fbsignup-submit {
    margin-top: 24px;
  }

  .fbsignup-login-note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    max-width: 820px;
    margin-inline: auto;
    padding-block: 22px 34px;
    color: var(--muted);
    font-size: 11px;
  }

  .fbsignup-login-note > a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    color: var(--ink);
    font-weight: 500;
  }

  .fbsignup-login-note > a:hover {
    text-decoration: underline;
  }

  .fbsignup-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px 25px;
    padding-block: 22px 32px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 10px;
  }

  .fbsignup-footer > div {
    display: flex;
    gap: 24px;
  }

  .fbsignup-footer a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }

  .fbsignup-footer a:hover {
    text-decoration: underline;
  }

  .fbsignup-sr-only {
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

  .fbsignup-spin {
    animation: fbsignupSpin 1s linear infinite;
  }

  @keyframes fbsignupSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes fbsignupEnter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 760px) {
    .fbsignup-form-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 12px;
    }

    .fbsignup-form-heading > p {
      flex-shrink: 1;
    }
  }

  @media (max-width: 600px) {
    .fbsignup-top {
      min-height: 76px;
      gap: 15px;
    }

    .fbsignup-brand {
      font-size: 21px;
    }

    .fbsignup-back {
      gap: 7px;
      font-size: 10px;
    }

    .fbsignup-heading {
      padding-block: 36px 28px;
      text-align: left;
    }

    .fbsignup-heading h1 {
      font-size: 44px;
    }

    .fbsignup-heading > p:last-child {
      margin-inline: 0;
    }

    .fbsignup-registration {
      padding: 26px 22px;
    }

    .fbsignup-form-heading {
      margin-bottom: 24px;
      padding-bottom: 22px;
    }

    .fbsignup-fields {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }

    .fbsignup-form-bottom {
      align-items: stretch;
      flex-direction: column;
      gap: 18px;
    }

    .fbsignup-form-bottom > p {
      max-width: none;
    }

    .fbsignup-submit {
      width: 100%;
      min-width: 0;
    }

    .fbsignup-login-note {
      align-items: flex-start;
      flex-direction: column;
      gap: 4px;
      padding-block: 20px 28px;
    }

    .fbsignup-footer {
      padding-block: 18px 24px;
    }
  }

  @media (max-width: 380px) {
    .fbsignup-brand {
      font-size: 19px;
    }

    .fbsignup-back {
      font-size: 9px;
    }

    .fbsignup-heading h1 {
      font-size: 38px;
    }

    .fbsignup-registration {
      padding: 24px 18px;
    }

    .fbsignup-form-heading h2 {
      font-size: 19px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbsignup *,
    .fbsignup *::before,
    .fbsignup *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Signup;