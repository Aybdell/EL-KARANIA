import jwt from 'jsonwebtoken';
import { findRefreshToken } from '../models/userModel.js';
import 'dotenv/config';

// New refreshToken function
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is missing' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.SECRET_TOKEN_REF);
        const userId = decoded.userId; // Note: Match key used in adminLogin (userId, not userID)

        // Check if the refresh token exists in the database
        const storedToken = await findRefreshToken(userId);
        if (!storedToken || storedToken.token !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ userId }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRES_IN });

        return res.json({
            accessToken: newAccessToken,
            message: "Access token refreshed successfully"
        });
    } catch (error) {
        console.log('Error refreshing token:', error);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};