import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  jsonLd?: any | any[];
}

export function SEOHead({ title, description, canonicalPath, jsonLd }: SEOHeadProps) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Canonical
    if (canonicalPath) {
      const fullUrl = `https://tbsdestilados.com${canonicalPath}`;
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', fullUrl);
    }

    // Update JSON-LD
    // Remove existing applet-generated JSON-LD scripts
    const oldScripts = document.querySelectorAll('script[data-seo-applet="true"]');
    oldScripts.forEach(script => script.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-applet', 'true');
        script.setAttribute('data-schema-index', index.toString());
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      // We don't necessarily want to remove meta tags on unmount if it's a SPA and next page will set its own
      // but cleaning up scripts might be good to avoid duplicates if navigation happens
    };
  }, [title, description, canonicalPath, jsonLd]);

  return null; // This component doesn't render anything to the DOM
}
