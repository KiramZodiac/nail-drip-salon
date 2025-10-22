import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  noindex?: boolean;
}

const SEO = ({
  title = "Nail Drip Salon | Premium Nail Services & Art | naildrip.salon",
  description = "Experience luxury nail care at Nail Drip Salon. Professional manicures, pedicures, nail art, extensions & training. Premium products, expert technicians, and exceptional service. Book your appointment today!",
  keywords = "nail salon, manicure, pedicure, nail art, nail extensions, gel nails, acrylic nails, nail technician, nail training, luxury nail salon, naildrip, nail drip salon",
  canonical = "https://naildrip.salon",
  ogImage = "https://naildrip.salon/nailpot.jpeg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noindex = false
}: SEOProps) => {
  const fullTitle = title.includes('naildrip.salon') ? title : `${title} | naildrip.salon`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="Nail Drip Salon" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@naildripsalon" />
      <meta name="twitter:creator" content="@naildripsalon" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
