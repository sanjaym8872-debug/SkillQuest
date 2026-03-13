const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skill: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    xpReward: { type: Number, required: true },
    estimatedTime: { type: String }, // e.g., "2 hours"
    tasks: [{ type: String }],
    resourceLink: { type: String }, // Backwards compatibility
    briefing: { type: String },    // Long-form instructions/materials
    docs: [{                         // External learning resources
        label: String,
        url: String
    }],
    intel: {                         // Simulated 'scan' data for immersion
        securityLevel: { type: String, default: 'Standard' },
        encryption: { type: String, default: 'AES-256' }
    },
    proofType: { type: String, enum: ['URL', 'Text', 'Code', 'Any'], default: 'Any' },
    validationPattern: { type: String }, // Regex string for client/server validation
    requiredFile: { type: String },      // e.g., 'Dockerfile' or 'package.json' for automated validation
    bonusObjectives: [{                  // Extra tasks for bonus XP
        text: String,
        xpBonus: Number
    }],
    isProject: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['Frontend Warrior', 'Data Mage', 'Cloud Engineer', 'Cyber Ninja', 'AI Architect', 'DevOps Paladin', 'UI/UX Sorcerer', 'Mobile Monk', 'Blockchain Bard', 'QA Shadow', 'Data Warden', 'Backend Titan', 'All'],
        default: 'All'
    }
}, { timestamps: true });

module.exports = mongoose.model('Mission', MissionSchema);
