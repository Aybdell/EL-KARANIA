import { addPayment, allPayments } from '../models/paymentModel.js';
import { findPaitentById } from '../models/patientModel.js';
import { findDoctorByid } from '../models/doctorModel.js';

export const createPayment = async (req, res) => {
    const {patient_id, doctor_id, amount, date, payment_method, notes} = req.body;
    try{
        const patient = await findPaitentById(patient_id);
        if(!patient){
            return res.status(404).json({
                message: "Patient Not Found"
            });
        }
        const doctor = await findDoctorByid(doctor_id);
        if(!doctor){
            return res.status(404).json({
                message: "Doctor Not Found"
            });
        }
        
        const payment = await addPayment(patient_id, doctor_id, amount, date, payment_method, notes);
        if(payment){
            return res.status(200).json({
                message: "Payment Created Successfully",
                payment
            });
        }else{
            return res.status(400).json({
                message: "Payment Creation Failed"
            });
        }
    }catch (error) {
        console.error('Error creating payment:', error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const getAllPayments = async (req, res) => {
    try {
        const payments = await allPayments();
        if (payments) {
            return res.status(200).json({
                message: "Payments Retrieved Successfully",
                payments
            });
        } else {
            return res.status(404).json({
                message: "No Payments Found"
            });
        }  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}