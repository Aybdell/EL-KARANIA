import cnx from '../db.js';

export const findAdmin = async (username) => {
    const result = await cnx.query('SELECT * FROM secadm WHERE username = $1', [username]);
    return result.rows[0];
}