import Patient from '../models/Patient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose'

export const registerPatient = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;

    if (!fullName || !email || !password || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      fullName,
      email,
      password: hashedPassword,
      contactNumber,
      healthRecords: [], // Initialize with an empty array
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patientId: patient._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: patient._id, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, patientId: patient._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

