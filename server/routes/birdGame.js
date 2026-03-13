const express = require('express');
const router = express.Router();
const BirdGameRun = require('../models/BirdGameRun');
const Question = require('../models/Question');
const User = require('../models/User');
const { updateUserProgress } = require('../utils/gameLogic');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

// POST /birdgame/start/:skill
router.post('/start/:skill', checkAuth, async (req, res) => {
    try {
        const { skill } = req.params;
        const userId = req.session.userId;

        // Preload 20 questions
        const questions = await Question.aggregate([
            { $match: { skill: skill } },
            { $sample: { size: 20 } }
        ]);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'Shield integrity failure: No data found for this skill.' });
        }

        const run = new BirdGameRun({
            userId,
            skill,
            health: 100,
            score: 0,
            combo: 0,
            questionIds: questions.map(q => q._id)
        });

        await run.save();

        res.json({
            runId: run._id,
            state: {
                health: run.health,
                score: run.score,
                combo: run.combo,
                distance: run.distance
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /birdgame/event/:runId
router.post('/event/:runId', checkAuth, async (req, res) => {
    try {
        const { runId } = req.params;
        const run = await BirdGameRun.findById(runId);

        if (!run || run.finished) return res.status(400).json({ message: 'Anomaly: Run inactive.' });

        if (run.currentIndex >= run.questionIds.length) {
            run.finished = true;
            await run.save();
            return res.json({ finished: true });
        }

        const questionId = run.questionIds[run.currentIndex];
        const question = await Question.findById(questionId);

        run.currentQuestionId = questionId;
        run.lastEventAt = Date.now();
        await run.save();

        res.json({
            question: {
                _id: question._id,
                question: question.question,
                options: question.options,
                points: question.points
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /birdgame/answer/:runId
router.post('/answer/:runId', checkAuth, async (req, res) => {
    try {
        const { runId } = req.params;
        const { selectedIndex, objectType } = req.body; // fruit or bomb
        const userId = req.session.userId;

        const run = await BirdGameRun.findById(runId);
        if (!run || run.finished) return res.status(400).json({ message: 'Run terminated.' });

        // Timing validation (10s limit)
        const timeTaken = (Date.now() - run.lastEventAt.getTime()) / 1000;
        if (timeTaken > 12) { // 10s + 2s buffer
            return res.status(400).json({ message: 'Temporal sync lost. Too slow!' });
        }

        const question = await Question.findById(run.currentQuestionId);
        const isCorrect = selectedIndex === question.correctIndex;

        let effect = { screenShake: false };

        if (isCorrect) {
            run.combo += 1;
            if (objectType === 'fruit') {
                run.score += question.points || 20;
                run.health = Math.min(100, run.health + 5);
                run.fruitsCollected += 1;
            } else {
                run.score += (question.points || 20) * 2;
                run.combo += 1; // Extra combo for bombs
                run.bombsHit += 1; // Technically successfully defused/passed
            }
        } else {
            run.combo = 0;
            if (objectType === 'bomb') {
                run.health -= 20;
                run.bombsHit += 1;
                effect.screenShake = true;
            } else {
                // Missed fruit
            }
        }

        run.currentIndex += 1;

        if (run.health <= 0 || run.currentIndex >= run.questionIds.length) {
            run.finished = true;
            // Reward Integration
            const rewards = {
                xp: run.score,
                skillGains: [{ name: run.skill, xp: run.score, isQuiz: true }]
            };
            await updateUserProgress(userId, rewards);
        }

        await run.save();

        res.json({
            isCorrect,
            correctIndex: question.correctIndex,
            state: {
                health: run.health,
                score: run.score,
                combo: run.combo,
                distance: run.distance,
                finished: run.finished
            },
            effect
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /birdgame/state/:runId
router.get('/state/:runId', checkAuth, async (req, res) => {
    try {
        const run = await BirdGameRun.findById(req.params.runId);
        res.json(run);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
