import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAssis, createAssis, getAllAssis, deleteAssistanceAccount } from "../models/assistanceModel.js";
import { insertRefreshToken } from "../models/userModel.js";

export const createAssistanceAccount = async (req, res) => {
    const { username, password } = req.body;
    try {
        const assistance = await findAssis(username);
        if (assistance) {
            return res.status(400).json({
                message: "Assistance account already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAssistance = await createAssis(username, hashedPassword);

        const accessToken = await jwt.sign({ userId: newAssistance.id }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRES_IN });
        const refreshToken = await jwt.sign({ userId: newAssistance.id}, process.env.SECRET_TOKEN_REF, { expiresIn: process.env.EXPIRES_IN_REF });
        await insertRefreshToken(newAssistance.id, refreshToken);

        return res.status(200).json({
            message: "SingUp Successfully",
            accessToken,
            refreshToken,
            role: "assistance"
        })
    } catch (error) {
        console.log(error);
        return res.status().json("Internal Server Error");
    }
}

export const getAssistanceAccounts = async (req, res) => {
    const assistance = await getAllAssis();
    if (assistance) {
        return res.json(assistance);
    }
    return res.send("no assistance found");
}

export const deleteAccount = async (req, res) => {
    const {username} = req.body;
    try {
        const assistance = await findAssis(username);
        if (!assistance) {
            return res.status(404).json({
                message: "Assistance account not found"
            });
        }
        // Assuming you have a function to delete the assistance account
        await deleteAssistanceAccount(username);
        return res.status(200).json({
            message: "Assistance account deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
}