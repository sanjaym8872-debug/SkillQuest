const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const missionRoutes = require('./routes/missions');
const leaderboardRoutes = require('./routes/leaderboard');
const quizRoutes = require('./routes/quiz');
const runRoutes = require('./routes/run');
const birdGameRoutes = require('./routes/birdGame');
const skillPopRoutes = require('./routes/skillPop');
const balloonRoutes = require('./routes/balloon');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sessions
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET || 'skill_quest_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/run', runRoutes);
app.use('/api/birdgame', birdGameRoutes);
app.use('/api/skillpop', skillPopRoutes);
app.use('/api/balloon', balloonRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.get('/', (req, res) => {
    res.send('Skill Quest RPG API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
