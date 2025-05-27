import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
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
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    default: 'Not specified',
  },
  rating: {
    type: Number,
    default: 4.0,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
  },
});

export default mongoose.model('Doctor', doctorSchema);