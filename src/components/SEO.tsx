import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

export default function SEO({ title, description, image, keywords }: SEOProps) {
  const defaultTitle = 'مسار العقار - أدوات عقارية ذكية';
  const defaultDescription = 'منصة سعودية تساعدك في اتخاذ قرارات عقارية صحيحة عبر أدوات متقدمة مثل حاسبة التمويل، البوت العقاري، والدليل العقاري';
  const defaultImage = '/og-image.png';
  const defaultKeywords = [
    'تملك عقار',
    'حاسبة تمويل',
    'مقارنة مشاريع',
    'دليل عقاري',
    'استشارات عقارية'
  ];

  return (
    <Helmet>
      {/* Meta Tags */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={(keywords || defaultKeywords).join(', ')} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content="https://masaralaqar.sa" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: title || defaultTitle,
          description: description || defaultDescription,
          url: 'https://masaralaqar.sa',
          image: image || defaultImage
        })}
      </script>
    </Helmet>
  );
}
