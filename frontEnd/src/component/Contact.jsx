import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  email: "info@ectoo.us",
  phoneDisplay: "+1 (832) 347-8821",
  phoneHref: "+19176952303",
  addressLine1: "1825 Dickinson Ave Ste D",
  addressLine2: "Dickinson, TX 77539",
  country: "United States",
  hours: "Monday – Friday",
  time: "9:00 AM – 5:00 PM CT",
};

const Contact = () => {
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (successMessage) setSuccessMessage("");
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setSuccessMessage(
        "Your message has been sent successfully. Our support team will get back to you as soon as possible.",
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      setErrorMessage(
        "We were unable to send your message. Please try again or email us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "min-h-12 w-full rounded-[8px] border border-[#E4DED7] bg-[#FAF8F5] px-4 py-3 text-sm text-[#111311] outline-none transition-all duration-300 placeholder:text-[#5E5B57]/45 focus:border-[#1F2D22] focus:bg-white focus:shadow-[0_0_0_3px_rgba(31,45,34,0.06)]";

  const labelClass =
    "mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5E5B57]";

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(38px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-42px);
        }

        [data-reveal="right"] {
          transform: translateX(42px);
        }

        [data-reveal="scale"] {
          transform: scale(0.96);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .ectoo-contact-card {
          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }

        .ectoo-contact-card:hover {
          transform: translateY(-4px);
          border-color: rgba(31, 45, 34, 0.18);
          box-shadow: 0 18px 45px rgba(31, 45, 34, 0.06);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden bg-[#EEE7DF] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#1F2D22]/5" />
        <div className="pointer-events-none absolute right-10 top-14 h-48 w-48 rounded-full border border-[#1F2D22]/5" />

        <div className="relative mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div data-reveal="left">
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#9A5937]">
              Contact Ectoo
            </p>

            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-[78px]">
              Here when you
              <span className="block text-[#3F4C3A]">need us.</span>
            </h1>
          </div>

          <p
            data-reveal="right"
            className="max-w-xl text-sm leading-7 text-[#5E5B57] lg:justify-self-end sm:text-base"
          >
            Questions about an order, product, shipping, or returns? Send us a
            message or use the contact information below.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <div data-reveal="left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                Contact Information
              </p>

              <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                Reach our support team.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#5E5B57]">
                Our support team is available during normal business hours for
                general questions, order assistance, and product support.
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              <div
                data-reveal="left"
                className="ectoo-contact-card flex items-start gap-4 rounded-[18px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                  <Mail size={17} strokeWidth={1.4} />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#5E5B57]">
                    Email
                  </p>

                  <a
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="mt-1.5 block break-all font-display text-xl transition-colors hover:text-[#9A5937]"
                  >
                    {BUSINESS_INFO.email}
                  </a>

                  <p className="mt-2 text-[10px] leading-5 text-[#5E5B57]">
                    We usually respond within 24 hours during business days.
                  </p>
                </div>
              </div>

              <div
                data-reveal="left"
                className="ectoo-contact-card flex items-start gap-4 rounded-[18px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                  <Phone size={17} strokeWidth={1.4} />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#5E5B57]">
                    Phone
                  </p>

                  <a
                    href={`tel:${BUSINESS_INFO.phoneHref}`}
                    className="mt-1.5 block font-display text-xl transition-colors hover:text-[#9A5937]"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>

                  <p className="mt-2 text-[10px] leading-5 text-[#5E5B57]">
                    {BUSINESS_INFO.hours}
                    <br />
                    {BUSINESS_INFO.time}
                  </p>
                </div>
              </div>

              <div
                data-reveal="left"
                className="ectoo-contact-card flex items-start gap-4 rounded-[18px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                  <MapPin size={17} strokeWidth={1.4} />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#5E5B57]">
                    Business Location
                  </p>

                  <p className="mt-1.5 font-display text-xl">
                    {BUSINESS_INFO.businessName}
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-[#5E5B57]">
                    {BUSINESS_INFO.addressLine1}
                    <br />
                    {BUSINESS_INFO.addressLine2}
                    <br />
                    {BUSINESS_INFO.country}
                  </p>
                </div>
              </div>

              <div
                data-reveal="left"
                className="ectoo-contact-card flex items-start gap-4 rounded-[18px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                  <Clock3 size={17} strokeWidth={1.4} />
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#5E5B57]">
                    Working Hours
                  </p>

                  <p className="mt-1.5 font-display text-xl">
                    {BUSINESS_INFO.hours}
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-[#5E5B57]">
                    {BUSINESS_INFO.time}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            data-reveal="right"
            className="relative overflow-hidden rounded-[22px] bg-[#1F2D22] p-6 text-white sm:p-8 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/5" />

            <div className="relative">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45">
                Send A Message
              </p>

              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                How can we help?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                Complete the form and our support team will review your message.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={80}
                    required
                    autoComplete="name"
                    className="min-h-12 w-full rounded-[8px] border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.1]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={120}
                    required
                    autoComplete="email"
                    className="min-h-12 w-full rounded-[8px] border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.1]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={120}
                    required
                    className="min-h-12 w-full rounded-[8px] border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.1]"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={2000}
                    required
                    rows={7}
                    className="w-full resize-y rounded-[8px] border border-white/15 bg-white/[0.07] px-4 py-3 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.1]"
                    placeholder="Enter your message"
                  />
                </div>

                {successMessage && (
                  <div
                    role="status"
                    className="flex items-start gap-3 rounded-[10px] border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-[10px] border border-red-300/20 bg-red-300/10 p-4 text-sm leading-6 text-red-100"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[7px] bg-[#F1EEE8] px-6 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E4DED7] bg-[#E4E5DD] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div data-reveal="scale" className="mx-auto max-w-[1100px] text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            Thoughtful bags for everyday life.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#5E5B57]">
            Practical details, versatile shapes, and an easier way to find the
            bag that fits your routine.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
