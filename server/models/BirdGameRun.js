const mongoose = require('mongoose');

const BirdGameRunSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skill: { type: String, required: true },
    health: { type: Number, default: 100 },
    score: { type: Number, default: 0 },
    combo: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    fruitsCollected: { type: Number, default: 0 },
    bombsHit: { type: Number, default: 0 },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    currentIndex: { type: Number, default: 0 },
    currentQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    startedAt: { type: Date, default: Date.now },
    finished: { type: Boolean, default: false },
    lastEventAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('BirdGameRun', BirdGameRunSchema);
