import express from 'express';
import { getAnimeByGenre } from '../../controllers/anime/genre.controller.js';

const router = express.Router();

router.get('/:genre', getAnimeByGenre);

export default router;
