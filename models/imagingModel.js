import cnx from '../db.js';

export const createImagingRecord = async (record_id, imageType, img_url, image_description) => {
    const query = `INSERT INTO imaging (record_id, image_type, image_url, description, upload_date) 
                   VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
    const values = [record_id, imageType, img_url, image_description];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating imaging record:', error);
        throw error;
    }
}

export const getImagingRecord = async (record_id) => {
    const query = `SELECT * FROM imaging WHERE record_id = $1`;
    const values = [record_id];
    try {
        const result = await cnx.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching imaging records:', error);
        throw error;
    }
}