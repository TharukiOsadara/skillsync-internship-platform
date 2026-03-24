const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const UserControllers = require('../Controllers/UserControllers');

router.get("/",     protect, adminOnly, UserControllers.getUsers);    // Admin only
router.post("/:id/view-password", protect, adminOnly, UserControllers.viewUserPassword); // Admin only
router.put("/:id",  protect, adminOnly, UserControllers.updateUser);  // Admin only
router.delete("/:id", protect, adminOnly, UserControllers.deleteUser); // Admin only

// Public — no middleware needed
router.post("/register", UserControllers.registerUser);
router.post("/login",    UserControllers.loginUser);
router.get("/:id",       protect, UserControllers.getUserById);

module.exports = router;