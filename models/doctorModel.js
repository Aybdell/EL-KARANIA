import cnx from '../db.js';

export const findDoctor = async (username) => {
    const query = `
        SELECT * FROM "doctores"
        WHERE "username" = $1;
    `
    const values = [username];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding doctor:', error);
        throw error;
    }
};
export const findDoctorByFN = async (firstname) => {
    const query = `
        SELECT * FROM "doctores"
        WHERE "firstname" = $1;
    `
    const values = [firstname];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding doctor:', error);
        throw error;
    }
};
export const findDoctorByid = async (id) => {
    const query = `
        SELECT * FROM "doctores"
        WHERE "id" = $1;
    `
    const values = [id];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding doctor:', error);
        throw error;
    }
};

export const getAlldoctors = async () => {
    const query = `
        SELECT * FROM "doctores";
    `
    try {
        const result = await cnx.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error finding doctor:', error);
        throw error;
    }
}

export const createDoctor = async (first_name, last_name, email, username, password) => {
    const query = `
        INSERT INTO "doctores" ("firstname", "lastname", "email", "username", "password")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `
    const values = [first_name, last_name, email, username, password];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw error;
    }
};