import express from 'express';
import { createAssistanceAccount, getAssistanceAccounts, deleteAccount } from '../controllers/assistanceController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();

// create Assistance Account 
routes.post('/addNewAccount', authenticateToken, createAssistanceAccount);
// get all assistance accounts
routes.post('/getAllAssistance', getAssistanceAccounts);
// delete assistance account
routes.post('/deleteAssistance', authenticateToken, deleteAccount);
/**
 * MAKE ALL THE CRUD FUNC TO THE ASSISTANCE MODEL 
 */

export default routes;
