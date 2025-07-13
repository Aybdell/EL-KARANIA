import express from 'express';
import { createPayment, getAllPayments } from '../controllers/paymentController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const routes = express.Router();

// create payment endpoint 
routes.post('/createPayment', authenticateToken, createPayment);
// get all payments endpoint
routes.post('/getAllPayments', authenticateToken, getAllPayments);

export default routes;