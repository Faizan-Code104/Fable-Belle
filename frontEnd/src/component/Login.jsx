import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

const Login = () => {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    typeof location.state?.from === "string"
      ? location.state.from
      : "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll("[data-reveal]");

    if (!elements?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ectoo-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setServerError("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    const loginValues = {
      email: formData.email
        .trim()
        .toLowerCase(),
      password: formData.password,
    };

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            loginValues
          ),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setServerError(
          data?.message ||
            "Unable to sign in. Please check your details and try again."
        );

        return;
      }

      if (!data?.token || !data?.user) {
        setServerError(
          "The server returned an incomplete login response."
        );

        return;
      }

      localStorage.setItem(
        "ectoo-token",
        data.token
      );

      localStorage.setItem(
        "ectoo-user",
        JSON.stringify(data.user)
      );

      setSuccessMessage(
        "Login successful. Redirecting..."
      );

      setFormData({
        email: "",
        password: "",
        remember: false,
      });

      setTimeout(() => {
        navigate(redirectTo, {
          replace: true,
        });
      }, 700);
    } catch {
      setServerError(
        "Unable to connect right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-38px);
        }

        [data-reveal="right"] {
          transform: translateX(38px);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">

        

        <div className="relative hidden overflow-hidden bg-[#1F2D22] lg:flex lg:m-5 lg:mr-0 lg:rounded-[30px]">

          

          <div
            className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full border border-white/5"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-white/5"
            aria-hidden="true"
          />

          <div data-reveal="left" className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16 2xl:p-20">

            

            <Link
              to="/"
              aria-label="Ectoo home"
              className="w-fit font-display text-4xl text-[#F1EEE8]"
            >
              Ectoo
            </Link>

            

            <div className="max-w-xl text-[#F1EEE8]">

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-white/55">
                Welcome Back
              </p>

              <h1 className="font-display text-5xl leading-[1.1] xl:text-6xl">

                Carry your style.

                <br />

                <span className="text-white/55">
                  Continue your journey.
                </span>

              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/65">
                Sign in to access your
                Ectoo account, view your
                account information, and
                check available order details.
              </p>

              <div className="mt-9 flex items-center gap-3 text-sm font-semibold text-white">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 bg-white/5">

                  <Check
                    size={16}
                    aria-hidden="true"
                  />

                </div>

                <span>
                  Designed for everyday use.
                </span>

              </div>

            </div>

            <p className="text-xs font-medium text-white/45">
              © {new Date().getFullYear()}{" "}
              Ectoo. All rights reserved.
            </p>

          </div>

        </div>

        

        <div className="relative flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 py-10 sm:px-8 lg:min-h-0 lg:px-14">

          <div data-reveal="right" className="w-full max-w-[470px] rounded-[28px] border border-[#E4DED7] bg-white p-6 shadow-[0_28px_80px_rgba(31,45,34,0.08)] sm:p-9 lg:p-11">

            

            <div className="mb-9 flex items-center justify-between lg:hidden">

              <Link
                to="/"
                aria-label="Ectoo home"
                className="font-display text-4xl text-[#1F2D22]"
              >
                Ectoo
              </Link>

            </div>

            

            <div className="mb-9">

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#9A5937]">
                Sign In
              </p>

              <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5E5B57]">
                Sign in to your Ectoo
                account to continue.
              </p>

            </div>

            

            {serverError && (
              <div
                role="alert"
                className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-600"
              >
                {serverError}
              </div>
            )}

            

            {successMessage && (
              <div
                role="status"
                className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-700"
              >
                {successMessage}
              </div>
            )}

            

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >

              

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold text-[#5E5B57]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5B57]/60"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={
                      Boolean(errors.email)
                    }
                    aria-describedby={
                      errors.email
                        ? "email-error"
                        : undefined
                    }
                    className={`min-h-12 w-full border bg-[#FAF8F5] py-3 pl-11 pr-4 text-base text-ink outline-none transition-colors placeholder:text-[#5E5B57]/60 focus:bg-white sm:text-sm ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E4DED7] focus:border-[#1F2D22]"
                    }`}
                  />

                </div>

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-xs font-medium text-red-500"
                  >
                    {errors.email}
                  </p>
                )}

              </div>

              

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold text-[#5E5B57]"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5B57]/60"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.password
                    }
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={
                      Boolean(
                        errors.password
                      )
                    }
                    aria-describedby={
                      errors.password
                        ? "password-error"
                        : undefined
                    }
                    className={`min-h-12 w-full border bg-[#FAF8F5] py-3 pl-11 pr-12 text-base text-ink outline-none transition-colors placeholder:text-[#5E5B57]/60 focus:bg-white sm:text-sm ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E4DED7] focus:border-[#1F2D22]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#5E5B57]/60 transition-colors hover:text-[#111311]"
                  >

                    {showPassword ? (
                      <EyeOff
                        size={18}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={18}
                        aria-hidden="true"
                      />
                    )}

                  </button>

                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1.5 text-xs font-medium text-red-500"
                  >
                    {errors.password}
                  </p>
                )}

              </div>

              

              <div className="flex items-center">

                <label className="flex min-h-11 cursor-pointer items-center gap-2">

                  <input
                    name="remember"
                    type="checkbox"
                    checked={
                      formData.remember
                    }
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#1F2D22]"
                  />

                  <span className="text-sm text-[#5E5B57]">
                    Remember me
                  </span>

                </label>

              </div>

              

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[12px] bg-[#1F2D22] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(31,45,34,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F4C3A] hover:shadow-[0_16px_34px_rgba(31,45,34,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Signing In..."
                  : "Sign In"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-line" />

              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#5E5B57]/60 sm:text-xs">
                New to Ectoo?
              </span>

              <div className="h-px flex-1 bg-line" />

            </div>

            <Link
              to="/signup"
              className="flex min-h-12 w-full items-center justify-center border border-[#E4DED7] bg-white px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-[#1F2D22]"
            >
              Create Account
            </Link>

            

            <p className="mt-6 text-center text-xs leading-5 text-[#5E5B57]/70">
              An account is not required to
              continue as a guest during checkout.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;