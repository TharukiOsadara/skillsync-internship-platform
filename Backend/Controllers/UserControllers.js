const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');

const hasLetter = (value = '') => /[A-Za-z]/.test(String(value));
const startsWithDigit = (value = '') => /^\d/.test(String(value).trim());
const digitsOnly = (value = '') => String(value).replace(/\D/g, '');

const getAuthUser = async (req) => {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'skillsync_dev_secret');
        if (!payload?.id) return null;
        return await User.findById(payload.id).select('+password');
    } catch (err) {
        return null;
    }
};

const requireAdmin = async (req, res) => {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'Admin') {
        res.status(403).json({ success: false, message: 'Admin access required.' });
        return null;
    }
    return authUser;
};

const validateUserPayload = ({ fullName, gmail, password, age, address, phoneNo, skills, education, experience }) => {
    if (!fullName || !gmail || !password || !age || !address || !phoneNo || !education || !experience) {
        return 'All required fields must be filled.';
    }

    if (/\d/.test(String(fullName))) return 'Full name cannot contain numbers.';

    const emailRx = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRx.test(String(gmail))) {
        return 'Gmail must start with a letter and be a valid email.';
    }

    if (!hasLetter(address)) return 'Address cannot be only numbers.';
    if (skills && !hasLetter(skills)) return 'Skills cannot be only numbers.';
    if (!hasLetter(education)) return 'Education cannot be only numbers.';
    if (!hasLetter(experience)) return 'Experience cannot be only numbers.';

    const phoneDigits = digitsOnly(phoneNo);
    if (phoneDigits.length !== 10) return 'Phone number must be exactly 10 digits.';

    if (Number(age) < 16 || Number(age) > 60) return 'Age must be between 16 and 60.';
    if (password.length < 6) return 'Password must be at least 6 characters.';

    return null;
};

const validateSelfUpdatePayload = ({ fullName, gmail, age, address, phoneNo, skills, education, experience }) => {
    if (fullName !== undefined) {
        if (!String(fullName).trim()) return 'Full name is required.';
        if (/\d/.test(String(fullName))) return 'Full name cannot contain numbers.';
    }

    if (gmail !== undefined) {
        const emailRx = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRx.test(String(gmail))) return 'Gmail must start with a letter and be a valid email.';
    }

    if (age !== undefined && (Number(age) < 16 || Number(age) > 60)) return 'Age must be between 16 and 60.';
    if (address !== undefined && !hasLetter(address)) return 'Address cannot be only numbers.';
    if (skills !== undefined && String(skills).trim() && !hasLetter(skills)) return 'Skills cannot be only numbers.';
    if (education !== undefined && !hasLetter(education)) return 'Education cannot be only numbers.';
    if (experience !== undefined && !hasLetter(experience)) return 'Experience cannot be only numbers.';

    if (phoneNo !== undefined) {
        const phoneDigits = digitsOnly(phoneNo);
        if (phoneDigits.length !== 10) return 'Phone number must be exactly 10 digits.';
    }

    return null;
};

