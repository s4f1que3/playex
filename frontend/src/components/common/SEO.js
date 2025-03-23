import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image = 'https://playex.com/og-image.jpg',
  url,
  type = 'website',
  keywords = [],
  publishedAt,
  modifiedAt,
  author = 'Playex'
}) => {
  const siteTitle = 'Playex - Watch Movies & TV Shows Online';
  const defaultDescription = 'Stream your favorite movies and TV shows on Playex. Watch the latest releases, classics, and exclusive content in HD quality.';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  const schemaOrgWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: 'https://playex.com',
    description: defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: 'Playex',
      logo: {
        '@type': 'ImageObject',
        url: 'https://playex.com/logo.png'
      }
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://playex.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: url
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={[
        'movies online',
        'tv shows',
        'streaming',
        'watch movies',
        'playex',
        'online streaming',
        ...keywords
      ].join(', ')} />
      <link rel="canonical" href={url} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@playex" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      {publishedAt && <meta name="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta name="article:modified_time" content={modifiedAt} />}
      <meta name="author" content={author} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebPage)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
