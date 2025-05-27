import Appointment from '../models/Appointment.js';
import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

export const getAllSpecializations = async (req, res) => {
  try {
    // Fetch all existing doctors
    const doctors = await Doctor.find();

    // Extract unique specializations from doctors
    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

    // Filter out any undefined or empty specializations
    const validSpecializations = specializations.filter(specialization => specialization && specialization.trim() !== '');

    res.json({ specializations: validSpecializations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getHospitalsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const hospitals = await Hospital.find({ specializations: specialization });
    res.json({
      hospitals: hospitals.map(h => ({
        id: h._id,
        name: h.hospitalName,
        image: h.image,
        location: h.location,
        rating: h.rating,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json({
      hospitals: hospitals.map(h => ({
        id: h._id,
        name: h.hospitalName,
        image: h.image,
        location: h.location,
        rating: h.rating,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSpecializationsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Find the hospital to ensure it exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Find all existing doctors associated with this hospital
    const doctors = await Doctor.find({ hospital: hospitalId });

    // Extract unique specializations from the existing doctors
    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

    // Filter out any undefined or empty specializations
    const validSpecializations = specializations.filter(specialization => specialization && specialization.trim() !== '');

    res.json({ specializations: validSpecializations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorsByHospitalAndSpecialization = async (req, res) => {
  try {
    const { hospitalId, specialization } = req.query;
    const doctors = await Doctor.find({
      hospital: hospitalId,
      specialization,
    });
    res.json({
      doctors: doctors.map(d => ({
        id: d._id,
        name: d.fullName,
        image: d.image,
        experience: d.experience,
        rating: d.rating,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkAvailableTimeSlots = async (req, res) => {
  try {
    const { hospitalId, doctorId, date } = req.query;
    const appointments = await Appointment.find({
      hospital: hospitalId,
      doctor: doctorId,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] },
    });

    const allTimeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    ];

    const bookedSlots = appointments.map(appointment => appointment.time);
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { patientName, problem, specialization, hospitalId, doctorId, date, time, appointmentType } = req.body;

    if (req.user.id !== patientId) {
      return res.status(403).json({ message: 'You can only book appointments for yourself' });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!hospital.specializations.includes(specialization) || doctor.specialization !== specialization) {
      return res.status(400).json({ message: 'Specialization not available for this hospital or doctor' });
    }

    const existingAppointment = await Appointment.findOne({
      hospital: hospitalId,
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = new Appointment({
      patient: patientId,
      patientName,
      problem,
      specialization,
      hospital: hospitalId,
      doctor: doctorId,
      date: new Date(date),
      time,
      appointmentType,
      status: 'pending',
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment request sent successfully', appointmentId: appointment._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (req.user.id !== patientId) {
      return res.status(403).json({ message: 'You can only view your own appointments' });
    }

    const appointments = await Appointment.find({ patient: patientId })
      .populate('hospital', 'hospitalName')
      .populate('doctor', 'fullName specialization');

    const filteredAppointments = appointments
      .filter(appointment => appointment.hospital && appointment.doctor)
      .map(appointment => ({
        hospitalName: appointment.hospital.hospitalName,
        specialization: appointment.doctor.specialization,
        doctorName: appointment.doctor.fullName,
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        status: appointment.status,
      }));

    res.json(filteredAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getHospitalAppointments = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (req.user.id !== hospitalId) {
      return res.status(403).json({ message: 'You can only view appointments for your own hospital' });
    }

    const appointments = await Appointment.find({ hospital: hospitalId })
      .populate('patient', 'fullName')
      .populate('doctor', 'fullName specialization');

    const filteredAppointments = appointments
      .filter(appointment => appointment.patient && appointment.doctor)
      .map(appointment => ({
        _id: appointment._id,
        patientName: appointment.patientName,
        doctorName: appointment.doctor.fullName,
        specialization: appointment.specialization,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
      }));

    res.json({ appointments: filteredAppointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { hospitalId, appointmentId } = req.params;
    const { status } = req.body;

    if (req.user.id !== hospitalId) {
      return res.status(403).json({ message: 'You can only update appointments for your own hospital' });
    }

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "Accepted" or "Rejected"' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.hospital.toString() !== hospitalId) {
      return res.status(403).json({ message: 'This appointment does not belong to your hospital' });
    }

    appointment.status = status === 'Accepted' ? 'approved' : 'rejected';
    await appointment.save();

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// New controller to fetch approved appointments for a doctor
export const getDoctorPatientRecords = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (req.user.id !== doctorId) {
      return res.status(403).json({ message: 'You can only view your own patients\' records' });
    }

    const query = {
      doctor: doctorId,
      status: 'approved',
    };

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
      }
      const startOfDay = new Date(parsedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(parsedDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query).populate('patient', 'fullName');
    if (!appointments.length) {
      return res.status(200).json({ patients: [] });
    }

    const patientIds = appointments.map(appointment => appointment.patient._id);
    const patients = await Patient.find({ _id: { $in: patientIds } });

    const patientRecords = patients.map(patient => ({
      id: patient._id.toString(),
      username: patient.fullName,
      healthRecords: patient.healthRecords.map(record => ({
        condition: record.medicalCondition,
        monthsSinceStart: record.monthsSince,
        medications: record.currentMedications.split(', '),
        report: record.filePath ? `${process.env.BASE_URL || 'http://localhost:3000'}/${record.filePath}` : 'No report available', // Full URL
      })),
    }));

    res.json({ patients: patientRecords });
  } catch (error) {
    console.error('Error fetching doctor patient records:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Existing getDoctorAppointments (unchanged, included for reference)
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (req.user.id !== doctorId) {
      return res.status(403).json({ message: 'You can only view your own appointments' });
    }

    const query = { doctor: doctorId, status: 'approved' };
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
      }
      const startOfDay = new Date(parsedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(parsedDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'fullName')
      .populate('hospital', 'hospitalName');

    const filteredAppointments = appointments
      .filter(appointment => appointment.patient && appointment.hospital)
      .map(appointment => ({
        id: appointment._id.toString(),
        patientName: appointment.patientName,
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        reason: appointment.problem,
        status: 'Confirmed',
      }));

    res.json({ appointments: filteredAppointments });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};