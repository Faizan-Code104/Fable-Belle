import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Ban,
  Clock3,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  phoneDisplay: "+1 (917) 695-2303",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
  businessDays: "Monday – Friday",
  supportHours: "9:00 AM – 5:00 PM Central Time",
};

const OrderCancellationPolicy = () => {
  const pageRef = useRef(null);
  const cancellationDetails = [
    {
      label: "Cancellation Window",
      value: "Before Shipment",
    },
    {
      label: "Refund Method",
      value: "Original Payment Method",
    },
    {
      label: "Refund Submission",
      value: "5–7 Business Days",
    },
  ];

  const requestItems = [
    "Customer name",
    "Order number",
    "Email address used for the order",
    "Reason for cancellation",
  ];

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
        threshold: 0.1,
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
          transform: translateY(34px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-40px);
        }

        [data-reveal="right"] {
          transform: translateX(40px);
        }

        [data-reveal="scale"] {
          transform: scale(0.97);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .ectoo-policy-card {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
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
        }
      `}</style>
      
      <section className="relative overflow-hidden border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div data-reveal="scale" className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1F2D22] text-white">
            <Ban size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-4xl leading-tight text-[#111311] sm:text-5xl lg:text-6xl">
            Order Cancellation Policy
          </h1>

          <p className="mt-4 text-sm text-[#5E5B57]">
            Last updated: September 11, 2026
          </p>
        </div>
      </section>

      
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl leading-tight text-[#111311]">
              Cancellation Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57] sm:text-[15px]">
              Customers may request an order cancellation before the order has
              shipped. Cancellation requests should be submitted as soon as
              possible.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {cancellationDetails.map((item) => (
              <div
                key={item.label}
                data-reveal className="ectoo-policy-card rounded-[16px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5E5B57]/70">
                  {item.label}
                </p>

                <p className="mt-2 text-base font-bold text-[#111311]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-[#E4E5DD] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          <div data-reveal className="ectoo-policy-card rounded-[18px] border border-[#E4DED7] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F2D22] text-white">
              <Clock3 size={20} aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-display text-xl text-[#111311]">
              Request Early
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57]">
              Contact us as soon as possible before the order enters shipment
              or tracking is issued.
            </p>
          </div>

          <div data-reveal className="ectoo-policy-card rounded-[18px] border border-[#E4DED7] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F2D22] text-white">
              <PackageCheck size={20} aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-display text-xl text-[#111311]">
              Before Shipment
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57]">
              Cancellation and address-change requests are available only
              before shipment and cannot be guaranteed after fulfillment
              begins.
            </p>
          </div>

          <div data-reveal className="ectoo-policy-card rounded-[18px] border border-[#E4DED7] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F2D22] text-white">
              <RotateCcw size={20} aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-display text-xl text-[#111311]">
              Refund
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57]">
              Approved cancellations are refunded to the original payment
              method.
            </p>
          </div>
        </div>
      </section>

      
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-7 text-[#5E5B57]">
          <section data-reveal="left">
            <h2 className="font-display text-2xl text-[#111311]">
              Cancellation Requests
            </h2>

            <p className="mt-3">
              Customers may request an order cancellation before the order has
              shipped.
            </p>

            <p className="mt-3">
              To request cancellation, contact{" "}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="font-bold text-[#111311] underline underline-offset-2"
              >
                {BUSINESS_INFO.email}
              </a>{" "}
              as soon as possible and include:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              {requestItems.map((item) => (
                <li key={item}>{item}.</li>
              ))}
            </ul>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-2xl text-[#111311]">
              Fulfillment and Shipment
            </h2>

            <p className="mt-3">
              We cannot guarantee cancellation after an order has entered
              fulfillment.
            </p>

            <p className="mt-3">
              Once tracking has been issued or the order has shipped, the
              customer must follow our{" "}
              <Link
                to="/return-policy"
                className="font-bold text-[#111311] underline underline-offset-2"
              >
                Return and Refund Policy
              </Link>
              .
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-2xl text-[#111311]">
              Cancellation Refunds
            </h2>

            <p className="mt-3">
              Approved cancellations are refunded to the original payment
              method.
            </p>

            <p className="mt-3">
              The refund is generally submitted within{" "}
              <strong className="text-[#111311]">5–7 business days</strong>, although
              the customer’s bank may require additional posting time.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-2xl text-[#111311]">
              Cancellations by Ectoo
            </h2>

            <p className="mt-3">
              If Ectoo cancels an order because of unavailable inventory, a
              pricing error, delivery restrictions, payment problems, or
              suspected fraud, any collected payment for the canceled products
              will be returned to the original payment method.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-2xl text-[#111311]">
              Shipping Address Changes
            </h2>

            <p className="mt-3">
              Shipping-address changes are also available only before shipment
              and cannot be guaranteed after fulfillment begins.
            </p>

            <p className="mt-3">
              Customers should contact us immediately if an address correction
              is needed.
            </p>
          </section>

          <section data-reveal="left">
            <h2 className="font-display text-2xl text-[#111311]">
              Contact
            </h2>

            <div className="mt-3 space-y-1">
              <p className="font-medium text-[#111311]">
                {BUSINESS_INFO.businessName}
              </p>

              <p>
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-medium text-[#111311] underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-medium text-[#111311] underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>

              <p>
                Hours: {BUSINESS_INFO.businessDays},{" "}
                {BUSINESS_INFO.supportHours}
              </p>
            </div>
          </section>
        </div>
      </section>

      
      <section className="border-t border-[#E4DED7] bg-[#E4E5DD] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div data-reveal="scale" className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-[22px] bg-[#1F2D22] p-7 text-white sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl">
              Need to cancel an order?
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Contact us as soon as possible before your order ships.
            </p>
          </div>

          <Link
            to="/contact"
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[6px] bg-[#F1EEE8] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-1 hover:bg-white md:w-auto"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrderCancellationPolicy;