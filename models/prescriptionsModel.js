import cnx from '../db.js';

export const addPrescriptionToDB = async (record_id, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date) => {
    const query = `
        INSERT INTO prescriptions (record_id, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    const values = [record_id, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding prescription:', error);
        throw error;
    }
}

export const findPrescription = async (id_Prescription) => {
    const query = `
        SELECT * FROM prescriptions WHERE prescription_id = $1`;
    const values = [id_Prescription];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding prescription:', error);
        throw error;
    }
}

export const updatePrescriptionInDB = async (id_Prescription, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date) => {
    const query = `
        UPDATE prescriptions 
        SET sphere_right = $1, 
            cylinder_right = $2, 
            axis_right = $3, 
            sphere_left = $4, 
            cylinder_left = $5, 
            axis_left = $6, 
            add_power = $7, 
            pd = $8, 
            prescription_date = $9, 
            expiration_date = $10 
        WHERE prescription_id = $11 RETURNING *`;
    const values = [sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date, id_Prescription];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating prescription:', error);
        throw error;
    }
}

export const removePrescription = async (id_Prescription) => {
    const query = `DELETE FROM prescriptions WHERE prescription_id = $1`;
    const values = [id_Prescription];
    try {
        await cnx.query(query, values);
    } catch (error) {
        console.error('Error deleting prescription:', error);
        throw error;
    }
}

export const findPrescriptionByRecordId = async (record_id) => {
    const query = `SELECT * FROM prescriptions WHERE record_id = $1`;
    const values = [record_id];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAllPrescription = async () => {
    const query = `SELECT * FROM prescriptions`;
    try {
        const result = await cnx.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error getting all prescriptions:', error);
        throw error;
    }
}