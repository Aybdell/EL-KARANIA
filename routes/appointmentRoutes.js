import express from 'express';
import { makeAppointement, showAppointment, validateAppointment, cancelAppointment, patientTakingAppoint, dayAppointment, patientAppointment, rescheduleAppointment, cancelPatientAppoointment } from '../controllers/appointmentController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();


// make appointement endpoint
routes.post("/getAppointement", makeAppointement);
// get all appointements endpoint
routes.post("/allAppointement", authenticateToken ,showAppointment);
// validate appoitment 
routes.post("/validate", authenticateToken, validateAppointment);
// cancel appointment 
routes.post("/cancel", authenticateToken, cancelAppointment);
// get all appointements by current day
routes.post('/thisDayAppointment', authenticateToken, dayAppointment);
// reschedule appointment
routes.post('/reschedule', authenticateToken, rescheduleAppointment);
// patient appointment 
routes.post('/patient-appointment', authenticateToken, patientAppointment);
// cancel patient appointment
routes.post('/cancel-patient', authenticateToken, cancelPatientAppoointment);
// book an appointment from the app
routes.post('/book-an-appointment', authenticateToken, patientTakingAppoint);


export default routes;