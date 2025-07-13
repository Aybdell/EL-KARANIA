import cnx from '../db.js';

export const insertRefreshToken = async (userId, token) => {
    await cnx.query('INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)', [userId, token]);
}
export const deleteRefreshToken = async (token) => {
    await cnx.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
}

export const findRefreshToken = async (userId) => {
    const result = await cnx.query('SELECT * FROM refresh_tokens WHERE user_id=$1',[userId]);
    return result.rows[0];
}

