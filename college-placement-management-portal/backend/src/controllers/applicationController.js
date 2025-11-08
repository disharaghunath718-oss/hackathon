
import Application from '../models/Application.js';
import User from '../models/User.js';
import aiService from '../services/aiService.js';

export const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.body;
    const resumeUrl = req.file?.path || req.file?.filename;
    // parse resume using AI service (Gemini placeholder)
    const parsed = await aiService.parseResume(resumeUrl);
    const score = await aiService.scoreResume(parsed, driveId);
    const app = await Application.create({ student: req.user._id, drive: driveId, resumeUrl, parsedResume: parsed, score });
    res.json(app);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    res.json(app);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const filterApplications = async (req, res) => {
  try {
    const { skills = [], minScore = 0, department, q, exportExcel } = req.body;
    let apps = await Application.find({ score: { $gte: minScore } }).populate('student drive');
    if (department) apps = apps.filter(a => a.student.department === department);
    if (skills.length) {
      apps = apps.filter(a => {
        const rs = (a.parsedResume?.skills || []).map(s => s.toLowerCase());
        return skills.every(skill => rs.includes(skill.toLowerCase()));
      });
    }
    if (q) {
      const ql = q.toLowerCase();
      apps = apps.filter(a => JSON.stringify(a.parsedResume || {}).toLowerCase().includes(ql));
    }
    res.json({ count: apps.length, data: apps });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
