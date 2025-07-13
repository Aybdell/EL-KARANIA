import express from 'express';
import { refreshAccessToken, logout, login } from '../controllers/userController.js';
const routes = express.Router();

routes.post('/refresh-token', refreshAccessToken);
// login endpoint 
routes.post('/login', login);
//logout endpoint
routes.post('/logout', logout);

export default routes;