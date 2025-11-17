import express from 'express';
import { getSearchSuggestions } from '../../controllers/anime/searchDropDown.controller.js';

const router = express.Router();

router.get('/:keyword', getSearchSuggestions);

export default router;
