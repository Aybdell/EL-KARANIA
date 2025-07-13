import db from '../db.js';

// Patient Analytics
export const getPatientDemographics = async () => {
    const query = `
        SELECT 
            age,
            COUNT(*) as count
        FROM patient
        GROUP BY age
        ORDER BY age;
    `;
    return db.query(query);
};

export const getGeographicDistribution = async () => {
    const query = `
        SELECT 
            address,
            COUNT(*) as patient_count
        FROM patient
        GROUP BY address
        ORDER BY patient_count DESC;
    `;
    return db.query(query);
};

export const getPatientGrowth = async (timeframe = 'month') => {
    const query = `
        SELECT 
            DATE_TRUNC($1, appoint_day) as period,
            COUNT(DISTINCT email) as new_patients,
            COUNT(*) as total_appointments
        FROM appointments
        GROUP BY period
        ORDER BY period;
    `;
    return db.query(query, [timeframe]);
};

export const getAppointmentFrequency = async () => {
    const query = `
        SELECT 
            email,
            COUNT(*) as appointment_count
        FROM appointments
        GROUP BY email
        ORDER BY appointment_count DESC;
    `;
    return db.query(query);
};

// Appointment Analytics
export const getAppointmentVolume = async (timeframe = 'day') => {
    const query = `
        SELECT 
            DATE_TRUNC($1, appoint_day) as period,
            COUNT(*) as appointment_count
        FROM appointments
        GROUP BY period
        ORDER BY period;
    `;
    return db.query(query, [timeframe]);
};

export const getDoctorUtilization = async () => {
    const query = `
        SELECT 
            selected_doctor,
            COUNT(*) as appointment_count,
            COUNT(DISTINCT DATE(appoint_day)) as days_worked
        FROM appointments
        GROUP BY selected_doctor
        ORDER BY appointment_count DESC;
    `;
    return db.query(query);
};

export const getAppointmentStatusAnalysis = async () => {
    const query = `
        SELECT 
            status,
            COUNT(*) as count,
            ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM appointment_status) * 100, 2) as percentage
        FROM appointment_status
        GROUP BY status;
    `;
    return db.query(query);
};

// Clinical & Diagnostic Analytics
export const getCommonDiagnoses = async () => {
    const query = `
        SELECT 
            diagnosis,
            COUNT(*) as frequency
        FROM medical_records
        GROUP BY diagnosis
        ORDER BY frequency DESC
        LIMIT 10;
    `;
    return db.query(query);
};

export const getPrescriptionTrends = async () => {
    const query = `
        SELECT 
            DATE_TRUNC('month', prescription_date) as month,
            AVG(sphere_right) as avg_sphere_right,
            AVG(sphere_left) as avg_sphere_left,
            AVG(cylinder_right) as avg_cylinder_right,
            AVG(cylinder_left) as avg_cylinder_left,
            AVG(pd) as avg_pd,
            COUNT(*) as prescription_count
        FROM prescriptions
        GROUP BY DATE_TRUNC('month', prescription_date)
        ORDER BY month;
    `;
    return db.query(query);
};

// Financial Analytics
export const getRevenueMetrics = async (timeframe = 'month') => {
    const query = `
        SELECT 
            DATE_TRUNC($1, payment_date) as period,
            SUM(amount) as total_revenue,
            AVG(amount) as avg_payment
        FROM payments
        GROUP BY period
        ORDER BY period;
    `;
    return db.query(query, [timeframe]);
};

export const getPaymentMethodDistribution = async () => {
    const query = `
        SELECT 
            payment_method,
            COUNT(*) as count,
            ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM payments) * 100, 2) as percentage
        FROM payments
        GROUP BY payment_method;
    `;
    return db.query(query);
};

// Doctor Performance
export const getDoctorPerformance = async () => {
    const query = `
        SELECT 
            d.id as doctor_id,
            d.firstName,
            COUNT(DISTINCT a.id) as total_appointments,
            COUNT(DISTINCT mr.record_id) as medical_records_created,
            COUNT(DISTINCT p.prescription_id) as prescriptions_created,
            SUM(py.amount) as total_revenue
        FROM doctores d
        LEFT JOIN appointments a ON d.firstName = a.selected_doctor
        LEFT JOIN medical_records mr ON d.id = mr.doctor_id
        LEFT JOIN prescriptions p ON mr.record_id = p.record_id
        LEFT JOIN payments py ON d.id = py.dr_id
        GROUP BY d.id, d.firstName;
    `;
    return db.query(query);
};

// Operational Efficiency
export const getImagingUsage = async () => {
    const query = `
        SELECT 
            image_type,
            COUNT(*) as usage_count,
            DATE_TRUNC('month', upload_date) as month
        FROM imaging
        GROUP BY image_type, month
        ORDER BY month, usage_count DESC;
    `;
    return db.query(query);
};

// Advanced Analytics
export const getPatientOutcomes = async () => {
    const query = `
        SELECT 
            p.id as patient_id,
            p.firstname,
            p.lastname,
            mr.diagnosis,
            COUNT(DISTINCT a.email) as follow_up_appointments,
            COUNT(DISTINCT pr.prescription_id) as prescription_count
        FROM patient p
        JOIN medical_records mr ON p.id = mr.patient_id
        LEFT JOIN appointments a ON p.email = a.email
        LEFT JOIN prescriptions pr ON mr.record_id = pr.record_id
        GROUP BY p.id, p.firstname, p.lastname, mr.diagnosis;
    `;
    return db.query(query);
};

export const getHighRiskPatients = async () => {
    const query = `
        SELECT 
            p.id as patient_id,
            p.firstname,
            p.lastname,
            mr.diagnosis,
            COUNT(ao.order_id) as test_count,
            COUNT(DISTINCT mr.record_id) as medical_records_count
        FROM patient p
        JOIN medical_records mr ON p.id = mr.patient_id
        LEFT JOIN analysis_orders ao ON p.id = ao.patient_id
        WHERE mr.diagnosis LIKE '%high%' 
           OR mr.diagnosis LIKE '%severe%'
           OR mr.diagnosis LIKE '%acute%'
           OR mr.diagnosis LIKE '%urgent%'
        GROUP BY p.id, p.firstname, p.lastname, mr.diagnosis
        ORDER BY test_count DESC;
    `;
    return db.query(query);
};
