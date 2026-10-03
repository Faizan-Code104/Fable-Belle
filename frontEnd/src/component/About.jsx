import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Layers3,
  Ruler,
  Sparkles,
} from "lucide-react";

import storeInfo from "../storeInfo";

const principles = [
  {
    number: "01",
    title: "Everyday use",
    description:
      "We look for bags that make sense across normal routines, from daily errands to plans that take you somewhere new.",
  },
  {
    number: "02",
    title: "Useful details",
    description:
      "Practical layouts, usable storage, and comfortable carrying options are part of what we consider.",
  },
  {
    number: "03",
    title: "Easy styling",
    description:
      "Versatile shapes and colors help a bag move naturally between different looks and occasions.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Shape & silhouette",
    description:
      "We look for handbags with balanced proportions and versatile forms that work across everyday routines.",
    Icon: Ruler,
  },
  {
    number: "02",
    title: "Practical details",
    description:
      "Storage, carrying comfort, closures, and usable interior layouts are considered as part of the selection.",
    Icon: Layers3,
  },
  {
    number: "03",
    title: "Style versatility",
    description:
      "We favor designs that can move easily between work, errands, travel, casual plans, and social occasions.",
    Icon: Sparkles,
  },
  {
    number: "04",
    title: "Clear information",
    description:
      "Each product page is intended to present the available product details so shoppers can review before ordering.",
    Icon: CheckCircle2,
  },
];

