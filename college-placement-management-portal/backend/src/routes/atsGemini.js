import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.memoryStorage(); // memory is fine for analysis-only
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['.pdf', '.doc', '.docx'].includes(path.extname(file.originalname).toLowerCase());
    if (!ok) return cb(new Error('Only PDF/DOC/DOCX allowed'));
    cb(null, true);
  }
});

// POST /api/ats/analyze
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No resume uploaded' });

    // If you actually call Gemini, check your key:
    // if (!process.env.GEMINI_API_KEY) return res.status(500).json({ message: 'GEMINI_API_KEY missing' });

    // --- TEMP SAFE RESPONSE (so your UI works immediately) ---
    const requiredSkills = (req.body.requiredSkills || '').split(',')
      .map(s => s.trim()).filter(Boolean);

    const candidateSkills = ['react','node','mongodb']; // stub example
    const missing = requiredSkills.filter(s => !candidateSkills.includes(s.toLowerCase()));

    return res.json({
      jobFit: {
        score: Math.max(0, 100 - missing.length * 10),
        missingSkills: missing,
        reasoning: 'Temporary stub response. Connect Gemini to get real analysis.'
      },
      candidate: { skills: candidateSkills },
      suggestions: {
        bullets: [
          'Optimized React components with memoization',
          'Built REST APIs with Express and JWT auth',
          'Modeled data in MongoDB with Mongoose'
        ],
        formattingTips: [
          'Use consistent section headings',
          'Quantify achievements (%, time saved, revenue)',
          'Keep it to one page if <5 years experience'
        ]
      }
    });
  } catch (err) {
    console.error('ATS analyze error:', err);
    res.status(500).json({ message: err.message || 'ATS analysis failed' });
  }
});

export default router;
