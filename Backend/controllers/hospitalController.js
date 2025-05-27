import Hospital from '../models/Hospital.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerHospital = async (req, res) => {
  try {
    const { hospitalName, email, password } = req.body;

    if (!hospitalName || !email || !password) {
      return res.status(400).json({ message: 'Hospital name, email, and password are required' });
    }

    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Hospital already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = new Hospital({
      hospitalName,
      email,
      password: hashedPassword,
      specializations: [],
    });

    await hospital.save();
    res.status(201).json({ message: 'Hospital registered successfully', hospitalId: hospital._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: hospital._id, role: 'hospital' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return both token and hospitalId
    res.json({ token, hospitalId: hospital._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};