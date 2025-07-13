import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token;

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // Extract token from "Bearer <token>" format
    token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    try {
        const user = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = user; // Attach decoded user info to request
        next(); // Proceed to the endpoint handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token expired');
            return res.status(401).json({ message: 'Token expired' });
        }
        console.log('Invalid token:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default authenticateToken;