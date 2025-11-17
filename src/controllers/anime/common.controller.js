import { scrapeAnimePage } from '../../scrapers/commonPages.scraper.js';

export const commonPagesController = (endpointPath, dataKey) => {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;

      if (page < 1) {
        return res.status(400).json({ error: 'Invalid page number' });
      }

      const endpoint = id ? `${endpointPath}/${id}?page=${page}` : `${endpointPath}?page=${page}`;
      const data = await scrapeAnimePage(endpoint, dataKey);

      res.json(data);
    } catch (error) {
      console.error(`❌ Failed to load ${dataKey} page:`, error.message);
      res.status(500).json({ error: `Failed to load ${dataKey} page data` });
    }
  };
};
