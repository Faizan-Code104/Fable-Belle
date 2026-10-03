import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import { BUSINESS_INFO, getFullAddress } from "../storeInfo";

const BusinessDetails = () => {
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
    <div className="fbprivacy-business">
      <strong>{BUSINESS_INFO.businessName}</strong>

      {address && <address>{address}</address>}

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

      {schedule && <p>Customer Support Hours: {schedule}</p>}

      <Link to="/contact">
        Contact our team
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
};

const PrivacyContact = ({ request = false }) =>
  BUSINESS_INFO.email ? (
    <a
      href={`mailto:${BUSINESS_INFO.email}${
        request ? "?subject=Privacy%20Request" : ""
      }`}
    >
      {BUSINESS_INFO.email}
    </a>
  ) : (
    <Link to="/contact">our customer support team</Link>
  );

const PrivacyPolicy = () => {
  const brand = BUSINESS_INFO.businessName;

  const sections = [
    {
      id: "business",
      title: "Business Information",
      body: [`Business information for ${brand}:`],
      contact: true,
    },
    {
      id: "collection",
      title: "Information We Collect",
      body: [
        "Depending on how you interact with our website, we may collect:",
      ],
      bullets: [
        "Name, billing address, shipping address, email address, and telephone number.",
        "Account login information, if you create an account.",
        "Products purchased, order value, transaction status, returns, refunds, and customer-service history.",
        "Information you provide through email, telephone, contact forms, reviews, or return requests.",
        "Internet Protocol address, device type, browser type, operating system, referring pages, pages viewed, and approximate location.",
        "Cookie, session, shopping-cart, and local-storage information.",
        "Fraud-prevention and transaction-verification information.",
      ],
    },
    {
      id: "payments",
      title: "Payment Information",
      body: [
        `${brand} is currently completing its online payment setup and does not accept Cash on Delivery.`,
        `When online payment processing is activated, payments will be handled by an authorized third-party payment processor. ${brand} will not intentionally store complete payment-card numbers or card security codes on its own systems.`,
        "Payment processors may collect and process payment information under their own privacy and security policies.",
      ],
    },
    {
      id: "usage",
      title: "How We Use Information",
      body: ["We may use personal information to:"],
      bullets: [
        "Operate and maintain our website.",
        "Create and manage customer accounts.",
        "Process, confirm, fulfill, and track orders.",
        "Communicate order, shipping, delivery, return, and refund information.",
        "Provide customer service.",
        "Verify transactions and prevent fraud or unauthorized activity.",
        "Improve our products, website, and customer experience.",
        "Maintain business, accounting, tax, and compliance records.",
        "Send marketing communications when the customer has chosen to receive them.",
        "Comply with legal obligations and enforce our policies.",
      ],
      after: [
        "We will not use personal information for materially different purposes without providing appropriate notice or obtaining consent when required.",
      ],
    },
    {
      id: "disclosure",
      title: "How We Disclose Information",
      body: [
        "We may disclose personal information to service providers that assist us with:",
      ],
      bullets: [
        "Website hosting and technical infrastructure.",
        "Order and inventory management.",
        "Payment processing.",
        "Shipping, tracking, and delivery.",
        "Email and customer communications.",
        "Website security and fraud prevention.",
        "Analytics and website performance.",
        "Accounting, legal, tax, and regulatory compliance.",
      ],
      after: [
        "These providers may access information only as reasonably necessary to perform services for us and are expected to protect it appropriately.",
        "We may also disclose information:",
      ],
      afterBullets: [
        "When required by law, subpoena, court order, or lawful government request.",
        "To investigate suspected fraud, security incidents, or violations of our policies.",
        `To protect the rights, safety, and property of ${brand}, our customers, or others.`,
        "In connection with a merger, financing, acquisition, reorganization, or sale of business assets.",
      ],
    },
    {
      id: "sharing",
      title: "Sale and Sharing of Personal Information",
      body: [
        "We do not sell personal information for money.",
        <>
          Certain analytics or advertising technologies, if enabled, may
          be treated as “sharing” or targeted advertising under some
          state privacy laws. Where legally required, eligible consumers
          may request to opt out by contacting <PrivacyContact />.
        </>,
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Local Storage",
      body: [
        "Our website may use cookies, browser storage, session technologies, and similar tools to:",
      ],
      bullets: [
        "Keep the website operational.",
        "Maintain shopping-cart contents.",
        "Remember customer preferences.",
        "Support account login and security.",
        "Understand website traffic and performance.",
        "Detect fraud or suspicious activity.",
      ],
      after: [
        <>
          Additional information is available in our{" "}
          <Link to="/cookie-policy">Cookie Policy</Link>.
        </>,
      ],
    },
    {
      id: "marketing",
      title: "Marketing Communications",
      body: [
        <>
          Customers may unsubscribe from promotional emails by using
          the unsubscribe link included in the message or by contacting{" "}
          <PrivacyContact />.
        </>,
        "Transactional communications concerning an order, delivery, return, security issue, or account are not promotional and may still be sent when necessary.",
        "We do not send promotional text messages without the recipient’s appropriate consent. Consent to marketing is not a condition of purchase.",
      ],
    },
    {
      id: "retention",
      title: "Data Retention",
      body: [
        "We retain personal information only for as long as reasonably necessary to:",
      ],
      bullets: [
        "Fulfill orders and provide customer support.",
        "Process returns and refunds.",
        "Maintain accounting, tax, and business records.",
        "Prevent fraud and resolve disputes.",
        "Comply with legal and regulatory obligations.",
      ],
      after: [
        "Retention periods may differ according to the type of information and the reason it was collected.",
      ],
    },
    {
      id: "security",
      title: "Data Security",
      body: [
        "We use reasonable administrative, organizational, and technical safeguards designed to protect personal information. However, no website, transmission, or storage system can be guaranteed to be completely secure.",
        "Customers are responsible for maintaining the confidentiality of their account credentials and should contact us immediately if they suspect unauthorized account access.",
        "Please do not send complete payment-card details through email, telephone messages, or our contact form.",
      ],
    },
    {
      id: "rights",
      title: "Your Privacy Choices and Rights",
      body: [
        "Depending on your state of residence and applicable law, you may have the right to:",
      ],
      bullets: [
        "Request access to personal information we maintain about you.",
        "Request correction of inaccurate information.",
        "Request deletion of eligible personal information.",
        "Request a portable copy of eligible information.",
        "Opt out of certain targeted advertising, sales, or sharing.",
        "Withdraw consent where processing is based on consent.",
        "Appeal our response to an eligible privacy request.",
        "Not receive unlawful discriminatory treatment for exercising privacy rights.",
      ],
      after: [
        <>
          To submit a request,{" "}
          {BUSINESS_INFO.email ? "email " : "contact "}
          <PrivacyContact request /> with the subject “Privacy Request.”
        </>,
        "We may need to verify your identity before completing a request. An authorized agent may submit a request when permitted by law and after providing appropriate authorization.",
      ],
    },
    {
      id: "children",
      title: "Children’s Privacy",
      body: [
        "Our website and products are intended for adults. We do not knowingly collect personal information directly from children under 13. If you believe a child has provided personal information, contact us so we can review and delete it when required.",
        "Individuals under 18 should use the website only with the involvement and permission of a parent or legal guardian.",
      ],
    },
    {
      id: "third-parties",
      title: "Third-Party Websites",
      body: [
        "Our website may contain links to third-party websites or services. We are not responsible for the privacy, security, content, or practices of third parties. Customers should review the applicable third party’s policies before providing information.",
      ],
    },
    {
      id: "operations",
      title: "United States Operations",
      body: [
        `${brand} operates in the United States. Information may be processed and stored in the United States, where privacy laws may differ from those in other jurisdictions.`,
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      body: [
        "We may update this Privacy Policy to reflect operational, legal, or technical changes. The revised version will be posted on this page with an updated “Last Updated” date.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      body: ["Questions or privacy requests may be directed to:"],
      contact: true,
    },
  ];

  return (
    <main id="fbprivacy-top" className="fbprivacy-page">
      <style>{styles}</style>

      <div className="fbprivacy-container">
        <div className="fbprivacy-topline">
          <span>{brand} / Privacy Policy</span>
          <Link to="/contact">
            Privacy questions
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <header className="fbprivacy-header">
          <div>
            <p className="fbprivacy-eyebrow">Your information</p>
            <h1>
              Privacy,
              <span>with care.</span>
            </h1>
          </div>

          <div className="fbprivacy-introduction">
            <p>
              {brand} (“{brand},” “we,” “us,” or “our”) respects your
              privacy. This Privacy Policy explains how we collect,
              use, disclose, retain, and protect personal information
              when you visit{" "}
              {BUSINESS_INFO.website ? (
                <a href={BUSINESS_INFO.website}>
                  {BUSINESS_INFO.website}
                </a>
              ) : (
                "our website"
              )}
              , create an account, communicate with us, or purchase
              our products.
            </p>

            <div className="fbprivacy-date">
              <span>Last updated</span>
              <time dateTime="2026-10-03">October 3, 2026</time>
            </div>
          </div>
        </header>

        <div className="fbprivacy-layout">
          <aside className="fbprivacy-sidebar">
            <nav aria-label="Privacy policy sections">
              <p className="fbprivacy-eyebrow">In this policy</p>
              <ol>
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#fbprivacy-${section.id}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="fbprivacy-request">
              <p className="fbprivacy-eyebrow">Privacy requests</p>
              <h2>Let’s talk.</h2>
              <p>
                If you have a question about this Privacy Policy or
                want to make a privacy-related request, you can contact{" "}
                {brand} using the details in this policy.
              </p>
              <Link to="/contact">
                Contact us
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </aside>

          <article
            className="fbprivacy-document"
            aria-label="Privacy policy"
          >
            <div className="fbprivacy-document-label">
              <span className="fbprivacy-eyebrow">Privacy Policy</span>
              <span>16 sections</span>
            </div>

            {sections.map((section, index) => (
              <section
                key={section.id}
                id={`fbprivacy-${section.id}`}
                className="fbprivacy-section"
                aria-labelledby={`fbprivacy-title-${section.id}`}
              >
                <div className="fbprivacy-section-heading">
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`fbprivacy-title-${section.id}`}>
                    {section.title}
                  </h2>
                </div>

                <div className="fbprivacy-section-body">
                  {section.body?.map((paragraph, paragraphIndex) => (
                    <p key={`body-${paragraphIndex}`}>{paragraph}</p>
                  ))}

                  {section.bullets && (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.after?.map((paragraph, paragraphIndex) => (
                    <p key={`after-${paragraphIndex}`}>{paragraph}</p>
                  ))}

                  {section.afterBullets && (
                    <ul>
                      {section.afterBullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.contact && <BusinessDetails />}
                </div>
              </section>
            ))}

            <footer className="fbprivacy-document-footer">
              <span>{brand} / Privacy Policy</span>
              <a href="#fbprivacy-top">
                Back to top
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </footer>
          </article>
        </div>

        <section
          className="fbprivacy-help"
          aria-labelledby="fbprivacy-help-title"
        >
          <div>
            <p className="fbprivacy-eyebrow">Here to help</p>
            <h2 id="fbprivacy-help-title">
              Questions about your information?
            </h2>
            <p>
              Contact us if you have a privacy-related question or request.
            </p>
          </div>
          <Link to="/contact">
            Contact us
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
};

const styles = `
  .fbprivacy-page {
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

  .fbprivacy-page *,
  .fbprivacy-page *::before,
  .fbprivacy-page *::after {
    box-sizing: border-box;
  }

  .fbprivacy-page a {
    color: inherit;
    text-underline-offset: 4px;
  }

  .fbprivacy-page a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 5px;
  }

  .fbprivacy-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbprivacy-topline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 20px;
    padding-block: 18px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbprivacy-topline a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    text-decoration: none;
    font-weight: 600;
  }

  .fbprivacy-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbprivacy-header {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
    align-items: end;
    gap: clamp(30px, 5vw, 70px);
    padding-block: clamp(40px, 6vw, 80px);
    animation: fbprivacyEnter .6s both;
  }

  .fbprivacy-header h1 {
    margin: 22px 0 0;
    font-size: clamp(58px, 7.7vw, 110px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.075em;
  }

  .fbprivacy-header h1 span {
    display: block;
    color: var(--accent);
  }

  .fbprivacy-introduction {
    border-left: 1px solid var(--ink);
    padding-left: clamp(22px, 3vw, 40px);
  }

  .fbprivacy-introduction > p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbprivacy-introduction a {
    color: var(--ink);
  }

  .fbprivacy-date {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
    margin-top: 25px;
    font-size: 11px;
  }

  .fbprivacy-date > span {
    color: var(--muted);
  }

  .fbprivacy-layout {
    display: grid;
    grid-template-columns: 275px minmax(0, 1fr);
    align-items: start;
    gap: clamp(25px, 4vw, 55px);
  }

  .fbprivacy-sidebar {
    min-width: 0;
  }

  .fbprivacy-sidebar nav {
    border-top: 1px solid var(--ink);
    padding-top: 20px;
  }

  .fbprivacy-sidebar ol {
    margin: 18px 0 0;
    padding: 0;
    list-style: none;
  }

  .fbprivacy-sidebar li a {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 12px 8px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
    text-decoration: none;
    transition: background .2s ease;
  }

  .fbprivacy-sidebar li a > span {
    color: var(--accent);
    font-size: 9px;
  }

  .fbprivacy-sidebar li a:hover {
    background: var(--lime);
  }

  .fbprivacy-request {
    margin-top: 28px;
    padding: 25px;
    border: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbprivacy-request h2 {
    margin: 16px 0;
    font-size: 36px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbprivacy-request > p:last-of-type {
    margin: 0;
    font-size: 11px;
    line-height: 1.9;
  }

  .fbprivacy-request a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    min-height: 44px;
    margin-top: 18px;
    border-bottom: 1px solid var(--ink);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
  }

  .fbprivacy-document {
    min-width: 0;
    border: 1px solid var(--ink);
    background: var(--paper);
    animation: fbprivacyEnter .6s .08s both;
  }

  .fbprivacy-document-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 23px 30px;
    border-bottom: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbprivacy-document-label > span:last-child {
    font-size: 10px;
  }

  .fbprivacy-section {
    padding: clamp(25px, 3.5vw, 45px);
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 110px;
  }

  .fbprivacy-section:target {
    background: #f1f4e8;
  }

  .fbprivacy-section-heading {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 17px;
    align-items: start;
    margin-bottom: 22px;
  }

  .fbprivacy-section-heading > span {
    padding-top: 6px;
    color: var(--accent);
    font-size: 11px;
  }

  .fbprivacy-section h2 {
    margin: 0;
    font-size: clamp(25px, 2.7vw, 35px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbprivacy-section-body {
    padding-left: 47px;
    min-width: 0;
  }

  .fbprivacy-section-body p,
  .fbprivacy-section-body address {
    margin: 0 0 15px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbprivacy-section-body > p:last-child {
    margin-bottom: 0;
  }

  .fbprivacy-section-body p a {
    color: var(--ink);
    font-weight: 600;
  }

  .fbprivacy-section-body ul {
    margin: 18px 0 22px;
    padding-left: 19px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
  }

  .fbprivacy-section-body ul:last-child {
    margin-bottom: 0;
  }

  .fbprivacy-section-body li {
    padding-block: 5px;
  }

  .fbprivacy-business {
    display: grid;
    justify-items: start;
    gap: 12px;
  }

  .fbprivacy-business > strong {
    font-size: 18px;
    font-weight: 600;
  }

  .fbprivacy-business address,
  .fbprivacy-business p {
    margin: 0;
  }

  .fbprivacy-business address {
    font-style: normal;
  }

  .fbprivacy-business a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    max-width: 100%;
    min-height: 44px;
    font-size: 13px;
    text-decoration: none;
  }

  .fbprivacy-business a > span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .fbprivacy-business svg {
    flex-shrink: 0;
  }

  .fbprivacy-business a:hover {
    color: var(--accent);
  }

  .fbprivacy-document-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px 20px;
    padding: 20px 30px;
    font-size: 10px;
  }

  .fbprivacy-document-footer a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  .fbprivacy-help {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    margin-top: 35px;
    padding: clamp(25px, 4vw, 50px);
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
  }

  .fbprivacy-help h2 {
    max-width: 750px;
    margin: 16px 0;
    font-size: clamp(30px, 3.5vw, 47px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbprivacy-help div > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.8;
  }

  .fbprivacy-help > a {
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

  .fbprivacy-help > a:hover {
    transform: translateY(-2px);
  }

  @keyframes fbprivacyEnter {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1050px) {
    .fbprivacy-layout {
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 25px;
    }

    .fbprivacy-section {
      padding: 30px 25px;
    }

    .fbprivacy-section-body {
      padding-left: 0;
    }
  }

  @media (max-width: 800px) {
    .fbprivacy-header {
      grid-template-columns: minmax(0, 1fr);
      gap: 30px;
    }

    .fbprivacy-introduction {
      border-left: 0;
      border-top: 1px solid var(--ink);
      padding: 25px 0 0;
    }

    .fbprivacy-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }

    .fbprivacy-sidebar ol {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 20px;
    }

    .fbprivacy-help {
      flex-direction: column;
      align-items: stretch;
      padding-inline: 0;
    }

    .fbprivacy-help > a {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .fbprivacy-header h1 {
      font-size: clamp(55px, 16vw, 76px);
    }

    .fbprivacy-sidebar ol {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbprivacy-document-label {
      padding: 20px;
    }

    .fbprivacy-section {
      padding: 27px 20px;
    }

    .fbprivacy-section-heading {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }

    .fbprivacy-section-heading > span {
      padding-top: 0;
    }

    .fbprivacy-section h2 {
      font-size: 28px;
    }

    .fbprivacy-section-body p,
    .fbprivacy-section-body address {
      font-size: 13px;
    }

    .fbprivacy-document-footer {
      padding: 18px 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbprivacy-page *,
    .fbprivacy-page *::before,
    .fbprivacy-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default PrivacyPolicy;