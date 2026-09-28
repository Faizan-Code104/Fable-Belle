import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  address: "1825 Dickinson Ave Ste D, Dickinson, TX 77539",
  phoneDisplay: "+1 (832) 347-8821",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
  businessDays: "Monday – Friday",
  supportHours: "9:00 AM – 5:00 PM Central Time",
};

const TermsAndConditions = () => {
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
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" },
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
          transform: translateY(28px);
          transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal="scale"] { transform: scale(.98); }
        [data-reveal].ectoo-visible { opacity: 1; transform: translateY(0) scale(1); }
        .ectoo-term-card { transition: transform .3s ease, box-shadow .3s ease; }
        .ectoo-term-card:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(31,45,34,.05); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
          .ectoo-term-card:hover { transform: none; }
        }
      `}</style>
      {}
      <section className="border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-14 text-center sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div data-reveal="scale" className="mx-auto max-w-4xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1F2D22] text-white">
            <FileText size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-5xl leading-tight text-[#111311] sm:text-6xl">
            Terms &amp; Conditions
          </h1>

          <p className="mt-4 text-sm text-[#5E5B57]">
            Last updated: September 11, 2026
          </p>
        </div>
      </section>

      {}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-5 text-sm leading-7 text-[#5E5B57]">
          <p>
            These Terms and Conditions (“Terms”) govern your access to and use
            of https://www.ectoo.us and any purchase from Ectoo LLC. By using
            our website or placing an order, you agree to these Terms.
          </p>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              1. Business Operator
            </h2>

            <p className="mt-3">The website and Ectoo brand are operated by:</p>

            <div className="mt-3 space-y-1">
              <p>{BUSINESS_INFO.businessName}</p>
              <p>1825 Dickinson Ave Ste D</p>
              <p>Dickinson, TX 77539</p>
              <p>United States</p>

              <p className="pt-2">
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-bold text-[#111311] underline underline-offset-4"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-bold text-[#111311] underline underline-offset-4"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>
            </div>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              2. Eligibility
            </h2>

            <p className="mt-3">
              You must be at least 18 years old or have the involvement and
              permission of a parent or legal guardian to use this website or
              place an order.
            </p>

            <p className="mt-3">
              You agree to provide accurate, current, and complete information.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              3. Products
            </h2>

            <p className="mt-3">
              Ectoo sells handbags, tote bags, crossbody bags, shoulder bags,
              and related fashion accessories.
            </p>

            <p className="mt-3">
              We make reasonable efforts to display product descriptions,
              materials, dimensions, colors, availability, and images
              accurately. Colors and appearance may vary slightly depending on
              lighting, photography, manufacturing variations, and device-screen
              settings.
            </p>

            <p className="mt-3">
              Product images are illustrative of the item offered. Customers
              should review the complete product description before purchasing.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              4. Prices and Currency
            </h2>

            <p className="mt-3">
              All prices are displayed and charged in United States dollars
              unless clearly stated otherwise.
            </p>

            <p className="mt-3">
              Applicable sales tax will be calculated and disclosed during
              checkout where required.
            </p>

            <p className="mt-3">
              We may correct accidental pricing, description, inventory, or
              typographical errors. If an error affects an order, we will
              contact the customer before fulfillment and provide the option to
              accept the correction or receive a cancellation and full refund.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              5. Online Orders
            </h2>

            <p className="mt-3">
              Submitting an order is an offer to purchase. An order is not
              accepted until:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Required payment is successfully authorized.</li>
              <li>We confirm product availability.</li>
              <li>We issue an order confirmation.</li>
            </ul>

            <p className="mt-3">
              We may decline or cancel an order because of inventory errors,
              inaccurate information, suspected fraud, payment failure, delivery
              restrictions, pricing errors, or legal requirements.
            </p>

            <p className="mt-3">
              If we cancel a paid order, the full amount collected for the
              canceled items will be refunded to the original payment method.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">6. Payment</h2>

            <p className="mt-3">
              Ectoo accepts online electronic payments only through the payment
              methods displayed at checkout. We do not accept Cash on Delivery.
            </p>

            <p className="mt-3">
              Online payment processing is currently being set up. Until an
              active payment method is displayed and payment is successfully
              authorized, no completed purchase will be accepted through the
              website.
            </p>

            <p className="mt-3">
              Once activated, payments will be securely processed by an
              authorized third-party payment provider. Ectoo does not offer
              subscription billing or automatically recurring product charges.
            </p>

            <p className="mt-3">
              The exact approved billing descriptor will be disclosed at
              checkout or in the order confirmation before live card payments
              are accepted.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              7. Fraud Prevention
            </h2>

            <p className="mt-3">
              We may use reasonable verification and fraud-prevention measures.
              An order may be held, canceled, or declined if:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Billing or shipping information cannot be verified.</li>
              <li>Payment authorization fails.</li>
              <li>The order appears unauthorized or fraudulent.</li>
              <li>
                Additional verification requested from the customer is not
                provided.
              </li>
              <li>
                The transaction violates payment-network or legal requirements.
              </li>
            </ul>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              8. Shipping
            </h2>

            <p className="mt-3">
              Orders are generally processed within 1–2 business days.
            </p>

            <p className="mt-3">
              After processing, estimated standard delivery is 3–7 business
              days. These periods exclude weekends, federal holidays, severe
              weather, carrier delays, and circumstances outside our reasonable
              control.
            </p>

            <p className="mt-3">
              Free standard shipping is offered on eligible orders delivered
              within our published U.S. shipping area.
            </p>

            <p className="mt-3">
              Complete shipping terms are provided in our{" "}
              <Link
                to="/shipping-policy"
                className="font-bold text-[#111311] underline underline-offset-4"
              >
                Shipping Policy
              </Link>
              .
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              9. Order Tracking
            </h2>

            <p className="mt-3">
              When tracking is available, customers will receive tracking
              information through the email address provided with the order.
            </p>

            <p className="mt-3">
              Tracking updates are supplied by the carrier and may take time to
              appear after a shipping label is created.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              10. Cancellations and Address Changes
            </h2>

            <p className="mt-3">
              Customers should contact us immediately to request a cancellation
              or shipping-address change.
            </p>

            <p className="mt-3">
              A cancellation or modification is available only before the order
              has shipped. Once an order has shipped, it is governed by our
              Return and Refund Policy.
            </p>

            <p className="mt-3">
              We cannot guarantee that an address can be changed after an order
              enters fulfillment.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              11. Returns and Refunds
            </h2>

            <p className="mt-3">
              Eligible products may be returned within 30 days of confirmed
              delivery.
            </p>

            <p className="mt-3">
              Returned products must generally be unused, unworn, unaltered, and
              in their original condition with tags and original packaging.
            </p>

            <p className="mt-3">
              We do not offer direct product exchanges. Customers may return an
              eligible item for a refund and place a separate order for another
              product.
            </p>

            <p className="mt-3">
              No restocking fee is charged on an eligible return. Change-of-mind
              return shipping is the customer’s responsibility. Ectoo covers
              reasonable return shipping for verified damaged, defective, or
              incorrect items.
            </p>

            <p className="mt-3">
              Complete conditions are provided in our{" "}
              <Link
                to="/return-policy"
                className="font-bold text-[#111311] underline underline-offset-4"
              >
                Return and Refund Policy
              </Link>
              .
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              12. Customer Accounts
            </h2>

            <p className="mt-3">
              Customers may be allowed to purchase as a guest or create an
              account. You are responsible for:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Keeping account credentials confidential.</li>
              <li>Providing accurate information.</li>
              <li>Restricting unauthorized access to your device.</li>
              <li>Notifying us promptly of suspected unauthorized activity.</li>
            </ul>

            <p className="mt-3">
              We may suspend or close accounts used for fraud, abuse, unlawful
              conduct, or violations of these Terms.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              13. Acceptable Use
            </h2>

            <p className="mt-3">You may not:</p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Use the website for unlawful or fraudulent activity.</li>
              <li>
                Attempt unauthorized access to accounts, systems, or data.
              </li>
              <li>
                Introduce malicious code or interfere with website operation.
              </li>
              <li>
                Scrape or copy website content for unauthorized commercial use.
              </li>
              <li>Misrepresent your identity or payment authority.</li>
              <li>
                Place orders using stolen or unauthorized payment credentials.
              </li>
              <li>Infringe intellectual-property or privacy rights.</li>
            </ul>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              14. Intellectual Property
            </h2>

            <p className="mt-3">
              The Ectoo name, website design, written content, graphics, logos,
              and original website materials are owned by or licensed to Ectoo
              LLC and are protected by applicable intellectual-property laws.
            </p>

            <p className="mt-3">
              No content may be reproduced, distributed, modified, or
              commercially exploited without written permission, except for
              lawful personal use.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              15. Third-Party Services
            </h2>

            <p className="mt-3">
              The website may rely on third-party services for payment
              processing, hosting, communications, shipping, tracking, or other
              functions.
            </p>

            <p className="mt-3">
              We are not responsible for an independent third party’s systems or
              policies, but we remain responsible for our obligations to
              customers under applicable law.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              16. Product Use and Care
            </h2>

            <p className="mt-3">
              Customers must follow product descriptions and care instructions.
              Damage caused by misuse, accidents, unauthorized alterations,
              improper cleaning, ordinary wear, or failure to follow
              instructions is not considered a manufacturing defect.
            </p>

            <p className="mt-3">
              Nothing in these Terms excludes warranties or consumer rights that
              cannot legally be excluded.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              17. Website Availability
            </h2>

            <p className="mt-3">
              We may update, suspend, or restrict website functionality for
              maintenance, security, technical, or business reasons. We do not
              guarantee uninterrupted or error-free availability.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              18. Disclaimer
            </h2>

            <p className="mt-3">
              To the maximum extent permitted by law, the website and its
              content are provided on an “as available” basis. We do not
              guarantee that every product or website feature will always remain
              available.
            </p>

            <p className="mt-3">
              This disclaimer does not limit any non-waivable legal rights or
              obligations relating to paid products.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              19. Limitation of Liability
            </h2>

            <p className="mt-3">
              To the maximum extent permitted by law, Ectoo LLC will not be
              liable for indirect, incidental, special, punitive, or
              consequential damages arising from use of the website.
            </p>

            <p className="mt-3">
              For a claim concerning a purchased product, our aggregate
              liability will not exceed the amount the customer paid for the
              product giving rise to the claim, except where a greater remedy is
              required by law.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              20. Indemnification
            </h2>

            <p className="mt-3">
              You agree to be responsible for losses or claims caused by your
              unlawful use of the website, fraudulent activity, infringement of
              another party’s rights, or material violation of these Terms.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              21. Delays Outside Our Control
            </h2>

            <p className="mt-3">
              We are not responsible for delays caused by events reasonably
              outside our control, including severe weather, natural disasters,
              carrier interruptions, labor disruptions, government actions,
              emergencies, or failures of third-party infrastructure.
            </p>

            <p className="mt-3">
              If a material shipping delay occurs, we will provide notice and
              available options as required by law.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              22. Governing Law and Venue
            </h2>

            <p className="mt-3">
              These Terms are governed by the laws of the State of Texas,
              without regard to conflict-of-law principles.
            </p>

            <p className="mt-3">
              Subject to any consumer rights that cannot be waived, disputes
              relating to these Terms or the website will be brought in an
              appropriate state or federal court located in Harris County,
              Texas.
            </p>

            <p className="mt-3">
              Before filing a claim, the parties are encouraged to attempt
              resolution by contacting one another in writing.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              23. Severability
            </h2>

            <p className="mt-3">
              If any provision is determined to be unlawful or unenforceable,
              the remaining provisions will continue in effect.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              24. No Waiver
            </h2>

            <p className="mt-3">
              Failure to enforce a provision of these Terms does not waive the
              right to enforce it later.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              25. Assignment
            </h2>

            <p className="mt-3">
              Customers may not transfer their rights or obligations under these
              Terms without our written consent. Ectoo may transfer these Terms
              in connection with a merger, acquisition, financing,
              reorganization, or sale of business assets.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              26. Entire Agreement
            </h2>

            <p className="mt-3">
              These Terms and the policies linked from the website constitute
              the entire agreement concerning website use and product purchases,
              except for any additional terms expressly accepted during
              checkout.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              27. Changes to These Terms
            </h2>

            <p className="mt-3">
              We may update these Terms when our business, website, payment
              arrangements, or legal obligations change. Updated Terms will be
              posted with a revised “Last Updated” date.
            </p>

            <p className="mt-3">
              Changes will not retroactively reduce rights relating to an order
              already accepted unless permitted by law.
            </p>
          </section>

          <section
            data-reveal
            className="ectoo-term-card rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
          >
            <h2 className="font-display text-2xl text-[#111311]">
              28. Contact
            </h2>

            <div className="mt-3 space-y-1">
              <p>{BUSINESS_INFO.businessName}</p>
              <p>1825 Dickinson Ave Ste D</p>
              <p>Dickinson, TX 77539</p>
              <p>United States</p>

              <p className="pt-2">
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-bold text-[#111311] underline underline-offset-4"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-bold text-[#111311] underline underline-offset-4"
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

      {}
      <section className="border-t border-[#E4DED7] bg-[#EEE7DF] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div
          data-reveal="scale"
          className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-[28px] bg-[#1F2D22] p-7 text-white shadow-[0_20px_50px_rgba(31,45,34,0.12)] sm:p-9 md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div>
            <h3 className="font-display text-2xl">Have a question?</h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Visit our contact page for assistance.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#F1EEE8] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all hover:-translate-y-0.5 hover:bg-white md:w-auto"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
