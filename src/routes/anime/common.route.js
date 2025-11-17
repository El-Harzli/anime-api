import express from 'express';
import { commonPagesController } from '../../controllers/anime/common.controller.js';

const router = express.Router();

router.get('/producer/:id', commonPagesController('/producer', 'producer'));
router.get('/subbed-anime', commonPagesController('/subbed-anime', 'subbedAnime'));
router.get('/dubbed-anime', commonPagesController('/dubbed-anime', 'dubbedAnime'));
router.get('/movie', commonPagesController('/movie', 'movies'));
router.get('/tv', commonPagesController('/tv', 'tv'));
router.get('/ova', commonPagesController('/ova', 'ova'));
router.get('/ona', commonPagesController('/ona', 'ona'));
router.get('/special', commonPagesController('/special', 'special'));
router.get('/top-upcoming', commonPagesController('/top-upcoming', 'topUpcomingAnime'));
router.get('/recently-updated', commonPagesController('/recently-updated', 'recentlyUpdatedAnime'));
router.get('/recently-added', commonPagesController('/recently-added', 'recentlyAddedAnime'));
router.get('/top-airing', commonPagesController('/top-airing', 'topAiringAnime'));
router.get('/most-popular', commonPagesController('/most-popular', 'mostPopularAnime'));
router.get('/most-favorite', commonPagesController('/most-favorite', 'mostFavoriteAnime'));
router.get('/completed', commonPagesController('/completed', 'completedAnime'));

export default router;
