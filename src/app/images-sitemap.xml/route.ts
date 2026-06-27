import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://predinex.com';
  
  // Read actual image files from the seo directory
  const seoDir = path.join(process.cwd(), 'public', 'images', 'seo');
  let seoFiles: string[] = [];
  try {
    seoFiles = fs.readdirSync(seoDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  } catch (e) {
    seoFiles = [];
  }

  // Build keyword-rich titles and captions from filenames
  const imageEntries = seoFiles.map((file, i) => {
    const name = file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const capitalName = name.replace(/\b\w/g, c => c.toUpperCase());
    return {
      url: `${baseUrl}/images/seo/${file}`,
      title: `${capitalName} - Predinex Diabetes Prevention by A. Roshan`,
      caption: `Predinex advanced metabolic health platform for diabetes prevention and insulin resistance management. Founded by A. Roshan.`,
      loc: `${baseUrl}`
    };
  });

  // Add the founder image with special Person-targeted SEO
  imageEntries.unshift({
    url: `${baseUrl}/images/roshan_founder.jpg`,
    title: `A. Roshan - Founder and CEO of Predinex Diabetes Prevention Platform`,
    caption: `Roshan A, Founder and CEO of Predinex, the world's leading metabolic health and diabetes prevention platform. Pharmacy Scholar, World Record Holder, Patent Holder.`,
    loc: `${baseUrl}/founder`
  });

  // Add the main product images
  const mainImages = [
    { file: 'predinex_hex_3d.png', title: 'Predinex Logo - Advanced Metabolic Health Platform', page: '' },
    { file: 'logo.png', title: 'Predinex Official Logo - Diabetes Prevention App', page: '' },
    { file: 'diet_hub_glass_3d.png', title: 'Predinex Diet Hub - Clinical Nutrition Planning', page: '' },
    { file: 'insulin.png', title: 'Predinex Insulin Resistance Tracker', page: '' },
    { file: 'futuristic_ui.png', title: 'Predinex Futuristic Health Dashboard', page: '' },
    { file: 'apple_health.png', title: 'Predinex Apple Health Integration', page: '' },
    { file: 'sleep.png', title: 'Predinex Sleep Tracking for Diabetes Management', page: '' },
    { file: 'low_gi.png', title: 'Predinex Low Glycemic Index Food Guide', page: '' },
  ];
  
  mainImages.forEach(img => {
    imageEntries.push({
      url: `${baseUrl}/images/${img.file}`,
      title: img.title,
      caption: `Predinex metabolic health technology by A. Roshan - preventing diabetes through precision science.`,
      loc: `${baseUrl}/${img.page}`
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map(img => `  <url>
    <loc>${img.loc}</loc>
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate'
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
