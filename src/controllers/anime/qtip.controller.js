import { scrapeQtip } from '../../scrapers/qtip.scraper.js';

export const getAnimeQtip = async (req, res) => {
  try {
    const { animeId } = req.params;
    if (!animeId) {
      return res.status(400).json({
        success: false,
        message: 'animeId is required',
      });
    }
    const id = animeId.split('-').pop();
    const data = await scrapeQtip(id);
    res.status(200).json({
      success: true,
      message: 'Qtip fetched successfully',
      data,
    });
  } catch (error) {
    console.error('Failed to fetch Qtip data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Qtip data',
      error: error.message,
    });
  }
};
