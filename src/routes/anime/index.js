import express from 'express';

import commonRoutes from './common.route.js';
import detailsRoutes from './details.route.js';
import filterRoutes from './filter.route.js';
import genreRoutes from './genre.route.js';
import homeRoutes from './home.route.js';
import qtipRoutes from './qtip.route.js';
import searchDropDownRoutes from './searchDropDown.route.js';
import searchPageRoutes from './searchPage.route.js';
import streamRoutes from './stream.route.js';

const router = express.Router();

// mount sub-routers
router.use('/', commonRoutes);
router.use('/details', detailsRoutes);
router.use('/filter', filterRoutes);
router.use('/genre', genreRoutes);
router.use('/home', homeRoutes);

router.use('/qtip', qtipRoutes);
router.use('/search/input', searchDropDownRoutes);
router.use('/search', searchPageRoutes);

router.use('/', streamRoutes);

export default router;
