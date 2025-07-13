import express from 'express';
import { createAnalysisOrder, getPatientAnalysisOrders } from '../controllers/analysisOrdersController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();

// create analysis order endpoint
routes.post("/create-analysis-order", authenticateToken, createAnalysisOrder);
// get patient analysis orders endpoint 
routes.post("/get-patient-analysis-orders", authenticateToken, getPatientAnalysisOrders);

export default routes;