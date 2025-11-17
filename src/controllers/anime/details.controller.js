import { scrapeDetailsPage } from '../../scrapers/detailsPage.scraper.js';

export const getAnimeDetails = async (req, res) => {
  const { animeId } = req.params;

  if (!animeId) {
    return res.status(400).json({
      success: false,
      message: 'Anime ID is required.',
    });
  }

  const endpoint = `/${animeId}`;

  try {
    const data = await scrapeDetailsPage(endpoint);
    res.status(200).json({
      success: true,
      message: `Details fetched for anime: ${animeId}`,
      data,
    });
  } catch (error) {
    console.error('Error fetching anime details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anime details.',
      error: error.message,
    });
  }
};
