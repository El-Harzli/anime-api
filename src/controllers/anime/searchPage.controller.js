import { scrapeSearchResult } from '../../scrapers/searchPage.scraper.js';

export const searchPageController = async (req, res) => {
    try {
      const { keyword } = req.query;
      const page = parseInt(req.query.page) || 1;

      if (page < 1) {
        return res.status(400).json({ error: 'Invalid page number' });
      }

      const endpoint = `/search?keyword=${keyword}`;

      const data = await scrapeSearchResult(endpoint, keyword);

      res.json(data);
    } catch (error) {
      console.error(`❌ Failed to load search result for keyword : ${keyword} page:`, error.message);
      res.status(500).json({ error: `Failed to load search result for keyword : ${keyword} page data` });
    }
  };

