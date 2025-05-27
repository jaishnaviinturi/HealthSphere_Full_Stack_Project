
// controllers/healthRecordController.js
import Patient from '../models/Patient.js';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';

// Get all health records for a patient
export const getHealthRecords = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }
    if (req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const healthRecords = patient.healthRecords.map(record => ({
      id: record._id.toString(),
      medicalCondition: record.medicalCondition,
      monthsSince: record.monthsSince,
      currentMedications: record.currentMedications,
      date: record.date.toISOString().split('T')[0],
      fileName: record.fileName,
      filePath: record.filePath,
    }));
    res.json(healthRecords);
  } catch (error) {
    console.error('Error in getHealthRecords:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new health record
export const addHealthRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }
    const { medicalCondition, monthsSince, currentMedications } = req.body;
    if (req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    if (!medicalCondition || !monthsSince || !currentMedications) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const newRecord = {
      medicalCondition,
      monthsSince: Number(monthsSince),
      currentMedications,
      date: new Date(),
    };
    if (req.file) {
      newRecord.fileName = req.file.originalname;
      newRecord.filePath = `Uploads/${req.file.filename}`;
    }
    patient.healthRecords.push(newRecord);
    await patient.save();
    const addedRecord = patient.healthRecords[patient.healthRecords.length - 1];
    const recordResponse = {
      id: addedRecord._id.toString(),
      medicalCondition: addedRecord.medicalCondition,
      monthsSince: addedRecord.monthsSince,
      currentMedications: addedRecord.currentMedications,
      date: addedRecord.date.toISOString().split('T')[0],
      fileName: addedRecord.fileName,
      filePath: addedRecord.filePath,
    };
    res.status(201).json({ record: recordResponse });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(process.cwd(), 'Uploads', req.file.filename));
    }
    console.error('Error in addHealthRecord:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a health record
export const deleteHealthRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const recordId = req.params.id;
    if (!Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }
    if (req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const recordIndex = patient.healthRecords.findIndex(record => record._id.toString() === recordId);
    if (recordIndex === -1) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    const record = patient.healthRecords[recordIndex];
    if (record.filePath) {
      const filePath = path.join(process.cwd(), record.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    patient.healthRecords.splice(recordIndex, 1);
    await patient.save();
    res.json({ message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Error in deleteHealthRecord:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};