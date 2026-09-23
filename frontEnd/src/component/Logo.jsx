import React from "react";

const EctooLogo = ({
  size = "md",
  showTagline = false,
  className = "",
}) => {
  const sizes = {
    sm: {
      logo: "h-8",
      tagline: "text-[9px]",
    },
    md: {
      logo: "h-10",
      tagline: "text-[10px]",
    },
    lg: {
      logo: "h-12",
      tagline: "text-xs",
    },
    xl: {
      logo: "h-16",
      tagline: "text-sm",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div
      className={`inline-flex max-w-full select-none flex-col items-start ${className}`}
      aria-label={
        showTagline
          ? "Ectoo — Carry Your Style"
          : "Ectoo"
      }
    >
      <img
        src="/ECTOO LOGO.png"
        alt="ECTOO"
        className={`${currentSize.logo} w-auto max-w-full object-contain`}
      />

      {showTagline && (
        <span
          className={`${currentSize.tagline} mt-1 whitespace-nowrap font-semibold uppercase tracking-[0.18em] text-[#5E5B57] sm:tracking-[0.22em]`}
        >
          Carry Your Style
        </span>
      )}
    </div>
  );
};

export default EctooLogo;