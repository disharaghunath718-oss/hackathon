
// import Drive from '../models/Drive.js';
// import Round from '../models/Round.js';

// export const createDrive = async (req, res) => {
//   try {
//     const data = req.body;
//     data.createdBy = req.user._id;
//     const drive = await Drive.create(data);
//     res.json(drive);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// };

// export const addRound = async (req, res) => {
//   try {
//     const { driveId } = req.params;
//     const round = await Round.create({ ...req.body, drive: driveId });
//     await Drive.findByIdAndUpdate(driveId, { $push: { rounds: round._id } });
//     res.json(round);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// };

// export const getActiveDrives = async (req, res) => {
//   const drives = await Drive.find({ isActive: true });
//   res.json(drives);
// };
import Drive from '../models/Drive.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';

// 🟢 Create new drive (TPO only)

// export const createDrive = async (req, res) => {
//   try {
//     console.log("📩 Received Drive creation request:",req.body);
//     const { companyName, role, package: pkg, date }=req.body;
//     console.log("📩 Received Drive creation request:",req.body);
//     // 1️⃣ Create and save the drive
//     const drive = new Drive({ companyName, role, package: pkg, date, isActive: true });
//     await drive.save();

//     // 2️⃣ Fetch all students to notify
//     const students = await User.find({ role: 'student' }, { name: 1, email: 1 });

//     if (students.length === 0) {
//       console.warn("⚠️ No students found in database to notify.");
//     } else {
//       console.log(`📢 Found ${students.length} students to email.`);
//     }

//     // 3️⃣ Prepare the email HTML template
//     const emailTemplate = (studentName) => `
//       <div style="font-family:Arial, sans-serif; line-height:1.5;">
//         <h2 style="color:#2b6cb0;">📢 New Placement Drive Alert!</h2>
//         <p>Hello <strong>${studentName}</strong>,</p>
//         <p>A new placement drive has been announced:</p>
//         <ul>
//           <li><b>🏢 Company:</b> ${companyName}</li>
//           <li><b>💼 Role:</b> ${role}</li>
//           <li><b>💰 Package:</b> ${pkg}</li>
//           <li><b>📅 Date:</b> ${new Date(date).toLocaleDateString()}</li>
//         </ul>
//         <p>Please visit your student dashboard to apply.</p>
//         <p style="margin-top:15px;">Best Regards,<br><b>Placement Cell</b></p>
//       </div>
//     `;

//     // 4️⃣ Send all emails asynchronously
//     const emailPromises = students.map((student) =>
//       sendEmail(
//         student.email,
//         "📢 New Placement Drive Available!",
//         emailTemplate(student.name)
//       )
//     );

//     // Run all in parallel (non-blocking)
//     Promise.allSettled(emailPromises).then((results) => {
//       const successCount = results.filter(r => r.status === "fulfilled").length;
//       const failCount = results.filter(r => r.status === "rejected").length;
//       console.log(`✅ Email Summary: ${successCount} sent, ${failCount} failed.`);
//     });

//     // 5️⃣ Send response back immediately
//     res.status(201).json({
//       message: "Drive created successfully! Students will be notified via email.",
//       drive,
//     });

//   } catch (error) {
//     console.error("❌ Error creating drive:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const createDrive = async (req, res) => {
  try {
    const { companyName, role, package: pkg, date } = req.body;

    console.log("📩 Received Drive creation request:", req.body);
    const drive = new Drive({ companyName, role, package: pkg, date, isActive: true });
    await drive.save();

    // ✅ Get TPO email from logged-in user
    const tpoEmail = req.user?.email || "placement.portal@gmail.com";

    // ✅ Fetch all students to notify
    const students = await User.find({ role: "student" }, { name: 1, email: 1 });
    console.log(`📢 Found ${students.length} students to email.`);

    // ✅ Email template
    const emailTemplate = (studentName) => `
      <div style="font-family:Arial, sans-serif; line-height:1.5;">
        <h2 style="color:#2b6cb0;">📢 New Placement Drive Alert!</h2>
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>A new placement drive has been announced:</p>
        <ul>
          <li><b>🏢 Company:</b> ${companyName}</li>
          <li><b>💼 Role:</b> ${role}</li>
          <li><b>💰 Package:</b> ${pkg}</li>
          <li><b>📅 Date:</b> ${new Date(date).toLocaleDateString()}</li>
        </ul>
        <p>Please visit your student dashboard to apply.</p>
        <p style="margin-top:15px;">Best Regards,<br><b>${req.user.name}</b><br>${tpoEmail}</p>
      </div>
    `;

    // ✅ Send all emails asynchronously (with TPO’s email as sender)
    const emailPromises = students.map((student) =>
      sendEmail(student.email, "📢 New Placement Drive Available!", emailTemplate(student.name), tpoEmail)
    );

    Promise.allSettled(emailPromises).then((results) => {
      const success = results.filter((r) => r.status === "fulfilled").length;
      const fail = results.filter((r) => r.status === "rejected").length;
      console.log(`✅ Email Summary: ${success} sent, ${fail} failed.`);
    });

    res.status(201).json({
      message: "Drive created successfully! Students will be notified via email.",
      drive,
    });
  } catch (error) {
    console.error("❌ Error creating drive:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Add a new round to a drive
export const addRound = async (req, res) => {
  try {
    const { driveId } = req.params;
    const { roundName, roundDetails } = req.body;

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    drive.rounds.push({ roundName, roundDetails });
    await drive.save();

    res.status(200).json({ message: 'Round added successfully', drive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get all active drives
export const getActiveDrives = async (req, res) => {
  try {
    const drives = await Drive.find({ isActive: true });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🟢 Get all drives (for TPO dashboard)
export const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });
    res.status(200).json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Delete a drive
export const deleteDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Drive.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Drive not found" });

    res.status(200).json({ message: "Drive deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};