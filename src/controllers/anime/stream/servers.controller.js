import { scrapeServers } from '../../../scrapers/stream/servers.scraper.js';

export const getAnimeServers = async (req, res) => {
  const { episodeId } = req.params;
  if (!episodeId) {
    return res.status(400).json({
      success: false,
      message: 'episodeId is required.',
    });
  }
  const endpoint = `/ajax/v2/episode/servers?episodeId=${episodeId}`;

  try {
    const data = await scrapeServers(endpoint);
    res.status(200).json({
      success: true,
      message: `servers fetched for anime: ${episodeId}`,
      data,
    });
  } catch (error) {
    console.error('Error fetching anime details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch episode servers',
      error: error.message,
    });
  }
};
