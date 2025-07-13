import express from 'express';
import cors from 'cors'; // Import the cors package
import adminRoutes from './routes/adminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordsRoutes from './routes/medicalRecordsRoutes.js';
import prescriptionsRoutes from './routes/prescriptionsRoutes.js';
import assistanceRoutes from './routes/assistanceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import imagingRoutes from './routes/imagingRoutes.js';
import analysisOrdersRoutes from './routes/analysisOrdersRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import 'dotenv/config';

const app = express();

// Configure CORS middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost', 'http://localhost:4000', 'http://localhost:8081'], // Add your frontend URL(s)
  credentials: true, // Enable credentials (cookies, authorization headers, etc)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());

/**
 * Bilal : IDEA 
 * PROBABLY WE MUST CREATE A SUPER ADMIN BUT WE WILL KEEP IT IN THE BACKEND 
 * SO WE USED HBC VIEW IN THE BACKEND AND BY THE SUPER ADMIN CAN CREATE NEW ADMINS OR DOCTORS 
 */

// admin routes 
app.use('/admin', adminRoutes);
// patient routes 
app.use('/patient', patientRoutes);
// user routes
app.use('/user', userRoutes);
// doctor routes
app.use('/doctor', doctorRoutes);
// auth routes
app.use('/auth', authRoutes);
// appointment routes
app.use('/appointment', appointmentRoutes);
// medical records routes
app.use("/medical-records", medicalRecordsRoutes);
// prescription routes 
app.use("/prescription", prescriptionsRoutes);
// assistance routes 
app.use('/assistance', assistanceRoutes);
// payment routes
app.use('/payment', paymentRoutes);
// imaging routes
app.use('/imaging', imagingRoutes);
// analysis orders routes
app.use('/analysis-orders', analysisOrdersRoutes);
// analytics routes
app.use('/analytics', analyticsRoutes);

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log('Server is running on port 5000');
}); 