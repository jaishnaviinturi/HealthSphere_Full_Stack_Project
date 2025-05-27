
// routes/patientRoutes.js
import express from 'express';
import { registerPatient, loginPatient, getPatientProfile } from '../controllers/patientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getPatientAppointments } from '../controllers/appointmentController.js';
import { addHealthRecord, getHealthRecords, deleteHealthRecord } from '../controllers/healthRecordController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Create uploads directory dynamically
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'));
    }
  },
});

const router = express.Router();

// Public patient registration
router.post('/register', registerPatient);

// Patient login
router.post('/login', loginPatient);

// Protected route: Get patient profile
router.get('/:patientId', authMiddleware('patient'), getPatientProfile);

// Protected route: Get patient appointment history
router.get('/:patientId/appointments', authMiddleware('patient'), getPatientAppointments);

// Protected routes: Health record management
router.get('/:patientId/health-records', authMiddleware('patient'), getHealthRecords);
router.post('/:patientId/health-records', authMiddleware('patient'), upload.single('file'), addHealthRecord);
router.delete('/:patientId/health-records/:id', authMiddleware('patient'), deleteHealthRecord);

export default router;