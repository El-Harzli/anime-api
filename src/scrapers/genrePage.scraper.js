import { fetchAndParseHTML } from "../services/fetchAndParseHTML.js";

export const scrapeGenrePage = async (endpoint) => {
  try {
    const $ = await fetchAndParseHTML(endpoint);

    const animeListByGenre = extractAnimeListByGenre($);
    const topAiring = extractTopAiringAnime($);
    const pagination = extractPagination($);

    return { animeListByGenre, topAiring, pagination };
  } catch (error) {
    console.log('Error when scraping anime by genre');
    return { animeListByGenre: [], topAiring: [], pagination: [] };
  }
};

const extractAnimeListByGenre = ($) => {
  const animeList = [];

  $('.film_list-wrap .flw-item').each((_, el) => {
    const title = $(el).find('.film-name a').text().trim() || null;
    const poster = $(el).find('.film-poster-img').attr('data-src') || null;

    const href = $(el).find('.film-name a').attr('href') || '';
    const idMatch = href.match(/\/([^\/]+-\d+)$/);
    const id = idMatch ? idMatch[1] : null;

    const subText = $(el).find('.tick-sub').text().trim();
    const sub = subText ? parseInt(subText.replace(/\D/g, '')) : null;

    const dubText = $(el).find('.tick-dub').text().trim();
    const dub = dubText ? parseInt(dubText.replace(/\D/g, '')) : null;

    const type = $(el).find('.fd-infor .fdi-item').first().text().trim() || null;
    const duration = $(el).find('.fd-infor .fdi-duration').text().trim() || null;

    const description =
      $(el).find('.description p').text().trim() || $(el).find('.film-detail .description').text().trim() || null;

    if (id && title && poster) {
      animeList.push({ id, title, poster, episodes: { sub, dub }, description, type, duration });
    }
  });

  return animeList;
};

const extractTopAiringAnime = ($) => {
  const topAiring = [];

  $('section.block_area:has(h2.cat-heading:contains("Top Airing"))')
    .find('ul.ulclear > li')
    .each((_, el) => {
      const title = $(el).find('.film-name a').text().trim() || null;
      const poster = $(el).find('.film-poster-img').attr('data-src') || null;

      const href = $(el).find('.film-name a').attr('href') || '';
      const idMatch = href.match(/\/([^\/]+-\d+)$/);
      const id = idMatch ? idMatch[1] : null;

      const subText = $(el).find('.tick-sub').text().trim();
      const sub = subText ? parseInt(subText.replace(/\D/g, '')) : null;

      const dubText = $(el).find('.tick-dub').text().trim();
      const dub = dubText ? parseInt(dubText.replace(/\D/g, '')) : null;

      const duration = $(el).find('.fdi-duration').text().trim() || null;

      if (id && title && poster) {
        topAiring.push({ id, title, poster, duration, episodes: { sub, dub } });
      }
    });

  return topAiring;
};


const extractPagination = ($) => {
  const pagination = {
    currentPage: null,
    totalPages: null,
    nextPage: null,
    prevPage: null,
  };

  const pageItems = $("ul.pagination li");

  pageItems.each((_, el) => {
    const $el = $(el);
    const link = $el.find("a");
    const title = link.attr("title");
    const href = link.attr("href");
    const text = link.text().trim();

    // 🔹 Get current page
    if ($el.hasClass("active")) {
      pagination.currentPage = parseInt(text);
    }

    // 🔹 Get next page
    if (title === "Next" && href) {
      const match = href.match(/page=(\d+)/);
      pagination.nextPage = match ? parseInt(match[1]) : null;
    }

    // 🔹 Get previous page
    if (title === "Previous" && href) {
      const match = href.match(/page=(\d+)/);
      pagination.prevPage = match ? parseInt(match[1]) : null;
    }

    // 🔹 Get total pages from "Last" link
    if (title === "Last" && href) {
      const match = href.match(/page=(\d+)/);
      pagination.totalPages = match ? parseInt(match[1]) : null;
    }
  });

  // 🔹 If no "Last" link (end page), use currentPage as totalPages
  if (!pagination.totalPages && !pagination.nextPage && pagination.currentPage) {
    pagination.totalPages = pagination.currentPage;
  }

  return pagination;
};
