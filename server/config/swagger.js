const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '⚔️ SkillQuest RPG API',
            version: '1.0.0',
            description: `
## SkillQuest RPG — Backend API Documentation

SkillQuest is a gamified skill-building platform where developers level up their tech skills through missions, quizzes, and mini-games.

### 🔐 Authentication
All protected endpoints require an active **session cookie** (set upon login or Google OAuth).  
Use \`POST /api/auth/login\` or the Google OAuth flow to establish a session.

### 🎮 Game Modules
- **Auth** – Register, login, logout, session check, Google OAuth  
- **User** – Character class, progress, skill analysis, skill gap, boss rewards  
- **Missions** – Fetch, complete, draft, and generate AI mission chains  
- **Quiz** – Start skill quiz, submit answers, history, stats  
- **Game Run** – Skill Runner game (answer while running)  
- **Bird Game** – Flappy-bird style skill game  
- **Skill Pop** – Balloon pop mini-game  
- **Balloon** – Altitude-based Q&A game  
- **Leaderboard** – Global and class-specific rankings
            `,
            contact: {
                name: 'SkillQuest Support',
                url: 'https://skillquest-08ht.onrender.com'
            }
        },
        servers: [
            {
                url: 'https://skillquest-08ht.onrender.com',
                description: 'Production Server'
            },
            {
                url: 'http://localhost:5000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                sessionAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description: 'Session cookie set after login'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '6613f2a8b9e4c123456789ab' },
                        username: { type: 'string', example: 'NeonWarrior' },
                        email: { type: 'string', example: 'warrior@skillquest.io' },
                        characterClass: { type: 'string', example: 'Frontend Warrior' },
                        level: { type: 'integer', example: 12 },
                        xp: { type: 'integer', example: 24500 },
                        rank: { type: 'string', example: 'Journeyman' },
                        skills: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'React' },
                                    level: { type: 'number', example: 45.5 },
                                    xp: { type: 'integer', example: 120 },
                                    skillPoints: { type: 'integer', example: 8 }
                                }
                            }
                        }
                    }
                },
                Mission: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string', example: 'Build a React Todo App' },
                        description: { type: 'string' },
                        skill: { type: 'string', example: 'React' },
                        difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
                        xpReward: { type: 'integer', example: 500 },
                        role: { type: 'string', example: 'Frontend Warrior' },
                        isProject: { type: 'boolean' },
                        status: { type: 'string', enum: ['available', 'in-progress', 'completed'] }
                    }
                },
                Question: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        question: { type: 'string', example: 'What is the Virtual DOM?' },
                        options: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['A copy of the real DOM', 'A server-side concept', 'A CSS technique', 'A database schema']
                        },
                        points: { type: 'integer', example: 10 }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Internal Server Error' }
                    }
                }
            }
        },
        tags: [
            { name: '🔐 Auth', description: 'Authentication & session management' },
            { name: '👤 User', description: 'User profile, class, progress & analytics' },
            { name: '🗺️ Missions', description: 'Mission management and completion' },
            { name: '🧠 Quiz', description: 'Skill quiz system with scoring' },
            { name: '🏃 Game Run', description: 'Infinite runner skill game' },
            { name: '🐦 Bird Game', description: 'Flappy bird style skill mini-game' },
            { name: '🎯 Skill Pop', description: 'Skill pop mini-game' },
            { name: '🎈 Balloon', description: 'Balloon altitude skill game' },
            { name: '🏆 Leaderboard', description: 'Global and class leaderboards' }
        ],
        paths: {
            // ─── AUTH ──────────────────────────────────────────────────────────
            '/api/auth/register': {
                post: {
                    tags: ['🔐 Auth'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['username', 'email', 'password'],
                                    properties: {
                                        username: { type: 'string', example: 'NeonWarrior' },
                                        email: { type: 'string', example: 'warrior@skillquest.io' },
                                        password: { type: 'string', example: 'SecureP@ss1' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User created and session started' },
                        400: { description: 'User already exists / weak password' },
                        500: { description: 'Server error' }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['🔐 Auth'],
                    summary: 'Login with email or username',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['identity', 'password'],
                                    properties: {
                                        identity: { type: 'string', description: 'Email or Username', example: 'NeonWarrior' },
                                        password: { type: 'string', example: 'SecureP@ss1' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string', example: 'Logged in' },
                                            user: { $ref: '#/components/schemas/User' }
                                        }
                                    }
                                }
                            }
                        },
                        400: { description: 'Invalid credentials' }
                    }
                }
            },
            '/api/auth/logout': {
                post: {
                    tags: ['🔐 Auth'],
                    summary: 'Logout and destroy session',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: { description: 'Logged out successfully' },
                        500: { description: 'Could not log out' }
                    }
                }
            },
            '/api/auth/me': {
                get: {
                    tags: ['🔐 Auth'],
                    summary: 'Get current authenticated user',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: {
                            description: 'User data returned',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/User' }
                                }
                            }
                        },
                        401: { description: 'No active session' }
                    }
                }
            },
            '/api/auth/google': {
                get: {
                    tags: ['🔐 Auth'],
                    summary: 'Initiate Google OAuth login',
                    description: 'Redirects to Google consent screen. Use in browser navigation.',
                    responses: {
                        302: { description: 'Redirect to Google OAuth' }
                    }
                }
            },
            '/api/auth/google/callback': {
                get: {
                    tags: ['🔐 Auth'],
                    summary: 'Google OAuth callback',
                    description: 'Handled by Google redirect. Sets session and redirects to client.',
                    responses: {
                        302: { description: 'Redirect to client app' }
                    }
                }
            },

            // ─── USER ──────────────────────────────────────────────────────────
            '/api/user/character': {
                post: {
                    tags: ['👤 User'],
                    summary: 'Set character class',
                    description: 'Assigns a character class (role) and resets skill tree accordingly.',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['characterClass'],
                                    properties: {
                                        characterClass: {
                                            type: 'string',
                                            example: 'Frontend Warrior',
                                            enum: ['Frontend Warrior', 'Data Mage', 'Cloud Engineer', 'Cyber Ninja', 'AI Architect', 'DevOps Paladin', 'UI/UX Sorcerer', 'Mobile Monk', 'Blockchain Bard', 'QA Shadow', 'Data Warden', 'Backend Titan']
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'User updated with new class', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/user/progress': {
                post: {
                    tags: ['👤 User'],
                    summary: 'Update user XP and skill progress',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        xpGain: { type: 'integer', example: 200 },
                                        skillName: { type: 'string', example: 'React' },
                                        skillXpGain: { type: 'integer', example: 50 }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Progress updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/user/complete-daily': {
                post: {
                    tags: ['👤 User'],
                    summary: 'Complete a daily Neural Spike challenge',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['stepId', 'xp'],
                                    properties: {
                                        stepId: { type: 'string', example: 'daily_step_001' },
                                        xp: { type: 'integer', example: 150 }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Daily spike completed, XP awarded' },
                        400: { description: 'Already completed today' },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/user/analysis': {
                get: {
                    tags: ['👤 User'],
                    summary: 'Get deep skill analysis report',
                    description: 'Requires at least 10 completed missions to generate analysis.',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: {
                            description: 'Skill analysis data',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            available: { type: 'boolean' },
                                            strongestSkill: { type: 'string', example: 'React' },
                                            weakestSkill: { type: 'string', example: 'TypeScript' },
                                            overallAccuracy: { type: 'integer', example: 87 },
                                            recommendedFocus: { type: 'string', example: 'Redux' },
                                            totalMissions: { type: 'integer', example: 15 }
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/user/skill-gap': {
                get: {
                    tags: ['👤 User'],
                    summary: 'Get skill gap analysis for current character class',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: {
                            description: 'Skill gap report with severity rankings',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            characterClass: { type: 'string' },
                                            report: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        name: { type: 'string' },
                                                        currentLevel: { type: 'number' },
                                                        targetLevel: { type: 'integer' },
                                                        gap: { type: 'number' },
                                                        severity: { type: 'string', enum: ['Pending', 'Critical', 'Moderate', 'Stable', 'Minor', 'Mastered'] }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/user/boss-victory': {
                post: {
                    tags: ['👤 User'],
                    summary: 'Claim boss victory reward (5000 XP)',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['bossId', 'bossTitle'],
                                    properties: {
                                        bossId: { type: 'string', example: 'boss_001' },
                                        bossTitle: { type: 'string', example: 'The Algorithm Overlord' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Boss defeated, XP awarded' },
                        401: { description: 'Unauthorized' }
                    }
                }
            },

            // ─── MISSIONS ──────────────────────────────────────────────────────
            '/api/missions': {
                get: {
                    tags: ['🗺️ Missions'],
                    summary: 'Get all available missions for current character class',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: {
                            description: 'List of missions with user progress',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/Mission' } }
                                }
                            }
                        },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/missions/complete/{id}': {
                post: {
                    tags: ['🗺️ Missions'],
                    summary: 'Complete a mission',
                    description: 'Validates proof of work (GitHub repo if applicable) and awards XP.',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mission ID' }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        proofOfWork: { type: 'string', example: 'https://github.com/user/my-react-app' },
                                        tasksCompleted: { type: 'array', items: { type: 'string' }, example: ['Task 1', 'Task 2'] }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Mission completed, XP awarded with neural feedback' },
                        400: { description: 'Already completed / proof invalid' },
                        404: { description: 'Mission not found' }
                    }
                }
            },
            '/api/missions/save-draft/{id}': {
                post: {
                    tags: ['🗺️ Missions'],
                    summary: 'Save in-progress mission draft',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mission ID' }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        proofOfWork: { type: 'string' },
                                        tasksCompleted: { type: 'array', items: { type: 'string' } }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Draft saved' },
                        400: { description: 'Cannot draft a completed mission' }
                    }
                }
            },
            '/api/missions/generate-chain': {
                post: {
                    tags: ['🗺️ Missions'],
                    summary: 'Generate personalized mission chain from skill gaps',
                    description: 'Analyzes the weakest skills and returns Easy → Medium → Hard mission chain.',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['requirements'],
                                    properties: {
                                        requirements: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    name: { type: 'string', example: 'React' },
                                                    level: { type: 'integer', example: 70 }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Mission chain generated',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            targetSkill: { type: 'string', example: 'React' },
                                            gapPoints: { type: 'integer', example: 25 },
                                            missions: { type: 'array', items: { $ref: '#/components/schemas/Mission' } }
                                        }
                                    }
                                }
                            }
                        },
                        404: { description: 'No skill gaps detected' }
                    }
                }
            },

            // ─── QUIZ ──────────────────────────────────────────────────────────
            '/api/quiz/start/{skill}': {
                post: {
                    tags: ['🧠 Quiz'],
                    summary: 'Start a new skill quiz (5 questions)',
                    description: 'Has a 10-minute cooldown between attempts.',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'skill', in: 'path', required: true, schema: { type: 'string' }, description: 'Skill name (e.g. React)', example: 'React' }
                    ],
                    responses: {
                        200: {
                            description: 'Quiz started with sanitized questions',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            attemptId: { type: 'string' },
                                            questions: { type: 'array', items: { $ref: '#/components/schemas/Question' } }
                                        }
                                    }
                                }
                            }
                        },
                        429: { description: 'Cooldown active, try again later' },
                        404: { description: 'Not enough questions for this skill' }
                    }
                }
            },
            '/api/quiz/boss-battle': {
                post: {
                    tags: ['🧠 Quiz'],
                    summary: 'Start a Boss Battle quiz (multi-skill, no cooldown)',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['skills'],
                                    properties: {
                                        skills: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            example: ['React', 'JavaScript', 'CSS']
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Boss battle quiz started' },
                        404: { description: 'No questions found for boss skills' }
                    }
                }
            },
            '/api/quiz/submit/{attemptId}': {
                post: {
                    tags: ['🧠 Quiz'],
                    summary: 'Submit quiz answers',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'attemptId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['answers'],
                                    properties: {
                                        answers: {
                                            type: 'array',
                                            items: { type: 'integer' },
                                            description: 'Array of selected option indices (0-based)',
                                            example: [0, 2, 1, 3, 0]
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Quiz results with score and rewards',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            score: { type: 'integer' },
                                            maxScore: { type: 'integer' },
                                            passed: { type: 'boolean' },
                                            rewards: { type: 'object' },
                                            correctAnswers: { type: 'array', items: { type: 'integer' } }
                                        }
                                    }
                                }
                            }
                        },
                        400: { description: 'Already submitted / too fast' }
                    }
                }
            },
            '/api/quiz/history': {
                get: {
                    tags: ['🧠 Quiz'],
                    summary: 'Get quiz attempt history',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: { description: 'List of past quiz attempts' }
                    }
                }
            },
            '/api/quiz/stats': {
                get: {
                    tags: ['🧠 Quiz'],
                    summary: 'Get quiz performance statistics',
                    security: [{ sessionAuth: [] }],
                    responses: {
                        200: {
                            description: 'Quiz stats summary',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            totalAttempts: { type: 'integer' },
                                            totalPassed: { type: 'integer' },
                                            totalFailed: { type: 'integer' },
                                            averageScore: { type: 'integer' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            // ─── GAME RUN ──────────────────────────────────────────────────────
            '/api/run/start/{skill}': {
                post: {
                    tags: ['🏃 Game Run'],
                    summary: 'Start a Skill Runner game session',
                    description: 'Loads 20 questions. Player answers while running; wrong answers drain health.',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'skill', in: 'path', required: true, schema: { type: 'string' }, example: 'React' }
                    ],
                    responses: {
                        200: {
                            description: 'Run started with initial game state',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            runId: { type: 'string' },
                                            state: { type: 'object', properties: { health: { type: 'integer' }, speed: { type: 'integer' }, score: { type: 'integer' }, combo: { type: 'integer' } } },
                                            currentQuestion: { $ref: '#/components/schemas/Question' }
                                        }
                                    }
                                }
                            }
                        },
                        404: { description: 'No questions found for this skill' }
                    }
                }
            },
            '/api/run/answer/{runId}': {
                post: {
                    tags: ['🏃 Game Run'],
                    summary: 'Submit an answer during a run',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['answerIndex'],
                                    properties: {
                                        answerIndex: { type: 'integer', example: 2, description: '0-based index of selected option' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Answer result with updated game state and next question' }
                    }
                }
            },
            '/api/run/state/{runId}': {
                get: {
                    tags: ['🏃 Game Run'],
                    summary: 'Get current run state',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        200: { description: 'Current run data' }
                    }
                }
            },
            '/api/run/end/{runId}': {
                post: {
                    tags: ['🏃 Game Run'],
                    summary: 'End a run early',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        200: { description: 'Run terminated with final score' }
                    }
                }
            },

            // ─── BIRD GAME ─────────────────────────────────────────────────────
            '/api/birdgame/start/{skill}': {
                post: {
                    tags: ['🐦 Bird Game'],
                    summary: 'Start a Bird Game session',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'skill', in: 'path', required: true, schema: { type: 'string' }, example: 'Python' }
                    ],
                    responses: {
                        200: { description: 'Bird game session started with runId and initial state' }
                    }
                }
            },
            '/api/birdgame/event/{runId}': {
                post: {
                    tags: ['🐦 Bird Game'],
                    summary: 'Get next question for a Bird Game event',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        200: { description: 'Next question or finished flag' }
                    }
                }
            },
            '/api/birdgame/answer/{runId}': {
                post: {
                    tags: ['🐦 Bird Game'],
                    summary: 'Submit answer for Bird Game event',
                    description: 'Must be answered within 10 seconds of event trigger.',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        selectedIndex: { type: 'integer', example: 1 },
                                        objectType: { type: 'string', enum: ['fruit', 'bomb'], example: 'fruit' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Answer result with bonus score and updated state' }
                    }
                }
            },
            '/api/birdgame/state/{runId}': {
                get: {
                    tags: ['🐦 Bird Game'],
                    summary: 'Get live Bird Game run state',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        200: { description: 'Current run state' }
                    }
                }
            },

            // ─── SKILL POP ─────────────────────────────────────────────────────
            '/api/skillpop/questions/{skill}': {
                get: {
                    tags: ['🎯 Skill Pop'],
                    summary: 'Get 5 random questions for Skill Pop game',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'skill', in: 'path', required: true, schema: { type: 'string' }, example: 'JavaScript' }
                    ],
                    responses: {
                        200: { description: 'Array of 5 random questions' }
                    }
                }
            },
            '/api/skillpop/finish': {
                post: {
                    tags: ['🎯 Skill Pop'],
                    summary: 'Submit final score for Skill Pop game',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['score', 'skill'],
                                    properties: {
                                        score: { type: 'integer', example: 120 },
                                        skill: { type: 'string', example: 'JavaScript' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Score saved and XP awarded' }
                    }
                }
            },

            // ─── BALLOON ───────────────────────────────────────────────────────
            '/api/balloon/start/{skill}': {
                post: {
                    tags: ['🎈 Balloon'],
                    summary: 'Start a Balloon altitude game session',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'skill', in: 'path', required: true, schema: { type: 'string' }, example: 'Python' }
                    ],
                    responses: {
                        200: {
                            description: 'Balloon run started',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            runId: { type: 'string' },
                                            state: {
                                                type: 'object',
                                                properties: {
                                                    balloonsCount: { type: 'integer', example: 5 },
                                                    altitude: { type: 'integer', example: 0 },
                                                    status: { type: 'string', example: 'active' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/balloon/question/{runId}': {
                get: {
                    tags: ['🎈 Balloon'],
                    summary: 'Get next question for Balloon game',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        200: { description: 'Question and current balloon state' }
                    }
                }
            },
            '/api/balloon/answer/{runId}': {
                post: {
                    tags: ['🎈 Balloon'],
                    summary: 'Submit answer for Balloon game',
                    description: 'Correct → altitude +15%, Wrong → lose 1 balloon, altitude -5%.',
                    security: [{ sessionAuth: [] }],
                    parameters: [
                        { name: 'runId', in: 'path', required: true, schema: { type: 'string' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['selectedIndex'],
                                    properties: {
                                        selectedIndex: { type: 'integer', example: 0 }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Answer result with altitude and balloon state' }
                    }
                }
            },

            // ─── LEADERBOARD ───────────────────────────────────────────────────
            '/api/leaderboard': {
                get: {
                    tags: ['🏆 Leaderboard'],
                    summary: 'Get top 20 players (optionally filtered by class)',
                    parameters: [
                        {
                            name: 'characterClass',
                            in: 'query',
                            required: false,
                            schema: {
                                type: 'string',
                                enum: ['All', 'Frontend Warrior', 'Data Mage', 'Cloud Engineer', 'Cyber Ninja', 'AI Architect', 'DevOps Paladin', 'UI/UX Sorcerer', 'Mobile Monk', 'Blockchain Bard', 'QA Shadow', 'Data Warden', 'Backend Titan']
                            },
                            description: 'Filter by character class. Omit or use "All" for global rankings.'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Top 20 users sorted by XP',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                username: { type: 'string' },
                                                characterClass: { type: 'string' },
                                                xp: { type: 'integer' },
                                                level: { type: 'integer' },
                                                rank: { type: 'string' },
                                                avatar: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [] // All docs defined inline above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
