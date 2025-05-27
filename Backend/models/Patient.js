// models/Patient.js
import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  medicalCondition: {
    type: String,
    required: true,
  },
  monthsSince: {
    type: Number,
    required: true,
  },
  currentMedications: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  fileName: {
    type: String,
    default: null,
  },
  filePath: {
    type: String,
    default: null,
  },
});

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  healthRecords: [healthRecordSchema], // Embed health records as an array
});

export default mongoose.model('Patient', patientSchema);