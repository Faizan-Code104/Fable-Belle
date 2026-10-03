import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  X,
} from "lucide-react";
import { BUSINESS_INFO, getFullAddress } from "../storeInfo";

const brandName = BUSINESS_INFO.businessName;
const fullAddress = getFullAddress();

const supportHours = [
  BUSINESS_INFO.supportHours,
  BUSINESS_INFO.timeZone,
]
  .filter(Boolean)
  .join(" ");

const supportSchedule = [
  BUSINESS_INFO.businessDays,
  supportHours,
]
  .filter(Boolean)
  .join(", ");

const phoneHref =
  BUSINESS_INFO.phoneHref ||
  BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

const contactInstruction = BUSINESS_INFO.email
  ? `Contact us at ${BUSINESS_INFO.email}`
  : "Contact our customer support team";

const supportDetails = [
  BUSINESS_INFO.email && `Email: ${BUSINESS_INFO.email}.`,
  BUSINESS_INFO.phoneDisplay &&
    `Phone: ${BUSINESS_INFO.phoneDisplay}.`,
  supportSchedule && `Hours: ${supportSchedule}.`,
]
  .filter(Boolean)
  .join(" ");

const FAQS = [
  {
    category: "Business",
    question: `What is ${brandName}?`,
    answer:
      `${brandName} is our online store for handbags, bags, and related fashion accessories.`,
  },
  {
    category: "Product Information",
    question: "What products do you sell?",
    answer:
      "We sell handbags, tote bags, shoulder bags, crossbody bags, and related fashion accessories.",
  },
  {
    category: "Orders & Payment",
    question: "Are prices in U.S. dollars?",
    answer:
      "Yes. All prices are displayed and charged in United States dollars unless clearly stated otherwise.",
  },
  {
    category: "Orders & Payment",
    question: "Do you accept online payments?",
    answer:
      `${brandName} accepts online electronic payments only through methods displayed at checkout. Payment processing is currently being set up and will become available after an authorized payment provider is activated.`,
  },
  {
    category: "Orders & Payment",
    question: "Do you offer Cash on Delivery?",
    answer: `No. ${brandName} does not accept Cash on Delivery.`,
  },
  {
    category: "Orders & Payment",
    question: "Do you offer recurring subscriptions?",
    answer:
      "No. Product orders are one-time purchases and are not automatically recurring.",
  },
  {
    category: "Orders & Payment",
    question: "What will appear on my card statement?",
    answer:
      `After online payments are activated, the exact processor-approved billing descriptor will be displayed at checkout or in the order confirmation. It will identify the transaction as associated with ${brandName}.`,
  },
  {
    category: "Shipping",
    question: "How much does shipping cost?",
    answer:
      "We provide free standard shipping on eligible orders within our published U.S. shipping area.",
  },
  {
    category: "Shipping",
    question: "Where do you ship?",
    answer:
      "We currently ship within the contiguous 48 United States. We do not currently ship internationally or to Alaska, Hawaii, U.S. territories, APO/FPO/DPO addresses, or P.O. boxes.",
  },
  {
    category: "Shipping",
    question: "How long does processing take?",
    answer:
      "Orders are normally processed within 1–2 business days after payment authorization and order acceptance.",
  },
  {
    category: "Shipping",
    question: "How long does delivery take?",
    answer:
      "Standard delivery normally takes 3–7 business days after processing. The estimated total period is generally 4–9 business days.",
  },
  {
    category: "Shipping",
    question: "How can I track my order?",
    answer:
      "When tracking becomes available, it will be sent to the email address used for the order. Carrier tracking may take up to 48 hours to update after label creation.",
  },
  {
    category: "Shipping",
    question: "Can I change my shipping address?",
    answer:
      `${contactInstruction} immediately. Address changes are available only before shipment and cannot be guaranteed after fulfillment begins.`,
  },
  {
    category: "Orders & Payment",
    question: "Can I cancel my order?",
    answer:
      "A cancellation may be requested before the order ships. Once an order has shipped, the Return and Refund Policy applies.",
  },
  {
    category: "Returns & Refunds",
    question: "What is your return period?",
    answer:
      "Eligible products may be returned within 30 days of confirmed delivery.",
  },
  {
    category: "Returns & Refunds",
    question: "What condition must a returned item be in?",
    answer:
      "It must be unused, unworn, unwashed, unaltered, and in original condition with tags, accessories, and packaging.",
  },
  {
    category: "Returns & Refunds",
    question: "Do you charge a restocking fee?",
    answer:
      "No. We do not charge a restocking fee for an eligible return.",
  },
  {
    category: "Returns & Refunds",
    question: "Who pays for return shipping?",
    answer:
      `For a change-of-mind return, the customer pays return shipping. For a verified damaged, defective, or incorrect product, ${brandName} covers reasonable return-shipping costs.`,
  },
  {
    category: "Returns & Refunds",
    question: "What if my order arrives damaged or incorrect?",
    answer:
      `${contactInstruction} within 48 hours of delivery. Include the order number and clear photographs of the item, packaging, and shipping label.`,
  },
  {
    category: "Returns & Refunds",
    question: "Do you offer exchanges?",
    answer:
      "No. We provide refunds for eligible returns. A customer may place a separate order for another product.",
  },
  {
    category: "Returns & Refunds",
    question: "How long does a refund take?",
    answer:
      "An approved refund is issued to the original payment method within 5–7 business days after inspection. The bank or card issuer may take additional time to post it.",
  },
  {
    category: "Returns & Refunds",
    question: "Where should I send an authorized return?",
    answer: fullAddress
      ? `After receiving return authorization, send the product according to our instructions to: ${brandName}, ${fullAddress}. Do not mail an unauthorized return.`
      : "After receiving return authorization, send the product to the return address provided in our instructions. Do not mail an unauthorized return.",
  },
  {
    category: "Business",
    question: "Where is your inventory stored?",
    answer:
      `${brandName} fulfills customer orders from inventory held for sale by the business. Our published address is a business mailing and authorized return address and is not presented as a walk-in retail store.`,
  },
  {
    category: "Business",
    question: "Can I shop at your business address?",
    answer:
      `No walk-in retail shopping or customer pickup is offered unless ${brandName} confirms an appointment or pickup option in writing.`,
  },
  {
    category: "Support",
    question: "How can I contact customer support?",
    answer:
      `${supportDetails || "You can contact our team through the Contact page."} We generally respond within one business day.`,
  },
];

