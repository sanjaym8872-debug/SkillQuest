const mongoose = require('mongoose');

const UserMissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    status: { type: String, enum: ['locked', 'available', 'in-progress', 'completed'], default: 'available' },
    proofOfWork: { type: String },
    tasksCompleted: [{ type: String }],
    completedAt: { type: Date },
    neuralFeedback: { type: String }, // AI-style feedback on submission
    validationScore: { type: Number, default: 100 } // Simulated confidence score
}, { timestamps: true });

module.exports = mongoose.model('UserMission', UserMissionSchema);
