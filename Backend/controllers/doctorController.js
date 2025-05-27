import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'doctor_images/');
  },
  filename: (req, file, cb) => {
    cb(null, 'temp_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  },
}).single('image');

export const addDoctor = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      // console.log('Request body:', req.body);
      // console.log('Uploaded file:', req.file);

      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      const { hospitalId } = req.params;
      const { fullName, email, password, specialization, experience, rating } = req.body;

      if (req.user.id !== hospitalId) {
        return res.status(403).json({ message: 'You can only add doctors to your own hospital' });
      }

      if (!fullName || !email || !password || !specialization) {
        return res.status(400).json({ message: 'Full name, email, password, and specialization are required' });
      }

      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ message: 'Doctor already exists' });
      }

      const hospital = await Hospital.findById(hospitalId).exec(); // Force fresh query
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const doctor = new Doctor({
        fullName,
        email,
        password: hashedPassword,
        hospital: hospitalId,
        specialization,
        experience: experience || 'Not specified',
        rating: rating || 4.0,
      });

      await doctor.save();

      let imagePath = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2';
      if (req.file) {
        const oldImagePath = req.file.path;
        const ext = path.extname(req.file.originalname);
        const newImagePath = `doctor_images/${doctor._id}${ext}`;
        imagePath = `/${newImagePath}`;

        await fs.rename(oldImagePath, path.join(process.cwd(), newImagePath));
        // console.log(`Renamed image to: ${newImagePath}`);
        if (await fs.access(path.join(process.cwd(), newImagePath)).then(() => true).catch(() => false)) {
          // console.log(`File exists at: ${newImagePath}`);
        } else {
          // console.log(`File does not exist at: ${newImagePath}`);
        }

        doctor.image = imagePath;
        await doctor.save();
      }

      // Check global uniqueness (optional, can be removed if index is dropped)
      const normalizedSpecialization = specialization.toLowerCase().trim();
      const existingSpecialization = await Hospital.findOne({
        specializations: normalizedSpecialization,
      });
      // console.log('Global check for specialization:', normalizedSpecialization, 'exists:', !!existingSpecialization);

      if (!existingSpecialization) {
        hospital.specializations.push(specialization);
        hospital.specializations = [...new Set(hospital.specializations)];
        await hospital.save();
        // console.log('Updated hospital specializations:', hospital.specializations);
      } else {
        // console.log(`Specialization "${specialization}" already exists globally, skipping update`);
      }

      res.status(201).json({ message: 'Doctor added successfully', doctorId: doctor._id });
    } catch (error) {
      console.error('Error in addDoctor:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (req.user.id !== hospitalId) {
      return res.status(403).json({ message: 'You can only view doctors in your own hospital' });
    }

    const doctors = await Doctor.find({ hospital: hospitalId }).select('-password');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.params;

    if (req.user.id !== hospitalId) {
      return res.status(403).json({ message: 'You can only delete doctors from your own hospital' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.hospital.toString() !== hospitalId) {
      return res.status(403).json({ message: 'Doctor does not belong to this hospital' });
    }

    // Get the image filename from the doctor's image path
    let imagePath = doctor.image;
    if (imagePath && !imagePath.startsWith('http')) { // Only delete if it's a local file path
      const filename = path.basename(imagePath); // e.g., "67f3cccc99473a13fdaa2ce2.jpeg"
      const filePath = path.join(process.cwd(), 'doctor_images', filename);

      // Delete the image file
      try {
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath); // Delete the file
        // console.log(`Deleted image file: ${filePath}`);
      } catch (fileError) {
        console.warn(`Image file not found or could not be deleted: ${filePath}, error: ${fileError.message}`);
      }
    }

    // Delete the doctor from the database
    await Doctor.deleteOne({ _id: doctorId });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};