// @desc    Register a new user (Student or Admin)
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            gmail,
            password,
            age,
            address,
            phoneNo,
            role,
            skills,
            education,
            experience,
            mode,
            timePreference,
            description
        } = req.body;

        const validationError = validateUserPayload({
            fullName,
            gmail,
            password,
            age,
            address,
            phoneNo,
            skills,
            education,
            experience
        });

        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        // 🔥 NEW: Validate student-specific fields
        if (role === 'Student') {
            if (!mode || !['Online/Remote', 'Physical/On-site', 'Hybrid'].includes(mode)) {
                return res.status(400).json({ success: false, message: 'Please select a valid work mode.' });
            }

            if (!timePreference || !['Day', 'Night'].includes(timePreference)) {
                return res.status(400).json({ success: false, message: 'Please select a valid time preference.' });
            }

            if (!description || String(description).trim().length < 10) {
                return res.status(400).json({ success: false, message: 'Description must be at least 10 characters.' });
            }

            if (!hasLetter(description)) {
                return res.status(400).json({ success: false, message: 'Description cannot be only numbers.' });
            }
        }

        // Check if user already exists
        const userExists = await User.findOne({ gmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this gmail' });
        }

        const user = await User.create({
            fullName,
            gmail,
            password,
            age,
            address,
            phoneNo: digitsOnly(phoneNo),
            role,
            skills,
            education,
            experience,
            mode: role === 'Student' ? mode : '',
            timePreference: role === 'Student' ? timePreference : '',
            description: role === 'Student' ? description : ''
        });

        const payload = { id: user._id, role: user.role, gmail: user.gmail };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'skillsync_dev_secret',
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            success: true,
            user,
            token
        });

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /users/login
const loginUser = async (req, res) => {
    try {
        const { gmail, password } = req.body;
        if (!gmail || !password) {
            return res.status(400).json({ success: false, message: 'gmail and password are required' });
        }

        const user = await User.findOne({ gmail }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Passwords are currently stored in plain text in this project.
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const payload = { id: user._id, role: user.role, gmail: user.gmail };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'skillsync_dev_secret', { expiresIn: '7d' });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({ success: true, user: userObj, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all users (Useful for Admin to see students)
// @route   GET /api/users
const getUsers = async (req, res) => {
    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const users = await User.find().select('+password').sort({ createdAt: -1 });
        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: err.message });
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

    const validationError = validateUserPayload({ fullName, gmail, password, age, address, phoneNo, skills, education, experience });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        user = new User({fullName, gmail, password, age, address, phoneNo: digitsOnly(phoneNo), role, skills, education, experience});
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
    const authUser = await getAuthUser(req);
    if (!authUser) {
        return res.status(401).json({ success: false, message: 'Not authorized.' });
    }

    const id = req.params.id;
    const isAdmin = authUser.role === 'Admin';
    const isSelf = String(authUser._id) === String(id);

    if (!isAdmin && !isSelf) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this user.' });
    }

    const { fullName, gmail, password, age, address, phoneNo, role, skills, education, experience, photo, adminPassword } = req.body;

    if (isAdmin && !isSelf) {
        if (!adminPassword) {
            return res.status(400).json({ success: false, message: 'Admin password is required to update users.' });
        }

        if (authUser.password !== adminPassword) {
            return res.status(401).json({ success: false, message: 'Admin password is incorrect.' });
        }

        const validationError = validateUserPayload({ fullName, gmail, password, age, address, phoneNo, skills, education, experience });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        try {
            const user = await User.findByIdAndUpdate(
                id,
                { fullName, gmail, password, age, address, phoneNo: digitsOnly(phoneNo), role, skills, education, experience, photo, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'User cannot Update' });
            }
            return res.status(200).json({ success: true, data: user });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    const validationError = validateSelfUpdatePayload({ fullName, gmail, age, address, phoneNo, skills, education, experience });
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }

    const updates = { updatedAt: new Date() };
    const allowedSelfFields = ['fullName', 'gmail', 'age', 'address', 'phoneNo', 'skills', 'education', 'experience', 'photo'];

    allowedSelfFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = field === 'phoneNo' ? digitsOnly(req.body[field]) : req.body[field];
        }
    });

    if (Object.keys(updates).length === 1) {
        return res.status(400).json({ success: false, message: 'No valid fields provided to update.' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
//delete user
const deleteUser = async (req, res) => {
    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    const { adminPassword } = req.body || {};
    if (!adminPassword) {
        return res.status(400).json({ success: false, message: 'Admin password is required to delete users.' });
    }

    if (adminUser.password !== adminPassword) {
        return res.status(401).json({ success: false, message: 'Admin password is incorrect.' });
    }

    const id = req.params.id;
    let user;
    try {
        if (String(adminUser._id) === String(id)) {
            return res.status(400).json({ success: false, message: 'Admin cannot delete own account.' });
        }

        user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Reveal a user's password (admin only, with admin password confirmation)
// @route   POST /users/:id/view-password
const viewUserPassword = async (req, res) => {
    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    const { adminPassword } = req.body || {};
    if (!adminPassword) {
        return res.status(400).json({ success: false, message: 'Admin password is required.' });
    }

    if (adminUser.password !== adminPassword) {
        return res.status(401).json({ success: false, message: 'Admin password is incorrect.' });
    }

    try {
        const targetUser = await User.findById(req.params.id).select('+password');
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({ success: true, password: targetUser.password });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.addUsers = addUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.viewUserPassword = viewUserPassword;


