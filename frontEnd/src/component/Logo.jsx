import React from "react";
import { BUSINESS_INFO } from "../storeInfo";

const FableBelleLogo = ({
  size = "md",
  showTagline = false,
  className = "",
}) => {
  const sizes = {
    sm: {
      logo: "w-[112px] sm:w-[126px]",
      tagline: "text-[8px]",
    },
    md: {
      logo: "w-[144px] sm:w-[168px]",
      tagline: "text-[9px]",
    },
    lg: {
      logo: "w-[182px] sm:w-[210px]",
      tagline: "text-[10px]",
    },
    xl: {
      logo: "w-[224px] sm:w-[280px]",
      tagline: "text-[11px] sm:text-xs",
    },
  };

  const currentSize = sizes[size] || sizes.md;
  const brandName = BUSINESS_INFO.businessName;

  return (
    <div
      className={`inline-flex min-w-0 max-w-full select-none flex-col items-start ${className}`}
      style={{
        fontFamily:
          "'Onest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <img
        src="/logo-mark.png"
        alt={brandName}
        width={1960}
        height={560}
        draggable={false}
        decoding="async"
        className={`${currentSize.logo} block h-auto max-w-full object-contain`}
      />

      {showTagline && (
        <span
          className={`${currentSize.tagline} mt-2 max-w-full font-semibold uppercase leading-relaxed tracking-[0.14em] text-[#173f36] sm:tracking-[0.2em]`}
        >
          Carry Your Style
        </span>
      )}
    </div>
  );
};

export default FableBelleLogo;