import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  hospitalName: {
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
  specializations: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc',
  },
  location: {
    type: String,
    default: 'Unknown',
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

export default mongoose.model('Hospital', hospitalSchema);