const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    skill: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true }, // 0 to 3
    difficulty: { type: Number, enum: [1, 2, 3], default: 1 },
    points: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
