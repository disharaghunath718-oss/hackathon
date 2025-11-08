import express from 'express';
import { auth } from '../middlewares/auth.js';
import Student from '../models/Student.js';   // ✅ make sure this file exists!

console.log("✅ studentSelf.js LOADED");

const router = express.Router();

// ✅ For debugging
router.get('/ping', (req, res) => res.json({ ok: true }));

router.get('/me', auth, async (req, res) => {
  try {
    console.log("✅ /me hit, user =", req.user);

    const student = await Student.findById(req.user.id)
      .select('-password')
      .lean();

    if (!student) {
      console.log("❌ Student not found");
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error("❌ ERROR IN /me:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
