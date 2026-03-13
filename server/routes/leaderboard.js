const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const { characterClass } = req.query;
        let query = {};

        if (characterClass && characterClass !== 'All') {
            query.characterClass = characterClass;
        }

        const topUsers = await User.find(query)
            .sort({ xp: -1 })
            .limit(20) // Increased limit to 20 for better visibility in categories
            .select('username characterClass xp level rank avatar');
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
