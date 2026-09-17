import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article';
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const SITE_ORIGIN = 'https://coredesk.crm';
const DEFAULT_OG_IMAGE = 'https://coredesk.crm/og-image.png';

function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalLink(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(schemaData?: Record<string, any> | Array<Record<string, any>>) {
  const existingScript = document.head.querySelector('#coredesk-schema-ld');
  if (!schemaData) {
    if (existingScript) existingScript.remove();
    return;
  }

  let script = existingScript as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'coredesk-schema-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData, null, 2);
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '/',
  noIndex = false,
  ogType = 'website',
  schema,
}) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // 2. Canonical URL
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    setCanonicalLink(canonicalUrl);

    // 3. Robots directive
    const robotsDirective = noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsDirective);

    // 4. Standard description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 5. Open Graph
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'CoreDesk CRM');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', DEFAULT_OG_IMAGE);

    // 6. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_OG_IMAGE);

    // 7. Schema markup (JSON-LD)
    setJsonLd(schema);
  }, [title, description, canonicalPath, noIndex, ogType, schema]);

  return null;
};
