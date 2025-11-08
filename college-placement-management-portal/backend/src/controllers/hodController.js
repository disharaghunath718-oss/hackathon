// Create this file if you don't have it yet
import User from '../models/User.js';               // or Student.js if you use that
import Application from '../models/Application.js'; // has resumeUrl/score

// GET /api/hod/students
export const getStudentsSummary = async (req, res, next) => {
  try {
    // If your student records live in Student.js, change to: Student.find({})
    const students = await User.find({ role: 'student' })
      .select('name email department') // adjust to your fields
      .lean();

    const ids = students.map(s => s._id);

    // Aggregate applications: latest resume/score + total count per student
    const apps = await Application.aggregate([
      { $match: { student: { $in: ids } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$student',
          latestResume: { $first: '$resumeUrl' },
          latestScore:  { $first: '$score' },
          totalApps:    { $sum: 1 },
        }
      }
    ]);

    const byStudent = new Map(apps.map(a => [String(a._id), a]));

    const rows = students.map(s => {
      const a = byStudent.get(String(s._id)) || {};
      return {
        id: s._id,
        name: s.name || s.fullName || '—',
        email: s.email || '—',
        department: s.department || s.dept || s.branch || '—',
        totalApplications: a.totalApps || 0,
        latestResume: a.latestResume || null,
        latestScore: a.latestScore ?? null,
      };
    });

    res.json(rows);
  } catch (err) {
    next(err);
  }
};
