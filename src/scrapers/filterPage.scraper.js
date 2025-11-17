import { fetchAndParseHTML } from '../services/fetchAndParseHTML.js';

export const scrapeFilterResult = async (endpoint) => {
  try {
    const $ = await fetchAndParseHTML(endpoint);
    const animeList = extractAnimeList($);
    const pagination = extractPagination($);
    return { animeList, pagination };
  } catch (error) {
    console.log(`Error when scraping Filter page`, error);
    return { animeList: [], pagination: {} };
  }
};

const extractAnimeList = ($) => {
  const animeList = [];

  // The container for items in this page is `.block_area_search`
  $('.block_area_search .flw-item').each((_, el) => {
    const title = $(el).find('.film-name a').text().trim() || null;
    const poster =
      $(el).find('.film-poster-img').attr('data-src') || $(el).find('.film-poster-img').attr('src') || null;

    const type = $(el).find('.fd-infor .fdi-item').first().text().trim() || null;
    const duration = $(el).find('.fd-infor .fdi-duration').text().trim() || null;

    const subText = $(el).find('.tick-sub').text().trim();
    const sub = subText ? parseInt(subText.replace(/\D/g, '')) : null;

    const dubText = $(el).find('.tick-dub').text().trim();
    const dub = dubText ? parseInt(dubText.replace(/\D/g, '')) : null;

    const epsText = $(el).find('.tick-eps').text().trim();
    const eps = epsText ? parseInt(epsText.replace(/\D/g, '')) : null;

    const watchHref = $(el).find(".film-poster a[href^='/']").attr('href') || '';
    const idMatch = watchHref.match(/\/([^/]+)(?:$|\?|\/)/);
    const id = idMatch ? idMatch[1] : null;

    if (id && title && poster) {
      animeList.push({
        id,
        title,
        poster,
        type,
        duration,
        episodes: { sub, dub, total: eps },
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

    // Current page
    if ($el.hasClass('active')) {
      pagination.currentPage = parseInt(text);
    }

    // Next page
    if (title === 'Next' && href) {
      const match = href.match(/page=(\d+)/);
      pagination.nextPage = match ? parseInt(match[1]) : null;
    }

    // Previous page
    if (title === 'Previous' && href) {
      const match = href.match(/page=(\d+)/);
      pagination.prevPage = match ? parseInt(match[1]) : null;
    }

    // Total pages (from "Last" link)
    if (title === 'Last' && href) {
      const match = href.match(/page=(\d+)/);
      pagination.totalPages = match ? parseInt(match[1]) : null;
    }
  });

  // If no "Last" link (end page)
  if (!pagination.totalPages && !pagination.nextPage && pagination.currentPage) {
    pagination.totalPages = pagination.currentPage;
  }

  return pagination;
};
