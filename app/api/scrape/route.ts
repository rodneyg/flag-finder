import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    // Get parameters from JSON body
    const { platform, profile1, profile2 } = await request.json();

    // Validate input
    if (!platform || !profile1 || !profile2) {
      return NextResponse.json({ error: 'Missing platform or usernames' }, { status: 400 });
    }

    if (!['instagram', 'twitter'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Launch Puppeteer with additional options
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000,
    });
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Function to scrape a single profile with retry logic
    const scrapeProfile = async (username: string, retries = 2): Promise<any> => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          await page.goto(`https://instagram.com/${username.replace('@', '')}`, { waitUntil: 'networkidle2', timeout: 60000 });

          // Check for login prompt or CAPTCHA
          const loginPrompt = await page.$('input[name="username"]');
          if (loginPrompt) {
            throw new Error('Login prompt detected');
          }

          // Scroll to load dynamic content
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds for content to load

          // Wait for posts to load
          await page.waitForSelector('article img', { timeout: 15000 }).catch(() => {
            console.log(`No posts found for ${username}, proceeding with available data`);
          });

          const data = await page.evaluate(() => {
            // More robust selector for posts
            const posts = Array.from(document.querySelectorAll('div[role="presentation"] img')).slice(0, 3).map(img => ({
              src: img.getAttribute('src') || '',
              alt: img.getAttribute('alt') || '',
            }));

            // More robust selector for followers
            const followerElement = Array.from(document.querySelectorAll('span')).find(span => span.textContent?.includes('Followers'));
            const followers = followerElement?.textContent?.match(/(\d+)/)?.[1] || '0';

            return { posts, followers };
          });

          return data;
        } catch (error) {
          if (attempt === retries) {
            throw error;
          }
          console.log(`Retry ${attempt} for ${username}: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
      }
      throw new Error('Max retries reached');
    };

    // Scrape both profiles
    const profile1Data = await scrapeProfile(profile1);
    const profile2Data = await scrapeProfile(profile2);

    // Close browser
    await browser.close();

    return NextResponse.json({ profile1: profile1Data, profile2: profile2Data }, { status: 200 });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to scrape profiles', details: error.message }, { status: 500 });
  }
}