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
  ogImage = '/assets/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema,
  noIndex = false,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = `${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // تحديث عنوان الصفحة
    document.title = title;

    // تحديث وصف الصفحة
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // تحديث علامات Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);

    // تحديث علامات Twitter
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);
    updateMetaTag('name', 'twitter:card', twitterCard);

    // تحديث الرابط الأساسي
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl);
    } else {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalTag);
    }

    // التحكم في الفهرسة
    updateMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // إضافة مخطط Schema.org إذا تم توفيره
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

    // تنظيف عند إلغاء تحميل المكون
    return () => {
      // اختياري: استعادة القيم الافتراضية عند الخروج
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

  // هذا المكون لا يعرض أي شيء مرئي
  return null;
}

export default SEO; 