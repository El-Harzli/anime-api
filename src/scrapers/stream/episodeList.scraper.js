import axiosInstance from '../../config/axios.config.js';
import * as cheerio from 'cheerio';

export const scrapeEpisodes = async (endpoint) => {
  try {
    const $ = await fetchEpisodes(endpoint);

    // Each episode is inside .ss-list > a.ep-item
    const episodes = [];

    $('.ss-list a.ep-item').each((_, el) => {
      const $el = $(el);

      episodes.push({
        episodeId: $el.attr('data-id'),
        number: parseInt($el.attr('data-number'), 10),
        title: $el.find('.ep-name').text().trim(),
        jname: $el.find('.ep-name').attr('data-jname'),
        href: $el.attr('href'),
        isFiller : $(el).hasClass('ssl-item-filler'),
      });
    });

    return episodes;
  } catch (error) {
    console.log('Error when scraping episodes:', error);
    return undefined;
  }
};

async function fetchEpisodes(endpoint) {
  try {
    const url = process.env.EXTRACTED_URL + endpoint;

    const { data } = await axiosInstance.get(url);

    return cheerio.load(data.html);
  } catch (err) {
    console.error('Scraping error:', err.message);
    throw new Error('Failed to scrape site on episodesScraper');
  }
}
