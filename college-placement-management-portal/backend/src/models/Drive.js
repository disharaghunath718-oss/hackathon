
import mongoose from 'mongoose';

const DriveSchema = new mongoose.Schema({
  companyName: String,
  role: String,
  description: String,
  eligibility: {
    departments: [String],
    minCgpa: Number,
    gradsFromYear: [Number]
  },
  rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Drive', DriveSchema);
