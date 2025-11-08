
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['student','hod','tpo'], default: 'student' },
  department: { type: String },
  rollNumber: { type: String },
  resumeUrl: { type: String },
  resumeParsed: { type: Object },
  isApprovedByHOD: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
