import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/', '/profile/'],
    },
    sitemap: [
      'https://predinex.com/sitemap.xml',
      'https://predinex.com/images-sitemap.xml'
    ],
  };
}
