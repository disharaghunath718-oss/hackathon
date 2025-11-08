// backend/src/models/Student.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

export const STUDENT_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];
export const ROLES = ['STUDENT', 'HOD', 'TPO', 'ADMIN']; // student docs will use 'STUDENT'

const StudentSchema = new Schema(
  {
    // Identity
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false }, // select:false hides in queries
    role: { type: String, enum: ROLES, default: 'STUDENT', index: true },

    // College info
    rollNo: { type: String, required: true, trim: true, unique: true }, // USN/RegNo
    department: { type: String, required: true, index: true }, // e.g., "CSE"
    section: { type: String, trim: true },
    year: { type: Number, min: 1, max: 8 },
    graduationYear: { type: Number },

    // Placement eligibility/profile
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    backlogCount: { type: Number, min: 0, default: 0 },
    phone: { type: String, trim: true },
    skills: [{ type: String, trim: true }],

    // Documents & media
    resumeUrl: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },

    // Workflow
    status: { type: String, enum: STUDENT_STATUSES, default: 'PENDING', index: true },

    // Auditing
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes helpful for HOD queries/search
StudentSchema.index({ department: 1, status: 1 });
StudentSchema.index({ name: 'text', email: 'text', rollNo: 'text' });

// Hash password on create/update
StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
StudentSchema.methods.comparePassword = async function (candidate) {
  // ensure password is selected in query when you intend to compare
  return bcrypt.compare(candidate, this.password);
};

// Clean JSON output
StudentSchema.methods.toJSON = function () {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  return obj;
};

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
export default Student;
