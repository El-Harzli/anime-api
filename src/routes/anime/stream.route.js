import express from 'express';
import { getAnimeEpisodes } from '../../controllers/anime/stream/episodes.controller.js';
import { getAnimeServers } from '../../controllers/anime/stream/servers.controller.js';
import { getAnimeSources } from '../../controllers/anime/stream/sources.controller.js';
import { getVideoByProxy } from '../../controllers/anime/stream/proxy.controller.js';

const router = express.Router();

router.get('/watch/:animeId', getAnimeEpisodes);
router.get('/servers/:episodeId', getAnimeServers);
router.get('/sources/:sourceId', getAnimeSources);
router.get('/proxy', getVideoByProxy);

export default router;
