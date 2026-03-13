const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skill: { type: String, required: true },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }],
    answers: [{ type: Number }], // Index of selected option
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    locked: { type: Boolean, default: false } // Prevent re-submission
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
