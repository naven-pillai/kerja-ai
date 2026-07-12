// Single source of truth for Kerja AI brand + site config.
// Sister site to Kerja-Remote; AI/ML jobs for Malaysia & Singapore.

export const SITE = {
  name: 'Kerja AI',
  shortName: 'Kerja AI',
  domain: 'kerja-ai.com',
  url: 'https://kerja-ai.com',
  adminUrl: 'https://admin.kerja-ai.com',
  tagline: 'AI, Machine Learning & Data Jobs in Malaysia & Singapore',
  description:
    'Kerja AI is the dedicated job board for artificial intelligence, machine learning and data careers in Malaysia and Singapore. Find AI engineering, ML, data science, NLP and computer vision roles.',
  // UTM source stamped on outbound apply links
  utmSource: 'kerja-ai',
  emails: {
    info: 'info@kerja-ai.com',
    noreply: 'noreply@kerja-ai.com',
    support: 'support@kerja-ai.com',
    contact: 'hello@kerja-ai.com',
  },
  socials: {
    linkedin: 'https://www.linkedin.com/company/kerja-ai',
    x: 'https://x.com/KerjaAI',
    facebook: 'https://www.facebook.com/kerjaai',
  },
  // Sister property for cross-linking (remote AI jobs overlap)
  sister: {
    name: 'Kerja-Remote',
    url: 'https://kerja-remote.com',
  },
} as const;

// Brand palette — sampled from the Kerja AI logo (deep blue -> teal gradient).
export const BRAND = {
  primary: '#1D4ED8', // deep blue
  primaryHover: '#1E40AF',
  accent: '#14B8A6', // teal
  accentHover: '#0D9488',
  gradient: 'linear-gradient(135deg, #1D4ED8 0%, #14B8A6 100%)',
} as const;
