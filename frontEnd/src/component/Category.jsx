import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ImageOff,
  ShoppingBag,
} from "lucide-react";

import { API_BASE_URL } from "../config";

const CATEGORY_CONFIG = [
  {
    id: "shoulder",
    name: "Shoulder Bags",
    image: "/Shoulder Bag.png",
    subtitle: "Close by, all day.",
    description:
      "Discover shoulder bags for everyday plans, evening outings, and everything in between.",
    mood: "For your daily rhythm",
    background: "#d7e5a5",
  },
  {
    id: "handbags",
    name: "Handbags",
    image: "/Handbags.png",
    subtitle: "A little presence.",
    description:
      "Explore handbags that bring your personal style into the everyday.",
    mood: "For a considered look",
    background: "#e9dfcf",
  },
  {
    id: "totes",
    name: "Tote Bags",
    image: "/Tote Bags.png",
    subtitle: "Room for your day.",
    description:
      "Browse tote bags and find a shape that suits your routine, from workdays to weekends.",
    mood: "For fuller days",
    background: "#dce5da",
  },
  {
    id: "crossbody",
    name: "Crossbody Bags",
    image: "/Crossbody Bags.png",
    subtitle: "Go your own way.",
    description:
      "Find a crossbody style for days on the move and plans that take you somewhere new.",
    mood: "For wherever you go",
    background: "#ede1d8",
  },
];

const normalizeCategory = (value) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : "";

const createShopLink = (categoryName) =>
  `/shop?category=${encodeURIComponent(categoryName)}`;

