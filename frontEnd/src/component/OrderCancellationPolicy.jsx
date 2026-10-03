import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Mail,
  Phone,
  RotateCcw,
} from "lucide-react";
import { BUSINESS_INFO, getFullAddress } from "../storeInfo";

const REQUEST_ITEMS = [
  "Customer name",
  "Order number",
  "Email address used for the order",
  "Reason for cancellation",
];

const PolicySection = ({ number, title, children }) => (
  <section
    className="fbcancel-section"
    aria-labelledby={`fbcancel-heading-${number}`}
  >
    <span className="fbcancel-number" aria-hidden="true">
      {String(number).padStart(2, "0")}
    </span>
    <div>
      <h2 id={`fbcancel-heading-${number}`}>{title}</h2>
      {children}
    </div>
  </section>
);

const OrderCancellationPolicy = () => {
  const brandName = BUSINESS_INFO.businessName;
  const fullAddress = getFullAddress();

  const phoneHref =
    BUSINESS_INFO.phoneHref ||
    BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

  const supportTime = [
    BUSINESS_INFO.supportHours,
    BUSINESS_INFO.timeZone,
  ]
    .filter(Boolean)
    .join(" ");

  const supportSchedule = [
    BUSINESS_INFO.businessDays,
    supportTime,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main id="fbcancel-top" className="fbcancel-page">
      <style>{styles}</style>

      <div className="fbcancel-container">
        <div className="fbcancel-topline">
          <span>{brandName} / Customer care</span>
          <Link to="/contact">
            Contact our team
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <header className="fbcancel-header">
          <p className="fbcancel-eyebrow">Order cancellation policy</p>
          <h1>
            A change
            <span>of plans.</span>
          </h1>

          <div className="fbcancel-header-bottom">
            <p>
              Customers may request an order cancellation before the order
              has shipped. Cancellation requests should be submitted as
              soon as possible.
            </p>
            <span className="fbcancel-date">
              Last updated
              <time dateTime="2026-10-03">October 3, 2026</time>
            </span>
          </div>
        </header>

        <div className="fbcancel-layout">
          <article
            className="fbcancel-document"
            aria-label="Order cancellation policy"
          >
            <PolicySection number={1} title="Cancellation requests">
              <p>
                Customers may request an order cancellation before the
                order has shipped.
              </p>
              <p>
                To request cancellation, contact{" "}
                {BUSINESS_INFO.email ? (
                  <a href={`mailto:${BUSINESS_INFO.email}`}>
                    {BUSINESS_INFO.email}
                  </a>
                ) : (
                  <Link to="/contact">our customer support team</Link>
                )}{" "}
                as soon as possible and include:
              </p>

              <ul className="fbcancel-request-list">
                {REQUEST_ITEMS.map((item) => (
                  <li key={item}>{item}.</li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection number={2} title="Fulfillment and shipment">
              <p>
                We cannot guarantee cancellation after an order has
                entered fulfillment.
              </p>
              <p>
                Once tracking has been issued or the order has shipped,
                the customer must follow our{" "}
                <Link to="/return-policy">
                  Return and Refund Policy
                </Link>
                .
              </p>
            </PolicySection>

            <PolicySection number={3} title="Cancellation refunds">
              <p>
                Approved cancellations are refunded to the original
                payment method.
              </p>
              <p>
                The refund is generally submitted within{" "}
                <strong>5–7 business days</strong>, although the
                customer’s bank may require additional posting time.
              </p>
            </PolicySection>

            <PolicySection
              number={4}
              title={`Cancellations by ${brandName}`}
            >
              <p>
                If {brandName} cancels an order because of unavailable
                inventory, a pricing error, delivery restrictions,
                payment problems, or suspected fraud, any collected
                payment for the canceled products will be returned to
                the original payment method.
              </p>
            </PolicySection>

            <PolicySection number={5} title="Shipping address changes">
              <p>
                Shipping-address changes are also available only before
                shipment and cannot be guaranteed after fulfillment
                begins.
              </p>
              <p>
                Customers should contact us immediately if an address
                correction is needed.
              </p>
            </PolicySection>

            <PolicySection number={6} title="Contact">
              <div className="fbcancel-contact">
                <strong className="fbcancel-business">
                  {brandName}
                </strong>

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

                {supportSchedule && (
                  <p>Hours: {supportSchedule}</p>
                )}

                {fullAddress && (
                  <address>{fullAddress}</address>
                )}

                <Link to="/contact">
                  Contact our team
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </PolicySection>

            <footer className="fbcancel-document-footer">
              <span>{brandName} / Order Cancellation Policy</span>
              <a href="#fbcancel-top">
                Back to top
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </footer>
          </article>

          <aside
            className="fbcancel-sidebar"
            aria-label="Cancellation summary"
          >
            <div className="fbcancel-summary">
              <p className="fbcancel-eyebrow">At a glance</p>
              <h2>Before it ships.</h2>

              <dl>
                <div>
                  <dt>Cancellation window</dt>
                  <dd>Before shipment</dd>
                </div>
                <div>
                  <dt>Refund method</dt>
                  <dd>Original payment method</dd>
                </div>
                <div>
                  <dt>Refund submission</dt>
                  <dd>5–7 business days</dd>
                </div>
              </dl>

              <div className="fbcancel-reminder">
                <Clock3 size={21} aria-hidden="true" />
                <div>
                  <h3>Request early</h3>
                  <p>
                    Contact us as soon as possible before the order
                    enters shipment or tracking is issued.
                  </p>
                </div>
              </div>

              <div className="fbcancel-reminder">
                <ArrowUpRight size={21} aria-hidden="true" />
                <div>
                  <h3>Before shipment</h3>
                  <p>
                    Cancellation and address-change requests are
                    available only before shipment and cannot be
                    guaranteed after fulfillment begins.
                  </p>
                </div>
              </div>

              <div className="fbcancel-reminder">
                <RotateCcw size={21} aria-hidden="true" />
                <div>
                  <h3>Refund</h3>
                  <p>
                    Approved cancellations are refunded to the original
                    payment method.
                  </p>
                </div>
              </div>
            </div>

            <div className="fbcancel-help">
              <p className="fbcancel-eyebrow">Need to cancel an order?</p>
              <h2>Let us know.</h2>
              <p>
                Contact us as soon as possible before your order ships.
              </p>
              <Link to="/contact">
                Contact us
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

const styles = `
  .fbcancel-page {
    --ink: #173f36;
    --cream: #f5f0e6;
    --paper: #fffdf5;
    --lime: #d7e5a5;
    --accent: #a56e4f;
    --muted: #516b62;
    --line: rgba(23, 63, 54, .23);
    min-height: 100vh;
    padding-bottom: clamp(50px, 7vw, 95px);
    background: var(--cream);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
    scroll-margin-top: 100px;
  }

  .fbcancel-page *,
  .fbcancel-page *::before,
  .fbcancel-page *::after {
    box-sizing: border-box;
  }

  .fbcancel-page a {
    color: inherit;
    text-underline-offset: 4px;
  }

  .fbcancel-page a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 5px;
  }

  .fbcancel-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbcancel-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 20px;
    padding-block: 18px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbcancel-topline a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    font-weight: 600;
    text-decoration: none;
  }

  .fbcancel-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbcancel-header {
    padding-block: clamp(35px, 5vw, 65px);
    animation: fbcancelEnter .6s both;
  }

  .fbcancel-header h1 {
    margin: 20px 0 30px;
    font-size: clamp(58px, 8.5vw, 120px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.07em;
  }

  .fbcancel-header h1 span {
    display: block;
    margin-left: clamp(0px, 10vw, 145px);
    color: var(--accent);
  }

  .fbcancel-header-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 25px;
    padding-top: 25px;
    border-top: 1px solid var(--ink);
  }

  .fbcancel-header-bottom > p {
    max-width: 650px;
    margin: 0;
    color: var(--muted);
    font-size: 15px;
    line-height: 1.9;
  }

  .fbcancel-date {
    flex-shrink: 0;
    color: var(--muted);
    font-size: 10px;
  }

  .fbcancel-date time {
    display: block;
    margin-top: 6px;
    color: var(--ink);
    font-size: 12px;
  }

  .fbcancel-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
    align-items: start;
    gap: clamp(25px, 4vw, 55px);
  }

  .fbcancel-document {
    min-width: 0;
    border: 1px solid var(--ink);
    background: var(--paper);
    animation: fbcancelEnter .6s .08s both;
  }

  .fbcancel-section {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 20px;
    padding: clamp(25px, 3vw, 42px);
    border-bottom: 1px solid var(--line);
  }

  .fbcancel-section > div {
    min-width: 0;
  }

  .fbcancel-number {
    padding-top: 6px;
    color: var(--accent);
    font-size: 11px;
  }

  .fbcancel-section h2 {
    margin: 0 0 18px;
    font-size: clamp(25px, 2.5vw, 33px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbcancel-section p,
  .fbcancel-section address {
    margin: 0 0 14px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbcancel-section p:last-child {
    margin-bottom: 0;
  }

  .fbcancel-section p a,
  .fbcancel-section p strong {
    color: var(--ink);
    font-weight: 600;
  }

  .fbcancel-request-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 25px;
    margin: 22px 0 0;
    padding-left: 18px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.8;
  }

  .fbcancel-request-list li {
    padding-block: 8px;
  }

  .fbcancel-contact {
    display: grid;
    justify-items: start;
    gap: 12px;
  }

  .fbcancel-business {
    font-size: 17px;
    font-weight: 600;
  }

  .fbcancel-contact a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    max-width: 100%;
    min-height: 44px;
    font-size: 13px;
    text-decoration: none;
  }

  .fbcancel-contact a span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .fbcancel-contact svg {
    flex-shrink: 0;
  }

  .fbcancel-contact a:hover {
    color: var(--accent);
  }

  .fbcancel-contact p,
  .fbcancel-contact address {
    margin: 0;
  }

  .fbcancel-contact address {
    font-style: normal;
  }

  .fbcancel-document-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px 20px;
    padding: 20px 28px;
    font-size: 10px;
  }

  .fbcancel-document-footer a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  .fbcancel-sidebar {
    position: sticky;
    top: 110px;
    min-width: 0;
    animation: fbcancelEnter .6s .15s both;
  }

  .fbcancel-summary {
    padding: 28px;
    border: 1px solid var(--ink);
  }

  .fbcancel-summary > h2,
  .fbcancel-help h2 {
    margin: 17px 0 24px;
    font-size: 38px;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -.055em;
  }

  .fbcancel-summary dl {
    margin: 0 0 25px;
    border-top: 1px solid var(--ink);
  }

  .fbcancel-summary dl > div {
    padding-block: 17px;
    border-bottom: 1px solid var(--line);
  }

  .fbcancel-summary dt {
    color: var(--muted);
    font-size: 10px;
  }

  .fbcancel-summary dd {
    margin: 6px 0 0;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -.025em;
  }

  .fbcancel-reminder {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 12px;
    margin-top: 22px;
  }

  .fbcancel-reminder > svg {
    margin-top: 2px;
    color: var(--accent);
  }

  .fbcancel-reminder h3 {
    margin: 0 0 7px;
    font-size: 15px;
    font-weight: 600;
  }

  .fbcancel-reminder p {
    margin: 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.9;
  }

  .fbcancel-help {
    margin-top: 22px;
    padding: 28px;
    background: var(--lime);
    border: 1px solid var(--ink);
  }

  .fbcancel-help h2 {
    margin-bottom: 15px;
  }

  .fbcancel-help > p:not(.fbcancel-eyebrow) {
    margin: 0;
    font-size: 12px;
    line-height: 1.9;
  }

  .fbcancel-help a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 50px;
    margin-top: 22px;
    padding: 14px 18px;
    background: var(--ink);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: transform .2s ease;
  }

  .fbcancel-help a:hover {
    transform: translateY(-2px);
  }

  @keyframes fbcancelEnter {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1050px) {
    .fbcancel-layout {
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 25px;
    }

    .fbcancel-summary,
    .fbcancel-help {
      padding: 23px;
    }

    .fbcancel-section {
      grid-template-columns: 24px minmax(0, 1fr);
      gap: 12px;
      padding: 28px 24px;
    }
  }

  @media (max-width: 800px) {
    .fbcancel-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbcancel-sidebar {
      position: static;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;
      gap: 20px;
    }

    .fbcancel-help {
      margin-top: 0;
    }

    .fbcancel-header-bottom {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .fbcancel-header h1 {
      font-size: clamp(54px, 16vw, 76px);
    }

    .fbcancel-header h1 span {
      margin-left: 0;
    }

    .fbcancel-header-bottom > p {
      font-size: 13px;
    }

    .fbcancel-sidebar {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbcancel-section {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      padding: 27px 20px;
    }

    .fbcancel-number {
      padding-top: 0;
    }

    .fbcancel-section h2 {
      font-size: 27px;
    }

    .fbcancel-section p,
    .fbcancel-section address {
      font-size: 13px;
    }

    .fbcancel-request-list {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbcancel-document-footer {
      padding: 18px 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbcancel-page *,
    .fbcancel-page *::before,
    .fbcancel-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default OrderCancellationPolicy;