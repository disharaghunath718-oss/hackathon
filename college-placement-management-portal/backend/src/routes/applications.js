// backend/src/routes/applications.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import Application from "../models/Application.js";   // ✅ import the model
import auth from "../middlewares/auth.js";
        // ✅ auth to populate req.user

const router = express.Router();

/* ---------------- ESM-safe __dirname ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- Ensure uploads directory exists ---------------- */
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* ---------------- Multer config ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|doc|docx)$/i;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only PDF/DOC/DOCX files allowed"));
  },
});

/* ---------------- Routes ---------------- */

// POST /api/applications/upload-resume
router.post("/upload-resume", upload.single("resume"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`, // public URL (served by static middleware)
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/applications/me  -> student's own applications
router.get("/me", auth, async (req, res, next) => {
  try {
    if (!req?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const apps = await Application.find({ student: req.user.id })
      .populate("drive", "companyName role") // adjust fields to your Drive schema
      .sort({ createdAt: -1 })
      .lean();

    res.json(apps);
  } catch (err) {
    next(err);
  }
});

/* ---------------- Local error handler for Multer/route errors ---------------- */
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (e.g., file too large)
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
  next();
});

export default router;