const CategoryImage = ({ src, name }) => {
  const [failedSource, setFailedSource] = useState(null);

  if (!src || failedSource === src) {
    return (
      <div className="fbl-category-image-fallback">
        <ImageOff size={42} strokeWidth={1.2} />
        <span>Collection image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} collection`}
      onError={() => setFailedSource(src)}
      className="fbl-category-bag"
    />
  );
};

const Category = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(
    CATEGORY_CONFIG[0].id
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const baseUrl = String(API_BASE_URL).replace(/\/+$/, "");

        const response = await fetch(`${baseUrl}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load collection counts.");
        }

        const data = await response.json();

        if (controller.signal.aborted) return;

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : null;

        if (!productList) {
          throw new Error("Unexpected product response.");
        }

        setProducts(productList);
      } catch (fetchError) {
        if (controller.signal.aborted) return;

        setError(
          "Collection counts are unavailable. You can still browse every category."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [requestVersion]);

  const categories = useMemo(
    () =>
      CATEGORY_CONFIG.map((category) => ({
        ...category,
        count: products.filter(
          (product) =>
            normalizeCategory(product?.category) ===
            normalizeCategory(category.name)
        ).length,
      })),
    [products]
  );

  const activeCategory =
    categories.find(
      (category) => category.id === activeCategoryId
    ) || categories[0];

  const totalProducts = categories.reduce(
    (total, category) => total + category.count,
    0
  );

  const getCountText = (count) => {
    if (loading) return "Loading styles…";
    if (error) return "Explore collection";

    return `${count} ${count === 1 ? "style" : "styles"}`;
  };

  return (
    <main className="fbl-category-page">
      <style>{categoryStyles}</style>

      <div className="fbl-category-container">
        <header className="fbl-category-header">
          <div>
            <p className="fbl-category-overline">
              FableBelle / The collection
            </p>

            <h1>
              Different shapes.
              <span>Same you.</span>
            </h1>
          </div>

          <div className="fbl-category-header-copy">
            <p>
              Start with a silhouette. Find the piece that fits
              naturally into your day.
            </p>

            <Link to="/shop" className="fbl-category-text-link">
              Browse all bags
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </header>

        <section
          className="fbl-category-workspace"
          aria-label="Explore bag categories"
        >
          <div className="fbl-category-controls">
            <div className="fbl-category-controls-top">
              <span className="fbl-category-step">01</span>
              <div>
                <p className="fbl-category-overline">
                  Find your silhouette
                </p>
                <h2>What feels like you?</h2>
              </div>
            </div>

            <div
              className="fbl-category-choice-list"
              role="group"
              aria-label="Choose a bag category"
            >
              {categories.map((category, index) => {
                const isActive =
                  category.id === activeCategoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="fbl-category-preview"
                    className={`fbl-category-choice ${
                      isActive ? "is-active" : ""
                    }`}
                    onClick={() =>
                      setActiveCategoryId(category.id)
                    }
                  >
                    <span className="fbl-category-choice-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="fbl-category-choice-copy">
                      <strong>{category.name}</strong>
                      <span>{category.subtitle}</span>
                    </span>

                    <ArrowUpRight
                      size={21}
                      strokeWidth={1.4}
                      className="fbl-category-choice-arrow"
                    />
                  </button>
                );
              })}
            </div>

            <div className="fbl-category-controls-bottom">
              <ShoppingBag size={20} strokeWidth={1.4} />

              <p>
                Choose a shape to preview it, then explore
                the collection.
              </p>
            </div>
          </div>

          <div
            id="fbl-category-preview"
            className="fbl-category-preview"
            style={{
              "--fbl-stage-color": activeCategory.background,
            }}
          >
            <div
              key={activeCategory.id}
              className="fbl-category-preview-inner"
            >
              <div className="fbl-category-stage-top">
                <span className="fbl-category-overline">
                  {activeCategory.mood}
                </span>

                <span className="fbl-category-stage-count">
                  {getCountText(activeCategory.count)}
                </span>
              </div>

              <div className="fbl-category-stage-art">
                <span
                  className="fbl-category-stage-circle"
                  aria-hidden="true"
                />
                <span
                  className="fbl-category-stage-orbit"
                  aria-hidden="true"
                />

                <CategoryImage
                  src={activeCategory.image}
                  name={activeCategory.name}
                />
              </div>

              <div
                className="fbl-category-stage-caption"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="fbl-category-overline">
                  Your selected silhouette
                </p>

                <h2>{activeCategory.name}</h2>
                <p>{activeCategory.description}</p>
              </div>

              <Link
                to={createShopLink(activeCategory.name)}
                className="fbl-category-primary"
              >
                Explore {activeCategory.name}
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <div className="fbl-category-error" role="status">
            <p>{error}</p>
            <button
              type="button"
              onClick={() =>
                setRequestVersion((version) => version + 1)
              }
              disabled={loading}
            >
              {loading ? "Retrying…" : "Retry counts"}
            </button>
          </div>
        )}

        <section className="fbl-category-footer">
          <div className="fbl-category-footer-heading">
            <p className="fbl-category-overline">
              A shape for every chapter
            </p>
            <h2>Make it an everyday favourite.</h2>
          </div>

          <div className="fbl-category-footer-action">
            <span>
              {loading
                ? "Discover the collection"
                : error
                ? "Four silhouettes to explore"
                : `${totalProducts} ${
                    totalProducts === 1 ? "style" : "styles"
                  } across four silhouettes`}
            </span>

            <Link to="/shop">
              Shop the collection
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

