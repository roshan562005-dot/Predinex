import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/blog-data';

// Your unique 32-character IndexNow key
const INDEXNOW_KEY = 'f4c8b2d1e9a34789b5c2d6f1e8a49c7b';
const HOST = 'predinex.com';
const BASE_URL = `https://${HOST}`;

export async function GET() {
  try {
    // 1. Gather all URLs you want to instantly index
    const urlList = [
      BASE_URL,
      `${BASE_URL}/blog`,
      `${BASE_URL}/founder`,
      `${BASE_URL}/tools`,
      `${BASE_URL}/tools/homa-ir`,
      `${BASE_URL}/tools/metabolic-age`,
      `${BASE_URL}/plans`,
      ...blogPosts.map(post => `${BASE_URL}/blog/${post.slug}`)
    ];

    // 2. Prepare the IndexNow Payload
    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urlList
    };

    // 3. Ping Bing (Bing shares this with Yahoo and DuckDuckGo via the IndexNow protocol)
    const bingResponse = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!bingResponse.ok) {
      throw new Error(`Bing IndexNow failed with status: ${bingResponse.status}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully forced Bing, Yahoo, and DuckDuckGo to index your site!',
      urlsSubmitted: urlList.length
    });

  } catch (error) {
    console.error('IndexNow Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit IndexNow request.' },
      { status: 500 }
    );
  }
}
