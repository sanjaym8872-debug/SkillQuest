Welcome to SkillQuest, a game-based career simulator.

SkillQuest is a premium, full-stack role-playing game platform designed to bridge the gap between your current skills and industry requirements through gamification.

It is packed with a lot of exciting features. The neural gap analysis provides a real-time visualization of your skill deficits using radar charts. You can climb the mastery ladder through personalized three-stage mission chains covering easy, medium, and hard difficulties. The class system allows you to specialize your career path as a Frontend Warrior, Data Mage, Cyber Ninja, and more. For practice, we have an integrated arcade featuring skill-based mini games like the bird game and daily spikes, as well as exciting boss confrontations. To keep you engaged, the consistency engine rewards habit-building using daily streaks and neural sync multipliers.

Behind the scenes, the project uses a modern tech stack. The frontend is built with React, Vite, Tailwind CSS, Framer Motion, Recharts, and Lucide React. The backend runs on Node and Express, with MongoDB and Express-Session handling the database and sessions. We use tools like concurrently, nodemon, and axios to keep the development process smooth.

Setting up the project is straightforward. Once you install all dependencies using the provided npm scripts, you just need to create an environment variables file in your server folder. This file should include your MongoDB Atlas URI, a session secret string, and your client URL. After that, you can simply boot up the system with a single run command.

The system architecture is based on a decoupled client-server model. The client runs on port 5173, managed by Vite, and handles persistent sessions across pages. The server runs on port 5000 serving as an Express REST API. Both sides share definitions to ensure the user interface and the backend validation remain perfectly aligned.

Data relationships in our database are built around a central user profile. The user document holds basic profile data and an embedded skills array for speed. This central user connects to missions, earned badges, and volatile game records for active edge training, while separate templates generate dynamic content as you play.

The game engine logic acts as the soul of SkillQuest. We use a custom level up formula to make progression feel natural. Your neural sync rate gives you dynamic experience multipliers based on your daily activity streak. Practicing your skills earns you points naturally, but watch out for skill decay. If you do not practice a skill for over two weeks, your level will slowly start to drop.

The API structure covers session management, user profiling, career progression, knowledge retrieval, arcade logic, and intense boss combat.

We have established strict boundaries for keeping our system clean. Core game logic and system components are heavily guarded, while boilerplate assets and temporary test files are free to be removed when no longer needed. Configuration and build files are kept intact to make sure our system always builds correctly.

This concludes our project overview. We hope you enjoy playing and leveling up your real-world skills with SkillQuest!
