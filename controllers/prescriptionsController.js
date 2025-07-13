import { findMedicalRecord } from '../models/medicalRecordsModel.js';
import { addPrescriptionToDB, findPrescription, updatePrescriptionInDB, removePrescription, findPrescriptionByRecordId, getAllPrescription } from '../models/prescriptionsModel.js';

export const addPrescription = async (req, res) => {
    const { record_id, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date } = req.body;
    try {
        const medical_record = await findMedicalRecord(record_id);
        if(!medical_record){
            console.log("Medical record not found");
            return res.status(404).json({
                message: "Medical record not found"
            })
        }
        const prescription = await addPrescriptionToDB(record_id, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date);
        return res.status(201).json({
            message: "Prescription added successfully",
            prescription: prescription
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updatePrescription = async (req, res) => {
    const { id_Prescription, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date } = req.body;
    try {
        const prescription = await findPrescription(id_Prescription);
        if(!prescription){
            console.log("Prescription not found");
            return res.status(404).json({
                message: "Prescription not found"
            })
        }
        const updatedPrescription = await updatePrescriptionInDB(id_Prescription, sphere_right, cylinder_right, axis_right, sphere_left, cylinder_left, axis_left, add_power, pd, prescription_date, expiration_date);
        return res.status(200).json({
            message: "Prescription updated successfully",
            prescription: updatedPrescription
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deletePrescription = async (req, res) => {
    const { id_Prescription } = req.body;
    try {
        const prescription = await findPrescription(id_Prescription);
        if(!prescription){
            console.log("Prescription not found");
            return res.status(404).json({
                message: "Prescription not found"
            })
        }
        await removePrescription(id_Prescription);
        return res.status(200).json({
            message: "Prescription deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const patientPrescription = async (req, res) => {
    const { record_id } = req.body;
    try {
        const medical_record = await findMedicalRecord(record_id);
        if(!medical_record){
            console.log("Medical record not found");
            return res.status(404).json({
                message: "Medical record not found"
            });
        }
        const prescription = await findPrescriptionByRecordId(record_id);
        if(!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }
        return res.status(200).json({
            message: "Getting successful",
            prescription: prescription
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const allPrecriptions = async (req, res) => {
    try {
        const prescriptions = await getAllPrescription();
        if(!prescriptions) {
            return res.status(404).json({
                message: "No prescriptions found"
            });
        }
        return res.status(200).json({
            message: "Getting successful",
            prescriptions: prescriptions
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}