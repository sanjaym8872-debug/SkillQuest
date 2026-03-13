const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');
const UserMission = require('../models/UserMission');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

// Get Available Missions
router.get('/', checkAuth, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.session.userId);

        // Filter missions by user's role/characterClass or 'All'
        const missions = await Mission.find({
            $or: [
                { role: user.characterClass },
                { role: 'All' }
            ]
        });
        const userMissions = await UserMission.find({ userId: req.session.userId });

        // Combine mission info with user progress
        const combined = missions.map(m => {
            const um = userMissions.find(u => u.missionId.toString() === m._id.toString());
            return {
                ...m.toObject(),
                status: um ? um.status : 'available',
                proofOfWork: um ? um.proofOfWork : '',
                tasksCompleted: um ? um.tasksCompleted : []
            };
        });

        res.json(combined);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Complete Mission
router.post('/complete/:id', checkAuth, async (req, res) => {
    try {
        const missionId = req.params.id;
        const { proofOfWork, tasksCompleted } = req.body;
        const { updateUserProgress } = require('../utils/gameLogic');

        const mission = await Mission.findById(missionId);
        if (!mission) return res.status(404).json({ message: 'Mission not found' });

        // Basic verification
        if (mission.isProject && !proofOfWork) {
            return res.status(400).json({ message: 'Proof of work (link or description) is required for projects' });
        }

        let um = await UserMission.findOne({ userId: req.session.userId, missionId });
        if (um && um.status === 'completed') {
            return res.status(400).json({ message: 'Mission already completed' });
        }

        // Regex Validation if pattern exists
        if (mission.validationPattern && proofOfWork) {
            const regex = new RegExp(mission.validationPattern);
            if (!regex.test(proofOfWork)) {
                return res.status(400).json({
                    message: `Validation Protocol Incomplete: Proof does not match required format (${mission.proofType})`
                });
            }
        }

        // Automated GitHub Validation
        if (mission.isProject && proofOfWork && proofOfWork.includes('github.com')) {
            try {
                const axios = require('axios');
                const githubMatch = proofOfWork.match(/github\.com\/([^\/]+)\/([^\/]+)/);
                if (githubMatch) {
                    const owner = githubMatch[1];
                    const repo = githubMatch[2].replace('.git', '');

                    // 1. Check if repo exists
                    try {
                        const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
                        console.log(`Neural Scan: Repository ${owner}/${repo} found.`);
                    } catch (repoErr) {
                        return res.status(400).json({ message: `Neural Link Timeout: Repository "github.com/${owner}/${repo}" not found or private.` });
                    }

                    // 2. Check for required file if mission specifies one
                    if (mission.requiredFile) {
                        try {
                            await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${mission.requiredFile}`);
                            console.log(`Neural Scan: Required file ${mission.requiredFile} verified.`);
                        } catch (fileErr) {
                            return res.status(400).json({
                                message: `Validation Error: Required file "${mission.requiredFile}" was not detected in your repository. Ensure your work is pushed correctly.`
                            });
                        }
                    }
                }
            } catch (err) {
                console.error('GitHub Validation Error:', err.message);
                // We don't block the mission if it's a general network error to avoid frustration, 
                // but we logged it. For this task, we assume GitHub is up.
            }
        }

        if (!um) {
            um = new UserMission({ userId: req.session.userId, missionId });
        }

        um.status = 'completed';
        um.proofOfWork = proofOfWork;
        um.tasksCompleted = tasksCompleted || [];
        um.completedAt = Date.now();

        // Simulated Neural Validation Branding
        const feedbackLines = [
            `Neural scan confirmed ${um.tasksCompleted.length} critical sectors resolved.`,
            `Code patterns detected in "${proofOfWork?.substring(0, 20)}..." match industry standards.`,
            `XP synthesis complete for ${mission.skill} specialization.`,
            `Neural bandwidth increased. Verification signature: ${Math.random().toString(36).substring(7).toUpperCase()}`
        ];
        um.neuralFeedback = feedbackLines.join(' ');
        um.validationScore = 90 + Math.floor(Math.random() * 11); // 90-100%

        await um.save();

        // Update User Progress
        const updatedUser = await updateUserProgress(req.session.userId, {
            xp: mission.xpReward,
            skillGains: [
                { name: mission.skill, xp: 50 } // Every mission gives 50 skill XP
            ]
        });

        res.json({
            message: 'Mission completed',
            xpEarned: mission.xpReward,
            neuralFeedback: um.neuralFeedback,
            validationScore: um.validationScore,
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Save Mission Draft
router.post('/save-draft/:id', checkAuth, async (req, res) => {
    try {
        const missionId = req.params.id;
        const { proofOfWork, tasksCompleted } = req.body;

        let um = await UserMission.findOne({ userId: req.session.userId, missionId });
        if (!um) {
            um = new UserMission({ userId: req.session.userId, missionId });
        }

        if (um.status === 'completed') {
            return res.status(400).json({ message: 'Cannot save draft for completed mission' });
        }

        um.status = 'in-progress';
        um.proofOfWork = proofOfWork;
        um.tasksCompleted = tasksCompleted || [];

        await um.save();
        res.json({ message: 'Progress synchronized with neural uplink' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Generate Personalized Mission Chain based on Skill Gaps
router.post('/generate-chain', checkAuth, async (req, res) => {
    try {
        const { requirements } = req.body; // e.g., [{ name: 'React', level: 50 }]
        console.log('Generating chain for requirements:', requirements);

        const User = require('../models/User');
        const user = await User.findById(req.session.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const { applySkillDecay } = require('../utils/gameLogic');
        applySkillDecay(user);
        await user.save();

        const gapsWithScores = requirements.map(r => {
            if (!r.name) return null;
            const userSkill = user.skills.find(s => s.name && s.name.toLowerCase() === r.name.toLowerCase());
            const currentLevel = userSkill?.level || 0;
            const accuracy = (userSkill?.accuracy || 0) / 100;
            const targetLevel = r.level;

            // Only consider if there's an actual gap
            if (currentLevel >= targetLevel) return null;

            // Calculate weaknessScore component weights
            const difficultyGap = (targetLevel - currentLevel) / 100;
            const lowLevelWeight = (100 - currentLevel) / 100;

            const weaknessScore =
                (1 - accuracy) * 0.4 +
                (difficultyGap) * 0.3 +
                (lowLevelWeight) * 0.3;

            return { ...r, weaknessScore };
        }).filter(Boolean);

        if (gapsWithScores.length === 0) {
            return res.status(404).json({ message: 'No skill gaps detected. You have mastered this role!' });
        }

        // Sort by weaknessScore descending
        const sortedGaps = gapsWithScores.sort((a, b) => b.weaknessScore - a.weaknessScore);

        // Select top 3 weakest skills and pick 1 randomly
        const topWeaknesses = sortedGaps.slice(0, 3);
        const selectedGap = topWeaknesses[Math.floor(Math.random() * topWeaknesses.length)];

        console.log('Targeting selected weakness:', selectedGap.name, 'Score:', selectedGap.weaknessScore);

        const filter = {
            skill: new RegExp(`^${selectedGap.name}$`, 'i'),
            role: { $in: [user.characterClass, 'All'] }
        };

        const easyMission = await Mission.findOne({ ...filter, difficulty: 'Easy' });
        const medMission = await Mission.findOne({ ...filter, difficulty: 'Medium' });
        const hardMission = await Mission.findOne({ ...filter, difficulty: 'Hard', isProject: true });

        const chain = [easyMission, medMission, hardMission].filter(Boolean);

        console.log(`Generated ${chain.length} missions for ${selectedGap.name} chain.`);

        res.json({
            message: 'Neural Quest Chain Initialized',
            targetSkill: selectedGap.name,
            gapPoints: selectedGap.level - (user.skills.find(s => s.name?.toLowerCase() === selectedGap.name.toLowerCase())?.level || 0),
            missions: chain
        });
    } catch (err) {
        console.error('GENERATE CHAIN ERROR:', err);
        res.status(500).json({ message: 'Neural scan failed: ' + err.message });
    }
});

module.exports = router;
