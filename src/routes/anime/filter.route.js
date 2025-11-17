import express from 'express';
import { filterPageController } from '../../controllers/anime/filter.controller.js';

const router = express.Router();

router.get('/', filterPageController);

export default router;
