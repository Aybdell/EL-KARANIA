import express from "express";
import { craeteMR, upadteMR, deleteMR, displayPatientMR, displayAllMR } from "../controllers/medicalRecordsController.js";
import authenticateToken from '../middleware/authMiddleware.js';
const routes = express.Router();

// create medical records
routes.post("/createMR", authenticateToken, craeteMR);
// update medical records
routes.post("/updatrMR", authenticateToken, upadteMR);
// delete medical records
routes.post("/removeMR", authenticateToken, deleteMR);
// display patient medical records
routes.post("/patientMR", authenticateToken, displayPatientMR);
// display all medical records
routes.post("/getAllMR", authenticateToken, displayAllMR);

// make an archive table of the medical record 

export default routes;