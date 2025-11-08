
import mongoose from 'mongoose';
const OfferSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
  offerLetterUrl: String,
  package: Number,
  role: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Offer', OfferSchema);
