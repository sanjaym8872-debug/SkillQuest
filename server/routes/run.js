const express = require('express');
const router = express.Router();
const GameRun = require('../models/GameRun');
const Question = require('../models/Question');
const User = require('../models/User');
const { updateUserProgress } = require('../utils/gameLogic');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

// Start Game Run API
router.post('/start/:skill', checkAuth, async (req, res) => {
    try {
        const { skill } = req.params;
        const userId = req.session.userId;

        // Select 20 Random Questions
        const questions = await Question.aggregate([
            { $match: { skill: skill } },
            { $sample: { size: 20 } }
        ]);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this skill.' });
        }

        const run = new GameRun({
            userId,
            skill,
            questionIds: questions.map(q => q._id),
            health: 100,
            speed: 10,
            distance: 0,
            score: 0,
            combo: 0
        });

        await run.save();

        // Return state with the first question (no correct index)
        const firstQuestion = questions[0];
        res.json({
            runId: run._id,
            state: {
                health: run.health,
                speed: run.speed,
                distance: run.distance,
                score: run.score,
                combo: run.combo,
                currentIndex: run.currentIndex,
                totalQuestions: questions.length
            },
            currentQuestion: {
                _id: firstQuestion._id,
                question: firstQuestion.question,
                options: firstQuestion.options,
                points: firstQuestion.points
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit Answer API
router.post('/answer/:runId', checkAuth, async (req, res) => {
    try {
        const { runId } = req.params;
        const { answerIndex } = req.body;
        const userId = req.session.userId;

        const run = await GameRun.findById(runId);
        if (!run) return res.status(404).json({ message: 'Game run not found' });
        if (run.finished) return res.status(400).json({ message: 'Run already finished' });
        if (run.userId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

        const currentQuestionId = run.questionIds[run.currentIndex];
        const question = await Question.findById(currentQuestionId);

        const isCorrect = answerIndex === question.correctIndex;

        // Adaptive Logic Tracking
        if (isCorrect) {
            run.consecutiveCorrect += 1;
            run.consecutiveWrong = 0;
            run.combo += 1;

            // Level Up Difficulty: 3 correct in a row
            if (run.consecutiveCorrect >= 3) {
                if (run.difficultyTier === 'Easy') run.difficultyTier = 'Medium';
                else if (run.difficultyTier === 'Medium') run.difficultyTier = 'Hard';
                run.consecutiveCorrect = 0; // Reset for next tier
            }

            const comboMultiplier = 1 + (run.combo * 0.15);
            const baseGain = question.points || 20;
            run.score += Math.round(baseGain * comboMultiplier);
            run.speed += 2;
            run.distance += run.speed;
        } else {
            run.consecutiveWrong += 1;
            run.consecutiveCorrect = 0;
            run.health -= 20;
            run.speed = Math.max(5, run.speed - 5);
            run.combo = 0;

            // Level Down Difficulty: 3 wrong in a row
            if (run.consecutiveWrong >= 3) {
                if (run.difficultyTier === 'Hard') run.difficultyTier = 'Medium';
                else if (run.difficultyTier === 'Medium') run.difficultyTier = 'Easy';
                run.consecutiveWrong = 0;
            }

            run.score = Math.max(0, run.score - 10);
        }

        // Log history
        run.history.push({
            questionId: currentQuestionId,
            providedAnswer: answerIndex,
            isCorrect: isCorrect
        });

        // Advance or End
        run.currentIndex += 1;

        let finished = false;
        let finishReason = '';

        if (run.health <= 0) {
            finished = true;
            run.health = 0;
            finishReason = 'CRITICAL_DAMAGE';
        } else if (run.currentIndex >= run.questionIds.length) {
            finished = true;
            finishReason = 'GOAL_REACHED';
        }

        if (finished) {
            run.finished = true;
            const rewards = {
                xp: run.score,
                skillGains: [{ name: run.skill, xp: run.score, isQuiz: true }]
            };
            await updateUserProgress(userId, rewards);
        }

        await run.save();

        // Get next question with Adaptive Selection (favors current difficultyTier)
        let nextQuestion = null;
        if (!finished) {
            // Strategic Injection: Pull a question matching current tier
            let nextMatched = await Question.findOne({
                skill: run.skill,
                difficulty: run.difficultyTier,
                _id: { $nin: run.questionIds } // Avoid immediate repeats in chain if possible
            });

            // Fallback to pre-generated queue if tier match is not found
            if (!nextMatched) {
                const nextQId = run.questionIds[run.currentIndex % run.questionIds.length];
                nextMatched = await Question.findById(nextQId);
            }

            nextQuestion = {
                _id: nextMatched._id,
                question: nextMatched.question,
                options: nextMatched.options,
                points: nextMatched.points
            };
        }

        res.json({
            isCorrect,
            correctIndex: question.correctIndex, // Show after answer
            state: {
                health: run.health,
                speed: run.speed,
                distance: run.distance,
                score: run.score,
                combo: run.combo,
                currentIndex: run.currentIndex,
                finished: run.finished
            },
            nextQuestion,
            finishReason
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Live State API
router.get('/state/:runId', checkAuth, async (req, res) => {
    try {
        const run = await GameRun.findById(req.params.runId);
        if (!run) return res.status(404).json({ message: 'Run not found' });
        res.json(run);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// End Run Early API
router.post('/end/:runId', checkAuth, async (req, res) => {
    try {
        const run = await GameRun.findById(req.params.runId);
        if (!run || run.finished) return res.status(400).json({ message: 'Invalid run' });

        run.finished = true;
        await run.save();

        res.json({ message: 'Run terminated', score: run.score });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
