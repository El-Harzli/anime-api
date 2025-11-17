import { fetchAndParseHTML } from "../services/fetchAndParseHTML.js";

export const scrapeQtip = async (id) => {
  try {
    const endpoint = `/ajax/movie/qtip/${id}`;
    const $ = await fetchAndParseHTML(endpoint);
    const details = scrapeAnimeTooltipData($);
    return { details };
  } catch (error) {
    console.log(error);

    return { details: [] };
  }
};
const scrapeAnimeTooltipData = ($) => {
  const title = $('.pre-qtip-title').text()?.trim() || '';

  const rating = $('.pre-qtip-detail .fa-star')
    .closest('span')
    .text()
    .trim();

  const type = $('.badge-quality').text()?.trim() || 'TV';

  const description = $('.pre-qtip-description').text()?.trim() || '';

  const japaneseTitle = $('.pre-qtip-line:contains("Japanese:") .stick-text')
    .text()
    .trim();

  const aired = $('.pre-qtip-line:contains("Aired:") .stick-text')
    .text()
    .trim();

  const status = $('.pre-qtip-line:contains("Status:") .stick-text')
    .text()
    .trim();

  const genres = [];
  $('.pre-qtip-line:contains("Genres:") a').each((i, el) => {
    genres.push($(el).text().trim());
  });

  const eps = {
    sub: $('.tick-sub').text().replace(/\D/g, '') || null,
    dub: $('.tick-dub').text().replace(/\D/g, '') || null,
  };

  return {
    title,
    rating,
    type,
    description,
    japaneseTitle,
    info: {
      aired,
      status,
    },
    genres,
    episodes: eps,
  };
};

