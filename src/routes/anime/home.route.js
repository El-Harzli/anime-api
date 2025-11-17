import express from 'express';
import { getHomePageData } from '../../controllers/anime/home.controller.js';

const router = express.Router();

router.get('/', getHomePageData);

export default router;
