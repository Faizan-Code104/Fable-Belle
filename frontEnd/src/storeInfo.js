const storeInfo = {
  businessName: "FableBelle",
  website: "https://fablebelle.com",

  // Apni actual business details yahan add karein.
  email: import.meta.env.VITE_SUPPORT_EMAIL || "",
  phoneDisplay: import.meta.env.VITE_SUPPORT_PHONE_DISPLAY || "",
  phoneHref: import.meta.env.VITE_SUPPORT_PHONE_HREF || "",

  addressLine1: import.meta.env.VITE_BUSINESS_ADDRESS_1 || "",
  addressLine2: import.meta.env.VITE_BUSINESS_ADDRESS_2 || "",
  country: import.meta.env.VITE_BUSINESS_COUNTRY || "",

  businessDays: import.meta.env.VITE_SUPPORT_DAYS || "",
  supportHours: import.meta.env.VITE_SUPPORT_HOURS || "",
  timeZone: import.meta.env.VITE_SUPPORT_TIMEZONE || "",
};

export const getFullAddress = () =>
  [
    storeInfo.addressLine1,
    storeInfo.addressLine2,
    storeInfo.country,
  ]
    .filter(Boolean)
    .join(", ");

export const BUSINESS_INFO = storeInfo;
export default storeInfo;