const express = require('express');
const router = express.Router();
const BalloonRun = require('../models/BalloonRun');
const Question = require('../models/Question');
const { updateUserProgress } = require('../utils/gameLogic');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

// POST /api/balloon/start/:skill
router.post('/start/:skill', checkAuth, async (req, res) => {
    try {
        const { skill } = req.params;
        const userId = req.session.userId;

        const questions = await Question.aggregate([
            { $match: { skill: new RegExp(`^${skill}$`, 'i') } },
            { $sample: { size: 10 } }
        ]);

        if (questions.length === 0) {
            const fallback = await Question.aggregate([{ $sample: { size: 10 } }]);
            questions.push(...fallback);
        }

        const run = new BalloonRun({
            userId,
            skill,
            balloonsCount: 5,
            altitude: 0,
            questionIds: questions.map(q => q._id)
        });

        await run.save();

        res.json({
            runId: run._id,
            state: {
                balloonsCount: run.balloonsCount,
                altitude: run.altitude,
                status: run.status
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/balloon/question/:runId
router.get('/question/:runId', checkAuth, async (req, res) => {
    try {
        const { runId } = req.params;
        const run = await BalloonRun.findById(runId);

        if (!run || run.finished) return res.status(400).json({ message: 'Link collapsed.' });

        if (run.currentIndex >= run.questionIds.length) {
            run.finished = true;
            run.status = run.balloonsCount > 0 ? 'landed' : 'crashed';
            await run.save();
            return res.json({ finished: true });
        }

        const question = await Question.findById(run.questionIds[run.currentIndex]);
        run.currentQuestionId = question._id;
        await run.save();

        res.json({
            question: {
                _id: question._id,
                text: question.question,
                options: question.options
            },
            state: {
                balloonsCount: run.balloonsCount,
                altitude: run.altitude
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/balloon/answer/:runId
router.post('/answer/:runId', checkAuth, async (req, res) => {
    try {
        const { runId } = req.params;
        const { selectedIndex } = req.body;
        const userId = req.session.userId;

        const run = await BalloonRun.findById(runId);
        if (!run || run.finished) return res.status(400).json({ message: 'Session archived.' });

        const question = await Question.findById(run.currentQuestionId);
        const isCorrect = selectedIndex === question.correctIndex;

        if (isCorrect) {
            run.score += 20;
            run.altitude = Math.min(100, run.altitude + 15);
        } else {
            run.balloonsCount -= 1;
            run.altitude = Math.max(0, run.altitude - 5);
        }

        run.currentIndex += 1;

        if (run.balloonsCount <= 0 || run.currentIndex >= run.questionIds.length) {
            run.finished = true;
            run.status = (run.balloonsCount <= 0) ? 'crashed' : 'landed';

            // Reward calculation
            const xpReward = run.status === 'landed' ? run.score + 100 : Math.max(0, run.score);
            if (xpReward > 0) {
                await updateUserProgress(userId, {
                    xp: xpReward,
                    skillGains: [{ name: run.skill, xp: xpReward, isQuiz: true }]
                });
            }
        }

        await run.save();

        res.json({
            isCorrect,
            correctIndex: question.correctIndex,
            state: {
                balloonsCount: run.balloonsCount,
                altitude: run.altitude,
                status: run.status,
                finished: run.finished
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