const categoryStyles = `
  .fbl-category-page {
    --fbl-forest: #173f36;
    --fbl-deep: #102e28;
    --fbl-pistachio: #d7e5a5;
    --fbl-bone: #f5f0e6;
    --fbl-paper: #fffdf5;
    --fbl-brass: #a56e4f;
    --fbl-line: rgba(23, 63, 54, .24);
    min-height: 100vh;
    padding-block: clamp(38px, 5vw, 74px)
      clamp(50px, 7vw, 100px);
    background: var(--fbl-bone);
    color: var(--fbl-forest);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbl-category-page *,
  .fbl-category-page *::before,
  .fbl-category-page *::after {
    box-sizing: border-box;
  }

  .fbl-category-page a {
    color: inherit;
    text-decoration: none;
  }

  .fbl-category-page button {
    font: inherit;
    cursor: pointer;
  }

  .fbl-category-page a:focus-visible,
  .fbl-category-page button:focus-visible {
    outline: 3px solid var(--fbl-brass);
    outline-offset: 5px;
  }

  .fbl-category-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbl-category-overline {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbl-category-header {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr)
      minmax(0, .65fr);
    align-items: end;
    gap: 40px;
    margin-bottom: clamp(36px, 5vw, 66px);
    animation: fblCategoryEnter .7s both;
  }

  .fbl-category-header h1 {
    margin: 18px 0 0;
    font-size: clamp(48px, 6.8vw, 96px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -.075em;
  }

  .fbl-category-header h1 span {
    display: block;
    margin-left: clamp(0px, 4vw, 58px);
    color: var(--fbl-brass);
  }

  .fbl-category-header-copy {
    max-width: 330px;
    padding-bottom: 5px;
  }

  .fbl-category-header-copy > p {
    margin: 0 0 20px;
    font-size: 15px;
    line-height: 1.75;
  }

  .fbl-category-text-link {
    display: inline-flex;
    align-items: center;
    gap: 24px;
    min-height: 44px;
    border-bottom: 1px solid currentColor;
    font-size: 12px;
    font-weight: 700;
  }

  .fbl-category-text-link svg {
    transition: transform .25s ease;
  }

  .fbl-category-text-link:hover svg {
    transform: translate(3px, -3px);
  }

  .fbl-category-workspace {
    display: grid;
    grid-template-columns: minmax(0, .9fr)
      minmax(0, 1.1fr);
    border: 1px solid var(--fbl-forest);
    box-shadow: 12px 12px 0 rgba(23, 63, 54, .1);
    animation: fblCategoryEnter .7s .1s both;
  }

  .fbl-category-controls {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: clamp(28px, 3.6vw, 54px);
    background: var(--fbl-paper);
  }

  .fbl-category-controls-top {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 32px;
  }

  .fbl-category-step {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border: 1px solid var(--fbl-forest);
    border-radius: 50%;
    font-size: 11px;
  }

  .fbl-category-controls-top h2 {
    margin: 7px 0 0;
    font-size: clamp(22px, 2.4vw, 32px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.045em;
  }

  .fbl-category-choice-list {
    border-top: 1px solid var(--fbl-line);
  }

  .fbl-category-choice {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr) 24px;
    align-items: center;
    gap: 13px;
    width: 100%;
    min-height: 105px;
    padding: 20px 12px;
    border: 0;
    border-bottom: 1px solid var(--fbl-line);
    background: transparent;
    color: var(--fbl-forest);
    text-align: left;
    transition: background .25s ease,
      color .25s ease, padding .25s ease;
  }

  .fbl-category-choice:hover,
  .fbl-category-choice.is-active {
    padding-left: 20px;
    background: var(--fbl-forest);
    color: var(--fbl-bone);
  }

  .fbl-category-choice-number {
    align-self: start;
    padding-top: 6px;
    font-size: 10px;
    opacity: .65;
  }

  .fbl-category-choice-copy strong {
    display: block;
    font-size: clamp(22px, 2.2vw, 30px);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.045em;
  }

  .fbl-category-choice-copy > span {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    opacity: .75;
  }

  .fbl-category-choice-arrow {
    transition: transform .25s ease;
  }

  .fbl-category-choice:hover .fbl-category-choice-arrow,
  .fbl-category-choice.is-active .fbl-category-choice-arrow {
    transform: translate(2px, -2px);
  }

  .fbl-category-controls-bottom {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    margin-top: auto;
    padding-top: 30px;
    color: var(--fbl-brass);
  }

  .fbl-category-controls-bottom svg {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .fbl-category-controls-bottom p {
    max-width: 280px;
    margin: 0;
    font-size: 12px;
    line-height: 1.8;
  }

  .fbl-category-preview {
    min-width: 0;
    overflow: hidden;
    background: var(--fbl-forest);
    color: var(--fbl-bone);
  }

  .fbl-category-preview-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 28px clamp(25px, 3vw, 44px) 32px;
    animation: fblCategoryPreview .45s both;
  }

  .fbl-category-stage-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
  }

  .fbl-category-stage-top .fbl-category-overline {
    max-width: 190px;
    line-height: 1.6;
  }

  .fbl-category-stage-count {
    font-size: 11px;
    text-align: right;
    color: var(--fbl-pistachio);
  }

  .fbl-category-stage-art {
    position: relative;
    isolation: isolate;
    display: grid;
    place-items: center;
    flex: 1;
    min-height: 360px;
    margin-block: 16px;
  }

  .fbl-category-stage-circle {
    position: absolute;
    z-index: -1;
    width: min(76%, 320px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--fbl-stage-color);
    box-shadow: 0 25px 55px rgba(0, 0, 0, .13);
  }

  .fbl-category-stage-orbit {
    position: absolute;
    z-index: -1;
    width: min(90%, 390px);
    aspect-ratio: 1;
    border: 1px solid rgba(215, 229, 165, .35);
    border-radius: 50%;
    animation: fblCategoryOrbit 25s linear infinite;
  }

  .fbl-category-stage-orbit::after {
    content: "";
    position: absolute;
    top: 50%;
    left: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--fbl-brass);
  }

  .fbl-category-bag {
    display: block;
    width: 100%;
    max-width: 450px;
    height: 350px;
    padding: 20px;
    object-fit: contain;
    filter: drop-shadow(10px 20px 16px rgba(0, 0, 0, .2));
    animation: fblCategoryBagEnter .6s both;
    transition: transform .5s ease;
  }

  .fbl-category-stage-art:hover .fbl-category-bag {
    transform: translateY(-7px) rotate(-2deg);
  }

  .fbl-category-image-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 190px;
    height: 190px;
    padding: 20px;
    border-radius: 50%;
    background: var(--fbl-stage-color);
    color: var(--fbl-forest);
    text-align: center;
    font-size: 12px;
  }

  .fbl-category-stage-caption .fbl-category-overline {
    color: var(--fbl-pistachio);
    font-size: 9px;
  }

  .fbl-category-stage-caption h2 {
    margin: 8px 0 12px;
    font-size: clamp(34px, 3.7vw, 52px);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -.06em;
  }

  .fbl-category-stage-caption > p:last-child {
    max-width: 420px;
    margin: 0;
    color: #d3ddd3;
    font-size: 13px;
    line-height: 1.8;
  }

  .fbl-category-page .fbl-category-primary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 56px;
    margin-top: 25px;
    padding: 16px 20px;
    border: 1px solid var(--fbl-pistachio);
    background: var(--fbl-deep);
    color: white;
    font-size: 13px;
    font-weight: 700;
    transition: background .25s ease;
  }

  .fbl-category-primary svg {
    flex-shrink: 0;
    transition: transform .25s ease;
  }

  .fbl-category-primary:hover {
    background: #214d42;
  }

  .fbl-category-primary:hover svg {
    transform: translateX(5px);
  }

  .fbl-category-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 28px;
    padding: 16px 20px;
    border: 1px solid var(--fbl-line);
    background: var(--fbl-paper);
  }

  .fbl-category-error p {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
  }

  .fbl-category-error button {
    flex-shrink: 0;
    min-height: 44px;
    padding: 10px 15px;
    border: 1px solid var(--fbl-forest);
    background: transparent;
    color: var(--fbl-forest);
    font-size: 11px;
    font-weight: 700;
  }

  .fbl-category-error button:disabled {
    opacity: .5;
    cursor: wait;
  }

  .fbl-category-footer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 30px;
    margin-top: clamp(60px, 7vw, 95px);
    padding-top: 28px;
    border-top: 1px solid var(--fbl-forest);
  }

  .fbl-category-footer-heading h2 {
    max-width: 620px;
    margin: 14px 0 0;
    font-size: clamp(30px, 3.5vw, 48px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbl-category-footer-action > span {
    display: block;
    margin-bottom: 12px;
    font-size: 11px;
  }

  .fbl-category-footer-action a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 44px;
    border-bottom: 1px solid var(--fbl-forest);
    font-size: 13px;
    font-weight: 700;
  }

  @keyframes fblCategoryEnter {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fblCategoryPreview {
    from { opacity: .35; }
    to { opacity: 1; }
  }

  @keyframes fblCategoryBagEnter {
    from {
      opacity: 0;
      translate: 0 14px;
    }
    to {
      opacity: 1;
      translate: 0 0;
    }
  }

  @keyframes fblCategoryOrbit {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 1000px) {
    .fbl-category-header {
      grid-template-columns: minmax(0, 1fr);
      gap: 26px;
    }

    .fbl-category-header-copy {
      max-width: 470px;
    }

    .fbl-category-controls {
      padding: 30px 24px;
    }

    .fbl-category-choice {
      gap: 9px;
      padding-inline: 8px;
    }

    .fbl-category-choice-copy strong {
      font-size: 25px;
    }

    .fbl-category-stage-art {
      min-height: 320px;
    }

    .fbl-category-bag {
      height: 310px;
      padding: 10px;
    }
  }

  @media (max-width: 760px) {
    .fbl-category-workspace {
      grid-template-columns: minmax(0, 1fr);
      box-shadow: 8px 8px 0 rgba(23, 63, 54, .1);
    }

    .fbl-category-controls {
      padding: 28px;
    }

    .fbl-category-choice {
      min-height: 88px;
      padding: 17px 12px;
    }

    .fbl-category-controls-bottom {
      padding-top: 22px;
    }

    .fbl-category-controls-bottom p {
      max-width: none;
    }

    .fbl-category-preview-inner {
      padding: 26px 30px 30px;
    }

    .fbl-category-stage-art {
      min-height: 360px;
    }

    .fbl-category-bag {
      height: 350px;
    }

    .fbl-category-footer {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbl-category-footer-action {
      max-width: 350px;
    }
  }

  @media (max-width: 480px) {
    .fbl-category-header h1 {
      font-size: clamp(42px, 11.5vw, 57px);
    }

    .fbl-category-header h1 span {
      margin-left: 0;
    }

    .fbl-category-header-copy > p {
      font-size: 14px;
    }

    .fbl-category-controls {
      padding: 25px 18px;
    }

    .fbl-category-controls-top {
      gap: 12px;
      margin-bottom: 24px;
    }

    .fbl-category-controls-top h2 {
      font-size: 24px;
    }

    .fbl-category-choice-copy strong {
      font-size: 24px;
    }

    .fbl-category-choice {
      grid-template-columns: 21px minmax(0, 1fr) 21px;
      gap: 10px;
      padding-inline: 8px;
    }

    .fbl-category-choice:hover,
    .fbl-category-choice.is-active {
      padding-left: 13px;
    }

    .fbl-category-preview-inner {
      padding: 24px 20px;
    }

    .fbl-category-stage-art {
      min-height: 285px;
    }

    .fbl-category-bag {
      height: 285px;
      padding: 8px;
    }

    .fbl-category-stage-caption h2 {
      font-size: 37px;
    }

    .fbl-category-stage-top .fbl-category-overline {
      max-width: 150px;
      font-size: 9px;
    }

    .fbl-category-stage-count {
      font-size: 10px;
    }

    .fbl-category-error {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbl-category-page *,
    .fbl-category-page *::before,
    .fbl-category-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Category;