import { scrapeHomePage } from '../../scrapers/homePage.scraper.js';

export const getHomePageData = async (req, res) => {
  try {
    const data = await scrapeHomePage("/home");
    res.status(200).json({
      success: true,
      message: 'Home page data fetched successfully',
      data,
    });
  } catch (error) {
    console.error('Failed to fetch home page data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home page data',
      error: error.message,
    });
  }
};
