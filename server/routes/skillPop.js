const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const { updateUserProgress } = require('../utils/gameLogic');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

// GET /api/skillpop/questions/:skill
router.get('/questions/:skill', checkAuth, async (req, res) => {
    try {
        const { skill } = req.params;
        const questions = await Question.aggregate([
            { $match: { skill: skill } },
            { $sample: { size: 5 } }
        ]);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/skillpop/finish
router.post('/finish', checkAuth, async (req, res) => {
    try {
        const { score, skill } = req.body;
        const userId = req.session.userId;

        const rewards = {
            xp: score,
            skillGains: [{ name: skill, xp: score, isQuiz: true }]
        };

        const result = await updateUserProgress(userId, rewards);

        // Slightly update syncMultiplier if needed (logically handled in updateUserProgress usually)
        // But we can return success
        res.json({ message: 'Score saved', updatedUser: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
