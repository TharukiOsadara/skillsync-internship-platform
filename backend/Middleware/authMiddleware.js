const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'skillsync_dev_secret';

// Verifies the JWT from Authorization: Bearer <token>
// Attaches the full user document to req.user
// Usage: router.get("/", protect, controller)

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        if (!payload?.id) {
            return res.status(401).json({ success: false, message: 'Token is invalid.' });
        }

        // Attach full user to req (include password so adminOnly can verify it)
        const user = await User.findById(payload.id).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
    }
};

// adminOnly 
// Must always be used AFTER protect
// Blocks any user whose role is not "Admin"
// Usage: router.get("/", protect, adminOnly, controller)

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Admin access required.' });
};

module.exports = { protect, adminOnly };