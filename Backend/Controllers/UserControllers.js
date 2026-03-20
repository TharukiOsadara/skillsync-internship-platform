const User = require('../Models/UserModel');

// @desc    Register a new user (Student or Admin)
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { fullName, gmail, password, age, address,phoneNo, role, skills, education, experience } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ gmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this gmail' });
        }

        const user = await User.create({
            fullName,
            gmail,
            password, // Note: In a real app, hash this with bcrypt first!
            age,
            address,
            phoneNo,
            role,
            skills,
            education,
            experience
        });

        return res.status(201).json({ success: true, data: user });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all users (Useful for Admin to see students)
// @route   GET /api/users
const getUsers = async (req, res) => {
    let Users;
    try {
        const users = await User.find();
        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: err.message });
    }
    // not found 
    if (!users) {
        return res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get single user profile
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
    const id = req.params.id;
    let user;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};


//Data Insert
const addUsers = async (req, res) => {
    const { fullName, gmail, password, age, address,phoneNo, role, skills, education, experience } = req.body;
    let user;
    try {
        user = new User({fullName, gmail, password, age, address,phoneNo, role, skills, education, experience});
        await user.save();
        console.log("User added successfully:", user);
    } catch (err) {
        console.error("Error adding user:", err);
        return res.status(400).json({ message: 'Unable to add User', error: err.message });
    }
    if (!user) {
        return res.status(404).json({ message: 'Unable to add User' });
    }
    return res.status(201).json({ user });
};
//update user
const updateUser = async (req, res) => {
    const id = req.params.id;
    const { fullName, gmail, password, age, address,phoneNo, role, skills, education, experience } = req.body;
    let user;
    try {
        user = await User.findByIdAndUpdate(req.params.id, { fullName, gmail, password, age, address,phoneNo, role, skills, education, experience }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User cannot Update' });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
//delete user
const deleteUser = async (req, res) => {
    const id = req.params.id;
    let user;
    try {
        user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.registerUser = registerUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.addUsers = addUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;


