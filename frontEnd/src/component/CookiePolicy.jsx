import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cookie,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  address: "1825 Dickinson Ave Ste D, Dickinson, TX 77539",
  phoneDisplay: "+1 (917) 695-2303",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
};

const CookiePolicy = () => {
  const pageRef = useRef(null);

  const cookieTypes = [
    {
      title: "Essential Technologies",
      description:
        "Support necessary website functions including navigation, shopping-cart operation, account login, security, fraud prevention, and privacy choices.",
    },
    {
      title: "Preference Technologies",
      description:
        "Remember selections such as account settings, display preferences, or shopping-cart contents.",
    },
    {
      title: "Analytics Technologies",
      description:
        "If enabled, help us understand website usage, identify technical errors, and improve website performance.",
    },
    {
      title: "Advertising Technologies",
      description:
        "If enabled, may help measure advertising performance or provide relevant advertising, subject to applicable consent or opt-out requirements.",
    },
  ];

  useEffect(() => {
    const elements =
      pageRef.current?.querySelectorAll("[data-reveal]");

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
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

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

        .ectoo-policy-card {
          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }

        .ectoo-policy-card:hover {
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

      <section className="relative overflow-hidden bg-[#EEE7DF] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#1F2D22]/5" />

        <div
          data-reveal="scale"
          className="relative mx-auto max-w-[1000px] text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2D22] text-white">
            <Cookie size={19} strokeWidth={1.4} />
          </div>

          <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">
            Cookie Policy
          </h1>

          <p className="mt-4 text-[11px] text-[#5E5B57]">
            Last updated: September 11, 2026
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div
          data-reveal="left"
          className="mx-auto max-w-[900px]"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9A5937]">
            About Cookies
          </p>

          <h2 className="mt-3 font-display text-4xl leading-tight">
            Cookies &amp; Similar Technologies
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5E5B57]">
            This Cookie Policy explains how {BUSINESS_INFO.businessName} uses
            cookies, local storage, session technologies, and similar tools on
            https://www.ectoo.us.
          </p>
        </div>
      </section>

      <section className="bg-[#E4E5DD] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div data-reveal="left">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9A5937]">
              Technology Types
            </p>

            <h2 className="mt-3 font-display text-4xl">
              Technologies We May Use
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cookieTypes.map((item, index) => (
              <div
                key={item.title}
                data-reveal
                style={{
                  transitionDelay: `${index * 80}ms`,
                }}
                className="ectoo-policy-card rounded-[18px] border border-[#E4DED7] bg-[#FAF8F5] p-6"
              >
                <span className="text-[9px] font-semibold text-[#9A5937]">
                  0{index + 1}
                </span>

                <h3 className="mt-4 font-display text-2xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-[12px] leading-6 text-[#5E5B57]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[900px] space-y-12 text-sm leading-7 text-[#5E5B57]">
          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              What Are Cookies and Similar Technologies?
            </h2>

            <p className="mt-4">
              Cookies are small files stored through a browser. Local storage
              and session storage allow a website to remember information on a
              device.
            </p>

            <p className="mt-3">
              These technologies may help operate website features, maintain a
              shopping cart, remember preferences, support account access, and
              understand website performance.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              Essential Technologies
            </h2>

            <p className="mt-4">
              These support necessary functions such as:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Website navigation.</li>
              <li>Shopping-cart operation.</li>
              <li>Account login.</li>
              <li>Security.</li>
              <li>Fraud prevention.</li>
              <li>Remembering privacy choices.</li>
            </ul>

            <p className="mt-3">
              Disabling essential technologies may prevent parts of the website
              from working correctly.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              Preference Technologies
            </h2>

            <p className="mt-4">
              These remember selections such as account settings, display
              preferences, or shopping-cart contents.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              Analytics Technologies
            </h2>

            <p className="mt-4">
              If enabled, analytics technologies help us understand how
              visitors use the website, identify technical errors, and improve
              performance.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              Advertising Technologies
            </h2>

            <p className="mt-4">
              If advertising tools are enabled, they may help measure
              advertising performance or provide relevant advertising. Where
              required by law, these technologies will be subject to consent or
              opt-out rights.
            </p>
          </section>

          <section
            data-reveal="scale"
            className="rounded-[20px] bg-[#1F2D22] p-6 text-white sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck size={18} strokeWidth={1.4} />
              </div>

              <div>
                <h2 className="font-display text-3xl">
                  Payment Information
                </h2>

                <p className="mt-4 text-white/60">
                  Cookies and local storage used by Ectoo are not intended to
                  store complete payment-card numbers or card security codes.
                </p>

                <p className="mt-3 text-white/60">
                  When payments are activated, payment providers may use their
                  own necessary security and fraud-prevention technologies.
                </p>
              </div>
            </div>
          </section>

          <section
            data-reveal="right"
            className="rounded-[20px] border border-[#E4DED7] bg-white p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4E5DD] text-[#1F2D22]">
                <SlidersHorizontal size={18} strokeWidth={1.4} />
              </div>

              <div>
                <h2 className="font-display text-3xl text-[#111311]">
                  Managing Cookies
                </h2>

                <p className="mt-4">
                  Customers may block, delete, or restrict cookies through
                  browser settings. Doing so may affect shopping-cart, account,
                  and website functionality.
                </p>

                <p className="mt-3">
                  Where a cookie-preference tool is available, customers may use
                  it to manage non-essential technologies.
                </p>

                <p className="mt-3">
                  We will recognize legally required browser-based opt-out
                  signals where applicable and technically supported.
                </p>
              </div>
            </div>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              Changes
            </h2>

            <p className="mt-4">
              We may update this Cookie Policy when our technology, providers,
              or legal obligations change. Updates will be posted with a revised
              date.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-3xl text-[#111311]">
              Contact
            </h2>

            <div className="mt-4 space-y-1">
              <p className="font-semibold text-[#111311]">
                {BUSINESS_INFO.businessName}
              </p>

              <p>1825 Dickinson Ave Ste D</p>
              <p>Dickinson, TX 77539</p>
              <p>United States</p>

              <p className="pt-2">
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-semibold text-[#111311] underline underline-offset-2 transition-colors hover:text-[#9A5937]"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-semibold text-[#111311] underline underline-offset-2 transition-colors hover:text-[#9A5937]"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-[#E4DED7] bg-[#E4E5DD] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div
          data-reveal="scale"
          className="mx-auto flex max-w-[900px] flex-col gap-6 rounded-[22px] bg-[#1F2D22] p-7 text-white sm:p-9 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="font-display text-3xl">
              Have a privacy question?
            </h3>

            <p className="mt-2 text-[11px] leading-6 text-white/55">
              Contact us if you have questions about cookies or website
              privacy.
            </p>
          </div>

          <Link
            to="/contact"
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-3 rounded-[6px] bg-[#F1EEE8] px-6 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-1 hover:bg-white md:w-auto"
          >
            Contact Us
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
