import cnx from '../db.js';

export const findAssis = async (username) => {
    const query = `
        SELECT * FROM "assistance"
        WHERE "username" = $1;
    `;
    const values = [username];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding assistance:', error);
        throw error;
    }
}

export const createAssis = async (username, password) => {
    const query = `
        INSERT INTO "assistance" ("username", "password")
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [username, password];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    }catch(error){
        console.log('error inserting assistance', error);
        throw error;
    }
}

export const getAllAssis = async () => {
    const query = `
        SELECT * FROM "assistance";
    `;
    try {
        const result = await cnx.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving assistance:', error);
        throw error;
    }
}

export const deleteAssistanceAccount = async (username) => {
    const query = `
        DELETE FROM "assistance"
        WHERE "username" = $1;
    `;
    const values = [username];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting assistance:', error);
        throw error;
    }
}