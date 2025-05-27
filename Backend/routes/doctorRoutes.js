import express from 'express';
import { addDoctor, loginDoctor, getDoctorsByHospital, deleteDoctor } from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getDoctorAppointments, getDoctorPatientRecords } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/:hospitalId/doctors', authMiddleware('hospital'), (req, res) => addDoctor(req, res));
router.post('/login', loginDoctor);
router.get('/:doctorId/appointments', authMiddleware('doctor'), getDoctorAppointments);
router.get('/:hospitalId/doctors', authMiddleware('hospital'), getDoctorsByHospital);
router.delete('/:hospitalId/doctors/:doctorId', authMiddleware('hospital'), deleteDoctor);
router.get('/:doctorId/patient-records', authMiddleware('doctor'), getDoctorPatientRecords);

export default router;