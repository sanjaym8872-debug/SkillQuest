const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { updateUserProgress } = require('../utils/gameLogic');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

// Start Quiz API
router.post('/start/:skill', checkAuth, async (req, res) => {
    try {
        const { skill } = req.params;
        const userId = req.session.userId;
        const user = await User.findById(userId);

        // 1. Cooldown Check (10 minutes)
        if (user.lastQuizAt) {
            const timeDiff = (Date.now() - new Date(user.lastQuizAt).getTime()) / (1000 * 60);
            if (timeDiff < 10) {
                return res.status(429).json({
                    message: 'Neural link recharging. Please wait before attempting another quiz.',
                    waitMinutes: Math.ceil(10 - timeDiff)
                });
            }
        }

        // 2. Select 5 Random Questions
        const questions = await Question.aggregate([
            { $match: { skill: skill } },
            { $sample: { size: 5 } }
        ]);

        if (questions.length < 5) {
            return res.status(404).json({ message: 'Not enough questions available for this skill.' });
        }

        // 3. Create QuizAttempt
        const attempt = new QuizAttempt({
            userId,
            skill,
            questionIds: questions.map(q => q._id),
            maxScore: questions.reduce((sum, q) => sum + (q.points || 10), 0)
        });
        await attempt.save();

        // 4. Update lastQuizAt
        user.lastQuizAt = Date.now();
        await user.save();

        // 5. Return questions WITHOUT correctIndex
        const sanitizedQuestions = questions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            points: q.points
        }));

        res.json({
            attemptId: attempt._id,
            questions: sanitizedQuestions
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start Boss Battle API (No Cooldown)
router.post('/boss-battle', checkAuth, async (req, res) => {
    try {
        const { skills } = req.body; // Array of skills boss has
        const userId = req.session.userId;

        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({ message: 'Boss skills required' });
        }

        // Pull 2 questions for each skill
        let allQuestions = [];
        for (const skill of skills) {
            const skillQS = await Question.aggregate([
                { $match: { skill: typeof skill === 'string' ? skill : skill.name } },
                { $sample: { size: 2 } }
            ]);
            allQuestions = [...allQuestions, ...skillQS];
        }

        if (allQuestions.length === 0) {
            return res.status(404).json({ message: 'No combat data found for this boss.' });
        }

        const attempt = new QuizAttempt({
            userId,
            skill: 'Boss Battle',
            questionIds: allQuestions.map(q => q._id),
            maxScore: allQuestions.reduce((sum, q) => sum + (q.points || 15), 0)
        });
        await attempt.save();

        const sanitized = allQuestions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            points: q.points || 15,
            skill: q.skill
        }));

        res.json({
            attemptId: attempt._id,
            questions: sanitized
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit Quiz API
router.post('/submit/:attemptId', checkAuth, async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { answers } = req.body; // Array of option indices
        const userId = req.session.userId;

        const attempt = await QuizAttempt.findById(attemptId);
        if (!attempt) return res.status(404).json({ message: 'Quiz attempt not found' });
        if (attempt.userId.toString() !== userId) return res.status(403).json({ message: 'Not your attempt' });
        if (attempt.locked) return res.status(400).json({ message: 'Quiz already submitted' });

        const submissionTime = Date.now();
        const timeTaken = (submissionTime - attempt.startedAt.getTime()) / 1000;

        // Anti-Cheat: Unrealistically fast (e.g., < 10 seconds for 5 questions)
        if (timeTaken < 10) {
            return res.status(400).json({ message: 'Neural Sync Anomaly: Submission too fast. Play fair, warrior.' });
        }

        const questions = await Question.find({ _id: { $in: attempt.questionIds } });

        // Match scoring logic
        let score = 0;
        attempt.questionIds.forEach((qId, idx) => {
            const question = questions.find(q => q._id.toString() === qId.toString());
            if (question && answers[idx] === question.correctIndex) {
                score += (question.points || 10);
            }
        });

        // Pass threshold 60%
        const passed = score >= (attempt.maxScore * 0.6);

        attempt.answers = answers;
        attempt.score = score;
        attempt.passed = passed;
        attempt.submittedAt = submissionTime;
        attempt.locked = true;
        await attempt.save();

        // Reward Logic
        const user = await User.findById(userId);
        user.stats.quizzesAttempted += 1;

        let rewardInfo = {};
        if (passed) {
            user.stats.quizzesPassed += 1;

            // skillPointsGain = score
            // xpGain = score * 2
            const rewards = {
                xp: score * 2,
                skillGains: [{
                    name: attempt.skill,
                    xp: score,
                    isQuiz: true,
                    accuracy: (score / attempt.maxScore) * 100,
                    timeTaken: timeTaken
                }]
            };

            const updatedUser = await updateUserProgress(userId, rewards);
            rewardInfo = {
                xpGain: score * 2,
                skillPointsGain: score,
                passed: true
            };
        } else {
            user.stats.totalFails += 1;
            await user.save();
            rewardInfo = { passed: false };
        }

        res.json({
            score,
            maxScore: attempt.maxScore,
            passed,
            rewards: rewardInfo,
            correctAnswers: questions.map(q => q.correctIndex) // Now safe to send after submission
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Quiz History
router.get('/history', checkAuth, async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Quiz Stats
router.get('/stats', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const stats = {
            totalAttempts: user.stats.quizzesAttempted,
            totalPassed: user.stats.quizzesPassed,
            totalFailed: user.stats.totalFails,
            averageScore: 0
        };

        const attempts = await QuizAttempt.find({ userId: req.session.userId, locked: true });
        if (attempts.length > 0) {
            const totalScore = attempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0);
            stats.averageScore = Math.round((totalScore / attempts.length) * 100);
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
