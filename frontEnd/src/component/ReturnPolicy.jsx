import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  address: "1825 Dickinson Ave Ste D, Dickinson, TX 77539",
  phoneDisplay: "+1 (832) 347-8821",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
  businessDays: "Monday – Friday",
  supportHours: "9:00 AM – 5:00 PM Central Time",
};

const ReturnPolicy = () => {
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
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const eligible = [
    "Unused and unworn",
    "Unwashed and unaltered",
    "Free from stains, odors, scratches, or customer-caused damage",
    "Original tags, accessories, and packaging are included",
    "Order number or proof of purchase is provided",
    "Return is requested within 30 days of confirmed delivery",
  ];

  const notEligible = [
    "Used, worn, washed, altered, or customer-damaged products",
    "Products missing tags, accessories, components, or original packaging",
    "Products showing misuse, improper cleaning, or ordinary wear",
    "Products returned more than 30 days after delivery",
    "Products mailed without authorization",
    "Products not purchased directly from Ectoo",
  ];

  const steps = [
    {
      title: "Request a return",
      description:
        "Contact our support team within 30 days of confirmed delivery and provide your order number and return reason.",
    },
    {
      title: "Receive authorization",
      description:
        "If approved, we will provide return instructions. Do not mail a product before authorization is provided.",
    },
    {
      title: "Ship the return",
      description:
        "Send the authorized product as instructed and retain your tracking number and shipping receipt.",
    },
    {
      title: "Refund processed",
      description:
        "After inspection and approval, the refund is issued to the original payment method within 5–7 business days.",
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
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        [data-reveal="left"] { transform: translateX(-40px); }
        [data-reveal="right"] { transform: translateX(40px); }
        [data-reveal="scale"] { transform: scale(0.97); }
        [data-reveal].ectoo-visible { opacity: 1; transform: translate(0,0) scale(1); }
        .return-card { transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .return-card:hover { transform: translateY(-4px); box-shadow: 0 18px 48px rgba(31,45,34,.07); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <section className="relative overflow-hidden border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div
          data-reveal="scale"
          className="relative mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F2D22] text-white shadow-[0_12px_30px_rgba(31,45,34,0.15)]">
            <RotateCcw size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-5xl leading-[0.98] text-[#111311] sm:text-6xl">
            Return &amp; Refund Policy
          </h1>

          <p className="mt-4 text-sm text-[#5E5B57]">
            Last updated: September 11, 2026
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-[#111311]">
            30-Day Return Window
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5E5B57]">
            {BUSINESS_INFO.businessName} accepts eligible returns requested
            within 30 days of confirmed delivery. Products must meet the return
            conditions described below.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div
            data-reveal="left"
            className="return-card rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 sm:p-7"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={19}
                className="text-emerald-600"
                aria-hidden="true"
              />

              <h3 className="text-sm font-bold text-emerald-800">
                Eligible for Return
              </h3>
            </div>

            <ul className="mt-4 space-y-2.5">
              {eligible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs leading-5 text-emerald-800"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            data-reveal="right"
            className="return-card rounded-[24px] border border-red-200 bg-red-50 p-6 sm:p-7"
          >
            <div className="flex items-center gap-2">
              <XCircle size={19} className="text-red-600" aria-hidden="true" />

              <h3 className="text-sm font-bold text-red-800">
                May Not Be Eligible
              </h3>
            </div>

            <ul className="mt-4 space-y-2.5">
              {notEligible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs leading-5 text-red-800"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#E8E7DF] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl text-[#111311]">
            How to Return an Item
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                data-reveal
                className="return-card rounded-[22px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F2D22] text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-4 text-sm font-bold text-[#111311]">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#5E5B57]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4 text-sm leading-7 text-[#5E5B57]">
          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Return Eligibility
            </h2>

            <p className="mt-3">
              To qualify for a return, the product must be unused and unworn,
              unwashed and unaltered, free from stains, odors, scratches, or
              customer-caused damage, and returned with its original tags,
              accessories, and packaging.
            </p>

            <p className="mt-3">
              The return must also be accompanied by the order number or proof
              of purchase.
            </p>

            <p className="mt-3">
              Products returned without authorization or outside the return
              period may be refused.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Starting a Return
            </h2>

            <p className="mt-3">
              Before mailing a return, contact our support team using the
              following details:
            </p>

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
            </div>

            <p className="mt-4">Please provide:</p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Customer name.</li>
              <li>Order number.</li>
              <li>Product being returned.</li>
              <li>Reason for return.</li>
              <li>
                Photographs if the item is damaged, defective, or incorrect.
              </li>
            </ul>

            <p className="mt-3">
              If approved, we will provide return instructions. Do not mail a
              product until return authorization has been provided.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Return Address
            </h2>

            <p className="mt-3">
              Authorized returns should be sent as instructed to:
            </p>

            <div className="mt-3 space-y-1">
              <p className="font-medium text-[#111311]">
                {BUSINESS_INFO.businessName}
              </p>
              <p>1825 Dickinson Ave Ste D</p>
              <p>Dickinson, TX 77539</p>
              <p>United States</p>
            </div>

            <p className="mt-3">
              The customer should retain the return tracking number and shipping
              receipt until the refund is completed.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Change-of-Mind Returns
            </h2>

            <p className="mt-3">
              If a customer changes their mind, orders the wrong item, or no
              longer wants the product:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>The customer is responsible for return-shipping costs.</li>
              <li>The return shipment should include tracking.</li>
              <li>
                Ectoo is not responsible for a return lost before it reaches us.
              </li>
              <li>
                The product must satisfy all return-eligibility requirements.
              </li>
            </ul>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Damaged, Defective, or Incorrect Products
            </h2>

            <p className="mt-3">
              A damaged, defective, or incorrect product should be reported
              within{" "}
              <strong className="text-[#111311]">48 hours of delivery</strong>.
            </p>

            <p className="mt-3">The customer should provide photographs of:</p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>The product.</li>
              <li>The packaging.</li>
              <li>The shipping label.</li>
              <li>The damaged or incorrect area.</li>
            </ul>

            <p className="mt-3">
              After verification, Ectoo will provide appropriate return
              instructions and cover reasonable return-shipping costs.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">Exchanges</h2>

            <p className="mt-3">
              We do{" "}
              <strong className="text-[#111311]">
                not offer direct exchanges
              </strong>
              .
            </p>

            <p className="mt-3">
              A customer who wants another color, style, or product may return
              the eligible original product for a refund and place a separate
              order.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Restocking Fees
            </h2>

            <p className="mt-3">
              Ectoo does{" "}
              <strong className="text-[#111311]">
                not charge a restocking fee
              </strong>{" "}
              for an eligible return.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Non-Returnable Products
            </h2>

            <p className="mt-3">A return may be refused if the product:</p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Was used, worn, washed, altered, or damaged after delivery.
              </li>
              <li>
                Is missing tags, accessories, components, or original packaging.
              </li>
              <li>
                Shows signs of misuse, improper cleaning, or ordinary wear.
              </li>
              <li>Is returned more than 30 days after delivery.</li>
              <li>Was mailed without authorization.</li>
              <li>Was not purchased directly from Ectoo.</li>
            </ul>

            <p className="mt-3">
              These exclusions do not limit legal rights concerning defective or
              misrepresented products.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Return Inspection
            </h2>

            <p className="mt-3">
              Returned products are inspected after receipt. We will notify the
              customer whether the return has been approved or rejected.
            </p>

            <p className="mt-3">
              If a return does not meet the stated conditions, we will explain
              the reason and may ask the customer to pay for shipment of the
              product back to them.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Refund Timing
            </h2>

            <p className="mt-3">
              Approved refunds are issued to the{" "}
              <strong className="text-[#111311]">
                original payment method within 5–7 business days after
                inspection
              </strong>
              .
            </p>

            <p className="mt-3">
              The customer’s bank or card issuer may require additional time to
              post the credit. Ectoo does not control financial-institution
              posting times.
            </p>

            <p className="mt-3">
              Shipping charges paid for expedited or optional delivery services,
              if any, are not refundable unless the return resulted from our
              error or applicable law requires otherwise.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Late or Missing Refunds
            </h2>

            <p className="mt-3">If an approved refund does not appear:</p>

            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Review the original payment account.</li>
              <li>Contact the bank or card issuer.</li>
              <li>Allow for the institution’s processing period.</li>
              <li>
                Contact{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-medium text-[#111311] underline underline-offset-2"
                >
                  {BUSINESS_INFO.email}
                </a>{" "}
                if the refund still cannot be located.
              </li>
            </ol>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Refused and Undeliverable Orders
            </h2>

            <p className="mt-3">
              Packages returned because of refusal, an inaccurate address, or
              repeated failed delivery may be processed under this policy.
            </p>

            <p className="mt-3">
              Actual carrier costs caused by refusal or inaccurate customer
              information may be deducted from the refund where legally
              permitted.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              Charge and Order Questions
            </h2>

            <p className="mt-3">
              Contact us before initiating a payment dispute so we can
              investigate the order promptly. This request does not restrict any
              rights a customer may have through their card issuer or applicable
              law.
            </p>
          </section>

          <section
            data-reveal
            className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">Contact</h2>

            <div className="mt-3 space-y-1">
              <p className="font-medium text-[#111311]">
                {BUSINESS_INFO.businessName}
              </p>
              <p>1825 Dickinson Ave Ste D</p>
              <p>Dickinson, TX 77539</p>
              <p>United States</p>

              <p className="pt-2">
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-medium text-[#111311] transition-opacity hover:opacity-70"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-medium text-[#111311] transition-opacity hover:opacity-70"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>

              <p>
                Support Hours: {BUSINESS_INFO.businessDays},{" "}
                {BUSINESS_INFO.supportHours}
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-[#E4DED7] bg-[#EEE7DF] px-5 py-16 sm:px-8 lg:px-12">
        <div
          data-reveal="scale"
          className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[28px] bg-[#1F2D22] p-8 text-center text-white shadow-[0_22px_55px_rgba(31,45,34,0.14)] sm:flex-row sm:justify-between sm:p-10 sm:text-left"
        >
          <div>
            <h3 className="font-display text-2xl">Need to start a return?</h3>

            <p className="mt-1 text-sm text-white/60">
              Contact our support team before mailing your return.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-[14px] bg-[#F1EEE8] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Contact Support
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicy;
