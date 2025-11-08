// backend/src/middlewares/auth.js
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // should include at least { id, role? }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Alias to satisfy code that imports { protect }
export const protect = auth;

// Optional role gate if you need it anywhere
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Provide a default export too, to satisfy `import auth from ...`
export default auth;
