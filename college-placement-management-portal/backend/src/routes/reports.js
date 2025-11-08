
import express from 'express';
import { protect } from '../middlewares/auth.js';
const router = express.Router();
router.get('/health', protect, (req, res) => res.json({ok:true}));
export default router;
