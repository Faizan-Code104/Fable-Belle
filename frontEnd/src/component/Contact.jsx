import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import { BUSINESS_INFO } from "../storeInfo";

const EMPTY_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const sendingRef = useRef(false);

  const supportTime = [
    BUSINESS_INFO.supportHours,
    BUSINESS_INFO.timeZone,
  ]
    .filter(Boolean)
    .join(" ");

  const addressLines = [
    BUSINESS_INFO.addressLine1,
    BUSINESS_INFO.addressLine2,
    BUSINESS_INFO.country,
  ].filter(Boolean);

  const phoneHref =
    BUSINESS_INFO.phoneHref ||
    BUSINESS_INFO.phoneDisplay?.replace(/[^\d+]/g, "");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sendingRef.current) return;

    setSuccessMessage("");
    setErrorMessage("");

    if (!event.currentTarget.reportValidity()) return;

    const values = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.trim(),
      ])
    );

    if (Object.values(values).some((value) => !value)) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setErrorMessage(
        BUSINESS_INFO.email || BUSINESS_INFO.phoneDisplay
          ? "The message form is currently unavailable. Please use the contact details below."
          : "The message form is currently unavailable. Please try again later."
      );
      return;
    }

    sendingRef.current = true;
    setIsSubmitting(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: values.name,
          from_email: values.email,
          subject: values.subject,
          message: values.message,
        },
        { publicKey }
      );

      setSuccessMessage(
        "Your message has been sent. Our support team will get back to you as soon as possible."
      );
      setFormData({ ...EMPTY_FORM });
    } catch {
      setErrorMessage(
        BUSINESS_INFO.email
          ? "We couldn't send your message. Please try again or email us directly."
          : "We couldn't send your message. Please try again."
      );
    } finally {
      sendingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <main className="fbct-page">
      <style>{contactStyles}</style>

      <div className="fbct-container">
        <header className="fbct-header">
          <p className="fbct-overline">
            {BUSINESS_INFO.businessName} / The care desk
          </p>

          <h1>
            A question?
            <span>Let's talk.</span>
          </h1>

          <p className="fbct-intro">
            A little help with your order, a detail about a bag,
            or something else on your mind. We're here to listen.
          </p>

          <a href="#fbct-message-form" className="fbct-jump">
            Write us a note
            <ArrowUpRight size={18} />
          </a>
        </header>

        <section
          className="fbct-message-board"
          aria-labelledby="fbct-form-title"
        >
          <div className="fbct-board-top">
            <div>
              <p className="fbct-overline">A note to our team</p>
              <h2 id="fbct-form-title">How can we help?</h2>
            </div>

            <span className="fbct-mail-mark" aria-hidden="true">
              <Mail size={32} strokeWidth={1.1} />
            </span>
          </div>

          <form
            id="fbct-message-form"
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
          >
            <fieldset disabled={isSubmitting}>
              <legend className="fbct-sr-only">
                Your contact details and message
              </legend>

              <div className="fbct-fields">
                <div className="fbct-field">
                  <label htmlFor="fbct-name">
                    <span>01</span>
                    Your name
                  </label>
                  <input
                    id="fbct-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={80}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="fbct-field">
                  <label htmlFor="fbct-email">
                    <span>02</span>
                    Email address
                  </label>
                  <input
                    id="fbct-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="fbct-field fbct-field-full">
                  <label htmlFor="fbct-subject">
                    <span>03</span>
                    What's it about?
                  </label>
                  <input
                    id="fbct-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder="An order, a product, or a general question"
                    required
                  />
                </div>

                <div className="fbct-field fbct-field-full">
                  <div className="fbct-message-label">
                    <label htmlFor="fbct-message">
                      <span>04</span>
                      Your message
                    </label>
                    <span id="fbct-message-count">
                      {formData.message.length} / 2000
                    </span>
                  </div>

                  <textarea
                    id="fbct-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={2000}
                    placeholder="Tell us a little more..."
                    rows={6}
                    required
                    aria-describedby="fbct-message-count"
                  />
                </div>
              </div>
            </fieldset>

            {successMessage && (
              <div className="fbct-feedback is-success" role="status">
                <CheckCircle2 size={20} />
                <p>{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="fbct-feedback is-error" role="alert">
                <AlertCircle size={20} />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="fbct-form-bottom">
              <p>
                Include your order number if your question
                is about an existing order.
              </p>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending your note…" : "Send your note"}
                {isSubmitting ? (
                  <Loader2 size={18} className="fbct-spinner" />
                ) : (
                  <Send size={18} strokeWidth={1.4} />
                )}
              </button>
            </div>
          </form>

          <div className="fbct-board-signature">
            <span>A little care goes a long way.</span>
            <strong>{BUSINESS_INFO.businessName}</strong>
          </div>
        </section>

        <section
          className="fbct-contact-strip"
          aria-labelledby="fbct-contact-title"
        >
          <div className="fbct-strip-heading">
            <p className="fbct-overline">Prefer another way?</p>
            <h2 id="fbct-contact-title">Stay in touch.</h2>
          </div>

          <div className="fbct-contact-grid">
            <div className="fbct-contact-cell">
              <Mail size={21} strokeWidth={1.3} />
              <h3>Email us</h3>

              {BUSINESS_INFO.email && (
                <a href={`mailto:${BUSINESS_INFO.email}`}>
                  {BUSINESS_INFO.email}
                  <ArrowUpRight size={15} />
                </a>
              )}

              <p>
                We usually respond within 24 hours
                during business days.
              </p>
            </div>

            <div className="fbct-contact-cell">
              <Phone size={21} strokeWidth={1.3} />
              <h3>Give us a call</h3>

              {BUSINESS_INFO.phoneDisplay && phoneHref && (
                <a href={`tel:${phoneHref}`}>
                  {BUSINESS_INFO.phoneDisplay}
                  <ArrowUpRight size={15} />
                </a>
              )}

              <p>Available during our business hours.</p>
            </div>

            <div className="fbct-contact-cell">
              <Clock3 size={21} strokeWidth={1.3} />
              <h3>Our hours</h3>

              {BUSINESS_INFO.businessDays && (
                <strong>{BUSINESS_INFO.businessDays}</strong>
              )}

              {supportTime && <p>{supportTime}</p>}
            </div>

            <div className="fbct-contact-cell">
              <MapPin size={21} strokeWidth={1.3} />
              <h3>Business location</h3>

              {addressLines.length > 0 && (
                <address>
                  {addressLines.map((line, index) => (
                    <React.Fragment key={`${index}-${line}`}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </address>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const contactStyles = `
  .fbct-page {
    --forest: #173f36;
    --deep: #102e28;
    --pistachio: #d7e5a5;
    --bone: #f5f0e6;
    --paper: #fffdf5;
    --brass: #a56e4f;
    --line: rgba(23, 63, 54, .24);
    min-height: 100vh;
    padding-block: clamp(40px, 6vw, 85px)
      clamp(50px, 7vw, 100px);
    background: var(--bone);
    color: var(--forest);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbct-page *,
  .fbct-page *::before,
  .fbct-page *::after {
    box-sizing: border-box;
  }

  .fbct-page a {
    color: inherit;
    text-decoration: none;
  }

  .fbct-page input,
  .fbct-page textarea,
  .fbct-page button {
    font: inherit;
  }

  .fbct-page a:focus-visible,
  .fbct-page button:focus-visible,
  .fbct-page input:focus-visible,
  .fbct-page textarea:focus-visible {
    outline: 3px solid var(--brass);
    outline-offset: 5px;
  }

  .fbct-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbct-overline {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbct-header {
    max-width: 850px;
    margin-inline: auto;
    margin-bottom: clamp(40px, 5vw, 70px);
    text-align: center;
    animation: fbctEnter .7s both;
  }

  .fbct-header h1 {
    margin: 20px 0 0;
    font-size: clamp(55px, 8.5vw, 120px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.075em;
  }

  .fbct-header h1 span {
    display: block;
    color: var(--brass);
  }

  .fbct-intro {
    max-width: 450px;
    margin: 25px auto 15px;
    font-size: 15px;
    line-height: 1.8;
  }

  .fbct-jump {
    display: inline-flex;
    align-items: center;
    gap: 20px;
    min-height: 44px;
    border-bottom: 1px solid var(--forest);
    font-size: 12px;
    font-weight: 700;
  }

  .fbct-jump svg {
    transition: transform .25s ease;
  }

  .fbct-jump:hover svg {
    transform: translate(3px, -3px);
  }

  .fbct-message-board {
    width: min(100%, 960px);
    margin-inline: auto;
    border: 1px solid var(--forest);
    background: var(--paper);
    box-shadow: 12px 12px 0 rgba(23, 63, 54, .1);
    animation: fbctEnter .7s .1s both;
  }

  .fbct-board-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    padding: 30px clamp(24px, 4vw, 55px);
    border-bottom: 1px solid var(--forest);
    background: var(--pistachio);
  }

  .fbct-board-top h2 {
    margin: 10px 0 0;
    font-size: clamp(32px, 4vw, 47px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbct-mail-mark {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 76px;
    height: 76px;
    border: 1px solid var(--forest);
    border-radius: 50%;
    transform: rotate(-10deg);
    transition: transform .3s ease;
  }

  .fbct-message-board:hover .fbct-mail-mark {
    transform: rotate(0);
  }

  .fbct-message-board form {
    padding: clamp(25px, 4vw, 55px);
    scroll-margin-top: 110px;
  }

  .fbct-message-board fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .fbct-message-board fieldset:disabled {
    opacity: .65;
  }

  .fbct-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 30px;
  }

  .fbct-field {
    min-width: 0;
  }

  .fbct-field-full {
    grid-column: 1 / -1;
  }

  .fbct-field label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 700;
  }

  .fbct-field label > span {
    color: var(--brass);
    font-size: 10px;
    font-weight: 500;
  }

  .fbct-field input,
  .fbct-field textarea {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 52px;
    padding: 13px 4px;
    border: 0;
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    background: transparent;
    color: var(--forest);
    font-size: 16px;
    transition: border-color .25s ease, background .25s ease;
  }

  .fbct-field input::placeholder,
  .fbct-field textarea::placeholder {
    color: #7b867b;
    font-size: 13px;
  }

  .fbct-field input:focus,
  .fbct-field textarea:focus {
    border-bottom-color: var(--forest);
    background: #f5f7ed;
  }

  .fbct-field textarea {
    min-height: 170px;
    resize: vertical;
    line-height: 1.8;
  }

  .fbct-message-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }

  .fbct-message-label > span {
    color: #516b62;
    font-size: 10px;
    white-space: nowrap;
  }

  .fbct-form-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    margin-top: 30px;
  }

  .fbct-form-bottom > p {
    max-width: 290px;
    margin: 0;
    color: #516b62;
    font-size: 11px;
    line-height: 1.8;
  }

  .fbct-form-bottom button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
    min-height: 56px;
    padding: 16px 23px;
    border: 1px solid var(--forest);
    background: var(--forest);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background .25s ease, transform .25s ease;
  }

  .fbct-form-bottom button:hover:not(:disabled) {
    background: var(--deep);
    transform: translateY(-2px);
  }

  .fbct-form-bottom button:disabled {
    opacity: .6;
    cursor: wait;
  }

  .fbct-form-bottom button svg {
    flex-shrink: 0;
  }

  .fbct-feedback {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 24px;
    padding: 18px;
    border: 1px solid;
  }

  .fbct-feedback svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .fbct-feedback p {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
  }

  .fbct-feedback.is-success {
    border-color: #b2c7ad;
    background: #eaf2e5;
    color: #245333;
  }

  .fbct-feedback.is-error {
    border-color: #dfb5a9;
    background: #faeee8;
    color: #8c382b;
  }

  .fbct-board-signature {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px clamp(24px, 4vw, 55px);
    border-top: 1px solid var(--line);
    background: #edf0e4;
  }

  .fbct-board-signature > span {
    font-size: 11px;
  }

  .fbct-board-signature strong {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -.06em;
  }

  .fbct-contact-strip {
    margin-top: clamp(65px, 8vw, 110px);
  }

  .fbct-strip-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 24px;
  }

  .fbct-strip-heading h2 {
    margin: 0;
    font-size: 42px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbct-contact-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-top: 1px solid var(--forest);
    border-bottom: 1px solid var(--forest);
  }

  .fbct-contact-cell {
    min-width: 0;
    padding: 30px 24px;
    border-right: 1px solid var(--line);
    transition: background .25s ease;
  }

  .fbct-contact-cell:first-child {
    padding-left: 0;
  }

  .fbct-contact-cell:last-child {
    border-right: 0;
  }

  .fbct-contact-cell:hover {
    background: #edf0e4;
  }

  .fbct-contact-cell h3 {
    margin: 18px 0 12px;
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.035em;
  }

  .fbct-contact-cell a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    font-size: 12px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .fbct-contact-cell a svg {
    flex-shrink: 0;
  }

  .fbct-contact-cell a:hover {
    color: var(--brass);
  }

  .fbct-contact-cell > strong {
    display: block;
    padding-top: 10px;
    font-size: 12px;
    font-weight: 700;
  }

  .fbct-contact-cell p,
  .fbct-contact-cell address {
    margin: 8px 0 0;
    color: #516b62;
    font-size: 11px;
    font-style: normal;
    line-height: 1.9;
    overflow-wrap: anywhere;
  }

  .fbct-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .fbct-spinner {
    animation: fbctSpin 1s linear infinite;
  }

  @keyframes fbctSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes fbctEnter {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1000px) {
    .fbct-contact-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .fbct-contact-cell {
      padding: 28px 22px;
    }

    .fbct-contact-cell:first-child {
      padding-left: 22px;
    }

    .fbct-contact-cell:nth-child(2) {
      border-right: 0;
    }

    .fbct-contact-cell:nth-child(-n + 2) {
      border-bottom: 1px solid var(--line);
    }
  }

  @media (max-width: 600px) {
    .fbct-header h1 {
      font-size: clamp(55px, 15vw, 80px);
    }

    .fbct-intro {
      font-size: 14px;
    }

    .fbct-message-board {
      box-shadow: 7px 7px 0 rgba(23, 63, 54, .1);
    }

    .fbct-board-top {
      padding: 25px 22px;
      gap: 15px;
    }

    .fbct-board-top h2 {
      font-size: 33px;
    }

    .fbct-mail-mark {
      width: 54px;
      height: 54px;
    }

    .fbct-mail-mark svg {
      width: 25px;
      height: 25px;
    }

    .fbct-fields {
      grid-template-columns: minmax(0, 1fr);
      gap: 25px;
    }

    .fbct-message-board form {
      padding: 28px 22px;
    }

    .fbct-form-bottom {
      flex-direction: column;
      align-items: stretch;
      gap: 20px;
    }

    .fbct-form-bottom > p {
      max-width: none;
    }

    .fbct-board-signature {
      flex-wrap: wrap;
      gap: 10px;
      padding: 18px 22px;
    }

    .fbct-contact-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbct-contact-cell,
    .fbct-contact-cell:first-child {
      padding: 25px 16px;
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }

    .fbct-contact-cell:last-child {
      border-bottom: 0;
    }

    .fbct-strip-heading {
      flex-direction: column;
      gap: 12px;
    }

    .fbct-strip-heading h2 {
      font-size: 37px;
    }

    .fbct-contact-cell h3 {
      margin-top: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbct-page *,
    .fbct-page *::before,
    .fbct-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Contact;