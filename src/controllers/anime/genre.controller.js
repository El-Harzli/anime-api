import { scrapeGenrePage } from "../../scrapers/genrePage.scraper.js";

export const getAnimeByGenre = async (req, res) => {
  const { genre } = req.params;
  const page = req.query.page || 1;

  if (!genre) {
    return res.status(400).json({
      success: false,
      message: "Genre slug is required",
    });
  }

  const endpoint = `/genre/${genre}?page=${page}`;

  try {
    const data = await scrapeGenrePage(endpoint);
    res.status(200).json({
      success: true,
      message: `Anime list for genre: ${genre}`,
      data,
    });
  } catch (error) {
    console.error("Error fetching genre page:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime by genre",
      error: error.message,
    });
  }
};
