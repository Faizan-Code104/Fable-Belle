import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { BUSINESS_INFO, getFullAddress } from "../storeInfo";

const brand = BUSINESS_INFO.businessName;
const updatedDate = "October 3, 2026";

const BusinessDetails = ({ showHours = false }) => {
  const address = getFullAddress();

  const supportSchedule = [
    BUSINESS_INFO.businessDays,
    BUSINESS_INFO.supportHours,
    BUSINESS_INFO.timeZone,
  ]
    .filter(Boolean)
    .join(", ");

  const phone = BUSINESS_INFO.phoneDisplay || BUSINESS_INFO.phoneHref;
  const phoneHref = BUSINESS_INFO.phoneHref
    ? `tel:${BUSINESS_INFO.phoneHref.replace(/^tel:/i, "")}`
    : "";

  return (
    <address className="fbterms-business">
      <strong>{brand}</strong>

      {address && <span>{address}</span>}

      {BUSINESS_INFO.email && (
        <span>
          Email:{" "}
          <a href={`mailto:${BUSINESS_INFO.email}`}>
            {BUSINESS_INFO.email}
          </a>
        </span>
      )}

      {phone && (
        <span>
          Phone:{" "}
          {phoneHref ? <a href={phoneHref}>{phone}</a> : phone}
        </span>
      )}

      {showHours && supportSchedule && (
        <span>Support Hours: {supportSchedule}</span>
      )}
    </address>
  );
};

