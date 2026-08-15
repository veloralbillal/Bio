/**
 * Dynamic SEO Generator for Sitemap.xml and Robots.txt
 * Automatically extracts all portfolio items, network websites, social links,
 * and application portals to generate search-engine-optimized XML sitemaps and robots directives.
 */

// Helper to escape XML special characters
export function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates dynamic, standard-compliant XML Sitemap
 * Supports standard sitemaps.org schema and Google Image Sitemap schema.
 * @param {Object} profile - Full profile object with websites, portfolio, etc.
 * @param {string} baseUrl - Domain root e.g. "https://example.com"
 * @returns {string} - XML sitemap string
 */
export function generateSitemapXml(profile = {}, baseUrl = '') {
  const cleanBaseUrl = (baseUrl || 'https://gravatar-hub.app').replace(/\/+$/, '');
  const lastModDate = new Date().toISOString().split('T')[0];

  const pages = [
    {
      loc: `${cleanBaseUrl}/`,
      lastmod: lastModDate,
      changefreq: 'daily',
      priority: '1.0',
      title: `${profile?.name || 'Billal Hossen'} - Gravatar Digital Identity & Portfolio`,
      image: profile?.avatarUrl
    },
    {
      loc: `${cleanBaseUrl}/#portfolio`,
      lastmod: lastModDate,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Featured Projects & Open Source Work'
    },
    {
      loc: `${cleanBaseUrl}/#websites`,
      lastmod: lastModDate,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Our Websites & Application Network'
    },
    {
      loc: `${cleanBaseUrl}/#socials`,
      lastmod: lastModDate,
      changefreq: 'weekly',
      priority: '0.8',
      title: 'Verified Social Identity & Developer Accounts'
    },
    {
      loc: `${cleanBaseUrl}/#contact`,
      lastmod: lastModDate,
      changefreq: 'monthly',
      priority: '0.8',
      title: 'Contact, Collaboration & Direct Message Portal'
    }
  ];

  // Include Donate Page if enabled
  if (profile?.donationConfig?.enabled !== false) {
    pages.push({
      loc: `${cleanBaseUrl}/#donate`,
      lastmod: lastModDate,
      changefreq: 'weekly',
      priority: '0.8',
      title: `${profile?.name || 'Creator'} - Support, Sponsor & Donations`
    });
  }

  // Include Crypto Payment Page if enabled
  const activeWallets = (profile?.cryptoWallets || []).filter(w => w.enabled !== false);
  if (activeWallets.length > 0) {
    pages.push({
      loc: `${cleanBaseUrl}/#crypto-pay`,
      lastmod: lastModDate,
      changefreq: 'monthly',
      priority: '0.7',
      title: 'Decentralized Cryptocurrency Payment & Verification'
    });
  }

  // Portfolio items / Featured Projects
  const portfolioItems = (profile?.featuredWork || profile?.portfolioItems || []).filter(
    item => item.enabled !== false
  );

  const portfolioNodes = portfolioItems.map(item => {
    const itemUrl = item.liveUrl || item.githubUrl || `${cleanBaseUrl}/#project-${item.id || item.title?.toLowerCase().replace(/\s+/g, '-')}`;
    const escapedUrl = escapeXml(itemUrl);
    const escapedTitle = escapeXml(item.title || 'Project Showcase');
    const escapedDesc = escapeXml(item.description || '');
    const imgUrl = item.image ? escapeXml(item.image) : '';

    return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>${imgUrl ? `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${escapedTitle}</image:title>
      <image:caption>${escapedDesc}</image:caption>
    </image:image>` : ''}
  </url>`;
  }).join('\n');

  // Network Websites configuration
  const websites = (profile?.websites || []).filter(w => w.enabled !== false && w.url);
  const websiteNodes = websites.map(site => {
    const escapedUrl = escapeXml(site.url);
    const escapedTitle = escapeXml(site.name || site.title || 'Network Website');
    const escapedDesc = escapeXml(site.description || '');

    return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
  }).join('\n');

  // Verified Social Links for external crawler indexing
  const socialLinks = (profile?.socialLinks || []).filter(l => l.enabled !== false && l.url);
  const socialNodes = socialLinks.map(l => {
    return `  <url>
    <loc>${escapeXml(l.url)}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`;
  }).join('\n');

  // Main Page Nodes
  const mainPageNodes = pages.map(p => {
    const hasImage = p.image && !p.image.startsWith('data:');
    return `  <url>
    <loc>${escapeXml(p.loc)}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${hasImage ? `
    <image:image>
      <image:loc>${escapeXml(p.image)}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
    </image:image>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${mainPageNodes}
${portfolioNodes ? `\n  <!-- Dynamic Portfolio Projects -->\n${portfolioNodes}` : ''}
${websiteNodes ? `\n  <!-- Dynamic Network Websites -->\n${websiteNodes}` : ''}
${socialNodes ? `\n  <!-- Verified Social Network Profiles -->\n${socialNodes}` : ''}
</urlset>`;
}

/**
 * Generates dynamic robots.txt file with crawler directives
 * @param {string} baseUrl - Domain root e.g. "https://example.com"
 * @param {Object} options - Custom rules and disallowed paths
 * @returns {string} - Plaintext robots.txt string
 */
export function generateRobotsTxt(baseUrl = '', options = {}) {
  const cleanBaseUrl = (baseUrl || 'https://gravatar-hub.app').replace(/\/+$/, '');
  const disallowList = options.disallow || ['/api/', '/admin', '/#admin'];
  const allowList = options.allow || ['/', '/sitemap.xml', '/assets/'];

  const allowLines = allowList.map(a => `Allow: ${a}`).join('\n');
  const disallowLines = disallowList.map(d => `Disallow: ${d}`).join('\n');

  return `# Robots.txt - Auto-Generated for Optimal Search Engine Indexing
# Supports Googlebot, Bingbot, Applebot, DuckDuckBot, Yandex, Baidu

User-agent: *
${allowLines}
${disallowLines}
Crawl-delay: 1

# Googlebot specific directives
User-agent: Googlebot
Allow: /
Allow: /#portfolio
Allow: /#websites
Allow: /#socials
Allow: /#donate
Disallow: /api/

# Canonical XML Sitemap
Sitemap: ${cleanBaseUrl}/sitemap.xml
Host: ${cleanBaseUrl}
`;
}

/**
 * Download a file in browser
 */
export function triggerFileDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
