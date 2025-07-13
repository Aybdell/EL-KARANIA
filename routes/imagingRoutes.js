import express from 'express';
import { createImaging, getImaging } from '../controllers/imagingController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();

// create imaging endpoint
routes.post("/create-imaging", authenticateToken, createImaging);
// get patient imaging endpoint 
routes.post("/get-patient-imaging", authenticateToken, getImaging);

export default routes;
