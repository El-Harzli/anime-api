import express from 'express';
import { getAnimeDetails } from '../../controllers/anime/details.controller.js';

const router = express.Router();

router.get('/:animeId', getAnimeDetails);

export default router;
