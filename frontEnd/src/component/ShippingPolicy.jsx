import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { BUSINESS_INFO, getFullAddress } from "../storeInfo";

const JOURNEY = [
  {
    icon: Package,
    title: "Order accepted",
    description:
      "After payment authorization and order acceptance, your order enters processing.",
  },
  {
    icon: Clock3,
    title: "Order processing",
    description:
      "Orders are normally processed within 1–2 business days, excluding weekends and federal holidays.",
  },
  {
    icon: Truck,
    title: "In transit",
    description:
      "After processing, standard delivery normally takes 3–7 business days through a recognized third-party carrier.",
  },
  {
    icon: MapPin,
    title: "Delivery",
    description:
      "Your order is delivered to the complete and accurate shipping address provided during checkout.",
  },
];

const SupportLink = () =>
  BUSINESS_INFO.email ? (
    <a href={`mailto:${BUSINESS_INFO.email}`}>
      {BUSINESS_INFO.email}
    </a>
  ) : (
    <Link to="/contact">our support team</Link>
  );

const PolicySection = ({ id, number, title, children }) => (
  <section
    id={`fbshipping-${id}`}
    className="fbshipping-section"
    aria-labelledby={`fbshipping-title-${id}`}
  >
    <span className="fbshipping-number" aria-hidden="true">
      {String(number).padStart(2, "0")}
    </span>
    <div>
      <h2 id={`fbshipping-title-${id}`}>{title}</h2>
      {children}
    </div>
  </section>
);

