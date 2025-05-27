import express from 'express';
import { registerHospital, loginHospital } from '../controllers/hospitalController.js';
import { getHospitalAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Manual hospital registration (via Postman)
router.post('/register', registerHospital);

// Hospital login
router.post('/login', loginHospital);

// Get all appointments for a hospital (protected route)
router.get('/:hospitalId/pending-appointments', authMiddleware('hospital'), getHospitalAppointments);

// Update appointment status (protected route)
router.put('/:hospitalId/appointments/:appointmentId/status', authMiddleware('hospital'), updateAppointmentStatus);

export default router;