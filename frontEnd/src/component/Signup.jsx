import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import { API_BASE_URL } from "../config";

const Signup = () => {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


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
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms =
        "You must accept the Terms & Conditions and Privacy Policy";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create your account. Please try again."
        );
      }

      setSuccessMessage(
        "Your Ectoo account has been created successfully."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setServerError(
        error.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#FAF8F5]">
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal="left"] { transform: translateX(-38px); }
        [data-reveal="right"] { transform: translateX(38px); }
        [data-reveal="scale"] { transform: scale(.97); }
        [data-reveal].ectoo-visible { opacity: 1; transform: translate(0,0) scale(1); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
      <div className="grid min-h-screen lg:grid-cols-2">

        {}
        <div className="relative hidden overflow-hidden bg-[#1F2D22] lg:flex">
<div className="absolute inset-0 bg-[#1F2D22]/70" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <Link
              to="/"
              className="font-display text-3xl text-[#FAF8F5]"
            >
              Ectoo
            </Link>

            <div className="max-w-xl text-[#FAF8F5]">

              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#FAF8F5]/60">
                Welcome to Ectoo
              </p>

              <h1 className="font-display text-5xl leading-[1.1] xl:text-6xl">
                Carry your style.
                <br />

                <span className="text-[#FAF8F5]/60">
                  Own your journey.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-[#FAF8F5]/70">
                Discover thoughtfully selected handbags
                designed for everyday life, work, travel,
                and every moment in between.
              </p>

              <div className="mt-9 flex items-center gap-3 text-sm font-semibold text-[#FAF8F5]">

                <div className="flex h-9 w-9 items-center justify-center border border-[#FAF8F5]/20 bg-[#FAF8F5]/10">
                  <Check size={16} />
                </div>

                Quality handbags. Timeless style.
              </div>
            </div>

            <p className="text-xs font-medium text-[#FAF8F5]/50">
              © 2026 Ectoo. All rights reserved.
            </p>
          </div>
        </div>

        {}
        <div data-reveal="right" className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-[480px] rounded-[28px] border border-[#E4DED7] bg-white p-6 shadow-[0_18px_55px_rgba(31,45,34,0.055)] sm:p-8 lg:p-9">

            {}
            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="font-display text-3xl text-[#111311]"
              >
                Ectoo
              </Link>
            </div>

            {}
            <div className="mb-8">

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#3F4C3A]">
                Create Account
              </p>

              <h2 className="font-display text-4xl text-[#111311]">
                Join Ectoo
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5E5B57]">
                Create your account for a faster and more
                convenient shopping experience.
              </p>
            </div>

            {}
            {serverError && (
              <div className="mb-5 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {serverError}
              </div>
            )}

            {}
            {successMessage && (
              <div className="mb-5 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >

              {}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-bold text-[#111311]/70"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111311]/40"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={`w-full min-h-[54px] rounded-[12px] border bg-[#F5F1EC] py-3.5 pl-11 pr-4 text-sm text-[#111311] outline-none transition placeholder:text-[#111311]/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(31,45,34,0.05)] ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E4DED7] focus:border-[#1F2D22]"
                    }`}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold text-[#111311]/70"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111311]/40"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full min-h-[54px] rounded-[12px] border bg-[#F5F1EC] py-3.5 pl-11 pr-4 text-sm text-[#111311] outline-none transition placeholder:text-[#111311]/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(31,45,34,0.05)] ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E4DED7] focus:border-[#1F2D22]"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold text-[#111311]/70"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111311]/40"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    className={`w-full min-h-[54px] rounded-[12px] border bg-[#F5F1EC] py-3.5 pl-11 pr-12 text-sm text-[#111311] outline-none transition placeholder:text-[#111311]/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(31,45,34,0.05)] ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E4DED7] focus:border-[#1F2D22]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111311]/40 transition hover:text-[#111311]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-bold text-[#111311]/70"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111311]/40"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={`w-full min-h-[54px] rounded-[12px] border bg-[#F5F1EC] py-3.5 pl-11 pr-12 text-sm text-[#111311] outline-none transition placeholder:text-[#111311]/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(31,45,34,0.05)] ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E4DED7] focus:border-[#1F2D22]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111311]/40 transition hover:text-[#111311]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {}
              <div>

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-[#1F2D22]"
                  />

                  <span className="text-sm leading-6 text-[#5E5B57]">

                    I agree to the{" "}

                    <Link
                      to="/terms-and-conditions"
                      className="font-semibold text-[#111311] hover:underline"
                    >
                      Terms & Conditions
                    </Link>

                    {" "}and{" "}

                    <Link
                      to="/privacy-policy"
                      className="font-semibold text-[#111311] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {errors.terms && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.terms}
                  </p>
                )}
              </div>

              {}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#1F2D22] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F4C3A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#E4DED7]" />

              <span className="text-xs font-medium uppercase tracking-wider text-[#111311]/40">
                Already a member?
              </span>

              <div className="h-px flex-1 bg-[#E4DED7]" />
            </div>

            <Link
              to="/login"
              className="flex min-h-[52px] w-full items-center justify-center rounded-[13px] border border-[#E4DED7] bg-[#FAF8F5] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111311] transition-all hover:border-[#1F2D22] hover:bg-white"
            >
              Sign In
            </Link>

            <p className="mt-7 text-center text-xs leading-5 text-[#111311]/40">
              By creating an account, you agree to
              Ectoo&apos;s Terms & Conditions and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;