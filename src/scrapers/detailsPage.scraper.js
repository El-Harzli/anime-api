import { fetchAndParseHTML } from "../services/fetchAndParseHTML.js";

export const scrapeDetailsPage = async (endpoint) => {
  try {
    const $ = await fetchAndParseHTML(endpoint);

    const details = extractDetails($);
    const otherSeasons = extractOtherSeasons($);
    const cast = extractCast($);
    const promotionVideos = extractPromotionVideos($);

    const recommendedAnime = extractRecommendedAnime($);
    const relatedAnime = extractRelatedAnime($);
    const mostPopularAnime = extractMostPopularAnime($);

    return { details, otherSeasons, cast, promotionVideos, recommendedAnime, relatedAnime, mostPopularAnime };
  } catch (error) {
    console.log(error.message);
    return {
      details: [],
      otherSeasons: [],
      cast: [],
      promotionVideos: [],
      recommendedAnime: [],
      relatedAnime: [],
      mostPopularAnime: [],
    };
  }
};

const extractDetails = ($) => {
  const $detail = $('#ani_detail');

  const id = $detail.find('.btn-play').attr('href')?.split('/').pop() || null;
  const title = $detail.find('.film-name').text().trim() || null;
  const japaneseTitle = $detail.find('.film-name').attr('data-jname') || null;
  const poster = $detail.find('.anisc-poster .film-poster-img').attr('src') || null;

  // Stats
  const rating = $detail.find('.tick-pg').text().trim() || null;
  const quality = $detail.find('.tick-quality').text().trim() || null;
  const sub = $detail.find('.tick-sub').text().trim() || null;
  const dub = $detail.find('.tick-dub').text().trim() || null;
  const type = $detail.find('.film-stats .item').eq(0).text().trim() || null;
  const duration = $detail.find('.film-stats .item').eq(1).text().trim() || null;

  // Descriptions
  const description = $detail.find('.film-description .text').text().trim() || null;

  // Info table
  const info = {};
  $detail.find('.anisc-info .item.item-title').each((i, el) => {
    const head = $(el).find('.item-head').text().replace(':', '').trim().toLowerCase().replace(/\s+/g, '_');
    const value = $(el).find('.name').text().trim().toLowerCase();
    if (head && value) info[head] = value;
  });

  // Genres
  const genres = [];
  $detail.find(".item.item-list:contains('Genres:') a").each((i, el) => {
    const genre = $(el).attr('href').split('/').pop();
    const capilatizeGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
    genres.push(capilatizeGenre);
  });

  // Studios
  const studios = [];
  $detail.find(".item.item-title:contains('Studios:') a").each((i, el) => {
    studios.push($(el).text().trim());
  });

  // Producers
  const producers = [];
  $detail.find(".item.item-title:contains('Producers:') a").each((i, el) => {
    producers.push($(el).text().trim());
  });

  return {
    id,
    title,
    japaneseTitle,
    poster,
    rating,
    quality,
    episodes: { sub, dub },
    type,
    duration,
    description,
    info,
    genres,
    studios,
    producers,
  };
};

const extractOtherSeasons = ($) => {
  const seasons = [];

  $('section.block_area-seasons .os-list a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const idMatch = href.match(/\/([^\/]+-\d+)$/);
    const id = idMatch ? idMatch[1] : null;

    const style = $(el).find('.season-poster').attr('style') || '';
    const imageMatch = style.match(/url\((.*?)\)/);
    const imageUrl = imageMatch ? imageMatch[1] : null;

    const label = $(el).find('.title').text().trim() || null;

    if (id && imageUrl && label) {
      seasons.push({ id, imageUrl, label });
    }
  });

  return seasons;
};

