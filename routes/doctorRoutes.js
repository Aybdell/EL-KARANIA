import express from 'express';
import { listDoctors, getDrId, createDoctorAccount } from '../controllers/doctorController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const routes = express.Router();

// get all doctors endpoint 
routes.post('/getAllDoctors', listDoctors);
// get the id of the doctor endpoint 
routes.post('/getDoctorId', authenticateToken, getDrId);
// create doctor account endpoint
routes.post('/createDoctorAccount', authenticateToken, createDoctorAccount);


export default routes;