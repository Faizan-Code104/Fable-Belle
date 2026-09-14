import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Layers3,
  Ruler,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const About = () => {
  const pageRef = useRef(null);

  const processSteps = [
    {
      number: "01",
      title: "Shape & Silhouette",
      description:
        "We look for handbags with balanced proportions and versatile forms that work across everyday routines.",
    },
    {
      number: "02",
      title: "Practical Details",
      description:
        "Storage, carrying comfort, closures, and usable interior layouts are considered as part of the selection.",
    },
    {
      number: "03",
      title: "Style Versatility",
      description:
        "We favor designs that can move easily between work, errands, travel, casual plans, and social occasions.",
    },
    {
      number: "04",
      title: "Clear Information",
      description:
        "Each product page is intended to present the available product details so shoppers can review before ordering.",
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
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) =>
      observer.observe(element)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(42px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-45px);
        }

        [data-reveal="right"] {
          transform: translateX(45px);
        }

        [data-reveal="scale"] {
          transform: scale(0.96);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .ectoo-image-zoom {
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ectoo-image-wrap:hover .ectoo-image-zoom {
          transform: scale(1.035);
        }

        .ectoo-hover-card {
          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            background-color 0.4s ease;
        }

        .ectoo-hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(31, 45, 34, 0.08);
        }

        .ectoo-number {
          transition:
            transform 0.35s ease,
            color 0.35s ease;
        }

        .ectoo-hover-card:hover .ectoo-number {
          transform: translateY(-4px);
          color: #9A5937;
        }

        @keyframes ectooArrowMove {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(5px);
          }
        }

        .ectoo-cta:hover .ectoo-arrow {
          animation: ectooArrowMove 0.8s ease infinite;
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

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="border-b border-[#E4DED7] bg-[#FAF8F5]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">

            <div data-reveal="left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9A5937]">
                About Ectoo
              </p>

              <div className="mt-5 h-px w-12 bg-[#9A5937]" />
            </div>

            <div data-reveal>
              <h1 className="max-w-5xl font-display text-[46px] leading-[0.98] tracking-[-0.03em] sm:text-[62px] lg:text-[76px] xl:text-[88px]">
                Bags that fit
                <span className="block text-[#5E5B57]">
                  into real life.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-[#5E5B57] sm:text-[16px] sm:leading-8">
                Ectoo is focused on women's handbags
                selected for everyday versatility,
                practical use, and modern styling.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className="bg-[#1F2D22] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">

            <div data-reveal="left">
              <p className="max-w-4xl font-display text-3xl leading-[1.12] sm:text-4xl lg:text-[52px]">
                We believe a handbag should feel
                useful before it feels complicated.
              </p>
            </div>

            <div
              data-reveal="right"
              className="border-l border-white/15 pl-0 lg:pl-10"
            >
              <p className="text-[12px] leading-7 text-white/65 sm:text-[13px]">
                Our approach is centered on styles
                that can move naturally through
                different parts of the day — from
                work and errands to travel and
                everyday plans.
              </p>

              <p className="mt-5 text-[12px] leading-7 text-white/65 sm:text-[13px]">
                Rather than building around one
                occasion, Ectoo focuses on versatile
                bags that can support different
                routines and personal styles.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          THREE PILLARS
      ===================================================== */}

      <section className="bg-[#EEE7DF]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

          <div
            data-reveal
            className="mb-12 max-w-2xl"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
              Our Perspective
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              What matters to us
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div
              data-reveal
              className="ectoo-hover-card rounded-[18px] bg-[#FAF8F5] p-7 sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                <ShoppingBag
                  size={20}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-6 font-display text-2xl">
                Everyday Use
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#5E5B57]">
                We look for bags that make sense
                across normal routines, not just one
                specific moment.
              </p>
            </div>

            <div
              data-reveal
              style={{
                transitionDelay: "120ms",
              }}
              className="ectoo-hover-card rounded-[18px] bg-[#E4E5DD] p-7 sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                <Layers3
                  size={20}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-6 font-display text-2xl">
                Useful Details
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#5E5B57]">
                Practical layouts, usable storage,
                and comfortable carrying options are
                part of what we consider.
              </p>
            </div>

            <div
              data-reveal
              style={{
                transitionDelay: "240ms",
              }}
              className="ectoo-hover-card rounded-[18px] bg-[#FAF8F5] p-7 sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                <Sparkles
                  size={20}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-6 font-display text-2xl">
                Easy Styling
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#5E5B57]">
                We favor versatile shapes and colors
                that can work with different looks
                and occasions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          IMAGE STORY
      ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[1.45fr_0.55fr] lg:items-stretch">

            <div
  data-reveal="scale"
  className="ectoo-image-wrap relative min-h-[420px] overflow-hidden rounded-[22px] bg-[#E4E5DD] lg:min-h-[560px]"
>
  <img
    src="/about.png"
    alt="Ectoo handbag in a modern editorial setting"
    className="ectoo-image-zoom absolute inset-0 h-full w-full object-cover object-center"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2D22]/30 via-transparent to-transparent" />
</div>

            <div
              data-reveal="right"
              className="flex flex-col justify-between rounded-[22px] bg-[#1F2D22] p-7 text-white sm:p-9"
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/45">
                  Our Direction
                </p>

                <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
                  Less noise.
                  <br />
                  More purpose.
                </h2>

                <p className="mt-6 text-sm leading-7 text-white/60">
                  We want Ectoo to feel clear,
                  considered, and easy to navigate —
                  from discovering a bag to reviewing
                  its available details.
                </p>
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <p className="text-[11px] leading-6 text-white/55">
                  Modern style
                  <br />
                  Practical use
                  <br />
                  Clear product information
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="bg-[#FAF8F5]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">

            <div data-reveal="left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                How We Choose
              </p>

              <h2 className="mt-4 max-w-md font-display text-4xl leading-tight sm:text-5xl">
                A simple way
                <span className="block text-[#5E5B57]">
                  to think about bags.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#5E5B57]">
                Our selection process is built around
                practical considerations rather than
                unnecessary complexity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {processSteps.map(
                (step, index) => (
                  <div
                    key={step.number}
                    data-reveal
                    style={{
                      transitionDelay: `${
                        index * 100
                      }ms`,
                    }}
                    className="ectoo-hover-card group rounded-[18px] border border-[#E4DED7] bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <span className="ectoo-number font-display text-4xl text-[#9A5937]/35">
                        {step.number}
                      </span>

                      {index === 0 && (
                        <Ruler
                          size={20}
                          strokeWidth={1.4}
                          className="text-[#1F2D22]"
                        />
                      )}

                      {index === 1 && (
                        <Layers3
                          size={20}
                          strokeWidth={1.4}
                          className="text-[#1F2D22]"
                        />
                      )}

                      {index === 2 && (
                        <Sparkles
                          size={20}
                          strokeWidth={1.4}
                          className="text-[#1F2D22]"
                        />
                      )}

                      {index === 3 && (
                        <CheckCircle2
                          size={20}
                          strokeWidth={1.4}
                          className="text-[#1F2D22]"
                        />
                      )}

                    </div>

                    <h3 className="mt-6 text-[14px] font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[12px] leading-6 text-[#5E5B57]">
                      {step.description}
                    </p>
                  </div>
                )
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-[#E4E5DD]">
        <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div data-reveal="left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                Explore Ectoo
              </p>

              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Find a bag that works with your day.
              </h2>
            </div>

            <div data-reveal="right">
              <Link
                to="/shop"
                className="ectoo-cta group inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] bg-[#1F2D22] px-7 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F4C3A]"
              >
                Shop Handbags

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="ectoo-arrow"
                />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default About;