import express from 'express';
import { login, register, refreshAccessToken, logout, updatePassword } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

const authRoute = express.Router();

authRoute.post('/login', login);
authRoute.post('/register', register);
authRoute.get('/refresh', refreshAccessToken);
authRoute.get('/logout', logout);
authRoute.post('/updatePassword',verifyJWT, updatePassword);

export default authRoute;
