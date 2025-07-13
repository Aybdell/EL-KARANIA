import cnx from '../db.js';

export const createAnalysisOrderRecord = async (record_id, patient_id, dr_id, analysis_test, priority) => {
    const query = `INSERT INTO analysis_orders (record_id, patient_id, doctor_id, analysis_test, priority) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [record_id, patient_id, dr_id, analysis_test, priority];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating analysis order record:', error);
        throw error;
    }
}

export const bringPatientAnalysisOrders = async (patient_id) => {
    const query = `SELECT * FROM analysis_orders WHERE patient_id = $1`;
    const values = [patient_id];
    try {
        const result = await cnx.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving patient analysis orders:', error);
        throw error;
    }
}