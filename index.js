import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoute from './src/routes/auth.route.js';
import watchListRoute from './src/routes/watchList.route.js';
import animeRoute from './src/routes/anime/index.js';

dotenv.config();
const PORT = process.env.PORT || '5000';
const app = express();

app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGINS.split(',');
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());

app.use(`/api/${process.env.API_VERSION}/auth`, authRoute);
app.use(`/api/${process.env.API_VERSION}/watchlist`, watchListRoute);
app.use(`/api/${process.env.API_VERSION}`, animeRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on PORT : ${PORT}`);
  });
});
