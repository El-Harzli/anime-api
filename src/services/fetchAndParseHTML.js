import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchAndParseHTML(endpoint) {
  try {
    const url = process.env.EXTRACTED_URL + endpoint;

    // Choose headers conditionally
    const headers = url.includes('qtip')
      ? {
          'User-Agent': 'Mozilla/5.0', // helps bypass blocks
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json, text/javascript, */*; q=0.01',
        }
      : {
          'User-Agent': 'Mozilla/5.0',
        };

    const { data } = await axios.get(url, { headers });

    // Continue parsing
    return cheerio.load(data);
  } catch (err) {
    console.error('❌ Scraping error:', err.message);
    throw new Error('Failed to scrape site');
  }
}