const ShippingPolicy = () => {
  const brand = BUSINESS_INFO.businessName;
  const address = getFullAddress();

  const phoneHref =
    BUSINESS_INFO.phoneHref ||
    BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

  const schedule = [
    BUSINESS_INFO.businessDays,
    [BUSINESS_INFO.supportHours, BUSINESS_INFO.timeZone]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main id="fbshipping-top" className="fbshipping-page">
      <style>{styles}</style>

      <div className="fbshipping-container">
        <div className="fbshipping-topline">
          <span>{brand} / Shipping Policy</span>
          <Link to="/track-order">
            Track your order
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <header className="fbshipping-header">
          <p className="fbshipping-eyebrow">Shipping information</p>
          <h1>
            On its way,
            <span>with care.</span>
          </h1>

          <div className="fbshipping-header-bottom">
            <p>
              This Shipping Policy applies to physical products purchased
              from {brand} through{" "}
              {BUSINESS_INFO.website ? (
                <a href={BUSINESS_INFO.website}>
                  {BUSINESS_INFO.website}
                </a>
              ) : (
                "our website"
              )}
              .
            </p>

            <div className="fbshipping-date">
              <span>Last updated</span>
              <time dateTime="2026-10-03">October 3, 2026</time>
            </div>
          </div>
        </header>

        <section
          className="fbshipping-overview"
          aria-label="Shipping overview"
        >
          <dl>
            <div>
              <dt>Shipping area</dt>
              <dd>Contiguous 48 U.S. states</dd>
            </div>
            <div>
              <dt>Order processing</dt>
              <dd>1–2 business days</dd>
            </div>
            <div>
              <dt>Shipping cost</dt>
              <dd>Free standard shipping</dd>
            </div>
          </dl>

          <p>
            Estimated total time from order acceptance to delivery is
            generally <strong>4–9 business days</strong>. Delivery
            estimates are not guaranteed.
          </p>
        </section>

        <div className="fbshipping-layout">
          <aside className="fbshipping-journey">
            <p className="fbshipping-eyebrow">Order journey</p>
            <h2>From checkout to your door.</h2>

            <ol>
              {JOURNEY.map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={step.title}>
                    <span className="fbshipping-step-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="fbshipping-step-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <Link className="fbshipping-journey-link" to="/track-order">
              Track your order
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </aside>

          <article
            className="fbshipping-document"
            aria-label="Shipping policy"
          >
            <div className="fbshipping-document-label">
              <p className="fbshipping-eyebrow">The delivery details</p>
              <span>Shipping Policy</span>
            </div>

            <PolicySection id="area" number={1} title="Shipping area">
              <p>
                We currently ship to deliverable addresses within the
                contiguous 48 United States.
              </p>
              <p>
                We do not currently ship internationally or to Alaska,
                Hawaii, U.S. territories, APO/FPO/DPO addresses, or P.O.
                boxes.
              </p>
            </PolicySection>

            <PolicySection id="cost" number={2} title="Shipping cost">
              <p>
                {brand} provides <strong>free standard shipping</strong>{" "}
                on eligible orders within our published U.S. shipping area.
              </p>
              <p>
                Customers will not be charged a standard shipping fee
                unless a different charge is clearly disclosed before
                completing the order.
              </p>
            </PolicySection>

            <PolicySection
              id="processing"
              number={3}
              title="Order processing"
            >
              <p>
                Orders are normally processed within{" "}
                <strong>1–2 business days</strong> after payment
                authorization and order acceptance.
              </p>
              <p>
                Business days are Monday through Friday and exclude
                federal holidays. Orders submitted during weekends or
                holidays begin processing on the following business day.
              </p>
              <p>
                An order confirmation does not mean the order has
                shipped. Customers will receive a separate shipping
                confirmation when tracking becomes available.
              </p>
            </PolicySection>

            <PolicySection
              id="delivery"
              number={4}
              title="Estimated delivery"
            >
              <p>
                After processing, standard delivery normally takes{" "}
                <strong>3–7 business days</strong>.
              </p>
              <p>
                The estimated total period from order acceptance to
                delivery is generally <strong>4–9 business days</strong>.
              </p>
              <p>
                Delivery estimates are not guarantees. Severe weather,
                carrier disruptions, incorrect addresses, holidays,
                emergencies, or other circumstances outside our control
                may cause delays.
              </p>
              <p>
                If we cannot ship within the promised period, we will
                notify the customer and provide available options,
                including cancellation and refund when required.
              </p>
            </PolicySection>

            <PolicySection
              id="method"
              number={5}
              title="Shipping method"
            >
              <p>
                Orders are shipped using standard ground or parcel
                delivery through a recognized third-party carrier. The
                carrier used may depend on the destination, package
                size, and operational availability.
              </p>
              <p>
                Available tracking information will be included in the
                shipping confirmation.
              </p>
            </PolicySection>

            <PolicySection
              id="accuracy"
              number={6}
              title="Address accuracy"
            >
              <p>
                Customers are responsible for providing a complete and
                accurate delivery address.
              </p>
              <p>
                Contact <SupportLink /> immediately if an address needs
                to be corrected. We cannot guarantee changes after an
                order enters fulfillment or has shipped.
              </p>
              <p>
                {brand} is not responsible for delays or failed delivery
                caused by incorrect or incomplete information supplied
                by the customer.
              </p>
            </PolicySection>

            <PolicySection id="tracking" number={7} title="Tracking">
              <p>
                Tracking information may take up to 48 hours to update
                after a label is created.
              </p>
              <p>
                A carrier’s “delivered” scan does not always mean the
                package was handed directly to the recipient. Customers
                should check the delivery area, household members,
                property staff, and carrier notices before reporting a
                missing delivery.
              </p>
              <p>
                You can also use your {brand} order number on our{" "}
                <Link to="/track-order">Order Tracking page</Link>.
              </p>
            </PolicySection>

            <PolicySection
              id="lost"
              number={8}
              title="Lost packages"
            >
              <p>
                If tracking does not update for an unusual period or a
                package appears lost, contact{" "}
                {BUSINESS_INFO.email ? (
                  <>us at <SupportLink /></>
                ) : (
                  <SupportLink />
                )}{" "}
                with the order number.
              </p>
              <p>
                We will review the shipment with the carrier and provide
                an appropriate resolution based on the investigation
                and applicable law.
              </p>
            </PolicySection>

            <PolicySection
              id="damaged"
              number={9}
              title="Damaged packages"
            >
              <p>
                If a package arrives visibly damaged, photograph the
                package and product and contact us within{" "}
                <strong>48 hours of delivery</strong>.
              </p>
              <p>
                Please retain the item, packaging, labels, and shipping
                materials until we complete our review.
              </p>
            </PolicySection>

            <PolicySection
              id="undeliverable"
              number={10}
              title="Refused or undeliverable packages"
            >
              <p>
                A shipment returned because of refusal, an incorrect
                address, repeated failed delivery, or failure to collect
                the package may be treated as a return.
              </p>
              <p>
                Any additional reshipping charge will be disclosed and
                approved before reshipment. If a refund is requested,
                unavoidable carrier charges incurred because of an
                incorrect address or refused delivery may be deducted
                where legally permitted.
              </p>
            </PolicySection>

            <PolicySection
              id="split"
              number={11}
              title="Split shipments"
            >
              <p>
                If an order contains multiple products, products may
                arrive in separate packages. Additional standard
                shipping will not be charged unless disclosed before
                purchase.
              </p>
            </PolicySection>

            <PolicySection id="contact" number={12} title="Contact">
              <div className="fbshipping-contact">
                <strong>{brand}</strong>

                {address && <address>{address}</address>}

                {BUSINESS_INFO.email && (
                  <p>
                    Email:{" "}
                    <a href={`mailto:${BUSINESS_INFO.email}`}>
                      {BUSINESS_INFO.email}
                    </a>
                  </p>
                )}

                {BUSINESS_INFO.phoneDisplay && phoneHref && (
                  <p>
                    Phone:{" "}
                    <a href={`tel:${phoneHref}`}>
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </p>
                )}

                {schedule && <p>Support Hours: {schedule}</p>}

                <Link to="/contact">
                  Contact our team
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </PolicySection>

            <footer className="fbshipping-document-footer">
              <span>{brand} / Shipping Policy</span>
              <a href="#fbshipping-top">
                Back to top
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </footer>
          </article>
        </div>

        <section
          className="fbshipping-help"
          aria-labelledby="fbshipping-help-title"
        >
          <div>
            <p className="fbshipping-eyebrow">Already submitted an order?</p>
            <h2 id="fbshipping-help-title">Follow its journey.</h2>
            <p>
              Check the latest available status using your order number.
            </p>
          </div>

          <Link to="/track-order">
            Track order
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
};

const styles = `
  .fbshipping-page {
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

  .fbshipping-page *,
  .fbshipping-page *::before,
  .fbshipping-page *::after {
    box-sizing: border-box;
  }

  .fbshipping-page a {
    color: inherit;
    text-underline-offset: 4px;
  }

  .fbshipping-page a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 5px;
  }

  .fbshipping-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbshipping-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 20px;
    padding-block: 18px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbshipping-topline a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    font-weight: 600;
    text-decoration: none;
  }

  .fbshipping-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbshipping-header {
    padding-block: clamp(40px, 6vw, 80px);
    animation: fbshippingEnter .6s both;
  }

  .fbshipping-header h1 {
    margin: 22px 0 35px;
    font-size: clamp(57px, 8.5vw, 120px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.075em;
  }

  .fbshipping-header h1 span {
    display: block;
    margin-left: clamp(0px, 12vw, 175px);
    color: var(--accent);
  }

  .fbshipping-header-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
  }

  .fbshipping-header-bottom > p {
    max-width: 600px;
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbshipping-header-bottom > p a {
    color: var(--ink);
  }

  .fbshipping-date {
    flex-shrink: 0;
    font-size: 11px;
  }

  .fbshipping-date > span {
    display: block;
    margin-bottom: 6px;
    color: var(--muted);
    font-size: 10px;
  }

  .fbshipping-overview {
    margin-bottom: 45px;
    border-block: 1px solid var(--ink);
  }

  .fbshipping-overview dl {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0;
  }

  .fbshipping-overview dl > div {
    padding: 25px 30px;
    border-right: 1px solid var(--line);
  }

  .fbshipping-overview dl > div:first-child {
    padding-left: 0;
  }

  .fbshipping-overview dl > div:last-child {
    border-right: 0;
  }

  .fbshipping-overview dt {
    color: var(--muted);
    font-size: 10px;
  }

  .fbshipping-overview dd {
    margin: 10px 0 0;
    font-size: clamp(19px, 2vw, 26px);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.04em;
  }

  .fbshipping-overview > p {
    margin: 0;
    padding-block: 18px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 11px;
    line-height: 1.9;
  }

  .fbshipping-overview strong {
    color: var(--ink);
  }

  .fbshipping-layout {
    display: grid;
    grid-template-columns: 310px minmax(0, 1fr);
    align-items: start;
    gap: clamp(25px, 4vw, 55px);
  }

  .fbshipping-journey {
    min-width: 0;
    padding: 28px;
    border: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbshipping-journey > h2 {
    margin: 18px 0 30px;
    font-size: 36px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbshipping-journey ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fbshipping-journey li {
    position: relative;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 15px;
    padding-bottom: 28px;
  }

  .fbshipping-journey li:last-child {
    padding-bottom: 0;
  }

  .fbshipping-journey li::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 42px;
    bottom: 0;
    width: 1px;
    background: var(--line);
  }

  .fbshipping-journey li:last-child::before {
    display: none;
  }

  .fbshipping-step-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbshipping-step-number {
    color: var(--accent);
    font-size: 9px;
  }

  .fbshipping-journey h3 {
    margin: 5px 0 10px;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.03em;
  }

  .fbshipping-journey li p {
    margin: 0;
    font-size: 11px;
    line-height: 1.9;
  }

  .fbshipping-journey-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    min-height: 48px;
    margin-top: 30px;
    border-top: 1px solid var(--ink);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
  }

  .fbshipping-document {
    min-width: 0;
    border: 1px solid var(--ink);
    background: var(--paper);
    animation: fbshippingEnter .6s .08s both;
  }

  .fbshipping-document-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 23px 30px;
    border-bottom: 1px solid var(--ink);
  }

  .fbshipping-document-label > span {
    color: var(--muted);
    font-size: 10px;
  }

  .fbshipping-section {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 18px;
    padding: clamp(25px, 3.5vw, 45px);
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 110px;
  }

  .fbshipping-section > div {
    min-width: 0;
  }

  .fbshipping-section:target {
    background: #f1f4e8;
  }

  .fbshipping-number {
    padding-top: 6px;
    color: var(--accent);
    font-size: 11px;
  }

  .fbshipping-section h2 {
    margin: 0 0 20px;
    font-size: clamp(25px, 2.6vw, 34px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbshipping-section p,
  .fbshipping-section address {
    margin: 0 0 15px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbshipping-section p:last-child {
    margin-bottom: 0;
  }

  .fbshipping-section p strong,
  .fbshipping-section p a {
    color: var(--ink);
    font-weight: 600;
  }

  .fbshipping-contact {
    display: grid;
    justify-items: start;
    gap: 12px;
  }

  .fbshipping-contact > strong {
    font-size: 18px;
    font-weight: 600;
  }

  .fbshipping-contact p,
  .fbshipping-contact address {
    margin: 0;
  }

  .fbshipping-contact address {
    font-style: normal;
  }

  .fbshipping-contact > a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    font-size: 13px;
    text-decoration: none;
  }

  .fbshipping-document-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px 20px;
    padding: 20px 30px;
    font-size: 10px;
  }

  .fbshipping-document-footer a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  .fbshipping-help {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-top: 35px;
    padding-block: 35px;
    border-bottom: 1px solid var(--ink);
  }

  .fbshipping-help h2 {
    margin: 15px 0;
    font-size: clamp(32px, 3.8vw, 50px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbshipping-help div > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.8;
  }

  .fbshipping-help > a {
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

  .fbshipping-help > a:hover {
    transform: translateY(-2px);
  }

  @keyframes fbshippingEnter {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1050px) {
    .fbshipping-layout {
      grid-template-columns: 270px minmax(0, 1fr);
      gap: 25px;
    }

    .fbshipping-journey {
      padding: 23px;
    }

    .fbshipping-section {
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 12px;
      padding: 30px 24px;
    }
  }

  @media (max-width: 800px) {
    .fbshipping-header-bottom {
      flex-direction: column;
      align-items: flex-start;
    }

    .fbshipping-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }

    .fbshipping-journey ol {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 25px;
    }

    .fbshipping-journey li {
      padding-bottom: 0;
    }

    .fbshipping-journey li::before {
      display: none;
    }

    .fbshipping-help {
      flex-direction: column;
      align-items: stretch;
    }

    .fbshipping-help > a {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .fbshipping-header h1 {
      font-size: clamp(52px, 15vw, 75px);
    }

    .fbshipping-header h1 span {
      margin-left: 0;
    }

    .fbshipping-overview dl {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbshipping-overview dl > div,
    .fbshipping-overview dl > div:first-child {
      padding: 20px 0;
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }

    .fbshipping-overview dl > div:last-child {
      border-bottom: 0;
    }

    .fbshipping-journey ol {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbshipping-section {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      padding: 27px 20px;
    }

    .fbshipping-number {
      padding-top: 0;
    }

    .fbshipping-section h2 {
      font-size: 28px;
    }

    .fbshipping-section p,
    .fbshipping-section address {
      font-size: 13px;
    }

    .fbshipping-document-label,
    .fbshipping-document-footer {
      padding-inline: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbshipping-page *,
    .fbshipping-page *::before,
    .fbshipping-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default ShippingPolicy;