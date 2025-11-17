import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeSearchSuggestions = async (keyword) => {
  try {
    const endpoint = `/ajax/search/suggest?keyword=${keyword}`;
    const url = process.env.EXTRACTED_URL + endpoint;

    // Make request
    const { data } = await axios.get(url);

    // Determine if response is object with "html" property or just HTML string
    const html = typeof data === 'object' && data.html ? data.html : data;

    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // Parse and return results
    const suggestions = scrapeSearchSuggestionsData($);
    return { suggestions };
  } catch (error) {
    console.error('scrapeSearchSuggestions error:', error.message);
    return { suggestions: [] };
  }
};

// Helper function to extract suggestion data
const scrapeSearchSuggestionsData = ($) => {
  const results = [];

  $('.nav-item').each((i, el) => {
    // Skip "View all results" link
    if ($(el).hasClass('nav-bottom')) return;

    const href = $(el).attr('href')?.trim() || '';
    const id = href.split('-').pop() || null;

    const title = $(el).find('.film-name').text()?.trim() || '';
    const japaneseTitle = $(el).find('.alias-name').text()?.trim() || '';

    const poster = $(el).find('.film-poster-img').attr('data-src')?.trim() || '';
    const alt = $(el).find('.film-poster-img').attr('alt')?.trim() || '';

    const infoElements = $(el).find('.film-infor').children('span');
    const aired = $(infoElements[0]).text()?.trim() || '';

    const type = $(el).find('.film-infor').text().includes('Movie')
      ? 'Movie'
      : $(el).find('.film-infor').text().includes('TV')
      ? 'TV'
      : '';

    const duration = $(infoElements[1]).text()?.trim() || '';

    results.push({
      id,
      title,
      japaneseTitle,
      alt,
      href,
      poster,
      info: {
        aired,
        type,
        duration,
      },
    });
  });



  return results
};
