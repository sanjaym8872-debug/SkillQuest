const mongoose = require('mongoose');

const BalloonRunSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skill: { type: String, required: true },
    balloonsCount: { type: Number, default: 5 },
    altitude: { type: Number, default: 0 }, // 0 to 100
    score: { type: Number, default: 0 },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    currentIndex: { type: Number, default: 0 },
    currentQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    startedAt: { type: Date, default: Date.now },
    finished: { type: Boolean, default: false },
    status: { type: String, enum: ['flying', 'landed', 'crashed'], default: 'flying' }
}, { timestamps: true });

module.exports = mongoose.model('BalloonRun', BalloonRunSchema);
