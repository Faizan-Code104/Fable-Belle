import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  phoneDisplay: "+1 (832) 347-8821",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
  businessDays: "Monday – Friday",
  supportHours: "9:00 AM – 5:00 PM Central Time",
};

const PaymentPolicy = () => {
  const pageRef = useRef(null);
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
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const paymentDetails = [
    {
      label: "Payment Type",
      value: "Online Electronic Payments",
    },
    {
      label: "Currency",
      value: "United States Dollars (USD)",
    },
    {
      label: "Purchases",
      value: "One-Time Purchases",
    },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(32px);
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

        .ectoo-payment-card {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .ectoo-payment-card:hover {
          transform: translateY(-4px);
          border-color: rgba(31, 45, 34, 0.18);
          box-shadow: 0 18px 48px rgba(31, 45, 34, 0.07);
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
        <div
          data-reveal="scale"
          className="relative mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F2D22] text-white shadow-[0_12px_30px_rgba(31,45,34,0.15)]">
            <CreditCard size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-5xl leading-[0.98] text-[#111311] sm:text-6xl">
            Payment Policy
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
              Payment Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57] sm:text-[15px]">
              Ectoo accepts online electronic payments only through the payment
              methods displayed at checkout. Our online payment setup is
              currently being completed.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {paymentDetails.map((item) => (
              <div
                key={item.label}
                data-reveal
                className="ectoo-payment-card rounded-[20px] border border-[#E4DED7] bg-white p-5 sm:p-6"
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

      <section className="bg-[#E8E7DF] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <div
            data-reveal
            className="ectoo-payment-card rounded-[24px] border border-[#E4DED7] bg-white p-6 sm:p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F2D22] text-white">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>

            <h2 className="mt-4 font-display text-2xl text-[#111311]">
              Secure Payment Processing
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57]">
              Once online payments are activated, transactions will be processed
              by an authorized third-party payment processor. Ectoo will not
              intentionally store complete card numbers or card security codes
              on its own systems.
            </p>
          </div>

          <div
            data-reveal
            className="ectoo-payment-card rounded-[24px] border border-[#E4DED7] bg-white p-6 sm:p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F2D22] text-white">
              <CircleDollarSign size={20} aria-hidden="true" />
            </div>

            <h2 className="mt-4 font-display text-2xl text-[#111311]">
              No Recurring Charges
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57]">
              Ectoo sells products through one-time purchases. Customers are not
              automatically enrolled in recurring product subscriptions.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-7 text-[#5E5B57]">
          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Online Payments Only
            </h2>

            <p className="mt-3">
              Ectoo accepts online electronic payments only through the payment
              methods displayed at checkout.
            </p>

            <p className="mt-3">We do not accept:</p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Cash on Delivery.</li>
              <li>Payment by cash through the mail.</li>
              <li>Personal checks.</li>
              <li>Telephone collection of complete payment-card details.</li>
            </ul>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Current Payment Status
            </h2>

            <p className="mt-3">
              Ectoo is currently completing its secure online payment setup.
            </p>

            <p className="mt-3">
              Until an active payment method is displayed at checkout and
              payment is successfully authorized, no completed online purchase
              will be accepted and no card payment will be collected through the
              website.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">Currency</h2>

            <p className="mt-3">
              All product prices and transactions are stated in{" "}
              <strong className="text-[#111311]">
                United States dollars (USD)
              </strong>
              .
            </p>

            <p className="mt-3">
              Applicable sales tax will be calculated and disclosed at checkout
              where required.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Payment Processing
            </h2>

            <p className="mt-3">
              Once online payments are activated, transactions will be processed
              by an authorized third-party payment processor.
            </p>

            <p className="mt-3">
              Ectoo will not intentionally store complete card numbers or card
              security codes on its own systems. Customers should never send
              complete card information through email, contact forms, or
              voicemail.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Authorization
            </h2>

            <p className="mt-3">
              Submitting payment authorizes the payment processor to verify and
              charge the selected payment method for the total amount displayed
              at checkout.
            </p>

            <p className="mt-3">
              An authorization does not guarantee acceptance. Orders remain
              subject to payment approval, inventory availability, fraud review,
              and order confirmation.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              One-Time Purchases
            </h2>

            <p className="mt-3">
              Ectoo sells products through one-time purchases. We do not
              automatically enroll product customers in recurring subscriptions.
            </p>

            <p className="mt-3">
              Any future recurring service would require separate, clear
              disclosure and express customer authorization before billing.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Billing Descriptor
            </h2>

            <p className="mt-3">
              Once payment processing is activated, the exact processor-approved
              billing descriptor will be displayed at checkout or in the order
              confirmation.
            </p>

            <p className="mt-3">
              The descriptor will identify the charge as associated with Ectoo
              or the Ectoo brand.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Declined Payments
            </h2>

            <p className="mt-3">
              A payment may be declined by the card issuer, payment processor,
              or fraud-prevention system. Customers should verify their
              information or contact their financial institution.
            </p>

            <p className="mt-3">
              Ectoo does not control issuer decline decisions.
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">Refunds</h2>

            <p className="mt-3">
              Approved refunds are returned to the original payment method in
              accordance with our{" "}
              <Link
                to="/return-policy"
                className="font-bold text-[#111311] underline underline-offset-2"
              >
                Return and Refund Policy
              </Link>
              .
            </p>
          </section>

          <section
            data-reveal="left"
            className="border-b border-[#E4DED7] pb-9 last:border-0 last:pb-0"
          >
            <h2 className="font-display text-2xl text-[#111311]">Contact</h2>

            <div className="mt-3 space-y-1">
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

      <section className="border-t border-[#E4DED7] bg-[#EEE7DF] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div
          data-reveal="scale"
          className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-[26px] bg-[#1F2D22] p-7 text-white shadow-[0_22px_55px_rgba(31,45,34,0.14)] sm:p-9 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="font-display text-2xl">Have a payment question?</h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Contact our support team for assistance.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#F1EEE8] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white md:w-auto"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PaymentPolicy;
