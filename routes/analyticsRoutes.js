import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import  authenticateToken  from '../middleware/authMiddleware.js';

const router = express.Router();

// Patient Analytics
router.get('/patients', authenticateToken, analyticsController.getPatientAnalytics);

// Appointment Analytics
router.get('/appointments', authenticateToken, analyticsController.getAppointmentAnalytics);

// Clinical & Diagnostic Analytics
router.get('/clinical', authenticateToken, analyticsController.getClinicalAnalytics);

// Financial Analytics
router.get('/financial', authenticateToken, analyticsController.getFinancialAnalytics);

// Doctor Performance Analytics
router.get('/doctors', authenticateToken, analyticsController.getDoctorAnalytics);

// Operational Efficiency Analytics
router.get('/operational', authenticateToken, analyticsController.getOperationalAnalytics);

// Advanced Analytics
router.get('/advanced', authenticateToken, analyticsController.getAdvancedAnalytics);

export default router;