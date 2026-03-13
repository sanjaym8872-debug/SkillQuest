const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  characterClass: {
    type: String,
    enum: ['Frontend Warrior', 'Data Mage', 'Cloud Engineer', 'Cyber Ninja', 'AI Architect', 'DevOps Paladin', 'UI/UX Sorcerer', 'Mobile Monk', 'Blockchain Bard', 'QA Shadow', 'Data Warden', 'Backend Titan', 'Unassigned'],
    default: 'Unassigned'
  },
  avatar: { type: String, default: 'default_avatar.png' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: String, default: 'Skill Explorer' },
  skills: [
    {
      name: { type: String, required: true },
      level: { type: Number, default: 0 }, // 0 to 100
      xp: { type: Number, default: 0 },
      skillPoints: { type: Number, default: 0 }, // Aggregated points for level mapping
      accuracy: { type: Number, default: 0 },
      avgAnswerTime: { type: Number, default: 0 },
      lastPracticedAt: { type: Date, default: Date.now }
    }
  ],
  badges: [
    {
      badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
      earnedAt: { type: Date, default: Date.now }
    }
  ],
  stats: {
    quizzesAttempted: { type: Number, default: 0 },
    quizzesPassed: { type: Number, default: 0 },
    totalFails: { type: Number, default: 0 }
  },
  lastQuizAt: { type: Date },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  syncRate: { type: Number, default: 1.0 }, // XP multiplier based on consistency (0.5 to 2.5)
  evolutionTier: {
    type: String,
    enum: ['Novice', 'Cyber-Adept', 'Neural Architect', 'Code God', 'Singularity'],
    default: 'Novice'
  },
  dailyProgress: {
    date: { type: Date, default: Date.now },
    completedSteps: [{ type: Number }], // IDs of completed daily tasks
    lastSyncAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
