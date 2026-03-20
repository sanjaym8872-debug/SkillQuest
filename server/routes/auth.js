const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Badge = require('../models/Badge');
const passport = require('passport');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'Username taken' });

        // Password strength validation (8+ chars, upper, lower, number, special)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password too weak. Must contain 8+ chars, uppercase, number, and special character.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Auto login after registration
        req.session.userId = user._id;
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identity, password } = req.body;
        // Search for user by email OR username
        const user = await User.findOne({
            $or: [
                { email: identity },
                { username: identity }
            ]
        });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const { applySkillDecay } = require('../utils/gameLogic');
        applySkillDecay(user);
        await user.save();

        req.session.userId = user._id;
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: 'Logged in',
            user: userResponse
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

// Check Session
router.get('/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: 'No session' });

    try {
        const user = await User.findById(req.session.userId)
            .select('-password')
            .populate('badges.badgeId');

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.json(user);
    } catch (err) {
        console.error('Error in /me:', err);
        res.status(500).json({ message: err.message });
    }
});

// --- GOOGLE OAUTH ROUTES ---

// Initiate Google Login
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

// Google Auth Callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL + '/login' }),
    (req, res) => {
        // Successful authentication, set session userId since that's what other parts of the app use
        if (req.user) {
            req.session.userId = req.user._id;
        }
        res.redirect(process.env.CLIENT_URL + '/');
    }
);

module.exports = router;
