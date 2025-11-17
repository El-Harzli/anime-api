import { scrapeSearchSuggestions } from '../../scrapers/searchDropDown.scraper.js';

export const getSearchSuggestions = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'keyword is required',
      });
    }
    const data = await scrapeSearchSuggestions(keyword);
    res.status(200).json({
      success: true,
      message: 'Search Suggestions fetched successfully',
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
