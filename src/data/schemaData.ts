
import { FAQItem, BlogArticle } from '../types';

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TBS Destilados",
  "legalName": "TBS Destilados SAS",
  "url": "https://tbsdestilados.com",
  "logo": "https://tbsdestilados.com/logo.png",
  "telephone": "+57 314 581 3569",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrera 2 No. 7-17 Local 1, Bocagrande",
    "addressLocality": "Cartagena",
    "addressRegion": "Bolívar",
    "addressCountry": "CO"
  }
});

export const buildLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "TBS Destilados",
  "legalName": "TBS Destilados SAS",
  "url": "https://tbsdestilados.com",
  "telephone": "+57 314 581 3569",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrera 2 No. 7-17 Local 1, Bocagrande",
    "addressLocality": "Cartagena",
    "addressRegion": "Bolívar",
    "addressCountry": "CO"
  }
});

export const buildWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TBS Destilados",
  "url": "https://tbsdestilados.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tbsdestilados.com/catalogo?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const buildBreadcrumbSchema = (items: { label: string, url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.label,
    "item": `https://tbsdestilados.com${item.url}`
  }))
});

export const buildFAQSchema = (faqItems: FAQItem[]) => {
  const publicFaqs = faqItems.filter(item => item.audience === 'publico' || item.audience === 'todos');
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": publicFaqs.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};

export const buildServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Abastecimiento B2B de licores",
  "provider": {
    "@type": "Organization",
    "name": "TBS Destilados"
  },
  "areaServed": {
    "@type": "City",
    "name": "Cartagena"
  },
  "description": "Servicios de logística, crédito, pedidos urgentes y soporte comercial para el canal institucional de licores."
});

export const buildCatalogSchema = (products: any[]) => {
  if (!products || products.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 10).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://tbsdestilados.com/catalogo`,
      "name": p.name,
      "image": p.image
    }))
  };
};

export const buildArticleSchema = (article: BlogArticle) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.seoDescription,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "datePublished": article.publishedAt,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://tbsdestilados.com${article.slug}`
  },
  "publisher": {
    "@type": "Organization",
    "name": "TBS Destilados"
  }
});

export const buildBlogBreadcrumbSchema = (article: BlogArticle) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://tbsdestilados.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Guías y recursos",
      "item": "https://tbsdestilados.com/guias"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": article.title,
      "item": `https://tbsdestilados.com${article.slug}`
    }
  ]
});

export const buildBlogFAQSchema = (article: BlogArticle) => {
  if (!article.faqs || article.faqs.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
