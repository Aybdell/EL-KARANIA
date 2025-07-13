import cnx from '../db.js';

export const insertAppointment = async (first_name, last_name, email, number, birthday, appointDay, address, selected_doctor) => {
    const query = `
        INSERT INTO appointments (first_name, last_name, email, number, birthday, appoint_day, address, selected_doctor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [first_name, last_name, email, number, birthday, appointDay, address, selected_doctor];

    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAllAppointments = async () => {
    const query = `
        SELECT * FROM appointments;
    `;

    try {
        const result = await cnx.query(query);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAllAppointmentsDay = async (appointDay) => {
    const query = `
        SELECT * FROM appointments WHERE appoint_day = $1;
    `;
    const values = [appointDay];

    try {
        const result = await cnx.query(query, values);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const removeAppoitment = async (id) => {
    const query = `
        DELETE FROM appointments WHERE id = $1;
    `;
    const values = [id];

    try {
        await cnx.query(query, values);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateAppointment = async (id, appointDay) => {
    const query = `
        UPDATE appointments SET appoint_day = $1 WHERE id = $2 RETURNING *;
    `;
    const values = [appointDay, id];

    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const validateAppoint = async (patient_id, dr_id, appointDay) => {
    const query = `
        INSERT INTO appointment_status (patient_id, doctor_id, appoint_day, status) 
        VALUES ($1, $2, $3, 'scheduled');
    `
    const values = [patient_id, dr_id, appointDay];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log("Error with inserting to appointment_status");
        throw error;
    }
}

export const findAppointmentStatus = async (appointStatusId) => {
    const query = `
        SELECT * FROM appointment_status WHERE id = $1;
    `;
    const values = [appointStatusId];

    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findPaitentInAppointment = async (patient_id, appointDay) => {
    const query = `
        SELECT * FROM appointment_status WHERE patient_id = $1 AND appoint_day = $2;
    `;
    const values = [patient_id, appointDay];

    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findPaitentAppointment = async (patient_id) => {
    const query = `
        SELECT * FROM appointment_status WHERE patient_id = $1 AND status = 'scheduled';
    `;
    const values = [patient_id];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateAppointmentnew = async (id, appointDay) => {
    const query = `
        UPDATE appointment_status SET appoint_day = $1 WHERE id = $2 RETURNING *;
    `;
    const values = [appointDay, id];

    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deletePatientAppoitment = async (id) => {
    const query = `
        DELETE FROM appointment_status WHERE id = $1;
    `;
    const values = [id];

    try {
        await cnx.query(query, values);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const addInAppoint_status = async (patient_id, doctor_id, appoint_day) => {
    const query = `
        INSERT INTO appointment_status (patient_id, doctor_id, appoint_day, status) 
        VALUES ($1, $2, $3, 'scheduled') RETURNING *;
    `;
    const values = [patient_id, doctor_id, appoint_day];

    try {
        const result = await cnx.query(query, values);
        return result.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}