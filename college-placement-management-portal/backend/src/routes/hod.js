import express from 'express';
import { protect } from '../middlewares/auth.js';
import Student from '../models/Student.js';        // adjust path if different
import Application from '../models/Application.js';
import Drive from '../models/Drive.js';

const router = express.Router();

// require login
router.use(protect);

// simple role check (change if your user object differs)
const ensureHod = (req, res, next) => {
  if (req.user?.role !== 'HOD') return res.status(403).json({ message: 'HOD only' });
  next();
};
router.use(ensureHod);

/** 1) Pending approvals (scoped to HOD’s department) */
router.get('/pending', async (req, res) => {
  try {
    const dept = req.user.department; // or req.user.dept
    const rows = await Student.find({ department: dept, status: 'PENDING' })
      .select('name email rollNo department createdAt')
      .lean();
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/** Approve a student */
router.patch('/students/:id/approve', async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, { status: 'APPROVED' }, { new: true });
    if (!s) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Approved', student: s });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/** 2) List + 3) Edit students (searchable) */
router.get('/students', async (req, res) => {
  try {
    const dept = req.user.department;
    const { search = '' } = req.query;
    const q = { department: dept };
    if (search) {
      q.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { rollNo: new RegExp(search, 'i') },
      ];
    }
    const rows = await Student.find(q)
      .select('name email rollNo department cgpa backlogCount phone status')
      .lean();
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/students/:id', async (req, res) => {
  try {
    const allow = (({ name, email, phone, cgpa, backlogCount, status }) =>
      ({ name, email, phone, cgpa, backlogCount, status }))(req.body);
    const s = await Student.findByIdAndUpdate(req.params.id, allow, { new: true });
    if (!s) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Updated', student: s });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/** 4) Department stats */
router.get('/stats', async (req, res) => {
  try {
    const dept = req.user.department;

    const total = await Student.countDocuments({ department: dept, status: 'APPROVED' });
    const eligible = await Student.countDocuments({
      department: dept, status: 'APPROVED', cgpa: { $gte: 6.5 }, backlogCount: { $lte: 1 }
    });

    const byCompany = await Application.aggregate([
      { $match: { department: dept } },
      { $group: { _id: '$company', applications: { $sum: 1 },
        offers: { $sum: { $cond: [{ $eq: ['$status', 'OFFERED'] }, 1, 0] } } } },
      { $sort: { offers: -1, applications: -1 } },
      { $limit: 8 }
    ]);

    const appsAgg = await Application.aggregate([
      { $match: { department: dept } },
      { $group: { _id: null, applied: { $sum: 1 },
        offers: { $sum: { $cond: [{ $eq: ['$status', 'OFFERED'] }, 1, 0] } } } }
    ]);

    const drivesCount = await Drive.countDocuments({ eligibleDepartments: dept });
    const applied = appsAgg[0]?.applied || 0;
    const offers = appsAgg[0]?.offers || 0;
    const placementRate = total ? Math.round((offers / total) * 100) : 0;

    res.json({ total, eligible, applied, offers, drivesCount, placementRate, byCompany });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