const sections = [
  {
    title: "Business Operator",
    content: (
      <>
        <p>The website and {brand} brand are operated by:</p>
        <BusinessDetails />
      </>
    ),
  },
  {
    title: "Eligibility",
    content: (
      <>
        <p>
          You must be at least 18 years old or have the involvement and
          permission of a parent or legal guardian to use this website or
          place an order.
        </p>
        <p>
          You agree to provide accurate, current, and complete information.
        </p>
      </>
    ),
  },
  {
    title: "Products",
    content: (
      <>
        <p>
          {brand} sells handbags, tote bags, crossbody bags, shoulder bags,
          and related fashion accessories.
        </p>
        <p>
          We make reasonable efforts to display product descriptions,
          materials, dimensions, colors, availability, and images
          accurately. Colors and appearance may vary slightly depending on
          lighting, photography, manufacturing variations, and device-screen
          settings.
        </p>
        <p>
          Product images are illustrative of the item offered. Customers
          should review the complete product description before purchasing.
        </p>
      </>
    ),
  },
  {
    title: "Prices and Currency",
    content: (
      <>
        <p>
          All prices are displayed and charged in United States dollars
          unless clearly stated otherwise.
        </p>
        <p>
          Applicable sales tax will be calculated and disclosed during
          checkout where required.
        </p>
        <p>
          We may correct accidental pricing, description, inventory, or
          typographical errors. If an error affects an order, we will
          contact the customer before fulfillment and provide the option to
          accept the correction or receive a cancellation and full refund.
        </p>
      </>
    ),
  },
  {
    title: "Online Orders",
    content: (
      <>
        <p>
          Submitting an order is an offer to purchase. An order is not
          accepted until:
        </p>
        <ul>
          <li>Required payment is successfully authorized.</li>
          <li>We confirm product availability.</li>
          <li>We issue an order confirmation.</li>
        </ul>
        <p>
          We may decline or cancel an order because of inventory errors,
          inaccurate information, suspected fraud, payment failure, delivery
          restrictions, pricing errors, or legal requirements.
        </p>
        <p>
          If we cancel a paid order, the full amount collected for the
          canceled items will be refunded to the original payment method.
        </p>
      </>
    ),
  },
  {
    title: "Payment",
    content: (
      <>
        <p>
          {brand} accepts online electronic payments only through the
          payment methods displayed at checkout. We do not accept Cash on
          Delivery.
        </p>
        <p>
          Online payment processing is currently being set up. Until an
          active payment method is displayed and payment is successfully
          authorized, no completed purchase will be accepted through the
          website.
        </p>
        <p>
          Once activated, payments will be securely processed by an
          authorized third-party payment provider. {brand} does not offer
          subscription billing or automatically recurring product charges.
        </p>
        <p>
          The exact approved billing descriptor will be disclosed at
          checkout or in the order confirmation before live card payments
          are accepted.
        </p>
      </>
    ),
  },
  {
    title: "Fraud Prevention",
    content: (
      <>
        <p>
          We may use reasonable verification and fraud-prevention measures.
          An order may be held, canceled, or declined if:
        </p>
        <ul>
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
      </>
    ),
  },
  {
    title: "Shipping",
    content: (
      <>
        <p>Orders are generally processed within 1–2 business days.</p>
        <p>
          After processing, estimated standard delivery is 3–7 business
          days. These periods exclude weekends, federal holidays, severe
          weather, carrier delays, and circumstances outside our reasonable
          control.
        </p>
        <p>
          Free standard shipping is offered on eligible orders delivered
          within our published U.S. shipping area.
        </p>
        <p>
          Complete shipping terms are provided in our{" "}
          <Link to="/shipping-policy">Shipping Policy</Link>.
        </p>
      </>
    ),
  },
  {
    title: "Order Tracking",
    content: (
      <>
        <p>
          When tracking is available, customers will receive tracking
          information through the email address provided with the order.
        </p>
        <p>
          Tracking updates are supplied by the carrier and may take time to
          appear after a shipping label is created.
        </p>
      </>
    ),
  },
  {
    title: "Cancellations and Address Changes",
    content: (
      <>
        <p>
          Customers should contact us immediately to request a cancellation
          or shipping-address change.
        </p>
        <p>
          A cancellation or modification is available only before the order
          has shipped. Once an order has shipped, it is governed by our
          Return and Refund Policy.
        </p>
        <p>
          We cannot guarantee that an address can be changed after an order
          enters fulfillment.
        </p>
      </>
    ),
  },
  {
    title: "Returns and Refunds",
    content: (
      <>
        <p>
          Eligible products may be returned within 30 days of confirmed
          delivery.
        </p>
        <p>
          Returned products must generally be unused, unworn, unaltered, and
          in their original condition with tags and original packaging.
        </p>
        <p>
          We do not offer direct product exchanges. Customers may return an
          eligible item for a refund and place a separate order for another
          product.
        </p>
        <p>
          No restocking fee is charged on an eligible return. Change-of-mind
          return shipping is the customer’s responsibility. {brand} covers
          reasonable return shipping for verified damaged, defective, or
          incorrect items.
        </p>
        <p>
          Complete conditions are provided in our{" "}
          <Link to="/return-policy">Return and Refund Policy</Link>.
        </p>
      </>
    ),
  },
  {
    title: "Customer Accounts",
    content: (
      <>
        <p>
          Customers may be allowed to purchase as a guest or create an
          account. You are responsible for:
        </p>
        <ul>
          <li>Keeping account credentials confidential.</li>
          <li>Providing accurate information.</li>
          <li>Restricting unauthorized access to your device.</li>
          <li>Notifying us promptly of suspected unauthorized activity.</li>
        </ul>
        <p>
          We may suspend or close accounts used for fraud, abuse, unlawful
          conduct, or violations of these Terms.
        </p>
      </>
    ),
  },
  {
    title: "Acceptable Use",
    content: (
      <>
        <p>You may not:</p>
        <ul>
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
      </>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <>
        <p>
          The {brand} name, website design, written content, graphics,
          logos, and original website materials are owned by or licensed to{" "}
          {brand} and are protected by applicable intellectual-property laws.
        </p>
        <p>
          No content may be reproduced, distributed, modified, or
          commercially exploited without written permission, except for
          lawful personal use.
        </p>
      </>
    ),
  },
  {
    title: "Third-Party Services",
    content: (
      <>
        <p>
          The website may rely on third-party services for payment
          processing, hosting, communications, shipping, tracking, or other
          functions.
        </p>
        <p>
          We are not responsible for an independent third party’s systems or
          policies, but we remain responsible for our obligations to
          customers under applicable law.
        </p>
      </>
    ),
  },
  {
    title: "Product Use and Care",
    content: (
      <>
        <p>
          Customers must follow product descriptions and care instructions.
          Damage caused by misuse, accidents, unauthorized alterations,
          improper cleaning, ordinary wear, or failure to follow
          instructions is not considered a manufacturing defect.
        </p>
        <p>
          Nothing in these Terms excludes warranties or consumer rights that
          cannot legally be excluded.
        </p>
      </>
    ),
  },
  {
    title: "Website Availability",
    content: (
      <p>
        We may update, suspend, or restrict website functionality for
        maintenance, security, technical, or business reasons. We do not
        guarantee uninterrupted or error-free availability.
      </p>
    ),
  },
  {
    title: "Disclaimer",
    content: (
      <>
        <p>
          To the maximum extent permitted by law, the website and its
          content are provided on an “as available” basis. We do not
          guarantee that every product or website feature will always remain
          available.
        </p>
        <p>
          This disclaimer does not limit any non-waivable legal rights or
          obligations relating to paid products.
        </p>
      </>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the maximum extent permitted by law, {brand} will not be
          liable for indirect, incidental, special, punitive, or
          consequential damages arising from use of the website.
        </p>
        <p>
          For a claim concerning a purchased product, our aggregate
          liability will not exceed the amount the customer paid for the
          product giving rise to the claim, except where a greater remedy is
          required by law.
        </p>
      </>
    ),
  },
  {
    title: "Indemnification",
    content: (
      <p>
        You agree to be responsible for losses or claims caused by your
        unlawful use of the website, fraudulent activity, infringement of
        another party’s rights, or material violation of these Terms.
      </p>
    ),
  },
  {
    title: "Delays Outside Our Control",
    content: (
      <>
        <p>
          We are not responsible for delays caused by events reasonably
          outside our control, including severe weather, natural disasters,
          carrier interruptions, labor disruptions, government actions,
          emergencies, or failures of third-party infrastructure.
        </p>
        <p>
          If a material shipping delay occurs, we will provide notice and
          available options as required by law.
        </p>
      </>
    ),
  },
  {
    title: "Governing Law and Venue",
    content: (
      <>
        <p>
          These Terms are governed by the laws of the State of Texas,
          without regard to conflict-of-law principles.
        </p>
        <p>
          Subject to any consumer rights that cannot be waived, disputes
          relating to these Terms or the website will be brought in an
          appropriate state or federal court located in Harris County,
          Texas.
        </p>
        <p>
          Before filing a claim, the parties are encouraged to attempt
          resolution by contacting one another in writing.
        </p>
      </>
    ),
  },
  {
    title: "Severability",
    content: (
      <p>
        If any provision is determined to be unlawful or unenforceable,
        the remaining provisions will continue in effect.
      </p>
    ),
  },
  {
    title: "No Waiver",
    content: (
      <p>
        Failure to enforce a provision of these Terms does not waive the
        right to enforce it later.
      </p>
    ),
  },
  {
    title: "Assignment",
    content: (
      <p>
        Customers may not transfer their rights or obligations under these
        Terms without our written consent. {brand} may transfer these Terms
        in connection with a merger, acquisition, financing,
        reorganization, or sale of business assets.
      </p>
    ),
  },
  {
    title: "Entire Agreement",
    content: (
      <p>
        These Terms and the policies linked from the website constitute
        the entire agreement concerning website use and product purchases,
        except for any additional terms expressly accepted during
        checkout.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We may update these Terms when our business, website, payment
          arrangements, or legal obligations change. Updated Terms will be
          posted with a revised “Last Updated” date.
        </p>
        <p>
          Changes will not retroactively reduce rights relating to an order
          already accepted unless permitted by law.
        </p>
      </>
    ),
  },
  {
    title: "Contact",
    content: (
      <>
        <BusinessDetails showHours />
        <p>
          <Link to="/contact">Visit our contact page for assistance.</Link>
        </p>
      </>
    ),
  },
];

