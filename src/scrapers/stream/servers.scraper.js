import axiosInstance from '../../config/axios.config.js';
import * as cheerio from 'cheerio';

export const scrapeServers = async (endpoint) => {
  try {
    const $ = await fetchServers(endpoint);

    const servers = {
      sub: [],
      dub: [],
    };

    $('.server-item').each((_, el) => {
      const item = $(el);
      const type = item.attr('data-type'); // 'sub' or 'dub'
      const serverId = item.attr('data-server-id');
      const id = item.attr('data-id');
      const label = item.find('a.btn').text().trim();

      const serverData = {
        id,
        serverId,
        label,
      };

      if (type === 'sub') {
        servers.sub.push(serverData);
      } else if (type === 'dub') {
        servers.dub.push(serverData);
      }
    });

    return servers;
  } catch (error) {
    console.log('Error when scraping servers:', error);
    return undefined;
  }
};

async function fetchServers(endpoint) {
  try {
    const url = process.env.EXTRACTED_URL + endpoint;

    const { data } = await axiosInstance.get(url);


    return cheerio.load(data.html); // .html because the response is a JSON with HTML inside
  } catch (err) {
    console.error('Scraping error:', err.message);
    throw new Error('Failed to scrape site on serversScraper');
  }
}
