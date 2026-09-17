export const SITE_URL = 'https://coredesk.crm';

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CoreDesk CRM',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Action-first CRM web application for small businesses and growing sales teams. Eliminates record-keeping clutter and turns operational attention into won revenue.',
  foundingDate: '2025',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@coredesk.crm',
    url: `${SITE_URL}/solutions`,
  },
};

export const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CoreDesk CRM',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All Modern Web Browsers',
  url: SITE_URL,
  description:
    'Production-grade CRM engineered with a deterministic 6-stage Operating Loop, Action Center, Stale Deal Engine, and Zero-Trust ABAC security for high-velocity sales teams.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    description: 'Free tier available with instant workspace preview. Transparent team upgrade pricing.',
  },
  featureList: [
    'Automated Action Center for overdue follow-ups',
    'Algorithmic stale pipeline deal detection (>= 7 days inactivity)',
    'Deterministic atomic lead-to-account & deal conversion',
    'Zero-Trust ABAC (Attribute-Based Access Control) multi-tenant architecture',
    'Immutable audit log tracking for all sales entity events',
    'Consolidated contact, company, deal, activity, and reporting engine',
  ],
};
