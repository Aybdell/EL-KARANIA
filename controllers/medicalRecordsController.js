import { findPaitentByFN } from '../models/patientModel.js';
import { findDoctorByid } from '../models/doctorModel.js';
import { insertMR, updateMedicalRecord, findMedicalRecord, removeMR, findMedicalRecordByPatient, getAllMedicalRecord } from '../models/medicalRecordsModel.js';

export const craeteMR = async (req, res) => {
    const {patientFirstName, doctorFirstName, dateCreate, diagnosis, treatmentPlan, notes} = req.body;
    const dr_id = req.user.userId;
    try {
        const patient = await findPaitentByFN(patientFirstName);
        const doctor = await findDoctorByid(dr_id);
        if(!patient){
            console.log("patient not found");
            return res.status(404).json({
                message: "the patient doesn't found"
            })
        }
        if(!doctor){
            console.log("doctor not found");
            return res.status(404).json({
                message: "the doctor doesn't found"
            })
        }
        const medicalR = await insertMR(patient.id, doctor.id, dateCreate, diagnosis, treatmentPlan, notes);

        if(!medicalR) {
            return res.status(404).json({
                message: "feild to add mr"
            });
        }

        return res.status(201).json({
            message: "adding succesful",
            mr: medicalR
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
} 

export const upadteMR = async (req, res) => {
    const {id_MRecord , dateCreate, diagnosis, treatmentPlan, notes} = req.body;
    try {
        const medical_record = await findMedicalRecord(id_MRecord);
        if(!medical_record){
            console.log("Medical record not found");
            return res.status(404).json({
                message: "Medical record not found"
            })
        }

        const medicalR = await updateMedicalRecord(id_MRecord, dateCreate, diagnosis, treatmentPlan, notes);

        if(!medicalR) {
            return res.status(404).json({
                message: "feild to update mr"
            });
        }

        return res.status(201).json({
            message: "update succesfully",
            mr: medicalR
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteMR = async (req, res) => {
    const {id_MRecord} = req.body;
    try {
        const medical_record = await findMedicalRecord(id_MRecord);
        if(!medical_record){
            console.log("Medical record not found");
            return res.status(404).json({
                message: "Medical record not found"
            })
        }
        await removeMR(id_MRecord);
        return res.status(200).json({
            message: "Medical record deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const displayPatientMR = async (req, res) => {
    const {patientFirstName} = req.body;
    try {
        const patient = await findPaitentByFN(patientFirstName);
        if(!patient){
            console.log("patient not found");
            return res.status(404).json({
                message: "the patient not found"
            });
        }
        const medicalR = await findMedicalRecordByPatient(patient.id);
        if(!medicalR) {
            return res.status(404).json({
                message: "Medical record not found"
            });
        }
        return res.status(200).json({
            message: "getting succesful",
            mr: medicalR
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const displayAllMR = async (req, res) => {
    try {
        const medicalR = await getAllMedicalRecord();
        if(!medicalR) {
            return res.status(404).json({
                message: "Medical record not found"
            });
        }
        return res.status(200).json({
            message: "getting succesful",
            mr: medicalR
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}