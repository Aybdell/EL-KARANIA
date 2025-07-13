import express from 'express';
import {createPatient, updatePatient, deletePatient, getAllPatient, doctorPatients, sendPatientToDr, getPatinetById, patientInfo, appointDayPatient, sendPatientToDrNewAppoint, inCheck, completedPatient, notifyUpcomingPatients, changePassword } from '../controllers/patientController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();

// CREATE PATIENT
routes.post('/create', authenticateToken, createPatient);
// UPDATE PATIENT 
routes.post('/update', authenticateToken, updatePatient);
// DELETE PATIENT
routes.post('/delete', authenticateToken, deletePatient);
// GET ALL PATIENTS
routes.post('/getAll', authenticateToken, getAllPatient);
// GET ALL PATIENTS OF A DOCTOR
routes.post('/doctorPatients', authenticateToken, doctorPatients);
// SEND PATIENT TO DOCTOR
routes.post('/sendPatient', authenticateToken, sendPatientToDrNewAppoint); 
// get specisfic patient 
routes.post('/patient', authenticateToken, getPatinetById);
// get patient info 
routes.post('/info', authenticateToken, patientInfo);
// get appointment day patient 
routes.post('/appoint-patient', authenticateToken, appointDayPatient);
// patient in the consultation 
routes.post('/in-check', authenticateToken, inCheck);
// patient are complete the consultation 
routes.post('/completed', authenticateToken, completedPatient);
// upcoming notification for patients 
routes.post('/notify-upcoming', notifyUpcomingPatients);
// change password endpoint 
routes.post('/change-password', authenticateToken, changePassword);

export default routes;