const TOPICS = [
  {
    name: "Business",
    subtitle: "About the business",
  },
  {
    name: "Product Information",
    subtitle: "Our bags and accessories",
  },
  {
    name: "Orders & Payment",
    subtitle: "Purchases, payments, and cancellations",
  },
  {
    name: "Shipping",
    subtitle: "Delivery and tracking",
  },
  {
    name: "Returns & Refunds",
    subtitle: "Returns, conditions, and refunds",
  },
  {
    name: "Support",
    subtitle: "Get in touch",
  },
];

const FAQs = () => {
  const [activeTopic, setActiveTopic] = useState("Orders & Payment");
  const [query, setQuery] = useState("");

  const searchText = query.trim().toLowerCase();

  const visibleFaqs = useMemo(
    () =>
      FAQS.filter((faq) =>
        searchText
          ? `${faq.question} ${faq.answer} ${faq.category}`
              .toLowerCase()
              .includes(searchText)
          : faq.category === activeTopic
      ),
    [activeTopic, searchText]
  );

  const selectTopic = (name) => {
    setActiveTopic(name);
    setQuery("");
  };

  return (
    <main className="fbhelp-page">
      <style>{styles}</style>

      <div className="fbhelp-container">
        <div className="fbhelp-topline">
          <span>{brandName} / Customer care</span>
          <Link to="/contact">
            Speak to our team
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="fbhelp-workspace">
          <aside className="fbhelp-sidebar">
            <header className="fbhelp-heading">
              <p className="fbhelp-eyebrow">
                Frequently asked questions
              </p>
              <h1>
                A little
                <span>guidance.</span>
              </h1>
              <p className="fbhelp-intro">
                Choose a topic and find the details you need.
              </p>
            </header>

            <nav className="fbhelp-topics" aria-label="FAQ topics">
              {TOPICS.map((topic, index) => (
                <button
                  key={topic.name}
                  type="button"
                  aria-pressed={
                    !searchText && activeTopic === topic.name
                  }
                  aria-controls="fbhelp-answers"
                  className={
                    !searchText && activeTopic === topic.name
                      ? "is-active"
                      : ""
                  }
                  onClick={() => selectTopic(topic.name)}
                >
                  <span className="fbhelp-topic-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="fbhelp-topic-copy">
                    <strong>{topic.name}</strong>
                    <small>{topic.subtitle}</small>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </nav>

            <div className="fbhelp-support-note">
              <p className="fbhelp-eyebrow">Still need a hand?</p>

              {BUSINESS_INFO.email && (
                <a href={`mailto:${BUSINESS_INFO.email}`}>
                  {BUSINESS_INFO.email}
                </a>
              )}

              {BUSINESS_INFO.phoneDisplay && phoneHref && (
                <a href={`tel:${phoneHref}`}>
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              )}

              {!BUSINESS_INFO.email &&
                !(BUSINESS_INFO.phoneDisplay && phoneHref) && (
                  <Link to="/contact">Contact our team</Link>
                )}

              {supportSchedule && (
                <p>
                  {BUSINESS_INFO.businessDays}
                  {BUSINESS_INFO.businessDays && supportHours && <br />}
                  {supportHours}
                </p>
              )}
            </div>
          </aside>

          <section
            id="fbhelp-answers"
            className="fbhelp-reader"
            aria-labelledby="fbhelp-reader-title"
          >
            <div className="fbhelp-search">
              <label htmlFor="fbhelp-search-input">
                Search every topic
              </label>
              <div className="fbhelp-search-input">
                <Search size={19} aria-hidden="true" />
                <input
                  id="fbhelp-search-input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Shipping, returns, payments…"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="fbhelp-reader-heading">
              <div>
                <p className="fbhelp-eyebrow">
                  {searchText ? "Across all topics" : "The details"}
                </p>
                <h2 id="fbhelp-reader-title">
                  {searchText ? "Search results" : activeTopic}
                </h2>
              </div>
              <span
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {visibleFaqs.length}{" "}
                {visibleFaqs.length === 1 ? "answer" : "answers"}
              </span>
            </div>

            <div
              key={searchText ? "search" : activeTopic}
              className="fbhelp-answer-list"
            >
              {visibleFaqs.length ? (
                visibleFaqs.map((faq, index) => (
                  <article
                    key={faq.question}
                    className="fbhelp-answer"
                    style={{
                      "--fbhelp-delay": `${Math.min(index, 4) * 45}ms`,
                    }}
                  >
                    <span
                      className="fbhelp-answer-number"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      {searchText && (
                        <p className="fbhelp-answer-category">
                          {faq.category}
                        </p>
                      )}
                      <h3>{faq.question}</h3>
                      <p className="fbhelp-answer-text">
                        {faq.answer}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="fbhelp-empty">
                  <h3>No matching answers.</h3>
                  <p>Try another word or choose a topic.</p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                  >
                    Return to {activeTopic}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>

            <footer className="fbhelp-reader-footer">
              <div>
                <p className="fbhelp-eyebrow">
                  A conversation can help
                </p>
                <h3>Let's talk it through.</h3>
              </div>
              <Link to="/contact">
                Contact support
                <ArrowRight size={18} />
              </Link>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
};

const styles = `
  .fbhelp-page {
    --ink: #173f36;
    --cream: #f5f0e6;
    --paper: #fffdf5;
    --lime: #d7e5a5;
    --accent: #a56e4f;
    --line: rgba(23, 63, 54, .23);
    min-height: 100vh;
    padding-bottom: 80px;
    background: var(--cream);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbhelp-page *,
  .fbhelp-page *::before,
  .fbhelp-page *::after {
    box-sizing: border-box;
  }

  .fbhelp-page a {
    color: inherit;
    text-decoration: none;
  }

  .fbhelp-page button,
  .fbhelp-page input {
    font: inherit;
  }

  .fbhelp-page button {
    cursor: pointer;
  }

  .fbhelp-page a:focus-visible,
  .fbhelp-page button:focus-visible,
  .fbhelp-page input:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
  }

  .fbhelp-container {
    width: min(100%, 1450px);
    padding-inline: clamp(20px, 4.2vw, 70px);
    margin-inline: auto;
  }

  .fbhelp-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding-block: 20px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbhelp-topline a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    font-weight: 600;
  }

  .fbhelp-workspace {
    display: grid;
    grid-template-columns: 340px minmax(0, 1fr);
    align-items: start;
    gap: clamp(30px, 5vw, 75px);
    margin-top: 45px;
  }

  .fbhelp-sidebar {
    position: sticky;
    top: 110px;
    min-width: 0;
  }

  .fbhelp-eyebrow {
    margin: 0;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .13em;
  }

  .fbhelp-heading h1 {
    margin: 18px 0;
    font-size: clamp(52px, 5.5vw, 75px);
    font-weight: 500;
    line-height: .99;
    letter-spacing: -.075em;
  }

  .fbhelp-heading h1 span {
    display: block;
    color: var(--accent);
  }

  .fbhelp-intro {
    max-width: 280px;
    margin: 0 0 28px;
    font-size: 13px;
    line-height: 1.8;
    color: #516b62;
  }

  .fbhelp-topics {
    border-top: 1px solid var(--ink);
  }

  .fbhelp-topics button {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr) 18px;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 76px;
    padding: 16px 10px;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    text-align: left;
    transition: background .25s ease, padding .25s ease;
  }

  .fbhelp-topics button:hover,
  .fbhelp-topics button.is-active {
    padding-left: 17px;
    background: var(--lime);
  }

  .fbhelp-topic-number {
    color: var(--accent);
    font-size: 9px;
  }

  .fbhelp-topic-copy strong {
    display: block;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -.035em;
  }

  .fbhelp-topic-copy small {
    display: block;
    margin-top: 3px;
    color: #516b62;
    font-size: 10px;
  }

  .fbhelp-support-note {
    margin-top: 28px;
    padding-left: 12px;
    border-left: 2px solid var(--accent);
  }

  .fbhelp-support-note a {
    display: block;
    width: fit-content;
    max-width: 100%;
    margin-top: 10px;
    font-size: 12px;
    overflow-wrap: anywhere;
  }

  .fbhelp-support-note a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .fbhelp-support-note > p:last-child:not(.fbhelp-eyebrow) {
    margin: 13px 0 0;
    color: #516b62;
    font-size: 10px;
    line-height: 1.8;
  }

  .fbhelp-reader {
    min-width: 0;
    border: 1px solid var(--ink);
    background: var(--paper);
  }

  .fbhelp-search {
    padding: 25px 30px;
    border-bottom: 1px solid var(--line);
    background: #edf0e4;
  }

  .fbhelp-search label {
    display: block;
    margin-bottom: 10px;
    font-size: 10px;
    font-weight: 700;
  }

  .fbhelp-search-input {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--ink);
  }

  .fbhelp-search-input > svg {
    flex-shrink: 0;
  }

  .fbhelp-search-input input {
    width: 100%;
    min-width: 0;
    min-height: 48px;
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fbhelp-search-input input::placeholder {
    color: #697b6d;
    font-size: 12px;
  }

  .fbhelp-search-input input::-webkit-search-cancel-button {
    display: none;
  }

  .fbhelp-search-input button {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
  }

  .fbhelp-reader-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding: 35px 35px 28px;
    border-bottom: 1px solid var(--ink);
  }

  .fbhelp-reader-heading > div {
    min-width: 0;
  }

  .fbhelp-reader-heading h2 {
    margin: 10px 0 0;
    font-size: clamp(31px, 3.4vw, 45px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbhelp-reader-heading > span {
    flex-shrink: 0;
    font-size: 10px;
    color: #516b62;
  }

  .fbhelp-answer {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 20px;
    padding: 32px 35px;
    border-bottom: 1px solid var(--line);
    animation: fbhelpReveal .45s both;
    animation-delay: var(--fbhelp-delay, 0ms);
  }

  .fbhelp-answer-number {
    padding-top: 4px;
    color: var(--accent);
    font-size: 11px;
  }

  .fbhelp-answer-category {
    margin: 0 0 9px;
    color: var(--accent);
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .fbhelp-answer h3 {
    margin: 0 0 14px;
    font-size: clamp(20px, 2vw, 26px);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.035em;
  }

  .fbhelp-answer-text {
    margin: 0;
    color: #516b62;
    font-size: 14px;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbhelp-reader-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 22px;
    padding: 30px 35px;
    background: var(--lime);
  }

  .fbhelp-reader-footer h3 {
    margin: 10px 0 0;
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -.045em;
  }

  .fbhelp-reader-footer a,
  .fbhelp-empty button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 50px;
    padding: 14px 18px;
    border: 0;
    background: var(--ink);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    transition: transform .25s ease;
  }

  .fbhelp-reader-footer a:hover,
  .fbhelp-empty button:hover {
    transform: translateY(-2px);
  }

  .fbhelp-empty {
    padding: 40px 35px;
  }

  .fbhelp-empty h3 {
    margin: 0;
    font-size: 27px;
    font-weight: 500;
    letter-spacing: -.04em;
  }

  .fbhelp-empty p {
    margin: 12px 0 25px;
    font-size: 13px;
    color: #516b62;
  }

  @keyframes fbhelpReveal {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1050px) {
    .fbhelp-workspace {
      grid-template-columns: 275px minmax(0, 1fr);
      gap: 30px;
    }

    .fbhelp-answer,
    .fbhelp-reader-heading,
    .fbhelp-reader-footer {
      padding-inline: 25px;
    }
  }

  @media (max-width: 800px) {
    .fbhelp-workspace {
      grid-template-columns: minmax(0, 1fr);
      margin-top: 32px;
      gap: 30px;
    }

    .fbhelp-sidebar {
      position: static;
    }

    .fbhelp-heading h1 {
      font-size: 64px;
    }

    .fbhelp-heading h1 span {
      display: inline;
      margin-left: 10px;
    }

    .fbhelp-intro {
      max-width: none;
    }

    .fbhelp-topics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 15px;
    }

    .fbhelp-support-note {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .fbhelp-page {
      padding-bottom: 50px;
    }

    .fbhelp-topline {
      flex-wrap: wrap;
      gap: 0;
      padding-block: 12px;
      font-size: 10px;
    }

    .fbhelp-heading h1 {
      font-size: 57px;
    }

    .fbhelp-heading h1 span {
      display: block;
      margin-left: 0;
    }

    .fbhelp-topics {
      gap: 0 10px;
    }

    .fbhelp-topics button {
      grid-template-columns: minmax(0, 1fr) 16px;
      gap: 8px;
      padding: 13px 8px;
      min-height: 70px;
    }

    .fbhelp-topic-number,
    .fbhelp-topic-copy small {
      display: none;
    }

    .fbhelp-topic-copy strong {
      font-size: 15px;
    }

    .fbhelp-topics button:hover,
    .fbhelp-topics button.is-active {
      padding-left: 10px;
    }

    .fbhelp-search {
      padding: 22px 20px;
    }

    .fbhelp-reader-heading {
      align-items: flex-start;
      padding: 27px 20px;
      gap: 12px;
    }

    .fbhelp-reader-heading h2 {
      font-size: 32px;
    }

    .fbhelp-answer {
      grid-template-columns: minmax(0, 1fr);
      gap: 9px;
      padding: 27px 20px;
    }

    .fbhelp-answer h3 {
      font-size: 23px;
    }

    .fbhelp-answer-text {
      font-size: 13px;
    }

    .fbhelp-reader-footer {
      padding: 27px 20px;
    }

    .fbhelp-reader-footer a {
      width: 100%;
    }

    .fbhelp-empty {
      padding: 30px 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbhelp-page *,
    .fbhelp-page *::before,
    .fbhelp-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default FAQs;