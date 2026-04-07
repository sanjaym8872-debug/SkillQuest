DATABASE FLOW AND ARCHITECTURE OVERVIEW

This document explains how data moves through SkillQuest and how our MongoDB Atlas database is structured to handle everything from user profiles to game sessions.

VISUAL FLOW MAP

USER LOGIN
    |
    V
RETRIEVE USER PROFILE
    | (Includes skills array, XP, and sync rates)
    V
DASHBOARD AND ROADMAP
    | (Map skill data to radar charts)
    V
CHOOSE MISSION OR ARCADE GAME
    |           |
    V           V
PULL MISSION   PULL GAME ENGINE
TEMPLATE       (Bird, Balloon, etc.)
    |           |
    V           V
COMPLETE TASK  SUBMIT FINAL SCORE
OR QUIZ        AND XP
    |           |
    V           V
VALIDATE ON BACKEND
    | (Apply daily sync multipliers and check for badges)
    V
UPDATE USER DOCUMENT
    | (Save new XP to skills array and overall level)
    V
GENERATE REFRESHED STATS AND LEADERBOARDS

CORE DATA MODELS

User Profile
The User is the center of the database. Instead of having dozens of small tables, we embed important data directly into the User document for speed.
It stores:
Basic info: Username, email, password, googleId.
Character stats: Class (like Frontend Warrior), XP, Level, and Rank.
Skills array: Each skill has its own level, accuracy, and last practiced date.
Progression: Streaks, daily synchronization rates, and evolution tiers (like Novice to Code God).

Mission System
Missions are stored as templates that define the title, difficulty, and XP rewards.
Mission Template: Contains instructions, resource links, and requirements.
UserMission: Acts as a bridge. It tracks which user is working on which mission and whether it is completed or still active.
Questions: Separate documents linked to missions to power the quiz system for skill validation.

Game Records
Every time you play a mini-game, a record is created.
BirdGameRun: Tracks distance and XP earned in the bird game.
BalloonRun: Tracks survival time and scores.
GameRun: A general record for other activities.
These are volatile records that feed directly back into the User skills array to update your stats.

Achievements and Badges
Badges are stored as separate templates with titles and icons. When a user earns one, a reference is added to the badges array in their profile.

HOW DATA FLOWS

Step 1 Authentication and Initialization
When you log in, the system retrieves your User document.
The server calculates your daily sync rate and skill decay if you have been inactive.
Your current sessions and streaks are updated immediately.

Step 2 Planning and Roadmaps
The frontend compares your current skill levels (from the User document) against the required missions.
The Dashboard and Roadmap pages map this data into visual radar charts.

Step 3 Training and Missions
Choosing a mission pulls data from the Mission collection.
If you complete a task or a quiz, the server creates a QuizAttempt record.
If successful, it updates the User document by:
Adding XP to the specific skill.
Updating the overall character level.
Triggering a badge check.

Step 4 Arcade and XP Grinding
When a mini-game finishes, the score is sent to the backend.
The server verifies the score and updates the User skills array.
The sync rate multiplier from your daily streak is applied to the earned XP before saving.

DATA RELATIONSHIPS

User to Skills: One-to-many (Embedded).
User to Missions: One-to-many (Referenced via UserMission).
Mission to Questions: One-to-many (Referenced).
User to Badges: Many-to-many (Referenced).

SCALING AND PERFORMANCE

We use MongoDB Atlas for its ability to handle high-frequency reads and writes during gameplay.
By embedding the skills array inside the User document, we avoid complex joins every time a user gains XP, making the dashboard feel incredibly fast.
Timestamps are used on almost every document to track your growth over time and power the analytics.
