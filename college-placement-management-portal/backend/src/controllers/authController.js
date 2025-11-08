
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, department, role, rollNumber } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User exists' });
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    user = await User.create({ name, email, password: hashed, department, role, rollNumber });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.password) return res.status(400).json({ message: 'External auth only' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
