/**
 * Dynamic Metadata & OpenGraph DOM Manager
 * Updates document title, meta tags, and structured data in real-time.
 */

export function applyDynamicMetadata(profile = {}) {
  if (typeof document === 'undefined') return;

  const seo = profile?.seo || {};
  const name = profile?.name || 'Billal Hossen';
  const title = seo.title || `${name} | Gravatar Profile & Social Hub`;
  const description = seo.description || profile?.bio || 'Verified Gravatar digital identity, portfolio, social links, crypto badges, and direct contact portal.';
  const keywords = seo.keywords || `${name}, Gravatar, Web Developer, Portfolio, Social Hub, Tech Educator`;
  const ogImage = seo.ogImage || profile?.avatarUrl || '';
  const author = seo.author || name;
  const twitterCard = seo.twitterCard || 'summary_large_image';
  const twitterHandle = seo.twitterHandle || profile?.username || '@billal_self';
  const canonicalUrl = seo.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  // 1. Update Document Title
  document.title = title;

  // 2. Helper to set or create meta tag
  const setMetaTag = (attr, key, content) => {
    if (!content) return;
    let element = document.querySelector(`meta[${attr}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 3. Set standard meta tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'author', author);
  setMetaTag('name', 'robots', seo.robots || 'index, follow, max-image-preview:large');

  // 4. OpenGraph Tags for Social Sharing (Facebook, LinkedIn, Discord, Telegram)
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:site_name', profile?.headerBrandName || 'GravatarHub');
  if (canonicalUrl) {
    setMetaTag('property', 'og:url', canonicalUrl);
  }
  if (ogImage) {
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:alt', title);
  }

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', twitterCard);
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  if (twitterHandle) {
    setMetaTag('name', 'twitter:creator', twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`);
  }
  if (ogImage) {
    setMetaTag('name', 'twitter:image', ogImage);
  }

  // 6. Canonical Link
  if (canonicalUrl) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  // 7. Dynamic JSON-LD Structured Data for Person & ProfilePage
  try {
    const siteUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://billalhossen.com');
    const sameAsLinks = (profile?.socialLinks || [])
      .filter((item) => item.enabled !== false && item.url)
      .map((item) => item.url);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': `${siteUrl}/#profilepage`,
          name: title,
          url: siteUrl,
          dateCreated: '2024-01-01T00:00:00+06:00',
          dateModified: new Date().toISOString().split('T')[0] + 'T00:00:00+06:00',
          mainEntity: {
            '@id': `${siteUrl}/#person`
          }
        },
        {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: name,
          alternateName: profile?.username || 'billal_self',
          jobTitle: profile?.tagline || profile?.occupation || 'Full Stack Developer & Tech Creator',
          description: description,
          image: ogImage || profile?.avatarUrl || '',
          url: siteUrl,
          sameAs: sameAsLinks.length > 0 ? sameAsLinks : ['https://github.com', 'https://linkedin.com', 'https://gravatar.com'],
          knowsAbout: [
            'Full Stack Web Development',
            'React',
            'Node.js',
            'TypeScript',
            'Tailwind CSS',
            'API Architecture',
            'Cybersecurity'
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: profile?.location?.split(',')[0]?.trim() || 'Sylhet',
            addressCountry: profile?.location?.split(',')[1]?.trim() || 'Bangladesh'
          }
        }
      ]
    };

    let scriptTag = document.getElementById('structured-data-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData, null, 2);
  } catch (err) {
    // Fail-safe
  }
}
