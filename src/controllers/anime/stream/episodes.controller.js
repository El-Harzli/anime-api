import { scrapeEpisodes } from '../../../scrapers/stream/episodeList.scraper.js';

export const getAnimeEpisodes = async (req, res) => {
  try {
    const { animeId } = req.params;
    const animeIdNumber = animeId.split('-').pop();
    if (!animeId) {
      return res.status(400).json({
        success: false,
        message: 'Anime ID is required.',
      });
    }
    const endpoint = `/ajax/v2/episode/list/${animeIdNumber}`;

    const data = await scrapeEpisodes(endpoint);
    res.status(200).json({
      success: true,
      message: `episodes fetched for anime: ${animeId}`,
      data,
    });
  } catch (error) {
    console.error('Error fetching anime episodes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anime episodes',
      error: error.message,
    });
  }
};
