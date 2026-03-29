const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const UserControllers = require('../Controllers/UserControllers');

<<<<<<< HEAD
// ── Public ────────────────────────────────────────────────────────────────────
router.get("/emails",              UserControllers.getUserEmails);
router.post("/register",           UserControllers.registerUser);
router.post("/login",              UserControllers.loginUser);

// Forgot password (no auth needed — user doesn't know their password)
router.post("/forgot-password/verify", UserControllers.verifyForgotEmail);
router.post("/forgot-password/reset",  UserControllers.resetForgotPassword);

// ── Authenticated ─────────────────────────────────────────────────────────────
router.post("/change-password",    protect, UserControllers.changePassword);

router.get("/",       protect, adminOnly, UserControllers.getUsers);
router.post("/:id/view-password", protect, adminOnly, UserControllers.viewUserPassword);
router.put("/:id",    protect, UserControllers.updateUser);
router.delete("/:id", protect, adminOnly, UserControllers.deleteUser);
router.get("/:id",    protect, UserControllers.getUserById);
=======
router.get("/",     protect, adminOnly, UserControllers.getUsers);    // Admin only
router.post("/:id/view-password", protect, adminOnly, UserControllers.viewUserPassword); // Admin only
router.put("/:id",  protect, UserControllers.updateUser);  // Admin or self
router.delete("/:id", protect, adminOnly, UserControllers.deleteUser); // Admin only

// Public — no middleware needed
router.post("/register", UserControllers.registerUser);
router.post("/login",    UserControllers.loginUser);
router.get("/:id",       protect, UserControllers.getUserById);
>>>>>>> origin/CV-Builder

module.exports = router;