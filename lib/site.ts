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

/** Real RantAI pair. Captions stay empty until Elsa writes them. */
export const showProofSlider = true;

export const PROOF_SLIDER = {
  width: 960,
  height: 600,
  before: {
    avif: "/proof/rantai-before.avif",
    webp: "/proof/rantai-before.webp",
  },
  after: {
    avif: "/proof/rantai-after.avif",
    webp: "/proof/rantai-after.webp",
  },
  /** PLACEHOLDER. Elsa is writing these. */
  beforeCaption: "",
  /** PLACEHOLDER. Elsa is writing these. */
  afterCaption: "",
  beforeSource: "rantai.dev, Feb 2025 (Internet Archive)",
};
