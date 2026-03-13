const User = require('../models/User');
const Badge = require('../models/Badge');
const UserMission = require('../models/UserMission');

/**
 * Shared logic to update user progress, handle level-ups, and award badges.
 * @param {string} userId 
 * @param {object} rewards { xp, skillGains: [{ name, xp }] }
 */
async function updateUserProgress(userId, rewards) {
    const user = await User.findById(userId);
    if (!user) return null;

    const now = new Date();
    const lastActive = new Date(user.lastActive || now);
    const diffInDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

    // 1. UPDATE NEURAL SYNC (The Innovative Multiplier)
    // If played consecutive days, sync increases. If missed days, it decays.
    if (diffInDays === 0) {
        // Already active today, slight boost for multiple activities
        user.syncRate = Math.min(2.5, user.syncRate + 0.01);
    } else if (diffInDays === 1) {
        // Daily login/activity streak
        user.syncRate = Math.min(2.5, user.syncRate + 0.15);
        user.streak += 1;
    } else {
        // Negative decay for inactivity
        const decay = Math.max(0.2, (diffInDays - 1) * 0.1);
        user.syncRate = Math.max(0.5, user.syncRate - decay);
        user.streak = 1; // Reset streak
    }
    user.lastActive = now;

    // 2. APPLY XP (With Sync Multiplier)
    if (rewards.xp) {
        const boostedXp = Math.round(rewards.xp * user.syncRate);
        user.xp += boostedXp;
    }

    // 2b. Daily Challenge Logic
    if (rewards.dailyStepId) {
        const today = now.toDateString();
        const lastDate = new Date(user.dailyProgress.date).toDateString();
        if (today !== lastDate) {
            user.dailyProgress.date = now;
            user.dailyProgress.completedSteps = [];
        }
        if (!user.dailyProgress.completedSteps.includes(rewards.dailyStepId)) {
            user.dailyProgress.completedSteps.push(rewards.dailyStepId);
        }
    }

    // 3. MASTER LEVELING ENGINE (Quadratic Curve - Level 1-100+)
    // Formula: XP = 500 * L * (L - 1) / 2
    // Inverse: L = (1 + sqrt(1 + 8 * XP / 500)) / 2
    const calculateLevel = (xp) => {
        if (xp <= 0) return 1;
        const level = (1 + Math.sqrt(1 + 8 * xp / 500)) / 2;
        return Math.floor(level);
    };

    const oldLevel = user.level;
    user.level = calculateLevel(user.xp);

    // Evolution Tiers (Synced to Lvl 100+ System)
    if (user.level >= 100) user.evolutionTier = 'Singularity';
    else if (user.level >= 50) user.evolutionTier = 'Code God';
    else if (user.level >= 25) user.evolutionTier = 'Neural Architect';
    else if (user.level >= 10) user.evolutionTier = 'Cyber-Adept';
    else user.evolutionTier = 'Novice';

    // Ranks mapping (Every 10 levels)
    const ranks = [
        'Skill Explorer', 'Circuit Runner', 'Buffer Breaker', 'Logic Weaver',
        'Data Wraith', 'System Oracle', 'Void Architect', 'Binary Deity',
        'Neural Overlord', 'Dimensional Scribe', 'The Absolute'
    ];
    user.rank = ranks[Math.min(ranks.length - 1, Math.floor(user.level / 10))];

    // 4. PROPORTIONAL SKILL GAINS
    if (rewards.skillGains && Array.isArray(rewards.skillGains)) {
        rewards.skillGains.forEach(gain => {
            const skill = user.skills.find(s => s.name.toLowerCase() === gain.name.toLowerCase());
            // Innovation: If no specific skill XP is given, derive it from the mission's total XP
            let skillXpReward = gain.xp;
            if (!gain.isQuiz && rewards.xp) {
                // Skills gain 20% of total mission XP as mastery points
                skillXpReward = Math.max(gain.xp, Math.round(rewards.xp * 0.2));
            }

            if (skill) {
                // Update practice timestamp
                skill.lastPracticedAt = now;

                if (gain.isQuiz) {
                    skill.skillPoints += skillXpReward;
                    // Sync the level based on points (40 pts/level)
                    skill.level = Math.max(skill.level, Math.floor(skill.skillPoints / 40));

                    // Update accuracy and time if provided (Simulating totalCorrect/totalAttempted via weighted rolling average)
                    if (gain.accuracy !== undefined) {
                        skill.accuracy = Math.round((skill.accuracy * 0.8) + (gain.accuracy * 0.2));
                    }
                    if (gain.timeTaken !== undefined) {
                        skill.avgAnswerTime = Math.round((skill.avgAnswerTime * 0.8) + (gain.timeTaken * 0.2));
                    }
                } else {
                    skill.xp += skillXpReward;
                    // Also contribute mission mastery to skillPoints so the graph remains fluid
                    skill.skillPoints += Math.round(skillXpReward / 2.5); // Normalize mission XP to match quiz point weight

                    const levelsGained = Math.floor(skill.xp / 100);
                    if (levelsGained > 0) {
                        skill.level = Math.min(100, skill.level + levelsGained);
                        skill.xp = skill.xp % 100;
                    }
                }
            } else {
                user.skills.push({
                    name: gain.name,
                    level: 1,
                    xp: skillXpReward % 100,
                    skillPoints: gain.isQuiz ? skillXpReward : Math.round(skillXpReward / 2.5),
                    lastPracticedAt: now,
                    accuracy: gain.accuracy || 0,
                    avgAnswerTime: gain.timeTaken || 0
                });
            }
        });
    }

    // 5. SMART BADGE ENGINE
    const completedMissionsCount = await UserMission.countDocuments({ userId, status: 'completed' });
    const badgeMap = [
        { name: 'First Blood', check: completedMissionsCount >= 1 },
        { name: 'Five Leaf Clover', check: user.level >= 5 },
        { name: 'Social Ninja', check: user.streak >= 3 },
        { name: 'Neural Overload', check: user.syncRate >= 2.0 },
        { name: 'System Architect', check: user.evolutionTier === 'Neural Architect' },
        { name: 'Class Master', check: user.level >= 10 }
    ];

    const currentBadgeIds = user.badges.map(b => b.badgeId.toString());
    const allBadgeDefs = await Badge.find();

    for (const b of badgeMap) {
        const def = allBadgeDefs.find(d => d.name === b.name);
        if (def && b.check && !currentBadgeIds.includes(def._id.toString())) {
            user.badges.push({ badgeId: def._id, earnedAt: now });
        }
    }

    await user.save();
    return user;
}

/**
 * Apply skill decay if not practiced in 14+ days
 * @param {object} user 
 */
function applySkillDecay(user) {
    const now = new Date();
    let totalDecayApplied = 0;

    user.skills.forEach(skill => {
        const lastPracticed = new Date(skill.lastPracticedAt || user.updatedAt || now);
        const diffInDays = Math.floor((now - lastPracticed) / (1000 * 60 * 60 * 24));

        if (diffInDays >= 14) {
            // Apply 3% decay to level
            const decayAmount = skill.level * 0.03;
            skill.level = Math.max(0, skill.level - decayAmount);

            // Also decay skillPoints to keep them in sync
            skill.skillPoints = Math.max(0, skill.skillPoints - (skill.skillPoints * 0.03));

            totalDecayApplied += 0.01; // Cumulative sync penalty
        }
    });

    if (totalDecayApplied > 0) {
        user.syncRate = Math.max(0.5, user.syncRate - Math.min(0.05, totalDecayApplied));
    }

    return user;
}

module.exports = { updateUserProgress, applySkillDecay };
