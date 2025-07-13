import {findPaitent, insertPatient, modifyPatient, dropPatient, findPaitentById, allPatients, allPatientsOfDoctor, sendPatient, getDrListPatient, updatePatientCheck, updatePatientCompleted, getUpcomingPatients, updatePassword} from '../models/patientModel.js';
import { findDoctorByFN, findDoctorByid } from '../models/doctorModel.js';
import {validateAppoint, findAppointmentStatus, findPaitentInAppointment} from '../models/appointmentModel.js';
import { sendEmailByGoogle, sendEmailByGoogleUpcoming } from '../utils/emailNotification.js';
import bcrypt from 'bcrypt';
export const createPatient = async (req, res) => {
    const {first_name, last_name, email, number, birth_day, age, address, selected_doctor} = req.body;
    try {
        const patientExist = await findPaitent(first_name, last_name);
        if(patientExist){
            return res.send("the patient already exist");
        }
        const dr = await findDoctorByFN(selected_doctor);
        if(!dr){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }
        const patient = await insertPatient(first_name, last_name, email, number, birth_day, age, address, dr.id);
        res.json({
            message: "Patient created successfully",
            data: patient
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
}

export const updatePatient = async (req, res) => {
    const {id, first_name, last_name, email, number, birth_day, age, address} = req.body;
    const patientExist = await findPaitentById(id);
    if(patientExist){
        const patient = await modifyPatient(id, first_name, last_name, email, number, birth_day, age, address);
        return res.status(200).json({
            data: patient,
            message: "Patient updated successfully"
        })
    }

    return res.send("the patient doesn't exist");
}

export const deletePatient = async (req, res) => {
    const {id} = req.body;
    const patientExist = await findPaitentById(id);
    if(patientExist){
        await dropPatient(id);
        return res.send("patient droped");
    }
    return res.send("patient doesn't exist");
}

export const getAllPatient = async (req, res) => {
    const patients = await allPatients();

    if(!patients){
        return res.send("no patients found");
    }
    return res.json({
        data: patients
    }) 
}

export const doctorPatients = async (req, res) => {
    const doctor_id = req.user.userId;
    try {
        const dr = await findDoctorByid(doctor_id);
        if(!dr){
            return res.status(404).json({
                message: "You're Not Authorized"
            });
        }

        const patients = await allPatientsOfDoctor(doctor_id);
        if(!patients){
            return res.status(404).send("no patients found");
        }
        return res.status(200).json({
            data: patients
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const sendPatientToDr = async (req, res) => {
    const {first_name, last_name, selected_doctor} = req.body;
    try {
        const patientExist = await findPaitent(first_name, last_name);
        if(!patientExist){
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        const dr = await findDoctorByFN(selected_doctor);
        if(!dr){
            return res.status(404).json({
                message: "Doctor not found"
            });
        }
        const patient = await sendPatient(patientExist.id,dr.id);
        return res.status(200).json({
            message: `Patient sent to Dr. ${dr.firstname}`,
            data: patient
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const sendPatientToDrNewAppoint = async (req, res) => {
    const { pateint_id, selected_doctor, appointDay} = req.body;
    try {
        const patient = await findPaitentById(pateint_id);
        if(!patient){
            console.log("patient not found");
            return res.status(500).json({message: "patient not found"});
        }
        const doctor = await findDoctorByFN(selected_doctor);
        if(!doctor){
            console.log("doctor not found");
            return res.status(500).json({message: "doctor not found"});
        }
        const isExist = await findPaitentInAppointment(patient.id, appointDay);
        if(isExist){
            console.log("the patient already has an appointment");
            return res.status(500).json({message: "the patient already has an appointment"});
        }
        const appointement = await validateAppoint(patient.id, doctor.id, appointDay);
        return res.status(201).json({maessage: "making appointement succesfully", 
            data: appointement
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
}

export const getPatinetById = async (req, res) => {
    const { pateint_id } = req.body;
    try {
        const patient = await findPaitentById(pateint_id);
        if(!patient){
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        return res.status(201).json({
            message: "getting the patient succesfully",
            pateint: patient
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const patientInfo = async(req, res) => {
    const patient_id = req.user.userId;
    try {
        const patient = await findPaitentById(patient_id);
        if(!patient){
            console.log("patient not found ");
            return res.status(500).json({message: "Patient Not found"});
        }
        return res.status(201).json({message : "the patient found ", patient : patient});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const appointDayPatient = async (req, res) => {
    const dr_id = req.user.userId;
    const { appointDay } = req.body;
    try {
        const patientList = await getDrListPatient(dr_id, appointDay);
        if(!patientList){
            return res.status(500).json({message: "the List is Empty"});
        }
        return res.status(201).json({
            message: "getting the list with successfully",
            list: patientList
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const inCheck = async (req, res) => {
    const {appointStatusId} = req.body;
    try {
        const patient = await findAppointmentStatus(appointStatusId);
        if(!patient){
            return res.status(404).json({
                message: "patient not found"
            });
        }
        const patientCheck = await updatePatientCheck(appointStatusId);
        return res.status(200).json({
            message: "patient check in successfully",
            data: patientCheck
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const completedPatient = async (req, res) => {
    const {appointStatusId} = req.body;
    try {
        const patient = await findAppointmentStatus(appointStatusId);
        if(!patient){
            return res.status(404).json({
                message: "patient not found"
            });
        }
        const patientCheck = await updatePatientCompleted(appointStatusId);
        return res.status(200).json({
            message: "patient completed successfully",
            data: patientCheck
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const notifyUpcomingPatients = async (req, res) => {
    const { doctor_id } = req.body;
  
    try {
      // Get the next 5 patients in queue
      const upcomingPatients = await getUpcomingPatients(doctor_id);
      
      if (!upcomingPatients || upcomingPatients.length === 0) {
        return res.status(200).json({
          message: "No upcoming patients found to notify"
        });
      }
  
      // Send email notifications to each patient
      const notificationResults = await Promise.all(upcomingPatients.map(async (patient) => {
        const patientsRemaining = upcomingPatients.length - patient.queue_position;
        
        try {
          // Send email using Google API
        //   await sendEmailByGoogle(
        //     patient.patient_email,
        //     patient.patient_firstname,
        //     patient.patient_lastname,
        //     '', // Doctor name (not available in query, can be added if needed)
        //     patient.appoint_day,
        //     'Clinic Address' // Replace with actual address if available
        //   );
          await sendEmailByGoogleUpcoming(
            patient.patient_email,
            patient.patient_firstname,
            patient.patient_lastname,
            '', // Doctor name (not available in query, can be added if needed)
            patient.appoint_day,
            'Clinic Address', // Replace with actual address if available
            patientsRemaining
          );
          
          return {
            patient_id: patient.patient_id,
            patient_name: `${patient.patient_firstname} ${patient.patient_lastname}`,
            email: patient.patient_email,
            appointment_time: patient.appoint_day,
            queue_position: patient.queue_position,
            patients_remaining: patientsRemaining,
            notification_sent: true
          };
        } catch (error) {
          console.error(`Failed to send email to ${patient.patient_email}:`, error);
          return {
            patient_id: patient.patient_id,
            patient_name: `${patient.patient_firstname} ${patient.patient_lastname}`,
            email: patient.patient_email,
            appointment_time: patient.appoint_day,
            queue_position: patient.queue_position,
            patients_remaining: patientsRemaining,
            notification_sent: false,
            error: error.message
          };
        }
      }));
  
      return res.status(200).json({
        message: "Notifications processed successfully",
        data: notificationResults
      });
  
    } catch (error) {
      console.error('Error in notifyUpcomingPatients:', error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  };
 
export const changePassword = async (req, res) => {
    const {p_id, new_password} = req.body;
    try{
        const pateint = await findPaitentById(p_id);
        if(!pateint){
            return res.status(404).json({
                message: "patient not found"
            });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        const updatedPatient = await updatePassword(pateint.id, hashedPassword);
        return res.status(200).json({
            message: "password updated successfully",
            data: updatedPatient
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}