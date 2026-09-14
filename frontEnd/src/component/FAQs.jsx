import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

const BUSINESS_INFO = {
  businessName: "Ectoo",
  address: "1825 Dickinson Ave Ste D, Dickinson, TX 77539",
  phoneDisplay: "+1 (917) 695-2303",
  phoneHref: "+19176952303",
  email: "info@ectoo.us",
  businessDays: "Monday – Friday",
  supportHours: "9:00 AM – 5:00 PM Central Time",
};

const FAQs = () => {
  const pageRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: "Business",
      question: "Who operates Ectoo?",
      answer:
        "Ectoo is operated by Ectoo, a Texas limited liability company.",
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
        "Ectoo accepts online electronic payments only through methods displayed at checkout. Payment processing is currently being set up and will become available after an authorized payment provider is activated.",
    },
    {
      category: "Orders & Payment",
      question: "Do you offer Cash on Delivery?",
      answer:
        "No. Ectoo does not accept Cash on Delivery.",
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
        "After online payments are activated, the exact processor-approved billing descriptor will be displayed at checkout or in the order confirmation. It will identify the transaction as associated with Ectoo.",
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
        "Contact info@ectoo.us immediately. Address changes are available only before shipment and cannot be guaranteed after fulfillment begins.",
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
        "For a change-of-mind return, the customer pays return shipping. For a verified damaged, defective, or incorrect product, Ectoo covers reasonable return-shipping costs.",
    },
    {
      category: "Returns & Refunds",
      question: "What if my order arrives damaged or incorrect?",
      answer:
        "Contact info@ectoo.us within 48 hours of delivery. Include the order number and clear photographs of the item, packaging, and shipping label.",
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
      answer:
        "After receiving return authorization, send the product according to our instructions to: Ectoo, 1825 Dickinson Ave Ste D, Dickinson, TX 77539, United States. Do not mail an unauthorized return.",
    },
    {
      category: "Business",
      question: "Where is your inventory stored?",
      answer:
        "Ectoo fulfills customer orders from inventory held for sale by the business. Our published address is a business mailing and authorized return address and is not presented as a walk-in retail store.",
    },
    {
      category: "Business",
      question: "Can I shop at the Pasadena address?",
      answer:
        "No walk-in retail shopping or customer pickup is offered unless Ectoo confirms an appointment or pickup option in writing.",
    },
    {
      category: "Support",
      question: "How can I contact customer support?",
      answer:
        "Email: info@ectoo.us. Phone: +1 (917) 695-2303. Hours: Monday–Friday, 9:00 AM–5:00 PM Central Time. We generally respond within one business day.",
    },
  ];

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
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex((current) =>
      current === index ? -1 : index
    );
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(34px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-40px);
        }

        [data-reveal="scale"] {
          transform: scale(0.97);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
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
        <div data-reveal="scale" className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1F2D22] text-white sm:h-16 sm:w-16">
            <HelpCircle
              size={24}
              aria-hidden="true"
            />
          </div>

          <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#5E5B57] sm:text-base">
            Find helpful information about Ectoo, orders, payments,
            shipping, returns, refunds, and customer support.
          </p>
        </div>
      </section>

      
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={faq.question}
                data-reveal className="overflow-hidden rounded-[16px] border border-[#E4DED7] bg-white px-5 py-4 transition-all duration-300 hover:border-[#1F2D22]/20 sm:px-6 sm:py-5"
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-12 w-full items-start justify-between gap-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9A5937]">
                      {faq.category}
                    </p>

                    <h2 className="mt-1.5 pr-2 font-display text-xl leading-6 text-[#111311] sm:text-2xl">
                      {faq.question}
                    </h2>
                  </div>

                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`mt-1 shrink-0 text-[#1F2D22]/45 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                  >
                    <p className="mt-3 max-w-2xl pr-1 whitespace-pre-line text-sm leading-7 text-[#5E5B57] sm:pr-8">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      
      <section className="border-t border-[#E4DED7] bg-[#E4E5DD] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div data-reveal="scale" className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[22px] bg-[#1F2D22] p-7 text-center text-white sm:p-9 md:flex-row md:justify-between md:text-left">
          <div className="min-w-0">
            <h2 className="font-display text-2xl sm:text-3xl">
              Still have questions?
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Contact {BUSINESS_INFO.businessName} if you need
              additional information.
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              {BUSINESS_INFO.email} · {BUSINESS_INFO.phoneDisplay}
              <br />
              {BUSINESS_INFO.businessDays} · {BUSINESS_INFO.supportHours}
            </p>
          </div>

          <Link
            to="/contact"
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[6px] bg-[#F1EEE8] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:w-auto"
          >
            Contact Support

            <ArrowRight
              size={16}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQs;