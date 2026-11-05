/**
 * PLACEHOLDER. The repo has an email and no WhatsApp number.
 * Replace WHATSAPP_E164 with the real number before sharing the link.
 */
export const WHATSAPP_E164 = "000000000000";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_E164}`;

/** Already used by the contact section. */
export const EMAIL = "mtharreq@gmail.com";

/**
 * Real mobile Lighthouse numbers for the deployed site.
 * null keeps the matching tile and the "Lighthouse 95+" chip off the page.
 */
export const measuredLighthouse = {
  mobilePerformance: null as number | null,
  mobileAccessibility: null as number | null,
};

/** The "Lighthouse 95+" chip stays off until this is set true on purpose. */
export const showLighthouseChip = false;

/**
 * Before/after slider. The real image pair is not confirmed.
 * Placeholder assets and empty captions are used only when this is true.
 */
export const showProofSlider = false;

export const PROOF_PLACEHOLDER = {
  beforeSrc: "/proof/before.svg",
  afterSrc: "/proof/after.svg",
  beforeCaption: "",
  afterCaption: "",
};
