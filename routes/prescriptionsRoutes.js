import express from 'express';
import { addPrescription, updatePrescription, deletePrescription, patientPrescription, allPrecriptions } from '../controllers/prescriptionsController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();

// add prescription 
routes.post('/add', authenticateToken, addPrescription);
// update prescription 
routes.post('/update', authenticateToken, updatePrescription);
// delete prescription
routes.post('/delete', authenticateToken, deletePrescription);
// get patient prescription // make another endpoint for the archive 
routes.post('/patientPrescription', authenticateToken, patientPrescription);
// get all prescriptions 
routes.post('/all', authenticateToken, allPrecriptions);

export default routes;