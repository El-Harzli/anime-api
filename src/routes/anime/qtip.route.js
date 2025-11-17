import express from 'express';
import { getAnimeQtip } from '../../controllers/anime/qtip.controller.js';

const router = express.Router();

router.get('/:animeId', getAnimeQtip);

export default router;
