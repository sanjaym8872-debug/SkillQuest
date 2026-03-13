const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { updateUserProgress } = require('../utils/gameLogic');

const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

const CLASS_SKILLS = {
    'Frontend Warrior': ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Tailwind', 'Next.js', 'Redux'],
    'Data Mage': ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Deep Learning', 'Statistics', 'Spark', 'Tableau'],
    'Cloud Engineer': ['Cloud', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Ansible', 'Azure'],
    'Cyber Ninja': ['Cyber', 'Networking', 'Encryption', 'Pentesting', 'Linux', 'Wireshark', 'Metasploit', 'Firewall'],
    'AI Architect': ['LLMs', 'Neural Networks', 'PyTorch', 'OpenAI API', 'LangChain', 'Vector DBs', 'TensorFlow', 'HuggingFace'],
    'DevOps Paladin': ['SRE', 'Prometheus', 'Grafana', 'ELK Stack', 'GitLab CI', 'ArgoCD', 'Nginx', 'Helm'],
    'UI/UX Sorcerer': ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Color Theory', 'Typography', 'Webflow', 'A/B Testing'],
    'Mobile Monk': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Firebase', 'Mobile UX', 'App Store'],
    'Blockchain Bard': ['Solidity', 'Ethereum', 'Web3.js', 'Ethers.js', 'Hardhat', 'IPFS', 'DeFi', 'NFTs'],
    'QA Shadow': ['Jest', 'Cypress', 'Selenium', 'Playwright', 'Bug Hunting', 'Performance', 'Postman', 'CI Testing'],
    'Data Warden': ['Data Governance', 'Airflow', 'Snowflake', 'Data Privacy', 'ETL', 'Databricks', 'PostgreSQL', 'Data Modeling'],
    'Backend Titan': ['Node.js', 'Go', 'Microservices', 'System Design', 'GraphQL', 'Redis', 'Kafka', 'PostgreSQL']
};

// Update Character Class
router.post('/character', checkAuth, async (req, res) => {
    try {
        const { characterClass } = req.body;
        const user = await User.findById(req.session.userId);
        user.characterClass = characterClass;

        if (CLASS_SKILLS[characterClass]) {
            user.skills = CLASS_SKILLS[characterClass].map(name => ({ name, level: 0, xp: 0, skillPoints: 0 })); // Start from zero
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Progress (Daily Challenges)
router.post('/progress', checkAuth, async (req, res) => {
    try {
        const { xpGain, skillName, skillXpGain } = req.body;
        const user = await User.findById(req.session.userId);

        const rewards = {
            xp: xpGain,
            skillGains: skillName ? [{ name: skillName, xp: skillXpGain }] : []
        };

        const updatedUser = await updateUserProgress(req.session.userId, rewards);
        res.json(updatedUser);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Complete Daily Spike Challenge
router.post('/complete-daily', checkAuth, async (req, res) => {
    try {
        const { stepId, xp } = req.body;
        const { updateUserProgress } = require('../utils/gameLogic');

        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Anti-cheat: Check if already completed today
        if (user.dailyProgress.completedSteps.includes(stepId)) {
            return res.status(400).json({ message: 'Neural Spike already recorded for this cycle.' });
        }

        // Determine skill gains from daily task (Dynamic based on Character Class)
        const relevantSkills = CLASS_SKILLS[user.characterClass] || [];
        const skillGains = relevantSkills.map(s => ({
            name: s,
            xp: Math.round(xp / 2), // Daily spike gives half XP as direct skill mastery/points
            isQuiz: true
        }));

        const updatedUser = await updateUserProgress(req.session.userId, {
            xp: xp,
            dailyStepId: stepId,
            skillGains
        });

        res.json({
            message: 'Neural Spike Completed!',
            xpEarned: xp,
            user: updatedUser
        });
    } catch (err) {
        console.error('Daily Spike Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Skill Analysis Report
router.get('/analysis', checkAuth, async (req, res) => {
    try {
        const UserMission = require('../models/UserMission');

        const completedMissions = await UserMission.find({
            userId: req.session.userId,
            status: 'completed'
        }).populate('missionId');

        if (completedMissions.length < 10) {
            return res.json({
                available: false,
                message: `Neural Link insufficient. Complete ${10 - completedMissions.length} more missions for a detailed Skill Analysis.`,
                count: completedMissions.length
            });
        }

        // 1. Calculate stats per skill
        const skillStats = {};
        let totalScore = 0;

        completedMissions.forEach(um => {
            if (!um.missionId) return;
            const skill = um.missionId.skill;
            if (!skillStats[skill]) {
                skillStats[skill] = { totalScore: 0, count: 0 };
            }
            skillStats[skill].totalScore += um.validationScore || 100;
            skillStats[skill].count += 1;
            totalScore += um.validationScore || 100;
        });

        const skillAverages = Object.keys(skillStats).map(name => ({
            name,
            avg: skillStats[name].totalScore / skillStats[name].count
        }));

        if (skillAverages.length === 0) {
            return res.json({ available: false, message: "No skill data available for analysis." });
        }

        // 2. Strongest & Weakest
        const strongest = skillAverages.reduce((prev, current) => (prev.avg > current.avg) ? prev : current);
        const weakest = skillAverages.reduce((prev, current) => (prev.avg < current.avg) ? prev : current);

        // 3. Overall Accuracy
        const accuracy = totalScore / completedMissions.length;

        // 4. Recommended Focus (largest gap to mastery)
        const user = await User.findById(req.session.userId);
        let focusSkill = 'None';
        let maxGap = -1;

        if (user.skills && user.skills.length > 0) {
            user.skills.forEach(s => {
                const gap = 100 - s.level;
                if (gap > maxGap) {
                    maxGap = gap;
                    focusSkill = s.name;
                }
            });
        }

        res.json({
            available: true,
            strongestSkill: strongest.name,
            weakestSkill: weakest.name,
            overallAccuracy: Math.round(accuracy),
            recommendedFocus: focusSkill,
            milestone: Math.floor(completedMissions.length / 10),
            totalMissions: completedMissions.length
        });

    } catch (err) {
        console.error('Analysis Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Skill Gap Analysis (Immediate)
router.get('/skill-gap', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { SKILL_TARGETS } = require('../utils/skillTargets');
        const targets = SKILL_TARGETS[user.characterClass] || [];

        const report = targets.map(target => {
            const userSkill = user.skills.find(s => s.name.toLowerCase() === target.name.toLowerCase());
            const currentLevel = userSkill ? userSkill.level : 0;
            const targetLevel = target.level;
            const gap = targetLevel - currentLevel;
            const gapPercentage = (gap / targetLevel) * 100;

            let severity = "Minor";
            if (currentLevel === 0) severity = "Pending";
            else if (gap <= 0) severity = "Mastered";
            else if (gapPercentage > 30) severity = "Critical";
            else if (gapPercentage >= 10) severity = "Moderate";
            else severity = "Stable";

            return {
                name: target.name,
                currentLevel: Number(currentLevel.toFixed(1)),
                targetLevel,
                gap: Number(Math.max(0, gap).toFixed(1)),
                gapPercentage: Math.max(0, gapPercentage).toFixed(2),
                severity
            };
        });

        res.json({
            characterClass: user.characterClass,
            report
        });
    } catch (err) {
        console.error('Skill Gap Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Boss Victory Reward
router.post('/boss-victory', checkAuth, async (req, res) => {
    try {
        const { bossId, bossTitle } = req.body;
        const { updateUserProgress } = require('../utils/gameLogic');

        // Award 5000 XP for boss victory
        const rewards = {
            xp: 5000,
            skillGains: []
        };

        const updatedUser = await updateUserProgress(req.session.userId, rewards);
        res.json({ message: `Victory over ${bossTitle}!`, user: updatedUser });
    } catch (err) {
        console.error('Boss Victory Error:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
