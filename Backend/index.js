import express from 'express';
     import mongoose from 'mongoose';
     import dotenv from 'dotenv';
     import cors from 'cors';
     import fs from 'fs';
     import path from 'path';
     import { fileURLToPath } from 'url';

     // ES Module fix for __dirname
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);

     // Ensure necessary folders exist
     const paths = ['Uploads', 'doctor_images'];
     paths.forEach(dir => {
       const fullPath = path.join(__dirname, dir);
       if (!fs.existsSync(fullPath)) {
         fs.mkdirSync(fullPath);
       }
     });

     import hospitalRoutes from './routes/hospitalRoutes.js';
     import doctorRoutes from './routes/doctorRoutes.js';
     import patientRoutes from './routes/patientRoutes.js';
     import appointmentRoutes from './routes/appointmentRoutes.js';

     dotenv.config();

     const app = express();

     // Configure CORS to allow requests from Vercel frontend
     app.use(cors({ origin: 'https://health-sphere-frontend.vercel.app' }));
     app.use(express.json());

     // MongoDB Connection
     mongoose.connect(process.env.MONGO_URI)
       .then(() => console.log('Connected to MongoDB'))
       .catch(err => console.error('MongoDB connection error:', err));

     // Static File Serving
     app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
     app.use('/doctor_images', express.static(path.join(__dirname, 'doctor_images')));

     // API Routes
     app.use('/hospitals', hospitalRoutes);
     app.use('/doctors', doctorRoutes);
     app.use('/patients', patientRoutes);
     app.use('/appointments', appointmentRoutes);

     // Add root route for testing
     app.get('/', (req, res) => {
       res.send('Hello from HealthSphere Express Backend!');
     });

     // Server
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });