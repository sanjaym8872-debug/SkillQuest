const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Icon identifier or URL
    requirement: {
        type: { type: String, enum: ['level', 'skill_count', 'mission_count', 'streak'] },
        value: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