const extractCast = ($) => {
  const cast = [];

  $('.block_area-actors .bac-item').each((_, el) => {
    const characterEl = $(el).find('.per-info.ltr');
    const voiceActorEl = $(el).find('.per-info.rtl');

    const characterImg = characterEl.find('img').attr('data-src') || null;
    const characterName = characterEl.find('.pi-name a').text().trim() || null;
    const characterRole = characterEl.find('.pi-cast').text().trim() || null;

    const voiceActorImg = voiceActorEl.find('img').attr('data-src') || null;
    const voiceActorName = voiceActorEl.find('.pi-name a').text().trim() || null;
    const voiceActorNationality = voiceActorEl.find('.pi-cast').text().trim() || null;

    if (characterName && voiceActorName) {
      cast.push({
        characterImg,
        characterName,
        characterRole,
        voiceActorImg,
        voiceActorName,
        voiceActorNationality,
      });
    }
  });

  return cast;
};
const extractPromotionVideos = ($) => {
  const videos = [];

  $('.block_area-promotions .item').each((_, el) => {
    const title = $(el).attr('data-title')?.trim() || null;
    const videoUrl = $(el).attr('data-src')?.trim() || null;
    const thumbnail = $(el).find('img').attr('src')?.trim() || null;

    if (title && videoUrl && thumbnail) {
      videos.push({ title, videoUrl, thumbnail });
    }
  });

  return videos;
};

const extractRecommendedAnime = ($) => {
  const recommended = [];

  $('.block_area_category .flw-item').each((_, el) => {
    const title = $(el).find('.film-name a').text().trim() || null;
    const poster = $(el).find('.film-poster-img').attr('data-src') || null;

    const type = $(el).find('.fd-infor .fdi-item').first().text().trim() || null;
    const duration = $(el).find('.fd-infor .fdi-duration').text().trim() || null;

    const subText = $(el).find('.tick-sub').text().trim();
    const sub = subText ? parseInt(subText.replace(/\D/g, '')) : null;

    const dubText = $(el).find('.tick-dub').text().trim();
    const dub = dubText ? parseInt(dubText.replace(/\D/g, '')) : null;

    const watchHref = $(el).find('.film-poster a[href^="/watch/"]').attr('href') || '';
    const idMatch = watchHref.match(/\/watch\/(.+?)(?:$|\?)/);
    const id = idMatch ? idMatch[1] : null;

    if (id && title && poster) {
      recommended.push({ id, title, poster, type, duration, episodes: { sub, dub } });
    }
  });

  return recommended;
};

const extractRelatedAnime = ($) => {
  const relatedAnime = [];

  $('section.block_area:has(h2.cat-heading:contains("Related Anime"))')
    .find('ul.ulclear > li')
    .each((_, el) => {
      const title = $(el).find('.film-name a').text().trim() || null;
      const poster = $(el).find('.film-poster-img').attr('data-src') || null;

      const href = $(el).find('.film-name a').attr('href') || '';
      const idMatch = href.match(/\/([^\/]+-\d+)$/);
      const id = idMatch ? idMatch[1] : null;

      const typeText = $(el).find('.tick').text().trim();
      const typeMatch = typeText.match(/(TV|OVA|ONA|Movie|Special)/i);
      const type = typeMatch ? typeMatch[1] : null;

      const subText = $(el).find('.tick-sub').text().trim();
      const sub = subText ? parseInt(subText.replace(/\D/g, '')) : null;

      const dubText = $(el).find('.tick-dub').text().trim();
      const dub = dubText ? parseInt(dubText.replace(/\D/g, '')) : null;

      if (id && title && poster) {
        relatedAnime.push({ id, title, type, poster, episodes: { sub, dub } });
      }
    });

  return relatedAnime;
};

const extractMostPopularAnime = ($) => {
  const mostPopular = [];

  $('section.block_area:has(h2.cat-heading:contains("Most Popular"))')
    .find('ul.ulclear > li')
    .each((_, el) => {
      const title = $(el).find('.film-name a').text().trim() || null;
      const poster = $(el).find('.film-poster-img').attr('data-src') || null;

      const href = $(el).find('.film-name a').attr('href') || '';
      const idMatch = href.match(/\/([^\/]+-\d+)$/);
      const id = idMatch ? idMatch[1] : null;

      const typeText = $(el).find('.tick').text().trim();
      const typeMatch = typeText.match(/(TV|OVA|ONA|Movie|Special)/i);
      const type = typeMatch ? typeMatch[1] : null;

      const subText = $(el).find('.tick-sub').text().trim();
      const sub = subText ? parseInt(subText.replace(/\D/g, '')) : null;

      const dubText = $(el).find('.tick-dub').text().trim();
      const dub = dubText ? parseInt(dubText.replace(/\D/g, '')) : null;

      if (id && title && poster) {
        mostPopular.push({ id, title, type, poster, episodes: { sub, dub } });
      }
    });

  return mostPopular;
};
