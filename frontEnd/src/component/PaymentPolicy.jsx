import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";
import { BUSINESS_INFO, getFullAddress } from "../storeInfo";

const SECTION_LINKS = [
  { id: "methods", label: "Payment methods" },
  { id: "status", label: "Current status" },
  { id: "currency", label: "Currency" },
  { id: "processing", label: "Processing" },
  { id: "authorization", label: "Authorization" },
  { id: "purchases", label: "Purchases" },
  { id: "descriptor", label: "Billing descriptor" },
  { id: "declined", label: "Declined payments" },
  { id: "refunds", label: "Refunds" },
  { id: "contact", label: "Contact" },
];

const PolicyRow = ({ id, number, title, children }) => (
  <section
    id={`fbpay-${id}`}
    className="fbpay-row"
    aria-labelledby={`fbpay-title-${id}`}
  >
    <div className="fbpay-row-heading">
      <span aria-hidden="true">
        {String(number).padStart(2, "0")}
      </span>
      <h2 id={`fbpay-title-${id}`}>{title}</h2>
    </div>
    <div className="fbpay-row-content">{children}</div>
  </section>
);

const PaymentPolicy = () => {
  const brandName = BUSINESS_INFO.businessName;
  const fullAddress = getFullAddress();

  const phoneHref =
    BUSINESS_INFO.phoneHref ||
    BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

  const supportSchedule = [
    BUSINESS_INFO.businessDays,
    [
      BUSINESS_INFO.supportHours,
      BUSINESS_INFO.timeZone,
    ]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main id="fbpay-top" className="fbpay-page">
      <style>{styles}</style>

      <div className="fbpay-container">
        <div className="fbpay-topline">
          <span>{brandName} / Website information</span>
          <span>
            Updated{" "}
            <time dateTime="2026-10-03">October 3, 2026</time>
          </span>
        </div>

        <header className="fbpay-header">
          <div className="fbpay-title">
            <p className="fbpay-eyebrow">Payment information</p>
            <h1>
              Payment
              <span>Policy.</span>
            </h1>
          </div>

          <div className="fbpay-overview">
            <CreditCard size={36} strokeWidth={1.2} aria-hidden="true" />
            <p>
              {brandName} accepts online electronic payments only through
              the payment methods displayed at checkout. Our online
              payment setup is currently being completed.
            </p>

            <dl>
              <div>
                <dt>Payment type</dt>
                <dd>Online electronic payments</dd>
              </div>
              <div>
                <dt>Currency</dt>
                <dd>United States dollars (USD)</dd>
              </div>
              <div>
                <dt>Purchases</dt>
                <dd>One-time purchases</dd>
              </div>
            </dl>
          </div>
        </header>

        <nav className="fbpay-navigation" aria-label="Payment policy sections">
          <p className="fbpay-eyebrow">Explore the policy</p>
          <ol>
            {SECTION_LINKS.map((section, index) => (
              <li key={section.id}>
                <a href={`#fbpay-${section.id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="fbpay-document" aria-label="Payment policy">
          <PolicyRow
            id="methods"
            number={1}
            title="Online payments only"
          >
            <p>
              {brandName} accepts online electronic payments only through
              the payment methods displayed at checkout.
            </p>
            <p>We do not accept:</p>

            <ul>
              <li>Cash on Delivery.</li>
              <li>Payment by cash through the mail.</li>
              <li>Personal checks.</li>
              <li>Telephone collection of complete payment-card details.</li>
            </ul>
          </PolicyRow>

          <PolicyRow
            id="status"
            number={2}
            title="Current payment status"
          >
            <p>
              {brandName} is currently completing its secure online
              payment setup.
            </p>
            <div className="fbpay-notice">
              <p>
                Until an active payment method is displayed at checkout
                and payment is successfully authorized, no completed
                online purchase will be accepted and no card payment
                will be collected through the website.
              </p>
            </div>
          </PolicyRow>

          <PolicyRow id="currency" number={3} title="Currency">
            <p>
              All product prices and transactions are stated in{" "}
              <strong>United States dollars (USD)</strong>.
            </p>
            <p>
              Applicable sales tax will be calculated and disclosed at
              checkout where required.
            </p>
          </PolicyRow>

          <PolicyRow
            id="processing"
            number={4}
            title="Payment processing"
          >
            <p>
              Once online payments are activated, transactions will be
              processed by an authorized third-party payment processor.
            </p>
            <p>
              {brandName} will not intentionally store complete card
              numbers or card security codes on its own systems.
              Customers should never send complete card information
              through email, contact forms, or voicemail.
            </p>
          </PolicyRow>

          <PolicyRow
            id="authorization"
            number={5}
            title="Authorization"
          >
            <p>
              Submitting payment authorizes the payment processor to
              verify and charge the selected payment method for the
              total amount displayed at checkout.
            </p>
            <p>
              An authorization does not guarantee acceptance. Orders
              remain subject to payment approval, inventory availability,
              fraud review, and order confirmation.
            </p>
          </PolicyRow>

          <PolicyRow
            id="purchases"
            number={6}
            title="One-time purchases"
          >
            <p>
              {brandName} sells products through one-time purchases. We
              do not automatically enroll product customers in recurring
              subscriptions.
            </p>
            <p>
              Any future recurring service would require separate, clear
              disclosure and express customer authorization before billing.
            </p>
          </PolicyRow>

          <PolicyRow
            id="descriptor"
            number={7}
            title="Billing descriptor"
          >
            <p>
              Once payment processing is activated, the exact
              processor-approved billing descriptor will be displayed
              at checkout or in the order confirmation.
            </p>
            <p>
              The descriptor will identify the charge as associated
              with {brandName}.
            </p>
          </PolicyRow>

          <PolicyRow
            id="declined"
            number={8}
            title="Declined payments"
          >
            <p>
              A payment may be declined by the card issuer, payment
              processor, or fraud-prevention system. Customers should
              verify their information or contact their financial
              institution.
            </p>
            <p>{brandName} does not control issuer decline decisions.</p>
          </PolicyRow>

          <PolicyRow id="refunds" number={9} title="Refunds">
            <p>
              Approved refunds are returned to the original payment
              method in accordance with our{" "}
              <Link to="/return-policy">Return and Refund Policy</Link>.
            </p>
          </PolicyRow>

          <PolicyRow id="contact" number={10} title="Contact">
            <div className="fbpay-contact">
              <strong className="fbpay-business">{brandName}</strong>

              {BUSINESS_INFO.email && (
                <a href={`mailto:${BUSINESS_INFO.email}`}>
                  <Mail size={18} aria-hidden="true" />
                  <span>
                    <small>Email</small>
                    {BUSINESS_INFO.email}
                  </span>
                </a>
              )}

              {BUSINESS_INFO.phoneDisplay && phoneHref && (
                <a href={`tel:${phoneHref}`}>
                  <Phone size={18} aria-hidden="true" />
                  <span>
                    <small>Phone</small>
                    {BUSINESS_INFO.phoneDisplay}
                  </span>
                </a>
              )}

              {supportSchedule && (
                <p>Hours: {supportSchedule}</p>
              )}

              {fullAddress && <address>{fullAddress}</address>}

              <Link className="fbpay-contact-link" to="/contact">
                Contact our team
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </PolicyRow>
        </article>

        <section className="fbpay-help" aria-labelledby="fbpay-help-title">
          <div>
            <p className="fbpay-eyebrow">A little assistance</p>
            <h2 id="fbpay-help-title">Have a payment question?</h2>
            <p>Contact our support team for assistance.</p>
          </div>

          <Link to="/contact">
            Contact us
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>

        <footer className="fbpay-footer">
          <span>{brandName} / Payment Policy</span>
          <a href="#fbpay-top">
            Back to top
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
};

const styles = `
  .fbpay-page {
    --ink: #173f36;
    --cream: #f5f0e6;
    --paper: #fffdf5;
    --lime: #d7e5a5;
    --accent: #a56e4f;
    --muted: #516b62;
    --line: rgba(23, 63, 54, .23);
    min-height: 100vh;
    padding-bottom: clamp(30px, 5vw, 65px);
    background: var(--cream);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
    scroll-margin-top: 110px;
  }

  .fbpay-page *,
  .fbpay-page *::before,
  .fbpay-page *::after {
    box-sizing: border-box;
  }

  .fbpay-page a {
    color: inherit;
    text-underline-offset: 4px;
  }

  .fbpay-page a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 5px;
  }

  .fbpay-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbpay-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 24px;
    min-height: 75px;
    padding-block: 18px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbpay-topline > span:last-child {
    color: var(--muted);
  }

  .fbpay-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbpay-header {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr);
    gap: clamp(30px, 5vw, 75px);
    padding-block: clamp(35px, 5vw, 70px);
    animation: fbpayEnter .6s both;
  }

  .fbpay-title {
    align-self: center;
    min-width: 0;
  }

  .fbpay-title h1 {
    margin: 22px 0 0;
    font-size: clamp(58px, 8vw, 115px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.075em;
  }

  .fbpay-title h1 span {
    display: block;
    margin-left: clamp(0px, 5vw, 75px);
    color: var(--accent);
  }

  .fbpay-overview {
    padding: clamp(24px, 3vw, 38px);
    border: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbpay-overview > p {
    margin: 20px 0 25px;
    font-size: 14px;
    line-height: 1.9;
  }

  .fbpay-overview dl {
    margin: 0;
    border-top: 1px solid var(--ink);
  }

  .fbpay-overview dl > div {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 15px;
    padding-block: 14px;
    border-bottom: 1px solid var(--line);
  }

  .fbpay-overview dl > div:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .fbpay-overview dt {
    font-size: 10px;
    color: var(--muted);
  }

  .fbpay-overview dd {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
  }

  .fbpay-navigation {
    padding: 23px 0 30px;
    border-top: 1px solid var(--ink);
  }

  .fbpay-navigation ol {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    margin: 17px 0 0;
    padding: 0;
    list-style: none;
  }

  .fbpay-navigation a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 10px 13px;
    border: 1px solid var(--line);
    font-size: 11px;
    text-decoration: none;
    transition: background .2s ease, border-color .2s ease;
  }

  .fbpay-navigation a span {
    color: var(--accent);
    font-size: 9px;
  }

  .fbpay-navigation a:hover {
    border-color: var(--ink);
    background: var(--lime);
  }

  .fbpay-document {
    border: 1px solid var(--ink);
    background: var(--paper);
    animation: fbpayEnter .6s .08s both;
  }

  .fbpay-row {
    display: grid;
    grid-template-columns: minmax(0, .75fr) minmax(0, 1.25fr);
    gap: clamp(25px, 4vw, 60px);
    padding: clamp(25px, 3.8vw, 50px);
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 110px;
  }

  .fbpay-row:last-child {
    border-bottom: 0;
  }

  .fbpay-row:target {
    background: #f1f4e8;
  }

  .fbpay-row-heading {
    display: grid;
    grid-template-columns: 25px minmax(0, 1fr);
    align-items: start;
    gap: 15px;
  }

  .fbpay-row-heading > span {
    padding-top: 6px;
    color: var(--accent);
    font-size: 11px;
  }

  .fbpay-row h2 {
    margin: 0;
    max-width: 300px;
    font-size: clamp(26px, 2.7vw, 35px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbpay-row-content {
    min-width: 0;
  }

  .fbpay-row-content p,
  .fbpay-row-content address {
    margin: 0 0 15px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbpay-row-content > p:last-child {
    margin-bottom: 0;
  }

  .fbpay-row-content p strong,
  .fbpay-row-content p a {
    color: var(--ink);
    font-weight: 600;
  }

  .fbpay-row-content ul {
    margin: 20px 0 0;
    padding-left: 19px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
  }

  .fbpay-row-content li {
    padding-block: 5px;
  }

  .fbpay-notice {
    padding: 22px;
    border-left: 3px solid var(--accent);
    background: var(--cream);
  }

  .fbpay-notice p {
    margin: 0;
  }

  .fbpay-contact {
    display: grid;
    justify-items: start;
    gap: 15px;
  }

  .fbpay-business {
    font-size: 19px;
    font-weight: 600;
  }

  .fbpay-contact a {
    display: inline-flex;
    align-items: center;
    gap: 13px;
    max-width: 100%;
    min-height: 44px;
    font-size: 13px;
    text-decoration: none;
  }

  .fbpay-contact a > span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .fbpay-contact small {
    display: block;
    margin-bottom: 5px;
    color: var(--muted);
    font-size: 10px;
  }

  .fbpay-contact svg {
    flex-shrink: 0;
  }

  .fbpay-contact a:hover {
    color: var(--accent);
  }

  .fbpay-contact p,
  .fbpay-contact address {
    margin: 0;
  }

  .fbpay-contact address {
    font-style: normal;
  }

  .fbpay-contact .fbpay-contact-link {
    border-bottom: 1px solid var(--ink);
    font-weight: 600;
  }

  .fbpay-help {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-top: 30px;
    padding: clamp(25px, 4vw, 50px);
    border: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbpay-help h2 {
    margin: 15px 0 12px;
    font-size: clamp(29px, 3.5vw, 45px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbpay-help div > p:last-child {
    margin: 0;
    font-size: 13px;
    line-height: 1.8;
  }

  .fbpay-help > a {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 30px;
    min-height: 54px;
    padding: 15px 22px;
    background: var(--ink);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: transform .2s ease;
  }

  .fbpay-help > a:hover {
    transform: translateY(-2px);
  }

  .fbpay-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px 20px;
    margin-top: 20px;
    font-size: 10px;
  }

  .fbpay-footer a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    text-decoration: none;
  }

  @keyframes fbpayEnter {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1000px) {
    .fbpay-header {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 30px;
    }

    .fbpay-title h1 {
      font-size: clamp(58px, 8.5vw, 85px);
    }

    .fbpay-row {
      grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
      gap: 28px;
      padding: 32px 28px;
    }
  }

  @media (max-width: 760px) {
    .fbpay-header {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbpay-title h1 {
      font-size: clamp(65px, 12vw, 100px);
    }

    .fbpay-title h1 span {
      display: inline;
      margin-left: 12px;
    }

    .fbpay-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
    }

    .fbpay-row h2 {
      max-width: none;
    }

    .fbpay-help {
      flex-direction: column;
      align-items: stretch;
    }

    .fbpay-help > a {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .fbpay-topline {
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;
      font-size: 10px;
    }

    .fbpay-title h1 {
      font-size: clamp(58px, 17vw, 78px);
    }

    .fbpay-title h1 span {
      display: block;
      margin-left: 0;
    }

    .fbpay-overview {
      padding: 24px 20px;
    }

    .fbpay-overview dl > div {
      grid-template-columns: 80px minmax(0, 1fr);
      gap: 12px;
    }

    .fbpay-navigation ol {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .fbpay-navigation a {
      width: 100%;
      height: 100%;
      font-size: 10px;
      padding: 10px;
    }

    .fbpay-row {
      padding: 27px 20px;
    }

    .fbpay-row-heading {
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 10px;
    }

    .fbpay-row h2 {
      font-size: 27px;
    }

    .fbpay-row-content p,
    .fbpay-row-content address {
      font-size: 13px;
    }

    .fbpay-notice {
      padding: 18px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbpay-page *,
    .fbpay-page *::before,
    .fbpay-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default PaymentPolicy;