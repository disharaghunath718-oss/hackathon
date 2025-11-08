
import mongoose from 'mongoose';
const RoundSchema = new mongoose.Schema({
  drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
  name: String,
  scheduledAt: Date,
  results: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['selected','rejected','pending'], default: 'pending' } }]
});
export default mongoose.model('Round', RoundSchema);
