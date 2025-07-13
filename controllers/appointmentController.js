import { insertAppointment, getAllAppointments, removeAppoitment, getAllAppointmentsDay, updateAppointment, validateAppoint, findPaitentInAppointment, findPaitentAppointment, updateAppointmentnew, deletePatientAppoitment, addInAppoint_status } from "../models/appointmentModel.js";
import { findPaitentByEmail } from "../models/patientModel.js";
import  {sendEmailNotification, sendEmailByGoogle, confirmationEmail}  from "../utils/emailNotification.js";
import { findPaitentById, insertPatient } from "../models/patientModel.js";
import { findDoctorByid } from "../models/doctorModel.js";
import { findDoctorByFN } from "../models/doctorModel.js";

export const makeAppointement = async (req, res) => {
    const {first_name, last_name, email, number, birthday, appointDay, address, selected_doctor} = req.body;

    try {
        const patientExist = await findPaitentByEmail(email);
        if(patientExist){
            return res.status(400).json({
                message: "Patient already has the same email"
            })
        }

        const patient = await insertAppointment(first_name, last_name, email, number, birthday, appointDay, address, selected_doctor);
        
        await sendEmailNotification(email, first_name, last_name, selected_doctor, appointDay, address);
        await sendEmailByGoogle(email, first_name, last_name, selected_doctor, appointDay, address);
        
        return res.status(200).json({
            message: "Appointment created successfully",
            data: patient
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const showAppointment = async (req, res) => {
    try {
        const appointments = await getAllAppointments();
        return res.status(200).json({
            message: "All appointments",
            data: appointments
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const validateAppointment = async (req, res) => {
    const { id, first_name, last_name, email, number, birthday, appoint_day, address, selected_doctor } = req.body;

    try {
        const dr = await findDoctorByFN(selected_doctor);
        if(!dr){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }

        const calculateAge = (birthday) => {
            const birthDate = new Date(birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        const age = calculateAge(birthday);

        const patient = await insertPatient(first_name, last_name, email, number, birthday, age, address, dr.id);

        const valid = await validateAppoint(patient.id, dr.id, appoint_day);

        await removeAppoitment(id);

        await confirmationEmail(email, first_name, last_name, selected_doctor, appoint_day);

        return res.status(200).json({
            message: "appointment taking successfully",
            data: valid
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const cancelAppointment = async (req, res) => {
    const { id } = req.body;

    try{
        await removeAppoitment(id);
        return res.status(200).json({
            message: "Appointment canceled successfully"
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const dayAppointment = async (req, res) => {
    const { appointDay } = req.body;
    try {
        const appointments = await getAllAppointmentsDay(appointDay);
        return res.status(200).json({
            message: "All appointments",
            data: appointments
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const rescheduleAppointment = async (req, res) => {
    const { id, appointDay } = req.body;
    try {
        const appointment = await updateAppointmentnew(id, appointDay);
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }
        await sendEmailNotification(appointment.email, appointment.first_name, appointment.last_name, appointment.selected_doctor, appointDay, appointment.address);
        return res.status(200).json({
            message: "Appointment rescheduled successfully",
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const patientAppointment = async (req, res) => {
    const {patient_id} = req.body;
    try {
        const patient = await findPaitentById(patient_id);
        if(!patient){
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const appointment = await findPaitentAppointment(patient.id);
        if(!appointment){
            return res.status(500).json({
                message: "Appointment not found"
            });
        }
        return res.status(200).json({
            message: "Patient appointment",
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const cancelPatientAppoointment = async (req, res) => {
    const { id } = req.body;
    try {
        await deletePatientAppoitment(id);
        return res.status(200).json({
            message: "Appointment canceled successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const patientTakingAppoint = async (req, res) => {
    const { patient_id, dr_id, appoint_day } = req.body;
    try {
        const patient = await findPaitentById(patient_id);
        const doctor = await findDoctorByid(dr_id);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }
        const appointment = await addInAppoint_status(patient.id, doctor.id, appoint_day);
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }
        await sendEmailByGoogle(patient.email, patient.first_name, patient.last_name, doctor.first_name, appoint_day, patient.address);
        return res.status(200).json({
            message: "Appointment taken successfully",
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}