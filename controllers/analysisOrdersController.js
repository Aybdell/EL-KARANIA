import { findMedicalRecord } from "../models/medicalRecordsModel.js";
import { findDoctorByid } from '../models/doctorModel.js';
import { findPaitentById } from '../models/patientModel.js';
import { createAnalysisOrderRecord , bringPatientAnalysisOrders } from "../models/analysisOrdersModel.js";


export const createAnalysisOrder = async (req, res) => {
    const {record_id, patient_id, dr_id, analysis_test, priority} = req.body;
    try {
        const record = await findMedicalRecord(record_id);
        if(!record) {
            return res.status(404).json({message: "Medical record not found"});
        }
        const patient = await findPaitentById(patient_id);
        if(!patient) {
            return res.status(404).json({message: "Patient not found"});
        }
        const doctor = await findDoctorByid(dr_id);
        if(!doctor) {
            return res.status(404).json({message: "Doctor not found"});
        }
        const analysisOrder = await createAnalysisOrderRecord(record_id, patient_id, dr_id, analysis_test, priority);
        if(!analysisOrder) {
            return res.status(500).json({message: "Error creating analysis order"});
        }
        return res.status(201).json({message: "Analysis order created successfully", analysisOrder});
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getPatientAnalysisOrders = async (req, res) => {
    const {patient_id} = req.body;
    try {
        const patient = await findPaitentById(patient_id);
        if(!patient) {
            return res.status(404).json({message: "Patient not found"});
        }
        const analysisOrders = await bringPatientAnalysisOrders(patient_id);
        if(!analysisOrders) {
            return res.status(404).json({message: "No analysis orders found"});
        }
        return res.status(200).json({message: "Analysis orders retrieved successfully", analysisOrders});
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}