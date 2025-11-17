import express from 'express';
import { searchPageController } from '../../controllers/anime/searchPage.controller.js';

const router = express.Router();

router.get('/', searchPageController);

export default router;
