SKILLQUEST

Level up your real-world skills by playing games.

SkillQuest is a full-stack RPG platform that turns career growth into a game. We built this to help developers bridge the gap between I know the basics and I am ready for the industry using actual game mechanics like XP, classes, and boss battles.

WHAT IS INSIDE

Skill Check The Roadmap
We use radar charts to show you exactly where your skills are lacking compared to what the industry actually wants. You can follow a roadmap through Easy, Medium, and Hard missions to fill those gaps.

Choose Your Class
Pick a path that fits your vibe:
Frontend Warrior: Focus on UI/UX and making things look clean.
Data Mage: Deep dive into data, logic, and algorithms.
Cyber Ninja: Speed, security, and backend mastery.

The Arcade
Need to grind some XP? Jump into the arcade:
Bird Game: Test your focus.
Balloon Survival: High-pressure precision training.
Terminal Velocity: The faster you type or react, the more you earn.
Daily Spikes: Quick daily tasks to keep your streak alive.

Boss Battles
Once you have leveled up enough, you will face Boss Battles. These are the final tests of everything you have learned in a mission chain. Win these to prove you have actually mastered the skill.

Consistency is Key
Daily Streaks: Do not break the chain! Keep showing up to earn XP multipliers.
Skill Decay: If you ignore a skill for more than 2 weeks, your level will start to drop. Keep practicing to stay sharp.

THE TECH SIDE

Frontend: React Vite Tailwind CSS Framer Motion for the smooth animations.
Backend: Node.js and Express.
Database: MongoDB Atlas for storing your progress and sessions.
Visuals: Recharts for the skill graphs and Lucide React for icons.

HOW TO RUN IT LOCALLY

1. Requirements
You will need Node.js installed and a MongoDB Atlas account or a local Mongo instance.

2. Setup
Clone the repo and install the dependencies for both the client and the server:

Install root tools
npm install

Install frontend stuff
cd client && npm install

Install backend stuff
cd server && npm install

3. Environment Variables
Create a .env file in the server folder and add these:

MONGO_URI=your_mongodb_uri_here
SESSION_SECRET=make_up_a_secret_key
CLIENT_URL=http://localhost:5173
PORT=5000

4. GO
Go back to the root folder and run:

npm run dev

This will boot up both the frontend and the backend at the same time.

A QUICK NOTE
We have kept the game logic pretty locked down so people cannot just cheat their way to Level 100. Feel free to mess around with the UI, but the core engine is where the magic happens.

Have fun leveling up!
