import { scrapeFilterResult } from '../../scrapers/filterPage.scraper.js';

export const filterPageController = async (req, res) => {
    try {
      const { type, status, rated, score, season, language, sy, sm, sd, ey, em, ed, sort, genres } = req.query;
      const page = parseInt(req.query.page) || 1;

      if (page < 1) {
        return res.status(400).json({ error: 'Invalid page number' });
      }

      // Build query for backend API
      const params = [];

      if (type && type !== '0') params.push(`type=${type}`);
      if (status && status !== '0') params.push(`status=${status}`);
      if (rated && rated !== '0') params.push(`rated=${rated}`);
      if (score && score !== '0') params.push(`score=${score}`);
      if (season && season !== '0') params.push(`season=${season}`);
      if (language && language !== '0') params.push(`language=${language}`);

      if (sy) params.push(`sy=${sy}`);
      if (sm) params.push(`sm=${sm}`);
      if (sd) params.push(`sd=${sd}`);

      if (ey) params.push(`ey=${ey}`);
      if (em) params.push(`em=${em}`);
      if (ed) params.push(`ed=${ed}`);

      if (genres) params.push(`genres=${encodeURIComponent(genres)}`);

      if (sort) params.push(`sort=${sort.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '')}`);

      params.push(`page=${page}`);

      const endpoint = `/filter?${params.join('&')}`;

      const data = await scrapeFilterResult(endpoint);

      res.json(data);
    } catch (error) {
      console.error(`❌ Failed to load filter result`, error.message);
      res.status(500).json({ error: `Failed to load filter result` });
    }
  };

