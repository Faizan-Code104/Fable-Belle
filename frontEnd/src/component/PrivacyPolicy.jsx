import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  address: "1825 Dickinson Ave Ste D, Dickinson, TX 77539",
  phoneDisplay: "+1 (832) 347-8821",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
  businessDays: "Monday – Friday",
  supportHours: "9:00 AM – 5:00 PM Central Time",
};

const PrivacyPolicy = () => {
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
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      title: "1. Business Information",
      body: [
        "Ectoo is operated by:",
        "Ectoo\n1825 Dickinson Ave Ste D\nDickinson, TX 77539\nUnited States",
        "Email: info@ectoo.us\nPhone: +1 (832) 347-8821\nCustomer Support Hours: Monday–Friday, 9:00 AM–5:00 PM Central Time",
      ],
    },
    {
      title: "2. Information We Collect",
      body: ["Depending on how you interact with our website, we may collect:"],
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
      title: "3. Payment Information",
      body: [
        "Ectoo is currently completing its online payment setup and does not accept Cash on Delivery.",
        "When online payment processing is activated, payments will be handled by an authorized third-party payment processor. Ectoo will not intentionally store complete payment-card numbers or card security codes on its own systems.",
        "Payment processors may collect and process payment information under their own privacy and security policies.",
      ],
    },
    {
      title: "4. How We Use Information",
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
      title: "5. How We Disclose Information",
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
        "To protect the rights, safety, and property of Ectoo, our customers, or others.",
        "In connection with a merger, financing, acquisition, reorganization, or sale of business assets.",
      ],
    },
    {
      title: "6. Sale and Sharing of Personal Information",
      body: [
        "We do not sell personal information for money.",
        "Certain analytics or advertising technologies, if enabled, may be treated as “sharing” or targeted advertising under some state privacy laws. Where legally required, eligible consumers may request to opt out by contacting info@ectoo.us.",
      ],
    },
    {
      title: "7. Cookies and Local Storage",
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
      after: ["Additional information is available in our Cookie Policy."],
    },
    {
      title: "8. Marketing Communications",
      body: [
        "Customers may unsubscribe from promotional emails by using the unsubscribe link included in the message or by contacting info@ectoo.us.",
        "Transactional communications concerning an order, delivery, return, security issue, or account are not promotional and may still be sent when necessary.",
        "We do not send promotional text messages without the recipient’s appropriate consent. Consent to marketing is not a condition of purchase.",
      ],
    },
    {
      title: "9. Data Retention",
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
      title: "10. Data Security",
      body: [
        "We use reasonable administrative, organizational, and technical safeguards designed to protect personal information. However, no website, transmission, or storage system can be guaranteed to be completely secure.",
        "Customers are responsible for maintaining the confidentiality of their account credentials and should contact us immediately if they suspect unauthorized account access.",
        "Please do not send complete payment-card details through email, telephone messages, or our contact form.",
      ],
    },
    {
      title: "11. Your Privacy Choices and Rights",
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
        "To submit a request, email info@ectoo.us with the subject “Privacy Request.”",
        "We may need to verify your identity before completing a request. An authorized agent may submit a request when permitted by law and after providing appropriate authorization.",
      ],
    },
    {
      title: "12. Children’s Privacy",
      body: [
        "Our website and products are intended for adults. We do not knowingly collect personal information directly from children under 13. If you believe a child has provided personal information, contact us so we can review and delete it when required.",
        "Individuals under 18 should use the website only with the involvement and permission of a parent or legal guardian.",
      ],
    },
    {
      title: "13. Third-Party Websites",
      body: [
        "Our website may contain links to third-party websites or services. We are not responsible for the privacy, security, content, or practices of third parties. Customers should review the applicable third party’s policies before providing information.",
      ],
    },
    {
      title: "14. United States Operations",
      body: [
        "Ectoo operates in the United States. Information may be processed and stored in the United States, where privacy laws may differ from those in other jurisdictions.",
      ],
    },
    {
      title: "15. Changes to This Policy",
      body: [
        "We may update this Privacy Policy to reflect operational, legal, or technical changes. The revised version will be posted on this page with an updated “Last Updated” date.",
      ],
    },
    {
      title: "16. Contact Us",
      body: [
        "Questions or privacy requests may be directed to:",
        "Ectoo\n1825 Dickinson Ave Ste D\nDickinson, TX 77539\nUnited States",
        "Email: info@ectoo.us\nPhone: +1 (832) 347-8821\nHours: Monday–Friday, 9:00 AM–5:00 PM Central Time",
      ],
    },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="scale"] {
          transform: scale(0.97);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .privacy-section {
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .privacy-section:hover {
          transform: translateY(-2px);
          border-color: rgba(31, 45, 34, 0.18);
          box-shadow: 0 14px 38px rgba(31, 45, 34, 0.05);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div
          data-reveal="scale"
          className="relative mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F2D22] text-white shadow-[0_12px_30px_rgba(31,45,34,0.15)]">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-5xl leading-[0.98] text-[#111311] sm:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-[#5E5B57]">
            Last updated: September 11, 2026
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p
            data-reveal
            className="rounded-[24px] border border-[#E4DED7] bg-white p-6 text-sm leading-7 text-[#5E5B57] shadow-[0_14px_40px_rgba(31,45,34,0.04)] sm:p-8 sm:text-base"
          >
            Ectoo (“Ectoo,” “we,” “us,” or “our”) respects your privacy. This
            Privacy Policy explains how we collect, use, disclose, retain, and
            protect personal information when you visit https://www.ectoo.us,
            create an account, communicate with us, or purchase our products.
          </p>

          <div className="mt-6 grid gap-4 sm:mt-8">
            {sections.map((section) => (
              <section
                data-reveal
                key={section.title}
                className="privacy-section rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7"
              >
                <h2 className="font-display text-2xl leading-tight text-[#111311]">
                  {section.title}
                </h2>

                <div className="mt-3 space-y-3">
                  {section.body?.map((paragraph, index) => (
                    <p
                      key={`${section.title}-body-${index}`}
                      className="whitespace-pre-line text-sm leading-7 text-[#5E5B57] sm:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-[#5E5B57] sm:text-[15px]">
                      {section.bullets.map((item, index) => (
                        <li key={`${section.title}-bullet-${index}`}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.after?.map((paragraph, index) => (
                    <p
                      key={`${section.title}-after-${index}`}
                      className="whitespace-pre-line text-sm leading-7 text-[#5E5B57] sm:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.afterBullets && (
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-[#5E5B57] sm:text-[15px]">
                      {section.afterBullets.map((item, index) => (
                        <li key={`${section.title}-after-bullet-${index}`}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div
            data-reveal="scale"
            className="mt-8 rounded-[24px] border border-[#E4DED7] bg-[#E8E7DF] p-6 sm:p-8"
          >
            <h2 className="font-display text-xl text-[#111311]">
              Privacy Questions or Requests
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#5E5B57]">
              If you have a question about this Privacy Policy or want to make a
              privacy-related request, you can contact{" "}
              {BUSINESS_INFO.businessName} using the details below.
            </p>

            <div className="mt-4 space-y-1 text-sm leading-6 text-[#5E5B57]">
              <p>{BUSINESS_INFO.businessName}</p>
              <p>{BUSINESS_INFO.address}</p>

              <p>
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-medium text-[#111311] transition-opacity hover:opacity-70"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-medium text-[#111311] transition-opacity hover:opacity-70"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>

              <p>
                Support: {BUSINESS_INFO.businessDays},{" "}
                {BUSINESS_INFO.supportHours}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E4DED7] bg-[#EEE7DF] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div
          data-reveal="scale"
          className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-[28px] bg-[#1F2D22] p-7 text-white shadow-[0_22px_55px_rgba(31,45,34,0.14)] sm:p-9 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="font-display text-2xl">
              Questions about your information?
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Contact us if you have a privacy-related question or request.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#F1EEE8] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white md:w-auto"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