const TermsAndConditions = () => {
  return (
    <main className="fbterms" id="fbterms-top">
      <style>{styles}</style>

      <div className="fbterms-wrap">
        <div className="fbterms-topline">
          <Link to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <span>{brand}</span>
        </div>

        <header className="fbterms-header">
          <div>
            <p className="fbterms-eyebrow">Website &amp; purchase terms</p>
            <h1>
              Terms &amp;
              <br />
              <span>Conditions.</span>
            </h1>
          </div>

          <div className="fbterms-header-note">
            <p className="fbterms-eyebrow">Please read before ordering</p>
            <p>
              These Terms explain the conditions that apply when you use our
              website or purchase from {brand}.
            </p>

            <dl>
              <div>
                <dt>Last updated</dt>
                <dd>
                  <time dateTime="2026-10-03">{updatedDate}</time>
                </dd>
              </div>
              <div>
                <dt>Document</dt>
                <dd>{sections.length} sections</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="fbterms-introduction">
          <span className="fbterms-eyebrow">Your agreement</span>

          <p>
            These Terms and Conditions (“Terms”) govern your access to and use
            of{" "}
            {BUSINESS_INFO.website ? (
              <a href={BUSINESS_INFO.website}>{BUSINESS_INFO.website}</a>
            ) : (
              "our website"
            )}{" "}
            and any purchase from {brand}. By using our website or placing an
            order, you agree to these Terms.
          </p>
        </div>

        <details className="fbterms-index">
          <summary>
            Browse the document
            <span>{sections.length} sections</span>
          </summary>

          <nav aria-label="Terms and Conditions contents">
            {sections.map((section, index) => (
              <a
                key={section.title}
                href={`#fbterms-section-${index + 1}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </details>

        <div className="fbterms-document">
          {sections.map((section, index) => (
            <section
              key={section.title}
              id={`fbterms-section-${index + 1}`}
              className="fbterms-section"
              aria-labelledby={`fbterms-title-${index + 1}`}
            >
              <div className="fbterms-section-heading">
                <span className="fbterms-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h2 id={`fbterms-title-${index + 1}`}>
                  {section.title}
                </h2>
              </div>

              <div className="fbterms-section-body">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <footer className="fbterms-footer">
          <div>
            <p className="fbterms-eyebrow">Need assistance?</p>
            <h2>We’re here to help.</h2>
            <p>Contact our team with questions about these Terms.</p>
          </div>

          <Link to="/contact" className="fbterms-contact-button">
            Contact us
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </footer>

        <div className="fbterms-bottom">
          <span>{brand} / Terms &amp; Conditions</span>
          <a href="#fbterms-top">Back to top ↑</a>
        </div>
      </div>
    </main>
  );
};

const styles = `
  .fbterms {
    --ink: #173f36;
    --deep: #102e28;
    --paper: #fffdf5;
    --bone: #f5f0e6;
    --brass: #a56e4f;
    --muted: #626e67;
    --line: rgba(23, 63, 54, .17);

    min-height: 100vh;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .fbterms *,
  .fbterms *::before,
  .fbterms *::after {
    box-sizing: border-box;
  }

  .fbterms a {
    color: inherit;
    text-underline-offset: 4px;
    overflow-wrap: anywhere;
  }

  .fbterms a:focus-visible,
  .fbterms summary:focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 5px;
  }

  .fbterms-wrap {
    width: min(100%, 1240px);
    margin-inline: auto;
    padding-inline: clamp(20px, 5vw, 64px);
  }

  .fbterms-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 78px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbterms-topline a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  .fbterms-topline > span {
    font-weight: 600;
    text-align: right;
  }

  .fbterms-header {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    align-items: end;
    gap: clamp(30px, 6vw, 80px);
    padding-block: clamp(42px, 7vw, 84px);
    animation: fbtermsEnter .5s ease both;
  }

  .fbterms-eyebrow {
    margin: 0;
    color: var(--brass);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .fbterms-header h1 {
    margin: 23px 0 0;
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: -.065em;
  }

  .fbterms-header h1 > span {
    color: var(--brass);
  }

  .fbterms-header-note {
    padding-bottom: 5px;
  }

  .fbterms-header-note > p:not(.fbterms-eyebrow) {
    margin: 18px 0 26px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
  }

  .fbterms-header-note dl {
    margin: 0;
    border-top: 1px solid var(--line);
  }

  .fbterms-header-note dl > div {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 10px;
    padding-block: 13px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbterms-header-note dt {
    color: var(--muted);
  }

  .fbterms-header-note dd {
    margin: 0;
    font-weight: 500;
  }

  .fbterms-introduction {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    align-items: start;
    gap: 35px;
    padding: 30px;
    background: var(--bone);
    border: 1px solid var(--line);
  }

  .fbterms-introduction > span {
    padding-top: 5px;
  }

  .fbterms-introduction p {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.95;
  }

  .fbterms-introduction a {
    color: var(--ink);
  }

  .fbterms-index {
    margin-block: 26px 42px;
    border-block: 1px solid var(--line);
  }

  .fbterms-index summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 62px;
    padding: 16px 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    list-style: none;
  }

  .fbterms-index summary::-webkit-details-marker {
    display: none;
  }

  .fbterms-index summary > span {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    color: var(--muted);
    font-size: 10px;
    font-weight: 400;
  }

  .fbterms-index summary > span::after {
    content: "+";
    color: var(--ink);
    font-size: 22px;
    line-height: 1;
  }

  .fbterms-index[open] summary > span::after {
    content: "−";
  }

  .fbterms-index nav {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px 24px;
    padding: 6px 4px 24px;
  }

  .fbterms-index nav a {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    min-height: 44px;
    padding-block: 10px;
    text-decoration: none;
    color: var(--muted);
    font-size: 11px;
    transition: color .2s ease;
  }

  .fbterms-index nav a:hover {
    color: var(--ink);
    text-decoration: underline;
  }

  .fbterms-index nav a > span {
    flex-shrink: 0;
    color: var(--brass);
    font-size: 9px;
    padding-top: 2px;
  }

  .fbterms-section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: clamp(30px, 5vw, 65px);
    padding-block: 34px;
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 28px;
  }

  .fbterms-section:first-child {
    padding-top: 0;
  }

  .fbterms-section-heading {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    min-width: 0;
  }

  .fbterms-number {
    color: var(--brass);
    font-size: 11px;
    letter-spacing: .05em;
  }

  .fbterms-section h2 {
    max-width: 280px;
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -.035em;
    overflow-wrap: anywhere;
  }

  .fbterms-section-body {
    min-width: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.95;
    overflow-wrap: anywhere;
  }

  .fbterms-section-body p {
    margin: 0 0 16px;
  }

  .fbterms-section-body > :last-child {
    margin-bottom: 0;
  }

  .fbterms-section-body a {
    color: var(--ink);
    font-weight: 500;
  }

  .fbterms-section-body ul {
    margin: 16px 0 20px;
    padding-left: 20px;
  }

  .fbterms-section-body li {
    padding-left: 4px;
    margin-bottom: 8px;
  }

  .fbterms-section-body li::marker {
    color: var(--brass);
  }

  .fbterms-business {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-block: 18px;
    font-style: normal;
  }

  .fbterms-business strong {
    color: var(--ink);
    font-weight: 600;
  }

  .fbterms-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    padding: 36px;
    margin-top: 45px;
    background: var(--bone);
    border: 1px solid var(--line);
  }

  .fbterms-footer h2 {
    margin: 12px 0 0;
    font-size: clamp(28px, 3.5vw, 40px);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.045em;
  }

  .fbterms-footer > div > p:last-child {
    margin: 12px 0 0;
    color: var(--muted);
    font-size: 12px;
  }

  .fbterms-contact-button {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    gap: 38px;
    min-height: 52px;
    padding: 14px 20px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff !important;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
    transition: background .2s ease;
  }

  .fbterms-contact-button:hover {
    background: var(--deep);
  }

  .fbterms-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding-block: 24px 42px;
    color: var(--muted);
    font-size: 10px;
  }

  .fbterms-bottom a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }

  @keyframes fbtermsEnter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1000px) {
    .fbterms-header {
      grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
      gap: 35px;
    }

    .fbterms-index nav {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .fbterms-section h2 {
      font-size: 22px;
    }
  }

  @media (max-width: 720px) {
    .fbterms-topline {
      min-height: 68px;
      font-size: 10px;
    }

    .fbterms-header {
      grid-template-columns: minmax(0, 1fr);
      gap: 30px;
      padding-block: 38px;
    }

    .fbterms-header h1 {
      font-size: clamp(48px, 10vw, 68px);
    }

    .fbterms-header-note > p:not(.fbterms-eyebrow) {
      margin-bottom: 20px;
    }

    .fbterms-introduction {
      grid-template-columns: minmax(0, 1fr);
      gap: 15px;
      padding: 24px;
    }

    .fbterms-index {
      margin-bottom: 28px;
    }

    .fbterms-section {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
      padding-block: 28px;
    }

    .fbterms-section-heading {
      flex-direction: row;
      align-items: baseline;
      gap: 15px;
    }

    .fbterms-number {
      flex-shrink: 0;
    }

    .fbterms-section h2 {
      max-width: none;
      font-size: 23px;
    }

    .fbterms-section-body {
      font-size: 13px;
    }

    .fbterms-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      padding: 28px 24px;
      margin-top: 32px;
    }

    .fbterms-contact-button {
      width: 100%;
    }

    .fbterms-bottom {
      flex-wrap: wrap;
      gap: 8px 20px;
      padding-bottom: 28px;
    }
  }

  @media (max-width: 420px) {
    .fbterms-header h1 {
      font-size: clamp(40px, 12vw, 50px);
    }

    .fbterms-index nav {
      grid-template-columns: minmax(0, 1fr);
      max-height: 380px;
      overflow-y: auto;
      padding-inline: 6px;
    }

    .fbterms-index summary {
      gap: 12px;
      font-size: 12px;
    }

    .fbterms-index summary > span {
      gap: 12px;
      font-size: 9px;
    }

    .fbterms-introduction {
      padding: 22px 18px;
    }

    .fbterms-section h2 {
      font-size: 21px;
    }

    .fbterms-footer {
      padding: 24px 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbterms *,
    .fbterms *::before,
    .fbterms *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default TermsAndConditions;