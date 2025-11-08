import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    status: { 
      type: String, 
      enum: ['applied', 'in_process', 'selected', 'rejected'], 
      default: 'applied' 
    },
    resumeUrl: String,
    parsedResume: Object,
    score: Number
  },
  { timestamps: true }               // ✅ auto creates createdAt & updatedAt
);

export default mongoose.model('Application', ApplicationSchema);
