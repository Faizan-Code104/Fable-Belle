import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Package,
  Truck,
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

const ShippingPolicy = () => {
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
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const shippingDetails = [
    {
      label: "Shipping Area",
      value: "Contiguous 48 U.S. States",
    },
    {
      label: "Order Processing",
      value: "1–2 business days",
    },
    {
      label: "Shipping Cost",
      value: "Free Standard Shipping",
    },
  ];

  const steps = [
    {
      icon: Package,
      title: "Order Accepted",
      description:
        "After payment authorization and order acceptance, your order enters processing.",
    },
    {
      icon: Clock3,
      title: "Order Processing",
      description:
        "Orders are normally processed within 1–2 business days, excluding weekends and federal holidays.",
    },
    {
      icon: Truck,
      title: "In Transit",
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

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]">
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal="left"] { transform: translateX(-40px); }
        [data-reveal="right"] { transform: translateX(40px); }
        [data-reveal="scale"] { transform: scale(.97); }
        [data-reveal].ectoo-visible { opacity: 1; transform: translate(0,0) scale(1); }
        .shipping-card { transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .shipping-card:hover { transform: translateY(-4px); box-shadow: 0 18px 48px rgba(31,45,34,.07); border-color: rgba(31,45,34,.18); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
      
      <section className="relative overflow-hidden border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div data-reveal="scale" className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F2D22] text-white shadow-[0_12px_30px_rgba(31,45,34,0.15)]">
            <Truck size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo
          </p>

          <h1 className="mt-3 font-display text-5xl leading-[0.98] text-[#111311] sm:text-6xl">
            Shipping Policy
          </h1>

          <p className="mt-4 text-sm text-[#5E5B57]">
            Last updated: September 11, 2026
          </p>
        </div>
      </section>

      
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl leading-tight text-[#111311]">
              Shipping Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E5B57] sm:text-[15px]">
              This Shipping Policy applies to physical products purchased from{" "}
              {BUSINESS_INFO.businessName} through https://www.ectoo.us.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {shippingDetails.map((item) => (
              <div
                key={item.label}
                data-reveal className="shipping-card rounded-[20px] border border-[#E4DED7] bg-white p-5 sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5E5B57]/70">
                  {item.label}
                </p>

                <p className="mt-2 text-base font-bold text-[#111311]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-5 text-[#5E5B57]/80">
            Estimated total time from order acceptance to delivery is generally
            4–9 business days. Delivery estimates are not guaranteed.
          </p>
        </div>
      </section>

      
      <section className="bg-[#E8E7DF] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A5937]">
              Order Journey
            </p>

            <h2 className="mt-2 font-display text-3xl leading-tight text-[#111311]">
              How Shipping Works
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  data-reveal className="shipping-card rounded-[22px] border border-[#E4DED7] bg-white p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#1F2D22] text-white">
                      <Icon size={17} aria-hidden="true" />
                    </div>

                    <span className="text-xs font-bold text-[#5E5B57]/70">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#111311]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#5E5B57]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4 text-sm leading-7 text-[#5E5B57]">
          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Shipping Area
            </h2>

            <p className="mt-3">
              We currently ship to deliverable addresses within the contiguous
              48 United States.
            </p>

            <p className="mt-3">
              We do not currently ship internationally or to Alaska, Hawaii,
              U.S. territories, APO/FPO/DPO addresses, or P.O. boxes.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Shipping Cost
            </h2>

            <p className="mt-3">
              Ectoo provides <strong className="text-[#111311]">free standard shipping</strong>{" "}
              on eligible orders within our published U.S. shipping area.
            </p>

            <p className="mt-3">
              Customers will not be charged a standard shipping fee unless a
              different charge is clearly disclosed before completing the
              order.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Order Processing
            </h2>

            <p className="mt-3">
              Orders are normally processed within{" "}
              <strong className="text-[#111311]">1–2 business days</strong> after
              payment authorization and order acceptance.
            </p>

            <p className="mt-3">
              Business days are Monday through Friday and exclude federal
              holidays. Orders submitted during weekends or holidays begin
              processing on the following business day.
            </p>

            <p className="mt-3">
              An order confirmation does not mean the order has shipped.
              Customers will receive a separate shipping confirmation when
              tracking becomes available.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Estimated Delivery
            </h2>

            <p className="mt-3">
              After processing, standard delivery normally takes{" "}
              <strong className="text-[#111311]">3–7 business days</strong>.
            </p>

            <p className="mt-3">
              The estimated total period from order acceptance to delivery is
              generally <strong className="text-[#111311]">4–9 business days</strong>.
            </p>

            <p className="mt-3">
              Delivery estimates are not guarantees. Severe weather, carrier
              disruptions, incorrect addresses, holidays, emergencies, or
              other circumstances outside our control may cause delays.
            </p>

            <p className="mt-3">
              If we cannot ship within the promised period, we will notify the
              customer and provide available options, including cancellation
              and refund when required.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Shipping Method
            </h2>

            <p className="mt-3">
              Orders are shipped using standard ground or parcel delivery
              through a recognized third-party carrier. The carrier used may
              depend on the destination, package size, and operational
              availability.
            </p>

            <p className="mt-3">
              Available tracking information will be included in the shipping
              confirmation.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Address Accuracy
            </h2>

            <p className="mt-3">
              Customers are responsible for providing a complete and accurate
              delivery address.
            </p>

            <p className="mt-3">
              Contact{" "}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="font-bold text-[#111311] underline underline-offset-2"
              >
                {BUSINESS_INFO.email}
              </a>{" "}
              immediately if an address needs to be corrected. We cannot
              guarantee changes after an order enters fulfillment or has
              shipped.
            </p>

            <p className="mt-3">
              Ectoo is not responsible for delays or failed delivery caused
              by incorrect or incomplete information supplied by the customer.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Tracking
            </h2>

            <p className="mt-3">
              Tracking information may take up to 48 hours to update after a
              label is created.
            </p>

            <p className="mt-3">
              A carrier’s “delivered” scan does not always mean the package
              was handed directly to the recipient. Customers should check the
              delivery area, household members, property staff, and carrier
              notices before reporting a missing delivery.
            </p>

            <p className="mt-3">
              You can also use your Ectoo order number on our{" "}
              <Link
                to="/track-order"
                className="font-bold text-[#111311] underline underline-offset-2"
              >
                Order Tracking page
              </Link>
              .
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Lost Packages
            </h2>

            <p className="mt-3">
              If tracking does not update for an unusual period or a package
              appears lost, contact us at{" "}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="font-bold text-[#111311] underline underline-offset-2"
              >
                {BUSINESS_INFO.email}
              </a>{" "}
              with the order number.
            </p>

            <p className="mt-3">
              We will review the shipment with the carrier and provide an
              appropriate resolution based on the investigation and applicable
              law.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Damaged Packages
            </h2>

            <p className="mt-3">
              If a package arrives visibly damaged, photograph the package and
              product and contact us within{" "}
              <strong className="text-[#111311]">48 hours of delivery</strong>.
            </p>

            <p className="mt-3">
              Please retain the item, packaging, labels, and shipping materials
              until we complete our review.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Refused or Undeliverable Packages
            </h2>

            <p className="mt-3">
              A shipment returned because of refusal, an incorrect address,
              repeated failed delivery, or failure to collect the package may
              be treated as a return.
            </p>

            <p className="mt-3">
              Any additional reshipping charge will be disclosed and approved
              before reshipment. If a refund is requested, unavoidable carrier
              charges incurred because of an incorrect address or refused
              delivery may be deducted where legally permitted.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Split Shipments
            </h2>

            <p className="mt-3">
              If an order contains multiple products, products may arrive in
              separate packages. Additional standard shipping will not be
              charged unless disclosed before purchase.
            </p>
          </section>

          
          <section data-reveal className="rounded-[22px] border border-[#E4DED7] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-[#111311]">
              Contact
            </h2>

            <div className="mt-3 space-y-1">
              <p>{BUSINESS_INFO.businessName}</p>
              <p>1825 Dickinson Ave Ste D</p>
              <p>Dickinson, TX 77539</p>
              <p>United States</p>

              <p className="pt-2">
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-bold text-[#111311] underline underline-offset-2"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>

              <p>
                Phone:{" "}
                <a
                  href={`tel:${BUSINESS_INFO.phoneHref}`}
                  className="font-bold text-[#111311] underline underline-offset-2"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>

              <p>
                Support Hours: {BUSINESS_INFO.businessDays},{" "}
                {BUSINESS_INFO.supportHours}
              </p>
            </div>
          </section>
        </div>
      </section>

      
      <section className="border-t border-[#E4DED7] bg-[#EEE7DF] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div data-reveal="scale" className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-[28px] bg-[#1F2D22] p-7 text-white shadow-[0_22px_55px_rgba(31,45,34,0.14)] sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl">
              Already submitted an order?
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Check the latest available status using your order number.
            </p>
          </div>

          <Link
            to="/track-order"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#F1EEE8] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white md:w-auto"
          >
            Track Order
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;