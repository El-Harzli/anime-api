import { fetchAndParseHTML } from "../services/fetchAndParseHTML.js";

export const scrapeHomePage = async (endpoint) => {
  try {
    const $ = await fetchAndParseHTML(endpoint);

    const spotlights = extractSpotlightItems($);
    const trendings = extractTrendingItems($);
    const topAiring = extractTopAiringAnime($);
    const mostPopular = extractMostPopularAnime($);
    const mostFavorite = extractMostFavoritedAnime($);
    const recentlyCompleted = extractRecentlyCompletedAnime($);

    const top10ViewedToday = extractTopViewedToday($);
    const top10ViewedWeek = extractTopViewedThisWeek($);
    const top10ViewedMonth = extractTopViewedThisMonth($);

    const genres = extractGenres($);

    const latestEpisode = extractSectionByTitle($, "Latest Episode");
    const newlyAdded = extractSectionByTitle($, "New On HiAnime");
    const topUpcoming = extractSectionByTitle($, "Top Upcoming");

    return {
      spotlights,
      trendings,

      topAiring,
      mostPopular,
      mostFavorite,
      recentlyCompleted,

      latestEpisode,
      newlyAdded,
      topUpcoming,

      genres,

      top10: {
        today: top10ViewedToday,
        week: top10ViewedWeek,
        month: top10ViewedMonth,
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      spotlights: [],
      trendings: [],

      topAiring: [],
      mostPopular: [],
      mostFavorite: [],
      recentlyCompleted: [],

      latestEpisode: [],
      newlyAdded: [], //
      topUpcoming: [],

      genres: [],

      top10: {
        today: [],
        week: [],
        month: [],
      },
    };
  }
};

// scraps hero section
const extractSpotlightItems = ($) => {
  const parseCount = (text, label) => {
    const stripped = text.replace(label, "").trim();
    return stripped === "" ? null : Number(stripped);
  };

  let spotlights = [];

  $("#slider .swiper-wrapper .swiper-slide").each((i, el) => {
    const poster =
      $(el).find(".film-poster-img").attr("data-src") ||
      $(el).find(".film-poster-img").attr("src");
    const title = $(el).find(".desi-head-title").text().trim();
    const japaneseTitle = $(el).find(".desi-head-title").attr("data-jname");
    const description = $(el).find(".desi-description").text().trim();

    const type = $(el).find(".scd-item").first().text().trim(); // e.g. "TV"
    const duration = $(el).find(".scd-item").eq(1).text().trim(); // e.g. "24m"
    const releaseDate = $(el).find(".scd-item").eq(2).text().trim(); // e.g. "Oct 20, 1999"
    const quality = $(el).find(".quality").text().trim(); // e.g. "HD"

    const subCount = parseCount($(el).find(".tick-sub").text(), "Sub");
    const dubCount = parseCount($(el).find(".tick-dub").text(), "Dub");

    // const watchLink = $(el).find('.btn-primary').attr('href');
    // const detailLink = $(el).find('.btn-secondary').attr('href');
    // get the href, /one-piece-100, then remove the first char to get the id
    const id = $(el).find(".btn-secondary").attr("href").slice(1);

    spotlights.push({
      id,
      title,
      japaneseTitle,
      poster,
      description,
      type,
      duration,
      releaseDate,
      quality,
      episodes: { sub: subCount, dub: dubCount },
      // links: { watch: watchLink, detail: detailLink },
    });
  });

  return spotlights;
};

// scraps trending section
const extractTrendingItems = ($) => {
  const trendings = [];

  $("#anime-trending .swiper-wrapper .swiper-slide").each((i, el) => {
    const id = $(el).find(".film-poster").attr("href").slice(1);
    const title = $(el).find(".film-title").text().trim();
    const japaneseTitle = $(el).find(".film-title").attr("data-jname");
    const poster =
      $(el).find(".film-poster img").attr("data-src") ||
      $(el).find(".film-poster img").attr("src");

    trendings.push({ id, title, japaneseTitle, poster });
  });

  return trendings;
};

// scraps top airing
const extractTopAiringAnime = ($) => {
  const topAiring = [];

  $(".anif-block-header:contains('Top Airing')")
    .next(".anif-block-ul")
    .find("ul.ulclear > li")
    .each((i, el) => {
      const posterEl = $(el).find(".film-poster");
      const detailEl = $(el).find(".film-name a");

      const poster =
        posterEl.find("img").attr("data-src") ||
        posterEl.find("img").attr("src");

      const id = detailEl.attr("href").slice(1);
      const title = detailEl.text().trim();
      const japaneseTitle = detailEl.attr("data-jname");

      const type = $(el).find(".fdi-item").text().trim();

      const subCount =
        $(el).find(".tick-sub").text().replace(/\D/g, "") || null;
      const dubCount =
        $(el).find(".tick-dub").text().replace(/\D/g, "") || null;

      topAiring.push({
        id,
        title,
        japaneseTitle,
        poster,
        type,
        episodes: {
          sub: subCount ? Number(subCount) : null,
          dub: dubCount ? Number(dubCount) : null,
        },
      });
    });

  return topAiring;
};

// scraps most popular
const extractMostPopularAnime = ($) => {
  const mostPopular = [];

  $(".anif-block-header:contains('Most Popular')")
    .next(".anif-block-ul")
    .find("ul.ulclear > li")
    .each((i, el) => {
      const posterEl = $(el).find(".film-poster");
      const detailEl = $(el).find(".film-name a");

      const poster =
        posterEl.find("img").attr("data-src") ||
        posterEl.find("img").attr("src");

      const id = detailEl.attr("href").slice(1);
      const title = detailEl.text().trim();
      const japaneseTitle = detailEl.attr("data-jname");

      const type = $(el).find(".fdi-item").text().trim();

      const parseCount = (selector) => {
        const text = $(el).find(selector).text();
        const num = text.replace(/\D/g, "");
        return num ? Number(num) : null;
      };

      const subCount = parseCount(".tick-sub");
      const dubCount = parseCount(".tick-dub");
      const episodeCount = parseCount(".tick-eps");

      mostPopular.push({
        id,
        title,
        japaneseTitle,
        poster,
        type,
        episodes: {
          sub: subCount,
          dub: dubCount,
          total: episodeCount,
        },
      });
    });

  return mostPopular;
};

// scraps most favotire
const extractMostFavoritedAnime = ($) => {
  const mostFavorite = [];

  $(".anif-block-header:contains('Most Favorite')")
    .next(".anif-block-ul")
    .find("ul.ulclear > li")
    .each((i, el) => {
      const posterEl = $(el).find(".film-poster");
      const detailEl = $(el).find(".film-name a");

      const poster =
        posterEl.find("img").attr("data-src") ||
        posterEl.find("img").attr("src");

      const title = detailEl.text().trim();
      const japaneseTitle = detailEl.attr("data-jname");
      const id = detailEl.attr("href").slice(1);
      const type = $(el).find(".fdi-item").text().trim();

      const parseCount = (selector) => {
        const text = $(el).find(selector).text();
        const num = text.replace(/\D/g, "");
        return num ? Number(num) : null;
      };

      const subCount = parseCount(".tick-sub");
      const dubCount = parseCount(".tick-dub");
      const episodeCount = parseCount(".tick-eps");

      mostFavorite.push({
        id,
        title,
        japaneseTitle,
        poster,
        type,
        episodes: {
          sub: subCount,
          dub: dubCount,
          total: episodeCount,
        },
      });
    });

  return mostFavorite;
};

// scraps latest completed anime
const extractRecentlyCompletedAnime = ($) => {
  const latestCompleted = [];

  $(".anif-block-header:contains('Latest Completed')")
    .next(".anif-block-ul")
    .find("ul.ulclear > li")
    .each((i, el) => {
      const posterEl = $(el).find(".film-poster");
      const detailEl = $(el).find(".film-name a");

      const poster =
        posterEl.find("img").attr("data-src") ||
        posterEl.find("img").attr("src");

      const title = detailEl.text().trim();
      const japaneseTitle = detailEl.attr("data-jname");
      const id = detailEl.attr("href").slice(1);
      const type = $(el).find(".fdi-item").text().trim();

      const parseCount = (selector) => {
        const text = $(el).find(selector).text();
        const num = text.replace(/\D/g, "");
        return num ? Number(num) : null;
      };

      const subCount = parseCount(".tick-sub");
      const dubCount = parseCount(".tick-dub");
      const episodeCount = parseCount(".tick-eps");

      latestCompleted.push({
        id,
        title,
        japaneseTitle,
        poster,
        type,
        episodes: {
          sub: subCount,
          dub: dubCount,
          total: episodeCount,
        },
      });
    });

  return latestCompleted;
};

// scraps top viewed
// today
const extractTopViewedToday = ($) => {
  const topViewedToday = [];

  $("#top-viewed-day ul.ulclear > li").each((i, el) => {
    const rank = $(el).find(".film-number span").text().trim();
    const posterEl = $(el).find(".film-poster");
    const detailEl = $(el).find(".film-name a");

    const poster =
      posterEl.find("img").attr("data-src") || posterEl.find("img").attr("src");

    const title = detailEl.text().trim();
    const japaneseTitle = detailEl.attr("data-jname");
    const id = detailEl.attr("href").slice(1);

    const parseCount = (selector) => {
      const text = $(el).find(selector).text();
      const num = text.replace(/\D/g, "");
      return num ? Number(num) : null;
    };

    const subCount = parseCount(".tick-sub");
    const dubCount = parseCount(".tick-dub");
    const episodeCount = parseCount(".tick-eps");

    topViewedToday.push({
      rank: Number(rank),
      id,
      title,
      japaneseTitle,
      poster,
      episodes: { sub: subCount, dub: dubCount, total: episodeCount },
    });
  });

  return topViewedToday;
};

// this week
const extractTopViewedThisWeek = ($) => {
  const topViewedWeek = [];

  $("#top-viewed-week ul.ulclear > li").each((i, el) => {
    const rank = $(el).find(".film-number span").text().trim();
    const posterEl = $(el).find(".film-poster");
    const detailEl = $(el).find(".film-name a");

    const poster =
      posterEl.find("img").attr("data-src") || posterEl.find("img").attr("src");

    const title = detailEl.text().trim();
    const japaneseTitle = detailEl.attr("data-jname");
    const id = detailEl.attr("href").slice(1);

    const parseCount = (selector) => {
      const text = $(el).find(selector).text();
      const num = text.replace(/\D/g, "");
      return num ? Number(num) : null;
    };

    const subCount = parseCount(".tick-sub");
    const dubCount = parseCount(".tick-dub");
    const episodeCount = parseCount(".tick-eps");

    topViewedWeek.push({
      rank: Number(rank),
      id,
      title,
      japaneseTitle,
      poster,
      episodes: { sub: subCount, dub: dubCount, total: episodeCount },
    });
  });

  return topViewedWeek;
};

// this month
const extractTopViewedThisMonth = ($) => {
  const topViewedMonth = [];

  $("#top-viewed-month ul.ulclear > li").each((i, el) => {
    const rank = $(el).find(".film-number span").text().trim();
    const posterEl = $(el).find(".film-poster");
    const detailEl = $(el).find(".film-name a");

    const poster =
      posterEl.find("img").attr("data-src") || posterEl.find("img").attr("src");

    const title = detailEl.text().trim();
    const japaneseTitle = detailEl.attr("data-jname");
    const id = detailEl.attr("href").slice(1);

    const parseCount = (selector) => {
      const text = $(el).find(selector).text();
      const num = text.replace(/\D/g, "");
      return num ? Number(num) : null;
    };

    const subCount = parseCount(".tick-sub");
    const dubCount = parseCount(".tick-dub");
    const episodeCount = parseCount(".tick-eps");

    topViewedMonth.push({
      rank: Number(rank),
      id,
      title,
      japaneseTitle,
      poster,
      episodes: { sub: subCount, dub: dubCount, total: episodeCount },
    });
  });

  return topViewedMonth;
};

// We have three sections that have the same html structure and same classes
// so we scrap the sections (which are 3 sections) by their header title
const extractSectionByTitle = ($, sectionTitle) => {
  const sectionData = [];

  $("section.block_area_home").each((_, section) => {
    const title = $(section).find(".cat-heading").text().trim().toLowerCase();

    if (title === sectionTitle.toLowerCase()) {
      $(section)
        .find(".film_list-wrap .flw-item")
        .each((_, el) => {
          const element = $(el);

          const id = element.find(".film-name a").attr("href").slice(1);
          const title = element.find(".film-name a").attr("title")?.trim();
          const poster =
            element.find(".film-poster-img").attr("data-src") ||
            element.find(".film-poster-img").attr("src");
          const type = element
            .find(".fd-infor .fdi-item")
            .first()
            .text()
            .trim();
          const duration = element
            .find(".fd-infor .fdi-duration")
            .text()
            .trim();
          const subCount = element.find(".tick-sub").text().trim() || null;
          const dubCount = element.find(".tick-dub").text().trim() || null;
          const epsCount = element.find(".tick-eps").text().trim() || null;

          sectionData.push({
            id,
            title,
            poster,
            type,
            duration,
            episodes: {
              sub: subCount,
              dub: dubCount,
              total: epsCount,
            },
          });
        });
    }
  });

  return sectionData;
};

const extractGenres = ($) => {
  const genres = [];

  $("ul.sb-genre-list li a").each((_, el) => {
    const href = $(el).attr("href") || "";
    const match = href.match(/\/genre\/([^\/]+)/);
    const slug = match ? match[1] : null;

    if (slug) {
      genres.push(slug);
    }
  });

  return genres;
};
