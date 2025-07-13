import { getAlldoctors, findDoctorByFN, createDoctor } from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { insertRefreshToken } from "../models/userModel.js";

export const listDoctors = async (req, res) => {
    const doctors = await getAlldoctors();
    if(doctors){
        return res.json(doctors);
    }
    return res.send("no doctors found");
}

export const getDrId = async (req, res) => {
    const doctor_id = req.user.userId;
    return res.json({
        message: "doctor id",
        dr_id: doctor_id
    });
}

export const createDoctorAccount = async (req, res) => {
    const { first_name, last_name, email, username, password } = req.body;
    try {
        const doctor = await findDoctorByFN(username);
        if (doctor) {
            return res.status(400).json({
                message: "Doctor account already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = await createDoctor(first_name, last_name, email, username, hashedPassword);
        const accessToken = await jwt.sign({ userId: newDoctor.id}, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRES_IN});
        const refreshToken = await jwt.sign({ userId: newDoctor.id}, process.env.SECRET_TOKEN_REF, { expiresIn: process.env.EXPIRES_IN_REF});
        await insertRefreshToken(newDoctor.id, refreshToken);

        return res.status(200).json({
            message: "SingUp Successfully",
            accessToken,
            refreshToken,
            role: "doctor"
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
}