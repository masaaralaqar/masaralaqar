import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  schema?: Record<string, any>;
  noIndex?: boolean;
}

export function SEO({
  title = 'مسار العقار - دليلك الذكي في عالم العقار',
  description = 'منصة سعودية تساعد المهتمين بالعقار في اكتساب المعرفة الصحيحة، عبر دليل عقاري شامل، وبوت ذكي يجاوب على استفساراتك، وأدوات تسهّل عليك فهم التمويل، الاستثمار، وصيانة المنزل.',
  canonical,
  ogImage = 'https://masaraqar.com/assets/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema,
  noIndex = false,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = `https://masaraqar.com${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Actualizar el título de la página
    document.title = title;

    // Actualizar la meta descripción
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // Actualizar etiquetas Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);

    // Actualizar etiquetas Twitter
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);
    updateMetaTag('name', 'twitter:card', twitterCard);

    // Actualizar etiqueta canónica
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl);
    } else {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalTag);
    }

    // Controlar indexación
    updateMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Agregar schema.org JSON-LD si se proporciona
    if (schema) {
      let schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript) {
        schemaScript.textContent = JSON.stringify(schema);
      } else {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.textContent = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
      }
    }

    // Limpieza al desmontar el componente
    return () => {
      // Opcional: restaurar valores predeterminados al salir
    };
  }, [title, description, canonicalUrl, ogImage, ogType, twitterCard, schema, noIndex]);

  const updateMetaTag = (
    attributeName: string,
    attributeValue: string,
    content: string
  ) => {
    let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (tag) {
      tag.setAttribute('content', content);
    } else {
      tag = document.createElement('meta');
      tag.setAttribute(attributeName, attributeValue);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    }
  };

  // Este componente no renderiza nada visible
  return null;
}

export default SEO; 