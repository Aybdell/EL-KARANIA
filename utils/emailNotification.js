import { Resend } from 'resend';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export const sendEmailNotification = async (email, first_name, last_name, selected_doctor, appointDay, address) => {
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Appointment Confirmation',
        html: `<strong>Hello ${first_name} ${last_name},</strong>
                <p>Your appointment with Dr. ${selected_doctor} on ${appointDay} has been confirmed.</p>
                <p>Address: ${address}</p>
                <p>Contact us if you need to make changes.</p>`
    });
}
export const sendEmailByGoogle = async (email, first_name, last_name, selected_doctor, appointDay, address) => {
    try {
        // Create email content
        const mailOptions = {
        from: process.env.GMAIL_USER, // sender address (must be your Gmail)
        to: email, // recipient email (can be any email)
        subject: 'Appointment Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4285f4;">Appointment Confirmation</h2>
            <p>Hello <strong>${first_name} ${last_name}</strong>,</p>
            <p>Your appointment with <strong>Dr. ${selected_doctor}</strong> has been successfully scheduled.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${appointDay}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${address}</p>
            </div>
            
            <p>Please arrive 15 minutes before your scheduled appointment time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <p>Thank you for choosing our services!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575;">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
            </div>
        `
        };
        
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        return info;
        
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

export const sendEmailByGoogleUpcoming = async (email, first_name, last_name, selected_doctor, appointDay, address, patientsRemaining) => {
    try {
        // Create email content
        const mailOptions = {
        from: process.env.GMAIL_USER, // sender address (must be your Gmail)
        to: email, // recipient email (can be any email)
        subject: 'Upcoming Consultation Reminder',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4285f4;">Upcoming Consultation Reminder</h2>
            <p>Hello <strong>${first_name} ${last_name}</strong>,</p>
            <p>This is a friendly reminder about your upcoming consultation with <strong>Dr. ${selected_doctor}</strong>.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Consultation Date:</strong> ${appointDay}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${address}</p>
                <p style="margin: 5px 0; color: #d23f3f; font-weight: bold;">there is ${patientsRemaining} left!</p>
            </div>
            
            <p>Please remember to:</p>
            <ul>
                <li>Arrive 15 minutes before your scheduled time</li>
                <li>Bring any required documents or test results</li>
                <li>Prepare any questions you may have for the doctor</li>
            </ul>
            
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <p>We look forward to seeing you!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575;">
                <p>This is an automated reminder. Please do not reply to this email.</p>
            </div>
        </div>
        `
        };
        
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        return info;
        
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

export const confirmationEmail = async (email, first_name, last_name, selected_doctor, appointDay) => {
    try {
        // Create email content
        const mailOptions = {
        from: process.env.GMAIL_USER, // sender address (must be your Gmail)
        to: email, // recipient email (can be any email)
        subject: 'Congratulation Youre Appointment Has been Confirmed',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4285f4;">Confirmation Email El-karania</h2>
            <p>Hello <strong>${first_name} ${last_name}</strong>,</p>
            <p>Your Appointment With <strong>Dr. ${selected_doctor}</strong> Has been Confirmed.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Consultation Date:</strong> ${appointDay}</p>
            </div>
            
            <p>Please remember to:</p>
            <ul>
                <li>Arrive 15 minutes before your scheduled time</li>
                <li>Bring any required documents or test results</li>
                <li>Prepare any questions you may have for the doctor</li>
            </ul>
            
            <p>If you need to reschedule or cancel, please You Can Go to Login and type Your Email and the password is 123.</p>
            <p>Please change You're password!</p>
            <p>We look forward to seeing you!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575;">
                <p>This is an automated reminder. Please do not reply to this email.</p>
            </div>
        </div>
        `
        };
        
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        return info;
        
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}