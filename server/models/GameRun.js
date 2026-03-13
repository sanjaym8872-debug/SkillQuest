const mongoose = require('mongoose');

const GameRunSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skill: { type: String, required: true },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }],
    currentIndex: { type: Number, default: 0 },
    health: { type: Number, default: 100 },
    speed: { type: Number, default: 10 },
    distance: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    combo: { type: Number, default: 0 },
    difficultyTier: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    consecutiveCorrect: { type: Number, default: 0 },
    consecutiveWrong: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    finished: { type: Boolean, default: false },
    history: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        providedAnswer: { type: Number },
        isCorrect: { type: Boolean },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('GameRun', GameRunSchema);
