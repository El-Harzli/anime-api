import { fetchAndParseHTML } from '../services/fetchAndParseHTML.js';

export const scrapeSearchResult = async (endpoint) => {
  try {
    const $ = await fetchAndParseHTML(endpoint);
    const animeList = extractSearchedAnimeList($);
    const pagination = extractPagination($);
    return { searchResult: animeList, pagination };
  } catch (error) {
    console.log(`Error when scraping searchResult page`, error);
    return { searchResult: [], pagination: [] };
  }
};

const extractSearchedAnimeList = ($) => {
  const animeList = [];

  $('.flw-item').each((_, el) => {
    const id = $(el).find('.film-poster-ahref').attr('data-id');
    const title = $(el).find('.film-name a').attr('title')?.trim();
    const poster = $(el).find('.film-poster-img').attr('data-src') || $(el).find('.film-poster-img').attr('src');

    const type = $(el).find('.fd-infor .fdi-item').first().text().trim();
    const duration = $(el).find('.fd-infor .fdi-duration').text().trim();

    // Sub / Dub / Episode counts
    const sub = $(el).find('.tick-sub').text().trim().replace(/\D+/g, '') || null;
    const dub = $(el).find('.tick-dub').text().trim().replace(/\D+/g, '') || null;
    const eps = $(el).find('.tick-eps').text().trim().replace(/\D+/g, '') || null;

    if (id && title && poster) {
      animeList.push({
        id,
        title,
        poster,
        type,
        duration,
        episodes: {
          sub: sub ? Number(sub) : null,
          dub: dub ? Number(dub) : null,
          total: eps ? Number(eps) : null,
        },
      });
    }
  });

  return animeList;
};

const extractPagination = ($) => {
  const pagination = {
    currentPage: null,
    totalPages: null,
    nextPage: null,
    prevPage: null,
  };

  const pageItems = $('ul.pagination li');

  pageItems.each((_, el) => {
    const $el = $(el);
    const link = $el.find('a');
    const title = link.attr('title');
    const href = link.attr('href');
    const text = link.text().trim();

    // 🔹 Get current page
    if ($el.hasClass('active')) {
      pagination.currentPage = parseInt(text);
    }

    // 🔹 Get next page
    if (title === 'Next' && href) {
      const match = href.match(/page=(\d+)/);
      pagination.nextPage = match ? parseInt(match[1]) : null;
    }

    // 🔹 Get previous page
    if (title === 'Previous' && href) {
      const match = href.match(/page=(\d+)/);
      pagination.prevPage = match ? parseInt(match[1]) : null;
    }

    // 🔹 Get total pages from "Last" link
    if (title === 'Last' && href) {
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
