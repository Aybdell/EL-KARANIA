import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { deleteRefreshToken, insertRefreshToken } from '../models/userModel.js';
import { findDoctor } from '../models/doctorModel.js';
import { findPaitentByEmail } from '../models/patientModel.js';
import { findAssis } from '../models/assistanceModel.js';
import bcrypt from 'bcrypt';


export const refreshAccessToken = (req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken) {
        return res.status(401).json({
            message: "Refresh Token Required"
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_TOKEN_REF);
        const accessToken = jwt.sign({userId: decoded.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(403).json({ messages: "Invalid Refresh Token"});
    }
}

export const logout = async (req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken) {
        return res.status(401).json({
            message: "Refresh Token Required"
        });
    }

    try{
        await deleteRefreshToken(refreshToken);
        res.status(200).json({
            message: "Logout Successful"
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const login = async (req, res) => {
    const {username, password} = req.body;

    const dr = await findDoctor(username);
    const patient = await findPaitentByEmail(username);
    const assistance = await findAssis(username);

    if( username === process.env.USERNAME_ADMIN ) {
        if(password === process.env.PASSWORD_ADMIN) {
            const accessToken = jwt.sign({userId: 1}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
            const refreshToken = jwt.sign({userId: 1}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});
            
            await insertRefreshToken(1, refreshToken);

            return res.status(200).json({
                message: "Login Successful",
                accessToken,
                refreshToken,
                role: "admin"
            })
        }else{
            return res.status(401).json({
                message: "Invalid Password"
            });
        }
    }

    if(dr) {
        if(password === dr.password){
            const accessToken = jwt.sign({userId: dr.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
            const refreshToken = jwt.sign({userId: dr.id}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});
            
            await insertRefreshToken(dr.id, refreshToken);

            return res.status(200).json({
                message: "Login Successful",
                accessToken,
                refreshToken,
                role: "doctor"
            })
        }
        const match = await bcrypt.compare(password, dr.password);
        if(match){
            const accessToken = jwt.sign({userId: dr.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
            const refreshToken = jwt.sign({userId: dr.id}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});

            await insertRefreshToken(dr.id, refreshToken);

            return res.status(200).json({
                message: "Login Successful",
                accessToken,
                refreshToken,
                role: "doctor"
            })
        }
        return res.status(401).json({
            message: "Invalid Password"
        });
    }
    else if (patient) {
        if(password === patient.password){
            const accessToken = jwt.sign({userId: patient.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
            const refreshToken = jwt.sign({userId: patient.id}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});

            await insertRefreshToken(patient.id, refreshToken);
            return res.status(200).json({
                message: "Login Successful",
                accessToken,
                refreshToken,
                role: "patient"
            })
        }else{
            const match = await bcrypt.compare(password, patient.password);
            if(!match) {
                return res.status(401).json({message: "Invalid password"});
            }else {
                const accessToken = jwt.sign({userId: patient.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
                const refreshToken = jwt.sign({userId: patient.id}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});

                await insertRefreshToken(patient.id, refreshToken);

                return res.status(200).json({
                    message: "Login Successful",
                    accessToken,
                    refreshToken,
                    role: "patient"
                });
            }
        }
        return res.status(401).json({message: "Invalid Password"});
    }
    else if(assistance){
        if(password === assistance.password){
            const accessToken = jwt.sign({userId: assistance.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
            const refreshToken = jwt.sign({userId: assistance.id}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});

            await insertRefreshToken(assistance.id, refreshToken);

            return res.status(200).json({
                message: "Login Successful",
                accessToken,
                refreshToken,
                role: "assistance"
            })
        }else {
            const match = await bcrypt.compare(password, assistance.password);
            if(!match) {
                return res.status(401).json({message: "Invalid password"});
            }else {
                const accessToken = jwt.sign({userId: assistance.id}, process.env.SECRET_TOKEN, {expiresIn: process.env.EXPIRES_IN});
                const refreshToken = jwt.sign({userId: assistance.id}, process.env.SECRET_TOKEN_REF, {expiresIn: process.env.EXPIRES_IN_REF});

                await insertRefreshToken(assistance.id, refreshToken);

                return res.status(200).json({
                    message: "Login Successful",
                    accessToken,
                    refreshToken,
                    role: "assistance"
                });
            }
        }
        return res.status(401).json({message: "Invalid password"});
    }else{
        return res.status(401).json({
            message: "Invalid Credentials"
        });
    }
}