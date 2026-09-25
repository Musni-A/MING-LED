import { Router } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { User } from "../mongoose/schema/users.mjs";
import { comparePassword, hashPassword } from "../util/helper.mjs";
import { isAuthenticated } from "../middleware/auth.mjs";

const router = Router();

const userValidation = [
    body('name').notEmpty().withMessage('Pls type your name'),
    body('username').notEmpty().withMessage("Cannot register with username empty"),
    body('age').isInt({ min: 16 }).withMessage('Invalid age'),
    body('address').notEmpty().withMessage('Invalid address'),
    body('phoneNumber').notEmpty().withMessage('Invalid Phone Number'),
    body('password').notEmpty().withMessage('Invalid password'),
    body('department').notEmpty().withMessage('Invalid department'),
    body('jobRole').default("Not yet assign job role"),
    body('imageUrl').optional().isString(),
];

// 🔐 LOGIN (no passport)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // 🔄 Regenerate session to prevent session fixation
        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ message: "Session error" });

            // Store user info in session
            req.session.userId = user._id.toString();
            req.session.name = user.name;

            // Save before responding
            req.session.save(async (err) => {
                if (err) return res.status(500).json({ message: "Session save failed" });

                const sendUser = await User.findById(user._id).select('-password -username');
                return res.json({
                    message: "Login successful",
                    sendUser,
                    loggedIn: true
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// 🚪 LOGOUT
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie('sessionId'); // must match cookie name in session config
        res.json({ message: "Logged out successfully" });
    });
});

// 👤 GET CURRENT USER (protected route example)
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not logged in" });
    }
    try {
        const user = await User.findById(req.session.userId).select('-password -username');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// 🧾 REGISTER (unchanged)
router.post('/register', userValidation, async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ Error: error.array() });
    }
    try {
        const body = matchedData(req);
        body.password = hashPassword(body.password);
        const user = new User(body);
        const savedUser = await user.save();
        const sendUser = await User.findById(savedUser._id).select('-password -username');
        res.status(200).json(sendUser);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Other routes (users, users/:id, patch, delete) — unchanged
router.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await User.find().select('-password -username');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.get('/users/:id', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.json({ msg: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const user = await User.findById(userId);
        if (!user) return res.json({ msg: "User not found" });

        if (updates.upType === 'updatePassword') {
            const compareResult = comparePassword(updates.data.currentPassword, user.password);
            if (!compareResult) {
                return res.json({ msg: "Current password is incorrect" });
            }
            const hashedPassword = hashPassword(updates.data.newPassword);
            const updateUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { returnDocument: 'after' });
            return res.status(200).json(updateUser);
        }

        if (updates.upType === 'updateDetails') {
            const updated = await User.findByIdAndUpdate(userId, updates.data, { returnDocument: 'after' });
            return res.status(200).json(updated);
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) return res.json({ msg: "User not found" });
        return res.json({ msg: "Deleted successfully", deleteUser });
    } catch (err) {
        res.json({ msg: err });
    }
});

export default router;