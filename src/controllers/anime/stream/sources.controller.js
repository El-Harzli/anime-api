import { scrapeDirectVideoLink } from "../../../scrapers/stream/directVideoLink.scraper.js";


export const getAnimeSources = async (req, res) => {
  const { sourceId } = req.params;
  if (!sourceId) {
    return res.status(400).json({
      success: false,
      message: 'sourceId is required.',
    });
  }
  const endpoint = `/ajax/v2/episode/sources?id=${sourceId}`;

  try {
    const data = await scrapeDirectVideoLink(endpoint);
    res.status(200).json({
      success: true,
      message: `sources fetched for anime: ${sourceId}`,
      data,
    });
  } catch (error) {
    console.error('Error fetching anime sources:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anime sources',
      error: error.message,
    });
  }
};
