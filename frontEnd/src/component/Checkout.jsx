import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ImageOff,
  MapPin,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "./CartContext";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const readSavedEmail = () => {
  if (typeof window === "undefined") return "";

  for (const key of ["fablebelle-user", "Fable Belle-user"]) {
    try {
      const saved = window.localStorage.getItem(key);

      if (!saved) continue;

      const user = JSON.parse(saved);

      if (typeof user?.email === "string" && user.email.trim()) {
        return user.email;
      }
    } catch {
      // Continue to the next supported account key.
    }
  }

  return "";
};

const CheckoutImage = ({ src, name }) => {
  const [failedSource, setFailedSource] = useState(null);

  return src && failedSource !== src ? (
    <img
      src={src}
      alt={name || "FableBelle handbag"}
      onError={() => setFailedSource(src)}
      loading="lazy"
    />
  ) : (
    <div className="fbco-image-fallback">
      <ImageOff size={25} strokeWidth={1.3} />
    </div>
  );
};

const Field = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  required = false,
  readOnly = false,
  inputMode,
  pattern,
  full = false,
}) => (
  <div className={`fbco-field ${full ? "fbco-field-full" : ""}`}>
    <label htmlFor={`fbco-${name}`}>
      {label}
      {!required && !readOnly && <span>Optional</span>}
    </label>

    <input
      id={`fbco-${name}`}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      inputMode={inputMode}
      pattern={pattern}
    />
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal } = useCart();

  const [step, setStep] = useState(0);
  const sectionTitleRef = useRef(null);
  const shouldFocusStep = useRef(false);

  const [formData, setFormData] = useState(() => ({
    firstName: "",
    lastName: "",
    email: readSavedEmail(),
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  }));

  const items = cartItems || [];
  const subtotal = Number(cartSubtotal) || 0;
  const shipping = 0;
  const total = subtotal + shipping;

  const totalItems = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate]);

  useEffect(() => {
    if (shouldFocusStep.current) {
      sectionTitleRef.current?.focus();
      shouldFocusStep.current = false;
    }
  }, [step]);

  const changeStep = (nextStep) => {
    shouldFocusStep.current = true;
    setStep(nextStep);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) return;

    changeStep(Math.min(step + 1, 2));
  };

  if (items.length === 0) return null;

  return (
    <main className="fbco-page">
      <style>{checkoutStyles}</style>

      <div className="fbco-container">
        <nav className="fbco-navigation" aria-label="Checkout navigation">
          <Link to="/cart">
            <ArrowLeft size={16} />
            Back to cart
          </Link>
          <span>FableBelle</span>
        </nav>

        <header className="fbco-header">
          <div>
            <p className="fbco-overline">A little closer to yours</p>
            <h1>
              The final <span>details.</span>
            </h1>
          </div>

          <p>
            Review your selection and delivery details.
            Online orders and payments are not yet available.
          </p>
        </header>

        <section className="fbco-order" aria-labelledby="fbco-order-title">
          <div className="fbco-order-intro">
            <ShoppingBag size={25} strokeWidth={1.3} />
            <p className="fbco-overline">Your selection</p>
            <h2 id="fbco-order-title">
              {totalItems} {totalItems === 1 ? "lovely piece" : "lovely pieces"}.
            </h2>
            <Link to="/cart">
              Edit cart
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="fbco-order-items">
            {items.map((item) => {
              const id = item.id || item._id;
              const quantity = Number(item.quantity) || 1;

              return (
                <article key={id} className="fbco-order-item">
                  <Link
                    to={`/shop/${id}`}
                    className="fbco-order-image"
                    aria-label={`View ${item.name}`}
                  >
                    <CheckoutImage src={item.image} name={item.name} />
                  </Link>

                  <div className="fbco-order-item-copy">
                    <p>{item.category || "FableBelle collection"}</p>
                    <Link to={`/shop/${id}`}>
                      <h3>{item.name}</h3>
                    </Link>
                    <span>Quantity: {quantity}</span>
                    <strong>{money(Number(item.price) * quantity)}</strong>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="fbco-price-review">
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>Free</dd>
              </div>
            </dl>

            <div className="fbco-total">
              <span>Order total</span>
              <strong>{money(total)}</strong>
            </div>
          </div>
        </section>

        <div className="fbco-details-layout">
          <aside className="fbco-guide">
            <p className="fbco-overline">Your details, in three steps</p>
            <h2>Where should<br />we begin?</h2>

            <ol className="fbco-steps" aria-label="Checkout progress">
              {["Contact", "Delivery", "Review"].map((label, index) => (
                <li
                  key={label}
                  className={
                    index === step
                      ? "is-current"
                      : index < step
                      ? "is-complete"
                      : ""
                  }
                  aria-current={index === step ? "step" : undefined}
                >
                  <span className="fbco-step-number">
                    {index < step ? (
                      <Check size={15} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ol>

            <div className="fbco-delivery-note">
              <Truck size={23} strokeWidth={1.3} />
              <div>
                <strong>United States delivery</strong>
                <p>Free U.S. shipping is shown in your order review.</p>
              </div>
            </div>
          </aside>

          <section className="fbco-form-panel">
            <div className="fbco-payment-notice" role="note">
              <Clock3 size={19} strokeWidth={1.4} />
              <p>
                <strong>Online checkout is coming soon.</strong>
                These details are for review only. No order is placed
                and no payment is collected.
              </p>
            </div>

            <div key={step} className="fbco-step-content">
              <div className="fbco-form-heading">
                <span className="fbco-form-icon">
                  {step === 0 ? (
                    <User size={22} strokeWidth={1.3} />
                  ) : step === 1 ? (
                    <MapPin size={22} strokeWidth={1.3} />
                  ) : (
                    <Check size={22} strokeWidth={1.3} />
                  )}
                </span>

                <div>
                  <p className="fbco-overline">
                    Step {String(step + 1).padStart(2, "0")}
                  </p>
                  <h2 ref={sectionTitleRef} tabIndex={-1}>
                    {step === 0
                      ? "First, a little about you."
                      : step === 1
                      ? "Next, your delivery details."
                      : "Everything in one place."}
                  </h2>
                </div>
              </div>

              {step < 2 ? (
                <form onSubmit={handleSubmit}>
                  <div className="fbco-fields">
                    {step === 0 ? (
                      <>
                        <Field
                          name="firstName"
                          label="First name"
                          autoComplete="given-name"
                          placeholder="First name"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        <Field
                          name="lastName"
                          label="Last name"
                          autoComplete="family-name"
                          placeholder="Last name"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        <Field
                          name="email"
                          label="Email address"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <Field
                          name="phone"
                          label="Phone number"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+1 555 000 0000"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </>
                    ) : (
                      <>
                        <Field
                          name="address"
                          label="Street address"
                          autoComplete="address-line1"
                          placeholder="Street address"
                          required
                          full
                          value={formData.address}
                          onChange={handleChange}
                        />
                        <Field
                          name="apartment"
                          label="Apartment, suite, etc."
                          autoComplete="address-line2"
                          placeholder="Apartment or suite"
                          full
                          value={formData.apartment}
                          onChange={handleChange}
                        />
                        <Field
                          name="city"
                          label="City"
                          autoComplete="address-level2"
                          placeholder="City"
                          required
                          value={formData.city}
                          onChange={handleChange}
                        />
                        <Field
                          name="state"
                          label="State"
                          autoComplete="address-level1"
                          placeholder="State"
                          required
                          value={formData.state}
                          onChange={handleChange}
                        />
                        <Field
                          name="postalCode"
                          label="ZIP code"
                          autoComplete="postal-code"
                          inputMode="numeric"
                          pattern="[0-9]{5}(-[0-9]{4})?"
                          placeholder="10001 or 10001-1234"
                          required
                          value={formData.postalCode}
                          onChange={handleChange}
                        />
                        <Field
                          name="country"
                          label="Country"
                          autoComplete="country-name"
                          readOnly
                          value={formData.country}
                          onChange={handleChange}
                        />
                      </>
                    )}
                  </div>

                  <div className="fbco-form-actions">
                    {step === 1 && (
                      <button
                        type="button"
                        className="fbco-secondary"
                        onClick={() => changeStep(0)}
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                    )}

                    <button type="submit" className="fbco-primary">
                      {step === 0
                        ? "Continue to delivery"
                        : "Review details"}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="fbco-review">
                  <section className="fbco-review-section">
                    <div className="fbco-review-heading">
                      <h3>Contact</h3>
                      <button
                        type="button"
                        onClick={() => changeStep(0)}
                      >
                        Edit
                      </button>
                    </div>

                    <p>
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>{formData.email}</p>
                    {formData.phone && <p>{formData.phone}</p>}
                  </section>

                  <section className="fbco-review-section">
                    <div className="fbco-review-heading">
                      <h3>Delivery address</h3>
                      <button
                        type="button"
                        onClick={() => changeStep(1)}
                      >
                        Edit
                      </button>
                    </div>

                    <p>{formData.address}</p>
                    {formData.apartment && <p>{formData.apartment}</p>}
                    <p>
                      {formData.city}, {formData.state}{" "}
                      {formData.postalCode}
                    </p>
                    <p>{formData.country}</p>
                  </section>

                  <div className="fbco-review-status">
                    <Clock3 size={23} strokeWidth={1.3} />
                    <div>
                      <h3>Payment is not available yet.</h3>
                      <p>
                        FableBelle is completing its online payment
                        setup. Your order has not been submitted.
                        These details are not saved when you leave
                        this page.
                      </p>
                    </div>
                  </div>

                  <Link to="/cart" className="fbco-primary">
                    Return to cart
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const checkoutStyles = `
  .fbco-page {
    --forest: #173f36;
    --deep: #102e28;
    --pistachio: #d7e5a5;
    --bone: #f5f0e6;
    --paper: #fffdf5;
    --brass: #a56e4f;
    --line: rgba(23, 63, 54, .24);
    min-height: 100vh;
    padding-bottom: clamp(50px, 7vw, 100px);
    background: var(--bone);
    color: var(--forest);
    font-family: 'Onest', ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbco-page *,
  .fbco-page *::before,
  .fbco-page *::after {
    box-sizing: border-box;
  }

  .fbco-page a {
    color: inherit;
    text-decoration: none;
  }

  .fbco-page button,
  .fbco-page input {
    font: inherit;
  }

  .fbco-page button {
    cursor: pointer;
  }

  .fbco-page a:focus-visible,
  .fbco-page button:focus-visible,
  .fbco-page input:focus-visible {
    outline: 3px solid var(--brass);
    outline-offset: 4px;
  }

  .fbco-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbco-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding-block: 16px;
    border-bottom: 1px solid var(--line);
    font-size: 12px;
    font-weight: 600;
  }

  .fbco-navigation a {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 44px;
  }

  .fbco-navigation svg {
    transition: transform .25s ease;
  }

  .fbco-navigation a:hover svg {
    transform: translateX(-4px);
  }

  .fbco-header {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, .65fr);
    align-items: end;
    gap: 35px;
    padding-block: clamp(35px, 5vw, 65px);
    animation: fbcoEnter .65s both;
  }

  .fbco-overline {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbco-header h1 {
    margin: 14px 0 0;
    font-size: clamp(48px, 6.8vw, 94px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -.075em;
  }

  .fbco-header h1 span {
    color: var(--brass);
  }

  .fbco-header > p {
    max-width: 340px;
    margin: 0 0 5px;
    font-size: 14px;
    line-height: 1.8;
  }

  .fbco-order {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) 230px;
    border: 1px solid var(--forest);
    background: var(--paper);
    animation: fbcoEnter .65s .08s both;
  }

  .fbco-order-intro {
    padding: 25px;
    background: var(--pistachio);
  }

  .fbco-order-intro .fbco-overline {
    margin-top: 18px;
  }

  .fbco-order-intro h2 {
    margin: 10px 0 16px;
    font-size: 30px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.05em;
  }

  .fbco-order-intro a {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    min-height: 44px;
    font-size: 11px;
    font-weight: 700;
  }

  .fbco-order-items {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
    gap: 24px;
    padding: 28px;
  }

  .fbco-order-item {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    min-width: 0;
  }

  .fbco-order-image {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 75px;
    height: 100px;
    overflow: hidden;
    background: #e6eadb;
  }

  .fbco-order-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 7px;
    transition: transform .4s ease;
  }

  .fbco-order-image:hover img {
    transform: scale(1.07);
  }

  .fbco-image-fallback {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  .fbco-order-item-copy {
    min-width: 0;
  }

  .fbco-order-item-copy > p {
    margin: 0;
    color: var(--brass);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .fbco-order-item-copy h3 {
    margin: 5px 0 7px;
    font-size: 17px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.035em;
    overflow-wrap: anywhere;
  }

  .fbco-order-item-copy > span {
    display: block;
    font-size: 10px;
    color: #516b62;
  }

  .fbco-order-item-copy strong {
    display: block;
    margin-top: 7px;
    font-size: 13px;
    font-weight: 600;
  }

  .fbco-price-review {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 25px;
    border-left: 1px solid var(--line);
  }

  .fbco-price-review dl {
    display: grid;
    gap: 14px;
    margin: 0;
  }

  .fbco-price-review dl > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
  }

  .fbco-price-review dd {
    margin: 0;
    font-weight: 600;
  }

  .fbco-total {
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid var(--forest);
  }

  .fbco-total > span {
    display: block;
    font-size: 10px;
  }

  .fbco-total strong {
    display: block;
    margin-top: 5px;
    font-size: 35px;
    font-weight: 500;
    letter-spacing: -.05em;
    overflow-wrap: anywhere;
  }

  .fbco-details-layout {
    display: grid;
    grid-template-columns: minmax(0, .65fr) minmax(0, 1.35fr);
    gap: clamp(30px, 5vw, 80px);
    margin-top: clamp(40px, 6vw, 80px);
  }

  .fbco-guide {
    align-self: start;
    position: sticky;
    top: 120px;
  }

  .fbco-guide h2 {
    margin: 16px 0 32px;
    font-size: clamp(35px, 3.7vw, 50px);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -.06em;
  }

  .fbco-steps {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--line);
  }

  .fbco-steps li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 17px 0;
    border-bottom: 1px solid var(--line);
    color: #6c7b71;
    font-size: 15px;
  }

  .fbco-step-number {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--line);
    border-radius: 50%;
    font-size: 10px;
  }

  .fbco-steps .is-current {
    color: var(--forest);
    font-weight: 700;
  }

  .fbco-steps .is-current .fbco-step-number,
  .fbco-steps .is-complete .fbco-step-number {
    border-color: var(--forest);
    background: var(--forest);
    color: #fff;
  }

  .fbco-delivery-note {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    margin-top: 28px;
  }

  .fbco-delivery-note svg {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .fbco-delivery-note strong {
    font-size: 12px;
  }

  .fbco-delivery-note p {
    max-width: 260px;
    margin: 5px 0 0;
    font-size: 11px;
    line-height: 1.8;
    color: #516b62;
  }

  .fbco-form-panel {
    min-width: 0;
    border: 1px solid var(--forest);
    background: var(--paper);
    box-shadow: 9px 9px 0 rgba(23, 63, 54, .1);
  }

  .fbco-payment-notice {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 20px 28px;
    border-bottom: 1px solid var(--line);
    background: #e9eddf;
  }

  .fbco-payment-notice svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .fbco-payment-notice p {
    margin: 0;
    font-size: 11px;
    line-height: 1.8;
  }

  .fbco-payment-notice strong {
    display: block;
    font-weight: 700;
  }

  .fbco-step-content {
    padding: clamp(24px, 3.5vw, 45px);
    animation: fbcoEnter .35s both;
  }

  .fbco-form-heading {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 30px;
  }

  .fbco-form-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    border: 1px solid var(--line);
    background: var(--pistachio);
  }

  .fbco-form-heading h2 {
    margin: 6px 0 0;
    font-size: clamp(25px, 2.7vw, 36px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.05em;
  }

  .fbco-form-heading h2:focus {
    outline: none;
  }

  .fbco-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 18px;
  }

  .fbco-field {
    min-width: 0;
  }

  .fbco-field-full {
    grid-column: 1 / -1;
  }

  .fbco-field label {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 9px;
    font-size: 11px;
    font-weight: 700;
  }

  .fbco-field label span {
    font-size: 9px;
    font-weight: 400;
    color: #516b62;
  }

  .fbco-field input {
    width: 100%;
    min-width: 0;
    min-height: 52px;
    padding: 13px 15px;
    border: 1px solid var(--line);
    border-radius: 0;
    background: var(--bone);
    color: var(--forest);
    font-size: 16px;
    transition: background .2s ease, border-color .2s ease;
  }

  .fbco-field input::placeholder {
    color: #7a877c;
    font-size: 13px;
  }

  .fbco-field input:focus {
    border-color: var(--forest);
    background: #fff;
  }

  .fbco-field input:read-only {
    background: #e9eddf;
    color: #516b62;
  }

  .fbco-form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
  }

  .fbco-page .fbco-primary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 54px;
    padding: 16px 22px;
    border: 1px solid var(--forest);
    background: var(--forest);
    color: white;
    font-size: 12px;
    font-weight: 700;
    transition: background .25s ease, transform .25s ease;
  }

  .fbco-primary svg {
    flex-shrink: 0;
    transition: transform .25s ease;
  }

  .fbco-primary:hover {
    background: var(--deep);
    transform: translateY(-2px);
  }

  .fbco-primary:hover svg {
    transform: translateX(4px);
  }

  .fbco-secondary {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    min-height: 44px;
    padding: 10px 15px;
    border: 0;
    background: transparent;
    color: var(--forest);
    font-size: 12px;
  }

  .fbco-review-section {
    padding-block: 20px;
    border-top: 1px solid var(--line);
  }

  .fbco-review-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 10px;
  }

  .fbco-review-heading h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .fbco-review-heading button {
    min-height: 44px;
    padding: 8px 10px;
    border: 0;
    background: transparent;
    color: var(--brass);
    font-size: 12px;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .fbco-review-section > p {
    margin: 5px 0;
    font-size: 13px;
    color: #516b62;
    overflow-wrap: anywhere;
  }

  .fbco-review-status {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    margin-block: 12px 25px;
    padding: 22px;
    background: var(--pistachio);
  }

  .fbco-review-status svg {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .fbco-review-status h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .fbco-review-status p {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.8;
  }

  @keyframes fbcoEnter {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1100px) {
    .fbco-order {
      grid-template-columns: 180px minmax(0, 1fr) 200px;
    }

    .fbco-order-items {
      grid-template-columns: minmax(0, 1fr);
      padding: 24px;
    }

    .fbco-price-review {
      padding: 20px;
    }

    .fbco-details-layout {
      grid-template-columns: minmax(0, .6fr) minmax(0, 1.4fr);
      gap: 30px;
    }
  }

  @media (max-width: 800px) {
    .fbco-header {
      grid-template-columns: minmax(0, 1fr);
      gap: 23px;
    }

    .fbco-header > p {
      max-width: 500px;
    }

    .fbco-order {
      grid-template-columns: minmax(0, 1fr) 220px;
    }

    .fbco-order-intro {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px 18px;
      padding: 20px;
    }

    .fbco-order-intro .fbco-overline {
      margin: 0;
    }

    .fbco-order-intro h2 {
      margin: 0;
      font-size: 25px;
    }

    .fbco-order-intro a {
      margin-left: auto;
    }

    .fbco-details-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }

    .fbco-guide {
      position: static;
    }

    .fbco-guide h2,
    .fbco-guide > .fbco-overline {
      display: none;
    }

    .fbco-steps {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      border: 0;
      gap: 12px;
    }

    .fbco-steps li {
      gap: 9px;
      padding: 0 0 15px;
      font-size: 12px;
    }

    .fbco-delivery-note {
      margin-top: 18px;
    }
  }

  @media (max-width: 520px) {
    .fbco-header h1 {
      font-size: clamp(43px, 12vw, 62px);
    }

    .fbco-header h1 span {
      display: block;
    }

    .fbco-order {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbco-order-intro {
      gap: 10px 14px;
    }

    .fbco-order-intro > svg {
      display: none;
    }

    .fbco-order-intro .fbco-overline {
      width: 100%;
    }

    .fbco-order-items {
      padding: 22px;
      gap: 22px;
    }

    .fbco-order-image {
      width: 85px;
      height: 105px;
    }

    .fbco-price-review {
      padding: 22px;
      border-left: 0;
      border-top: 1px solid var(--line);
      background: #e9eddf;
    }

    .fbco-total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .fbco-total strong {
      margin: 0;
      font-size: 32px;
    }

    .fbco-steps {
      gap: 8px;
    }

    .fbco-step-number {
      width: 28px;
      height: 28px;
      font-size: 9px;
      flex-shrink: 0;
    }

    .fbco-steps li {
      gap: 6px;
      font-size: 11px;
    }

    .fbco-payment-notice {
      padding: 18px;
    }

    .fbco-step-content {
      padding: 25px 20px;
    }

    .fbco-form-heading {
      gap: 12px;
    }

    .fbco-form-icon {
      width: 38px;
      height: 38px;
    }

    .fbco-form-heading h2 {
      font-size: 27px;
    }

    .fbco-fields {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }

    .fbco-form-actions .fbco-primary {
      width: 100%;
    }

    .fbco-form-panel {
      box-shadow: 6px 6px 0 rgba(23, 63, 54, .1);
    }

    .fbco-review-status {
      padding: 18px;
      gap: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbco-page *,
    .fbco-page *::before,
    .fbco-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Checkout;