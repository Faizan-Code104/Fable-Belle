import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
} from "lucide-react";
import { BUSINESS_INFO } from "../storeInfo";

const RETURN_STEPS = [
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

const SupportContact = () => {
  const phoneHref =
    BUSINESS_INFO.phoneHref ||
    BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

  return (
    <div className="fbreturn-contact-links">
      {BUSINESS_INFO.email && (
        <a href={`mailto:${BUSINESS_INFO.email}`}>
          <Mail size={17} aria-hidden="true" />
          <span>{BUSINESS_INFO.email}</span>
        </a>
      )}

      {BUSINESS_INFO.phoneDisplay && phoneHref && (
        <a href={`tel:${phoneHref}`}>
          <Phone size={17} aria-hidden="true" />
          <span>{BUSINESS_INFO.phoneDisplay}</span>
        </a>
      )}

      <Link to="/contact">
        Contact our team
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
};

const BusinessAddress = () => {
  const lines = [
    BUSINESS_INFO.addressLine1,
    BUSINESS_INFO.addressLine2,
    BUSINESS_INFO.country,
  ].filter(Boolean);

  return (
    <address className="fbreturn-address">
      <strong>{BUSINESS_INFO.businessName}</strong>
      {lines.map((line, index) => (
        <span key={`${index}-${line}`}>{line}</span>
      ))}
    </address>
  );
};

const PolicySection = ({ id, number, title, children }) => (
  <section
    id={`fbreturn-${id}`}
    className="fbreturn-section"
    aria-labelledby={`fbreturn-title-${id}`}
  >
    <div className="fbreturn-section-title">
      <span aria-hidden="true">
        {String(number).padStart(2, "0")}
      </span>
      <h2 id={`fbreturn-title-${id}`}>{title}</h2>
    </div>
    <div className="fbreturn-section-content">{children}</div>
  </section>
);

const ReturnPolicy = () => {
  const brand = BUSINESS_INFO.businessName;

  const hasAddress = Boolean(
    BUSINESS_INFO.addressLine1 ||
      BUSINESS_INFO.addressLine2 ||
      BUSINESS_INFO.country
  );

  const supportSchedule = [
    BUSINESS_INFO.businessDays,
    [BUSINESS_INFO.supportHours, BUSINESS_INFO.timeZone]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ");

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
    `Products not purchased directly from ${brand}`,
  ];

  return (
    <main id="fbreturn-top" className="fbreturn-page">
      <style>{styles}</style>

      <div className="fbreturn-container">
        <div className="fbreturn-topline">
          <span>{brand} / Return & Refund Policy</span>
          <span>
            Last updated:{" "}
            <time dateTime="2026-10-03">October 3, 2026</time>
          </span>
        </div>

        <header className="fbreturn-header">
          <div>
            <p className="fbreturn-eyebrow">Returns & refunds</p>
            <h1>
              A little
              <span>reconsideration.</span>
            </h1>
            <p className="fbreturn-intro">
              {brand} accepts eligible returns requested within 30 days
              of confirmed delivery. Products must meet the return
              conditions described below.
            </p>
          </div>

          <div className="fbreturn-window">
            <span className="fbreturn-eyebrow">Return window</span>
            <strong>30</strong>
            <span className="fbreturn-window-unit">days</span>
            <p>From confirmed delivery, subject to eligibility.</p>
            <a href="#fbreturn-starting">
              Start with authorization
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </header>

        <nav className="fbreturn-navigation" aria-label="Return policy navigation">
          <a href="#fbreturn-conditions">Return conditions</a>
          <a href="#fbreturn-process">Return process</a>
          <a href="#fbreturn-starting">Start a return</a>
          <a href="#fbreturn-damaged">Damaged products</a>
          <a href="#fbreturn-refunds">Refund timing</a>
          <a href="#fbreturn-contact">Contact</a>
        </nav>

        <section
          id="fbreturn-conditions"
          className="fbreturn-conditions"
          aria-labelledby="fbreturn-conditions-title"
        >
          <div className="fbreturn-block-heading">
            <p className="fbreturn-eyebrow">Before you begin</p>
            <h2 id="fbreturn-conditions-title">Check the conditions.</h2>
          </div>

          <div className="fbreturn-condition-columns">
            <div>
              <h3>Eligible for return</h3>
              <ul>
                {eligible.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>May not be eligible</h3>
              <ul>
                {notEligible.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="fbreturn-process"
          className="fbreturn-process"
          aria-labelledby="fbreturn-process-title"
        >
          <div className="fbreturn-block-heading">
            <p className="fbreturn-eyebrow">How to return an item</p>
            <h2 id="fbreturn-process-title">The return journey.</h2>
          </div>

          <ol>
            {RETURN_STEPS.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <article className="fbreturn-document" aria-label="Return and refund policy">
          <div className="fbreturn-document-heading">
            <p className="fbreturn-eyebrow">The full policy</p>
            <span>Return & Refund Policy</span>
          </div>

          <PolicySection id="eligibility" number={1} title="Return eligibility">
            <p>
              To qualify for a return, the product must be unused and
              unworn, unwashed and unaltered, free from stains, odors,
              scratches, or customer-caused damage, and returned with its
              original tags, accessories, and packaging.
            </p>
            <p>
              The return must also be accompanied by the order number or
              proof of purchase.
            </p>
            <p>
              Products returned without authorization or outside the
              return period may be refused.
            </p>
          </PolicySection>

          <PolicySection id="starting" number={2} title="Starting a return">
            <p>
              Before mailing a return, contact our support team using the
              following details:
            </p>

            <SupportContact />

            <p>Please provide:</p>
            <ul>
              <li>Customer name.</li>
              <li>Order number.</li>
              <li>Product being returned.</li>
              <li>Reason for return.</li>
              <li>
                Photographs if the item is damaged, defective, or incorrect.
              </li>
            </ul>
            <p>
              If approved, we will provide return instructions. Do not
              mail a product until return authorization has been provided.
            </p>
          </PolicySection>

          <PolicySection id="address" number={3} title="Return address">
            <p>
              {hasAddress
                ? "Authorized returns should be sent as instructed to:"
                : "Authorized returns should be sent to the address provided in our return instructions."}
            </p>

            {hasAddress && <BusinessAddress />}

            <p>
              The customer should retain the return tracking number and
              shipping receipt until the refund is completed.
            </p>
          </PolicySection>

          <PolicySection
            id="change-of-mind"
            number={4}
            title="Change-of-mind returns"
          >
            <p>
              If a customer changes their mind, orders the wrong item,
              or no longer wants the product:
            </p>
            <ul>
              <li>The customer is responsible for return-shipping costs.</li>
              <li>The return shipment should include tracking.</li>
              <li>
                {brand} is not responsible for a return lost before it
                reaches us.
              </li>
              <li>
                The product must satisfy all return-eligibility requirements.
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id="damaged"
            number={5}
            title="Damaged, defective, or incorrect products"
          >
            <p>
              A damaged, defective, or incorrect product should be
              reported within <strong>48 hours of delivery</strong>.
            </p>
            <p>The customer should provide photographs of:</p>
            <ul>
              <li>The product.</li>
              <li>The packaging.</li>
              <li>The shipping label.</li>
              <li>The damaged or incorrect area.</li>
            </ul>
            <p>
              After verification, {brand} will provide appropriate return
              instructions and cover reasonable return-shipping costs.
            </p>
          </PolicySection>

          <PolicySection id="exchanges" number={6} title="Exchanges">
            <p>We do <strong>not offer direct exchanges</strong>.</p>
            <p>
              A customer who wants another color, style, or product may
              return the eligible original product for a refund and
              place a separate order.
            </p>
          </PolicySection>

          <PolicySection id="fees" number={7} title="Restocking fees">
            <p>
              {brand} does <strong>not charge a restocking fee</strong>{" "}
              for an eligible return.
            </p>
          </PolicySection>

          <PolicySection
            id="non-returnable"
            number={8}
            title="Non-returnable products"
          >
            <p>A return may be refused if the product:</p>
            <ul>
              <li>Was used, worn, washed, altered, or damaged after delivery.</li>
              <li>
                Is missing tags, accessories, components, or original packaging.
              </li>
              <li>Shows signs of misuse, improper cleaning, or ordinary wear.</li>
              <li>Is returned more than 30 days after delivery.</li>
              <li>Was mailed without authorization.</li>
              <li>Was not purchased directly from {brand}.</li>
            </ul>
            <p>
              These exclusions do not limit legal rights concerning
              defective or misrepresented products.
            </p>
          </PolicySection>

          <PolicySection id="inspection" number={9} title="Return inspection">
            <p>
              Returned products are inspected after receipt. We will
              notify the customer whether the return has been approved
              or rejected.
            </p>
            <p>
              If a return does not meet the stated conditions, we will
              explain the reason and may ask the customer to pay for
              shipment of the product back to them.
            </p>
          </PolicySection>

          <PolicySection id="refunds" number={10} title="Refund timing">
            <p>
              Approved refunds are issued to the{" "}
              <strong>
                original payment method within 5–7 business days after inspection
              </strong>.
            </p>
            <p>
              The customer’s bank or card issuer may require additional
              time to post the credit. {brand} does not control
              financial-institution posting times.
            </p>
            <p>
              Shipping charges paid for expedited or optional delivery
              services, if any, are not refundable unless the return
              resulted from our error or applicable law requires otherwise.
            </p>
          </PolicySection>

          <PolicySection
            id="missing-refunds"
            number={11}
            title="Late or missing refunds"
          >
            <p>If an approved refund does not appear:</p>
            <ol>
              <li>Review the original payment account.</li>
              <li>Contact the bank or card issuer.</li>
              <li>Allow for the institution’s processing period.</li>
              <li>
                Contact{" "}
                {BUSINESS_INFO.email ? (
                  <a href={`mailto:${BUSINESS_INFO.email}`}>
                    {BUSINESS_INFO.email}
                  </a>
                ) : (
                  <Link to="/contact">our support team</Link>
                )}{" "}
                if the refund still cannot be located.
              </li>
            </ol>
          </PolicySection>

          <PolicySection
            id="undeliverable"
            number={12}
            title="Refused and undeliverable orders"
          >
            <p>
              Packages returned because of refusal, an inaccurate
              address, or repeated failed delivery may be processed
              under this policy.
            </p>
            <p>
              Actual carrier costs caused by refusal or inaccurate
              customer information may be deducted from the refund
              where legally permitted.
            </p>
          </PolicySection>

          <PolicySection
            id="questions"
            number={13}
            title="Charge and order questions"
          >
            <p>
              Contact us before initiating a payment dispute so we can
              investigate the order promptly. This request does not
              restrict any rights a customer may have through their
              card issuer or applicable law.
            </p>
          </PolicySection>

          <PolicySection id="contact" number={14} title="Contact">
            <BusinessAddress />
            <SupportContact />
            {supportSchedule && <p>Support Hours: {supportSchedule}</p>}
          </PolicySection>

          <footer className="fbreturn-document-footer">
            <span>{brand} / Return & Refund Policy</span>
            <a href="#fbreturn-top">
              Back to top
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </footer>
        </article>

        <section className="fbreturn-help" aria-labelledby="fbreturn-help-title">
          <div>
            <p className="fbreturn-eyebrow">Our team can help</p>
            <h2 id="fbreturn-help-title">Need to start a return?</h2>
            <p>Contact our support team before mailing your return.</p>
          </div>
          <Link to="/contact">
            Contact support
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
};

const styles = `
  .fbreturn-page {
    --ink: #173f36;
    --cream: #f5f0e6;
    --paper: #fffdf5;
    --lime: #d7e5a5;
    --accent: #a56e4f;
    --muted: #516b62;
    --line: rgba(23, 63, 54, .23);
    min-height: 100vh;
    padding-bottom: clamp(45px, 6vw, 85px);
    background: var(--cream);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
    scroll-margin-top: 110px;
  }

  .fbreturn-page *,
  .fbreturn-page *::before,
  .fbreturn-page *::after {
    box-sizing: border-box;
  }

  .fbreturn-page a {
    color: inherit;
    text-underline-offset: 4px;
  }

  .fbreturn-page a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 5px;
  }

  .fbreturn-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbreturn-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding-block: 25px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbreturn-topline > span:last-child {
    color: var(--muted);
  }

  .fbreturn-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbreturn-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    align-items: center;
    gap: 40px;
    padding-block: clamp(40px, 6vw, 80px);
    animation: fbreturnEnter .6s both;
  }

  .fbreturn-header h1 {
    margin: 22px 0 28px;
    font-size: clamp(45px, 5.8vw, 83px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -.07em;
  }

  .fbreturn-header h1 span {
    display: block;
    color: var(--accent);
  }

  .fbreturn-intro {
    max-width: 590px;
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
  }

  .fbreturn-window {
    display: flex;
    flex-direction: column;
    padding: 28px;
    border: 1px solid var(--ink);
    background: var(--lime);
    box-shadow: 7px 7px 0 rgba(23, 63, 54, .1);
  }

  .fbreturn-window > strong {
    margin-top: 10px;
    font-size: 115px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: -.08em;
  }

  .fbreturn-window-unit {
    font-size: 31px;
    line-height: 1;
    letter-spacing: -.04em;
  }

  .fbreturn-window > p {
    margin: 22px 0 14px;
    font-size: 11px;
    line-height: 1.8;
  }

  .fbreturn-window a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    border-top: 1px solid var(--ink);
    font-size: 11px;
    text-decoration: none;
  }

  .fbreturn-navigation {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    padding-block: 18px;
    border-block: 1px solid var(--ink);
  }

  .fbreturn-navigation a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-size: 12px;
    text-decoration: none;
  }

  .fbreturn-navigation a:hover {
    color: var(--accent);
  }

  .fbreturn-conditions,
  .fbreturn-process {
    padding-block: clamp(35px, 5vw, 60px);
    scroll-margin-top: 110px;
  }

  .fbreturn-block-heading h2 {
    margin: 15px 0 28px;
    font-size: clamp(32px, 3.8vw, 49px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbreturn-condition-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-top: 1px solid var(--ink);
  }

  .fbreturn-condition-columns > div {
    min-width: 0;
    padding: 28px 30px 0 0;
  }

  .fbreturn-condition-columns > div:last-child {
    border-left: 1px solid var(--line);
    padding: 28px 0 0 30px;
  }

  .fbreturn-condition-columns h3 {
    margin: 0 0 20px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -.04em;
  }

  .fbreturn-condition-columns > div:last-child h3 {
    color: var(--accent);
  }

  .fbreturn-condition-columns ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fbreturn-condition-columns li {
    padding-block: 13px;
    border-bottom: 1px solid var(--line);
    color: var(--muted);
    font-size: 13px;
    line-height: 1.8;
  }

  .fbreturn-process {
    padding: clamp(25px, 4vw, 50px);
    border: 1px solid var(--ink);
    background: var(--lime);
    margin-bottom: 40px;
  }

  .fbreturn-process ol {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 25px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fbreturn-process li {
    padding-top: 18px;
    border-top: 1px solid var(--ink);
  }

  .fbreturn-process li > span {
    color: var(--accent);
    font-size: 11px;
  }

  .fbreturn-process h3 {
    margin: 22px 0 12px;
    font-size: 21px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.035em;
  }

  .fbreturn-process li p {
    margin: 0;
    font-size: 12px;
    line-height: 1.9;
  }

  .fbreturn-document {
    border: 1px solid var(--ink);
    background: var(--paper);
    animation: fbreturnEnter .6s .08s both;
  }

  .fbreturn-document-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 23px 30px;
    border-bottom: 1px solid var(--ink);
  }

  .fbreturn-document-heading > span {
    font-size: 11px;
    color: var(--muted);
  }

  .fbreturn-section {
    display: grid;
    grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
    gap: clamp(25px, 4vw, 60px);
    padding: clamp(25px, 3.8vw, 50px);
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 110px;
  }

  .fbreturn-section:target {
    background: #f1f4e8;
  }

  .fbreturn-section-title {
    display: grid;
    grid-template-columns: 25px minmax(0, 1fr);
    align-items: start;
    gap: 15px;
  }

  .fbreturn-section-title > span {
    padding-top: 6px;
    color: var(--accent);
    font-size: 11px;
  }

  .fbreturn-section h2 {
    margin: 0;
    font-size: clamp(25px, 2.5vw, 33px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbreturn-section-content {
    min-width: 0;
  }

  .fbreturn-section-content p {
    margin: 0 0 15px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbreturn-section-content > p:last-child {
    margin-bottom: 0;
  }

  .fbreturn-section-content strong,
  .fbreturn-section-content p a,
  .fbreturn-section-content li a {
    color: var(--ink);
    font-weight: 600;
  }

  .fbreturn-section-content ul,
  .fbreturn-section-content ol {
    margin: 18px 0 22px;
    padding-left: 20px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
  }

  .fbreturn-section-content ul:last-child,
  .fbreturn-section-content ol:last-child {
    margin-bottom: 0;
  }

  .fbreturn-section-content li {
    padding-block: 5px;
  }

  .fbreturn-address {
    display: grid;
    gap: 5px;
    margin: 18px 0 22px;
    color: var(--muted);
    font-size: 13px;
    font-style: normal;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbreturn-address strong {
    font-size: 17px;
  }

  .fbreturn-contact-links {
    display: grid;
    justify-items: start;
    gap: 8px;
    margin: 15px 0 22px;
  }

  .fbreturn-contact-links a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    max-width: 100%;
    min-height: 44px;
    font-size: 13px;
    text-decoration: none;
  }

  .fbreturn-contact-links a > span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .fbreturn-contact-links svg {
    flex-shrink: 0;
  }

  .fbreturn-contact-links a:hover {
    color: var(--accent);
  }

  .fbreturn-document-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px 20px;
    padding: 20px 30px;
    font-size: 10px;
  }

  .fbreturn-document-footer a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  .fbreturn-help {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-top: 35px;
    padding-block: 35px;
    border-bottom: 1px solid var(--ink);
  }

  .fbreturn-help h2 {
    margin: 15px 0;
    font-size: clamp(31px, 3.7vw, 48px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbreturn-help div > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.8;
  }

  .fbreturn-help > a {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 25px;
    min-height: 54px;
    padding: 15px 22px;
    background: var(--ink);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: transform .2s ease;
  }

  .fbreturn-help > a:hover {
    transform: translateY(-2px);
  }

  @keyframes fbreturnEnter {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1000px) {
    .fbreturn-header {
      grid-template-columns: minmax(0, 1fr) 245px;
      gap: 25px;
    }

    .fbreturn-header h1 {
      font-size: clamp(40px, 5.5vw, 60px);
    }

    .fbreturn-process ol {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 30px;
    }

    .fbreturn-section {
      gap: 25px;
      padding: 32px 28px;
    }
  }

  @media (max-width: 760px) {
    .fbreturn-header {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbreturn-header h1 {
      font-size: clamp(39px, 7.5vw, 65px);
    }

    .fbreturn-window {
      max-width: 350px;
      width: 100%;
    }

    .fbreturn-condition-columns {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbreturn-condition-columns > div,
    .fbreturn-condition-columns > div:last-child {
      border-left: 0;
      padding: 25px 0 0;
    }

    .fbreturn-condition-columns > div:last-child {
      margin-top: 20px;
    }

    .fbreturn-section {
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
    }

    .fbreturn-help {
      flex-direction: column;
      align-items: stretch;
    }

    .fbreturn-help > a {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .fbreturn-topline {
      align-items: flex-start;
      flex-direction: column;
      font-size: 10px;
    }

    .fbreturn-header h1 {
      font-size: clamp(31px, 8.8vw, 43px);
    }

    .fbreturn-navigation {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px 15px;
    }

    .fbreturn-navigation a {
      font-size: 11px;
    }

    .fbreturn-process ol {
      grid-template-columns: minmax(0, 1fr);
      gap: 25px;
    }

    .fbreturn-process h3 {
      margin-top: 15px;
    }

    .fbreturn-section {
      padding: 27px 20px;
    }

    .fbreturn-section-title {
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 10px;
    }

    .fbreturn-section h2 {
      font-size: 27px;
    }

    .fbreturn-section-content p {
      font-size: 13px;
    }

    .fbreturn-document-heading,
    .fbreturn-document-footer {
      padding-inline: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbreturn-page *,
    .fbreturn-page *::before,
    .fbreturn-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default ReturnPolicy;