const express = require('express');
const router = express.Router();
const UserControllers = require('../Controllers/UserControllers');

// Route for register and getting all users

router.get("/", UserControllers.getUsers);
router.post("/register", UserControllers.registerUser);
router.post("/", UserControllers.addUsers);
router.get("/:id", UserControllers.getUserById);
router.put("/:id", UserControllers.updateUser);
router.delete("/:id", UserControllers.deleteUser);

// Route for getting a specific profile

module.exports = router;