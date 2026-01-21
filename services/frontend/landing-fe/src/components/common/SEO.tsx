/**
 * Purpose: SEO meta tag management using react-helmet-async.
 * Exports: default SEO (React component)
 * Side effects: Injects meta tags into document head.
 *
 * @example
 * <SEO title="Events" description="Upcoming IEEE events" />
 */

import { Helmet } from 'react-helmet-async';


interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export default function SEO({
  title = 'IEEE RITB | Advancing Technology for Humanity',
  description = 'IEEE RIT Bangalore Student Branch is a community of thinkers, builders, and leaders shaping the future of technology through innovation and collaboration.',
  keywords = ['IEEE', 'RITB', 'RIT Bangalore', 'Student Branch', 'Technology', 'Engineering', 'Innovation'],
  image = '/ieee_icon.png',
  url = 'https://ieee.ritb.in',
}: SEOProps) {
  const siteTitle = title.includes('IEEE RITB') ? title : `${title} | IEEE RITB`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="IEEE RITB" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="IEEE RIT Bangalore Student Branch" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ieeeritb" />
      <meta name="twitter:creator" content="@ieeeritb" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Theme Color */}
      <meta name="theme-color" content="#05060f" />
    </Helmet>
  );
}
