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
  const siteTitle = 'Playex - Watch Free Movies & TV Shows Online';
  const defaultDescription = 'Playex - Stream thousands of free movies, TV shows, and series online in HD quality. Watch the latest releases, classics, trending content, and exclusive entertainment. Your ultimate destination for free streaming.';
  const fullTitle = title ? `${title} | Playex` : siteTitle;
  
  // Comprehensive keyword list for maximum SEO coverage
  const defaultKeywords = [
    // Brand keywords
    'playex', 'play ex', 'play', 'ex',
    // Primary keywords
    'free movies', 'watch movies free', 'free tv shows', 'watch free movies online',
    'stream movies free', 'watch movies online free', 'free streaming', 'free movies online',
    // Action keywords
    'watch movies', 'stream movies', 'watch tv shows', 'stream tv shows online',
    'play movies online', 'watch online', 'stream online', 'watch movies hd',
    // Long-tail keywords
    'watch movies and tv shows free', 'free movie streaming sites', 'free entertainment',
    'watch latest movies free', 'stream tv series', 'online movies free',
    'watch hd movies', 'free movie website', 'stream shows online',
    // Content-specific keywords
    'movies online', 'tv shows online', 'series online', 'trending movies',
    'latest movies', 'popular movies', 'new releases', 'classic movies',
    'action movies', 'comedy movies', 'drama series', 'documentaries',
    // Platform keywords
    'online streaming', 'movie streaming', 'tv streaming', 'video streaming',
    'entertainment hub', 'watch free', 'stream free', 'free content',
    // Alternative spellings/variations
    'free movs', 'watch mov free', 'film online', 'cinema online'
  ];
  
  const schemaOrgWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Playex',
    alternateName: ['Play Ex', 'PlayEx Streaming'],
    url: 'https://playex.com',
    description: defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://playex.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Playex',
      logo: {
        '@type': 'ImageObject',
        url: 'https://playex.com/logo.png'
      }
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Playex',
    alternateName: 'Play Ex',
    url: 'https://playex.com',
    logo: 'https://playex.com/logo.png',
    description: 'Free online streaming platform for movies and TV shows',
    sameAs: [
      'https://twitter.com/playex',
      'https://facebook.com/playex'
    ]
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
      ...(title ? [{
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: url || 'https://playex.com'
      }] : [])
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={[...defaultKeywords, ...keywords].join(', ')} />
      <link rel="canonical" href={url || 'https://playex.com'} />
      
      {/* Alternative titles for better matching */}
      <meta name="application-name" content="Playex" />
      <meta name="apple-mobile-web-app-title" content="Playex" />
      
      {/* Alternative titles for better matching */}
      <meta name="application-name" content="Playex" />
      <meta name="apple-mobile-web-app-title" content="Playex" />

      {/* OpenGraph Meta Tags */}
      <meta property="og:site_name" content="Playex" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url || 'https://playex.com'} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@playex" />
      <meta name="twitter:creator" content="@playex" />

      {/* Additional Meta Tags for SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      <meta name="language" content="English" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="page-type" content="Entertainment" />
      {publishedAt && <meta name="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta name="article:modified_time" content={modifiedAt} />}
      <meta name="author" content={author} />

      {/* Mobile optimizations */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data - WebSite */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebPage)}
      </script>
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Structured Data - BreadcrumbList */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
