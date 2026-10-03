import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Cookie,
  Mail,
  Phone,
} from "lucide-react";
import { BUSINESS_INFO } from "../storeInfo";

const SECTIONS = [
  { id: "about", title: "About these technologies" },
  { id: "essential", title: "Essential technologies" },
  { id: "preferences", title: "Preference technologies" },
  { id: "analytics", title: "Analytics technologies" },
  { id: "advertising", title: "Advertising technologies" },
  { id: "payment", title: "Payment information" },
  { id: "managing", title: "Managing cookies" },
  { id: "changes", title: "Policy changes" },
  { id: "contact", title: "Contact" },
];

const PolicySection = ({ id, number, title, children }) => (
  <section
    id={`fbcp-${id}`}
    className="fbcp-section"
    aria-labelledby={`fbcp-title-${id}`}
  >
    <span className="fbcp-section-number" aria-hidden="true">
      {String(number).padStart(2, "0")}
    </span>

    <div className="fbcp-section-content">
      <h2 id={`fbcp-title-${id}`}>{title}</h2>
      {children}
    </div>
  </section>
);

const CookiePolicy = () => {
  const addressLines = [
    BUSINESS_INFO.addressLine1,
    BUSINESS_INFO.addressLine2,
    BUSINESS_INFO.country,
  ].filter(Boolean);

  const phoneHref =
    BUSINESS_INFO.phoneHref ||
    BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

  return (
    <main id="fbcp-top" className="fbcp-page">
      <style>{policyStyles}</style>

      <div className="fbcp-container">
        <header className="fbcp-header">
          <div>
            <p className="fbcp-overline">
              {BUSINESS_INFO.businessName} / Website information
            </p>
            <h1>
              Cookie
              <span>Policy.</span>
            </h1>
          </div>

          <div className="fbcp-header-note">
            <Cookie size={38} strokeWidth={1.1} />
            <p>Cookies, local storage, and similar website technologies.</p>
            <span>
              Last updated:{" "}
              <time dateTime="2026-10-03">October 3, 2026</time>
            </span>
          </div>
        </header>

        <div className="fbcp-layout">
          <aside className="fbcp-sidebar">
            <nav aria-label="Cookie policy sections">
              <p className="fbcp-overline">Inside this policy</p>

              <ol>
                {SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#fbcp-${section.id}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="fbcp-sidebar-help">
              <Mail size={21} strokeWidth={1.3} />
              <h2>A privacy question?</h2>
              <p>
                Contact us if you have questions about cookies or website
                privacy.
              </p>
              <Link to="/contact">
                Contact us
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>

          <article className="fbcp-document" aria-label="Cookie policy">
            <div className="fbcp-document-intro">
              <p className="fbcp-overline">
                Cookies & similar technologies
              </p>
              <p>
                This Cookie Policy explains how{" "}
                {BUSINESS_INFO.businessName} uses cookies, local storage,
                session technologies, and similar tools
                {BUSINESS_INFO.website ? (
                  <>
                    {" "}on{" "}
                    <a href={BUSINESS_INFO.website}>
                      {BUSINESS_INFO.website}
                    </a>
                  </>
                ) : (
                  " on our website"
                )}
                .
              </p>
            </div>

            <PolicySection
              id="about"
              number={1}
              title="What are cookies and similar technologies?"
            >
              <p>
                Cookies are small files stored through a browser. Local
                storage and session storage allow a website to remember
                information on a device.
              </p>
              <p>
                These technologies may help operate website features,
                maintain a shopping cart, remember preferences, support
                account access, and understand website performance.
              </p>
            </PolicySection>

            <PolicySection
              id="essential"
              number={2}
              title="Essential technologies"
            >
              <p>These support necessary functions such as:</p>

              <ul className="fbcp-function-list">
                <li>Website navigation.</li>
                <li>Shopping-cart operation.</li>
                <li>Account login.</li>
                <li>Security.</li>
                <li>Fraud prevention.</li>
                <li>Remembering privacy choices.</li>
              </ul>

              <div className="fbcp-note">
                <p>
                  Disabling essential technologies may prevent parts of
                  the website from working correctly.
                </p>
              </div>
            </PolicySection>

            <PolicySection
              id="preferences"
              number={3}
              title="Preference technologies"
            >
              <p>
                These remember selections such as account settings,
                display preferences, or shopping-cart contents.
              </p>
            </PolicySection>

            <PolicySection
              id="analytics"
              number={4}
              title="Analytics technologies"
            >
              <p>
                If enabled, analytics technologies help us understand how
                visitors use the website, identify technical errors, and
                improve performance.
              </p>
            </PolicySection>

            <PolicySection
              id="advertising"
              number={5}
              title="Advertising technologies"
            >
              <p>
                If advertising tools are enabled, they may help measure
                advertising performance or provide relevant advertising.
                Where required by law, these technologies will be subject
                to consent or opt-out rights.
              </p>
            </PolicySection>

            <PolicySection
              id="payment"
              number={6}
              title="Payment information"
            >
              <p>
                Cookies and local storage used by{" "}
                {BUSINESS_INFO.businessName} are not intended to store
                complete payment-card numbers or card security codes.
              </p>
              <p>
                When payments are activated, payment providers may use
                their own necessary security and fraud-prevention
                technologies.
              </p>
            </PolicySection>

            <PolicySection
              id="managing"
              number={7}
              title="Managing cookies"
            >
              <p>
                Customers may block, delete, or restrict cookies through
                browser settings. Doing so may affect shopping-cart,
                account, and website functionality.
              </p>
              <p>
                Where a cookie-preference tool is available, customers
                may use it to manage non-essential technologies.
              </p>
              <p>
                We will recognize legally required browser-based opt-out
                signals where applicable and technically supported.
              </p>
            </PolicySection>

            <PolicySection id="changes" number={8} title="Changes">
              <p>
                We may update this Cookie Policy when our technology,
                providers, or legal obligations change. Updates will be
                posted with a revised date.
              </p>
            </PolicySection>

            <PolicySection id="contact" number={9} title="Contact">
              <div className="fbcp-contact">
                <address>
                  <strong>{BUSINESS_INFO.businessName}</strong>

                  {addressLines.map((line, index) => (
                    <React.Fragment key={`${index}-${line}`}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </address>

                <div className="fbcp-contact-links">
                  {BUSINESS_INFO.email && (
                    <a href={`mailto:${BUSINESS_INFO.email}`}>
                      <Mail size={17} strokeWidth={1.4} />
                      <span>
                        <small>Email</small>
                        {BUSINESS_INFO.email}
                      </span>
                    </a>
                  )}

                  {BUSINESS_INFO.phoneDisplay && phoneHref && (
                    <a href={`tel:${phoneHref}`}>
                      <Phone size={17} strokeWidth={1.4} />
                      <span>
                        <small>Phone</small>
                        {BUSINESS_INFO.phoneDisplay}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </PolicySection>

            <footer className="fbcp-document-footer">
              <span>{BUSINESS_INFO.businessName} / Cookie Policy</span>
              <a href="#fbcp-top">
                Back to top
                <ArrowUpRight size={15} />
              </a>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
};

const policyStyles = `
  .fbcp-page {
    --forest: #173f36;
    --deep: #102e28;
    --pistachio: #d7e5a5;
    --bone: #f5f0e6;
    --paper: #fffdf5;
    --brass: #a56e4f;
    --line: rgba(23, 63, 54, .24);
    min-height: 100vh;
    padding-block: clamp(40px, 6vw, 80px) clamp(50px, 7vw, 100px);
    background: var(--bone);
    color: var(--forest);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
    scroll-margin-top: 100px;
  }

  .fbcp-page *,
  .fbcp-page *::before,
  .fbcp-page *::after {
    box-sizing: border-box;
  }

  .fbcp-page a {
    color: inherit;
  }

  .fbcp-page a:focus-visible {
    outline: 3px solid var(--brass);
    outline-offset: 5px;
  }

  .fbcp-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbcp-overline {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbcp-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 285px;
    align-items: end;
    gap: 35px;
    margin-bottom: clamp(40px, 5vw, 65px);
    padding-bottom: 32px;
    border-bottom: 1px solid var(--forest);
    animation: fbcpEnter .65s both;
  }

  .fbcp-header h1 {
    margin: 18px 0 0;
    font-size: clamp(60px, 8.5vw, 118px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.075em;
  }

  .fbcp-header h1 span {
    display: block;
    margin-left: clamp(0px, 5vw, 75px);
    color: var(--brass);
  }

  .fbcp-header-note {
    padding-bottom: 5px;
  }

  .fbcp-header-note > p {
    margin: 18px 0;
    font-size: 14px;
    line-height: 1.8;
  }

  .fbcp-header-note > span {
    font-size: 11px;
    color: #516b62;
  }

  .fbcp-layout {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    align-items: start;
    gap: clamp(28px, 4vw, 60px);
  }

  .fbcp-sidebar {
    position: sticky;
    top: 120px;
  }

  .fbcp-sidebar nav > .fbcp-overline {
    margin-bottom: 18px;
  }

  .fbcp-sidebar ol {
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--line);
    list-style: none;
  }

  .fbcp-sidebar li a {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr) 15px;
    align-items: center;
    gap: 10px;
    min-height: 53px;
    padding: 12px 7px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
    text-decoration: none;
    transition: background .2s ease, padding .2s ease;
  }

  .fbcp-sidebar li a > span {
    color: var(--brass);
    font-size: 9px;
  }

  .fbcp-sidebar li a:hover {
    padding-left: 12px;
    background: var(--pistachio);
  }

  .fbcp-sidebar-help {
    margin-top: 28px;
    padding: 25px;
    border: 1px solid var(--forest);
    background: var(--pistachio);
  }

  .fbcp-sidebar-help h2 {
    margin: 14px 0 12px;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.045em;
  }

  .fbcp-sidebar-help p {
    margin: 0;
    font-size: 11px;
    line-height: 1.8;
  }

  .fbcp-sidebar-help a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    min-height: 44px;
    margin-top: 15px;
    border-bottom: 1px solid var(--forest);
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }

  .fbcp-document {
    min-width: 0;
    border: 1px solid var(--forest);
    background: var(--paper);
    box-shadow: 9px 9px 0 rgba(23, 63, 54, .1);
    animation: fbcpEnter .65s .08s both;
  }

  .fbcp-document-intro {
    padding: clamp(25px, 3.8vw, 50px);
    border-bottom: 1px solid var(--forest);
    background: var(--pistachio);
  }

  .fbcp-document-intro > p:last-child {
    margin: 17px 0 0;
    font-size: clamp(16px, 1.7vw, 21px);
    line-height: 1.7;
    letter-spacing: -.02em;
    overflow-wrap: anywhere;
  }

  .fbcp-document-intro a {
    text-underline-offset: 4px;
  }

  .fbcp-section {
    display: grid;
    grid-template-columns: 35px minmax(0, 1fr);
    gap: 20px;
    padding: clamp(25px, 3.5vw, 45px);
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 120px;
  }

  .fbcp-section:target {
    background: #f1f4e8;
  }

  .fbcp-section-number {
    padding-top: 7px;
    color: var(--brass);
    font-size: 12px;
  }

  .fbcp-section-content {
    min-width: 0;
  }

  .fbcp-section h2 {
    margin: 0 0 18px;
    font-size: clamp(25px, 2.6vw, 34px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbcp-section-content > p {
    margin: 0 0 14px;
    color: #516b62;
    font-size: 14px;
    line-height: 1.9;
  }

  .fbcp-section-content > p:last-child {
    margin-bottom: 0;
  }

  .fbcp-function-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 25px;
    margin: 18px 0;
    padding: 0 0 0 18px;
    color: #516b62;
    font-size: 13px;
    line-height: 1.8;
  }

  .fbcp-function-list li {
    padding-block: 7px;
  }

  .fbcp-note {
    margin-top: 20px;
    padding: 18px 20px;
    border-left: 3px solid var(--forest);
    background: #e9eddf;
  }

  .fbcp-note p {
    margin: 0;
    font-size: 13px;
    line-height: 1.8;
  }

  .fbcp-contact {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 25px;
  }

  .fbcp-contact address {
    color: #516b62;
    font-size: 13px;
    font-style: normal;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbcp-contact address strong {
    display: block;
    margin-bottom: 8px;
    color: var(--forest);
    font-size: 16px;
    font-weight: 600;
  }

  .fbcp-contact-links {
    display: grid;
    align-content: start;
    gap: 16px;
  }

  .fbcp-contact-links a {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-height: 44px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    overflow-wrap: anywhere;
  }

  .fbcp-contact-links a > span {
    min-width: 0;
  }

  .fbcp-contact-links svg {
    flex-shrink: 0;
    margin-top: 4px;
  }

  .fbcp-contact-links small {
    display: block;
    margin-bottom: 4px;
    color: #516b62;
    font-size: 10px;
    font-weight: 400;
  }

  .fbcp-contact-links a:hover {
    color: var(--brass);
  }

  .fbcp-document-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 30px;
    font-size: 10px;
  }

  .fbcp-document-footer a {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  @keyframes fbcpEnter {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1000px) {
    .fbcp-layout {
      grid-template-columns: 225px minmax(0, 1fr);
      gap: 25px;
    }

    .fbcp-section {
      grid-template-columns: 25px minmax(0, 1fr);
      gap: 12px;
      padding: 28px 24px;
    }

    .fbcp-contact {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbcp-sidebar-help {
      padding: 21px;
    }
  }

  @media (max-width: 760px) {
    .fbcp-header {
      grid-template-columns: minmax(0, 1fr);
      gap: 25px;
    }

    .fbcp-header-note {
      max-width: 430px;
    }

    .fbcp-header-note > svg {
      display: none;
    }

    .fbcp-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }

    .fbcp-sidebar {
      position: static;
    }

    .fbcp-sidebar ol {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 20px;
    }

    .fbcp-sidebar-help {
      margin-top: 20px;
    }

    .fbcp-sidebar-help h2 {
      font-size: 25px;
    }

    .fbcp-section {
      scroll-margin-top: 100px;
    }
  }

  @media (max-width: 480px) {
    .fbcp-header h1 {
      font-size: clamp(55px, 16vw, 78px);
    }

    .fbcp-header h1 span {
      margin-left: 0;
    }

    .fbcp-sidebar ol {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbcp-document {
      box-shadow: 6px 6px 0 rgba(23, 63, 54, .1);
    }

    .fbcp-document-intro {
      padding: 25px 20px;
    }

    .fbcp-section {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      padding: 27px 20px;
    }

    .fbcp-section-number {
      padding-top: 0;
    }

    .fbcp-section h2 {
      font-size: 28px;
    }

    .fbcp-section-content > p {
      font-size: 13px;
    }

    .fbcp-function-list {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbcp-document-footer {
      flex-wrap: wrap;
      gap: 8px;
      padding: 18px 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbcp-page *,
    .fbcp-page *::before,
    .fbcp-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default CookiePolicy;