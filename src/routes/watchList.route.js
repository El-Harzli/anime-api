import express from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import {
  addToWatchList,
  getUserWatchList,
  updateStatus,
  removeFromWatchList,
} from '../controllers/watchList.controller.js';

const watchListRoute = express.Router();

// All routes require authentication
watchListRoute.use(verifyJWT);

watchListRoute.post('/', addToWatchList);
watchListRoute.get('/', getUserWatchList);
watchListRoute.put('/:animeId', updateStatus);
watchListRoute.delete('/:animeId', removeFromWatchList);

export default watchListRoute;
