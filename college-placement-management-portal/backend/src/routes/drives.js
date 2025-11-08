
// import express from 'express';
// import { protect } from '../middlewares/auth.js';
// import { permit } from '../middlewares/roles.js';
// import { createDrive, addRound, getActiveDrives } from '../controllers/driveController.js';
// const router = express.Router();
// router.post('/', protect, permit('tpo'), createDrive);
// router.post('/:driveId/rounds', protect, permit('tpo'), addRound);
// router.get('/active', protect, getActiveDrives);
// export default router;
// 
import express from "express";
import { protect } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";
import {
  createDrive,
  getActiveDrives,
  getAllDrives,
  deleteDrive,
} from "../controllers/driveController.js";

const router = express.Router();

// Create a new drive (TPO only)
router.post("/", protect, permit("tpo"), createDrive);

// Get all drives (TPO)
router.get("/", protect, permit("tpo"), getAllDrives);

// Delete a drive
router.delete("/:id", protect, permit("tpo"), deleteDrive);

// Get active drives for students
router.get("/active", protect, getActiveDrives);

export default router;