import cnx from '../db.js';

export const addPayment = async (patient_id, doctor_id, amount, date, payment_method, notes) => {
    const query = `
        INSERT INTO "payments" (patient_id, dr_id, amount, payment_date, payment_method, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [patient_id, doctor_id, amount, date, payment_method, notes];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding payment:', error);
        throw error;
    }
}

export const allPayments = async () => {
    const query = `
        SELECT * FROM "payments";
    `;
    try {
        const result = await cnx.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving payments:', error);
        throw error;
    }
}