const About = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const root = pageRef.current;

    if (
      !root ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const elements = root.querySelectorAll("[data-fb-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("fb-about-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
      },
    );

    elements.forEach((element) => {
      element.classList.add("fb-about-pending");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      elements.forEach((element) =>
        element.classList.remove("fb-about-pending"),
      );
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="fb-about min-w-0 bg-paper font-sans text-navy"
    >
      <style>{`
        .fb-about [data-fb-reveal] {
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(.2,.8,.2,1);
        }

        .fb-about .fb-about-pending {
          opacity: 0;
          transform: translateY(24px);
        }

        .fb-about .fb-about-image {
          transition: transform 900ms cubic-bezier(.2,.8,.2,1);
        }

        .fb-about .fb-about-image-wrap:hover .fb-about-image {
          transform: scale(1.04);
        }

        .fb-about .fb-about-arrow {
          transition: transform 250ms ease;
        }

        .fb-about a:hover .fb-about-arrow {
          transform: translate(3px, -3px);
        }

        @keyframes fbAboutOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fb-about .fb-about-orbit {
          animation: fbAboutOrbit 30s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fb-about [data-fb-reveal],
          .fb-about .fb-about-pending {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .fb-about .fb-about-orbit {
            animation: none;
          }

          .fb-about .fb-about-image,
          .fb-about .fb-about-arrow {
            transition: none;
          }
        }
      `}</style>

      {/* OPENING NOTE */}
      <section className="bg-champagne px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1520px]">
          <div
            data-fb-reveal
            className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/25 pb-5 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-xs"
          >
            <span>{storeInfo.businessName} / Our story</span>
            <span>A note on carrying well</span>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-12">
            <div data-fb-reveal className="min-w-0">
              <h1 className="text-[clamp(3rem,7.5vw,7.5rem)] font-medium leading-[1.02] tracking-[-0.075em]">
                Life moves.
                <span className="block text-gold lg:ml-[8%]">
                  Carry it well.
                </span>
              </h1>
            </div>

            <div data-fb-reveal className="max-w-sm">
              <p className="text-sm leading-7 text-navy/85 sm:text-base">
                {storeInfo.businessName} is focused on women&apos;s
                handbags selected for everyday versatility, practical
                use, and modern styling.
              </p>

              <Link
                to="/shop"
                className="mt-5 inline-flex min-h-11 items-center gap-5 border-b border-navy text-sm font-semibold"
              >
                Meet the collection
                <ArrowUpRight
                  size={18}
                  className="fb-about-arrow"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* BRAND STATEMENT */}
          <div
            data-fb-reveal
            className="mt-12 grid border border-navy bg-paper shadow-[7px_7px_0_rgba(23,36,59,0.12)] sm:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:shadow-[12px_12px_0_rgba(23,36,59,0.12)]"
          >
            <div className="relative grid min-h-[260px] place-items-center overflow-hidden bg-navy text-paper sm:min-h-[330px]">
              <div
                aria-hidden="true"
                className="absolute h-52 w-52 rounded-full border border-champagne/25 sm:h-64 sm:w-64"
              />

              <div
                aria-hidden="true"
                className="fb-about-orbit absolute h-64 w-64 rounded-full border border-champagne/15 sm:h-80 sm:w-80"
              >
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-gold" />
              </div>

              <span
                aria-hidden="true"
                className="relative text-[100px] font-medium leading-none tracking-[-0.13em] sm:text-[130px]"
              >
                f<span className="text-gold">.</span>b
              </span>

              <p className="absolute bottom-6 text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">
                Find your way to carry
              </p>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mute">
                The thought behind the collection
              </p>

              <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl">
                A handbag should feel useful before it feels complicated.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-mute sm:text-base">
                Our approach centers on styles that move naturally
                through different parts of the day—from work and errands
                to travel and everyday plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLE LEDGER */}
      <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1520px]">
          <div
            data-fb-reveal
            className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mute">
                Our perspective / 03 principles
              </p>

              <h2 className="mt-4 text-[clamp(2.4rem,5vw,5rem)] font-medium leading-tight tracking-[-0.065em]">
                What we carry forward.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-mute">
              A few simple ideas guide the way we look at a bag and the
              place it can have in your day.
            </p>
          </div>

          <div className="border-b border-navy">
            {principles.map((item) => (
              <article
                key={item.number}
                data-fb-reveal
                className="grid gap-4 border-t border-navy px-2 py-7 transition-colors hover:bg-champagne/40 sm:grid-cols-[40px_1fr] sm:gap-x-6 sm:px-4 sm:py-9 lg:grid-cols-[6%_42%_1fr]"
              >
                <span className="text-xs font-bold text-mute">
                  {item.number}
                </span>

                <h3 className="text-2xl font-medium leading-tight tracking-[-0.045em] sm:text-3xl lg:text-4xl">
                  {item.title}
                </h3>

                <p className="max-w-xl text-sm leading-7 text-mute sm:col-start-2 lg:col-start-auto lg:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL STORY */}
      <section className="bg-navy px-5 py-12 text-paper sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1520px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div data-fb-reveal className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-champagne">
              {storeInfo.businessName} / Our direction
            </p>

            <h2 className="mt-5 text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.065em]">
              Room for
              <br />
              your everyday.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-paper/80 sm:text-base">
              Rather than building around one occasion, we focus on
              versatile bags that support different routines and
              personal styles.
            </p>

            <p className="mt-4 max-w-lg text-sm leading-7 text-paper/80 sm:text-base">
              We want {storeInfo.businessName} to feel clear, considered,
              and easy to navigate—from discovering a bag to reviewing
              its available details.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-paper/30 pt-5 text-xs text-champagne">
              <span>Modern style</span>
              <span>Practical use</span>
              <span>Clear information</span>
            </div>
          </div>

          <figure
            data-fb-reveal
            className="min-w-0 border border-champagne/40 p-3 sm:p-4"
          >
            <div className="fb-about-image-wrap aspect-[4/3] overflow-hidden bg-champagne">
              <img
                src="/about.png"
                alt={`${storeInfo.businessName} handbag in an editorial setting`}
                loading="lazy"
                className="fb-about-image h-full w-full object-cover object-center"
              />
            </div>

            <figcaption className="flex flex-wrap justify-between gap-3 px-1 pb-1 pt-4 text-[10px] uppercase tracking-[0.12em] text-champagne">
              <span>The everyday edit</span>
              <span>Carry it your way ↗</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* SELECTION REFERENCE SHEET */}
      <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1520px]">
          <div data-fb-reveal className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mute">
              How we choose
            </p>

            <h2 className="mt-4 text-[clamp(2.4rem,5vw,5rem)] font-medium leading-tight tracking-[-0.065em]">
              The selection notes.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-mute sm:text-base">
              Our selection process is built around practical
              considerations and straightforward product information.
            </p>
          </div>

          <div
            data-fb-reveal
            className="border border-navy bg-champagne shadow-[7px_9px_0_rgba(23,36,59,0.12)]"
          >
            <div className="flex flex-wrap justify-between gap-3 border-b border-navy/40 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-8">
              <span>Your reference sheet</span>
              <span>01—04 / Considered details</span>
            </div>

            <div className="grid sm:grid-cols-2">
              {processSteps.map(({ number, title, description, Icon }, index) => (
                <article
                  key={number}
                  className={`group min-w-0 p-6 transition-colors hover:bg-paper/60 sm:p-8 lg:p-10 ${
                    index < 3 ? "border-b border-navy/40" : ""
                  } ${
                    index % 2 === 0 ? "sm:border-r sm:border-navy/40" : ""
                  } ${index === 2 ? "sm:border-b-0" : ""}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-mute">
                      {number}
                    </span>
                    <Icon
                      size={24}
                      strokeWidth={1.4}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-y-1"
                    />
                  </div>

                  <h3 className="mt-8 text-2xl font-medium leading-tight tracking-[-0.045em] lg:text-3xl">
                    {title}
                  </h3>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-mute">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION INVITATION */}
      <section className="border-t border-navy/25 bg-champagne px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div
          data-fb-reveal
          className="mx-auto flex max-w-[1520px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mute">
              Your next chapter
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl">
              Find a shape for the day ahead.
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-between gap-8 bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark sm:w-auto"
          >
            Explore the collection
            <ArrowUpRight
              size={20}
              className="fb-about-arrow"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;