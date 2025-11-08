// backend/server.js
import 'dotenv/config';                          // load env FIRST
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './src/routes/auth.js';
import driveRoutes from './src/routes/drives.js';
import appRoutes from './src/routes/applications.js';
import reportRoutes from './src/routes/reports.js';
import hodRoutes from './src/routes/hod.js';
import studentSelfRoutes from './src/routes/studentSelf.js';
import atsGeminiRoutes from './src/routes/atsGemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads dir (keep this consistent with applications.js)
const uploadDir = path.join(process.cwd(), 'uploads'); // or __dirname, but match applications.js
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const app = express();

// global middleware
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // allow CRA & Vite
    credentials: true,
  })
);
app.use(express.json());

// static
app.use('/uploads', express.static(uploadDir));

// routes
app.use('/api/ats', atsGeminiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/students', studentSelfRoutes); // ✅ only once now

app.get('/', (_req, res) => res.send('Placement API running'));

// connect DB then listen
await connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
