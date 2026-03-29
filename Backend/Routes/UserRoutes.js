const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const UserControllers = require('../Controllers/UserControllers');

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

module.exports = router;