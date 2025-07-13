import cnx from '../db.js'

export const insertMR = async (patient_id, doctor_id, dateCreate, diagnosis, treatmentPlan, notes) => {
    const query = `INSERT INTO medical_records (patient_id, doctor_id, date_created, diagnosis, treatment_plan, notes)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [patient_id, doctor_id, dateCreate, diagnosis, treatmentPlan, notes];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting medical record:', error);
        throw error;
    }
}

export const updateMedicalRecord = async (id_MRecord, dateCreate, diagnosis, treatmentPlan, notes) => {
    const query = `UPDATE medical_records 
                SET date_created = $1, 
                    diagnosis = $2, 
                    treatment_plan = $3, 
                    notes = $4 
                WHERE record_id = $5 RETURNING *`;
    const values = [dateCreate, diagnosis, treatmentPlan, notes, id_MRecord];
    try{
        const result = await cnx.query(query, values);
        return result.rows[0];
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const findMedicalRecord = async (id_MRecord) => {
    const query = `
        SELECT * FROM medical_records WHERE record_id = $1`;
    const values = [id_MRecord];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding medical record:', error);
        throw error;
    }
}

export const findMedicalRecordByPatient = async (id_Patient) => {
    const query = `
        SELECT * FROM medical_records WHERE patient_id = $1`;
    const values = [id_Patient];
    try {
        const result = await cnx.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error finding medical records by patient:', error);
        throw error;
    }
}

export const removeMR = async (id_MRecord) => {
    const query = `DELETE FROM medical_records WHERE record_id = $1`;
    const values = [id_MRecord];
    try {
        const result = await cnx.query(query, values);
    } catch (error) {
        console.error('Error deleting medical record:', error);
        throw error;
    }
}

export const getAllMedicalRecord = async () => {
    const query = `SELECT * FROM medical_records`;
    try {
        const result = await cnx.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error getting all medical records:', error);
        throw error;
    }
}