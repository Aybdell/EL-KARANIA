import * as analyticsModel from '../models/analyticsModel.js';

// Patient Analytics
export const getPatientAnalytics = async (req, res) => {
    try {
        const [demographics, geographic, growth, frequency] = await Promise.all([
            analyticsModel.getPatientDemographics(),
            analyticsModel.getGeographicDistribution(),
            analyticsModel.getPatientGrowth(req.query.timeframe || 'month'),
            analyticsModel.getAppointmentFrequency()
        ]);

        res.json({
            demographics: demographics.rows,
            geographic: geographic.rows,
            growth: growth.rows,
            appointmentFrequency: frequency.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Appointment Analytics
export const getAppointmentAnalytics = async (req, res) => {
    try {
        const [volume, utilization, status] = await Promise.all([
            analyticsModel.getAppointmentVolume(req.query.timeframe || 'day'),
            analyticsModel.getDoctorUtilization(),
            analyticsModel.getAppointmentStatusAnalysis()
        ]);

        res.json({
            volume: volume.rows,
            doctorUtilization: utilization.rows,
            statusAnalysis: status.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clinical & Diagnostic Analytics
export const getClinicalAnalytics = async (req, res) => {
    try {
        const [diagnoses, prescriptions] = await Promise.all([
            analyticsModel.getCommonDiagnoses(),
            analyticsModel.getPrescriptionTrends()
        ]);

        res.json({
            commonDiagnoses: diagnoses.rows,
            prescriptionTrends: prescriptions.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Financial Analytics
export const getFinancialAnalytics = async (req, res) => {
    try {
        const [revenue, paymentMethods] = await Promise.all([
            analyticsModel.getRevenueMetrics(req.query.timeframe || 'month'),
            analyticsModel.getPaymentMethodDistribution()
        ]);

        res.json({
            revenue: revenue.rows,
            paymentMethods: paymentMethods.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Doctor Performance Analytics
export const getDoctorAnalytics = async (req, res) => {
    try {
        const performance = await analyticsModel.getDoctorPerformance();
        res.json(performance.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Operational Efficiency Analytics
export const getOperationalAnalytics = async (req, res) => {
    try {
        const imagingUsage = await analyticsModel.getImagingUsage();
        res.json(imagingUsage.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Advanced Analytics
export const getAdvancedAnalytics = async (req, res) => {
    try {
        const [outcomes, highRisk] = await Promise.all([
            analyticsModel.getPatientOutcomes(),
            analyticsModel.getHighRiskPatients()
        ]);

        res.json({
            patientOutcomes: outcomes.rows,
            highRiskPatients: highRisk.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
