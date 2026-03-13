import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Skull, Timer, Target, Rocket, Activity, AlertCircle, Cpu, ChevronRight, Gamepad2, Play } from 'lucide-react';
import axios from 'axios';

const BossCombatGame = ({ boss, onFinish, userClass }) => {
    // Game Constants (Internal Coordinates 0-100)
    const PLAYER_Y = 90;
    const ENEMY_HEIGHT = 10;
    const ENEMY_WIDTH = 22;
    const BULLET_SPEED = 2;
    const TIME_PER_ROUND = 15;

    // Game State
    const [gameState, setGameState] = useState('menu'); // menu, playing, won, lost
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // Render State (Synced from Refs)
    const [renderPlayerX, setRenderPlayerX] = useState(50);
    const [renderBullets, setRenderBullets] = useState([]);
    const [renderEnemies, setRenderEnemies] = useState([]);
    const [feedback, setFeedback] = useState(null);

    // Game Logic Refs (Avoid Closure Stale State)
    const gameStateRef = useRef('menu');
    const playerXRef = useRef(50);
    const bulletsRef = useRef([]);
    const enemiesRef = useRef([]);
    const roundRef = useRef(0);
    const timeLeftRef = useRef(TIME_PER_ROUND);
    const questionsRef = useRef([]);
    const scoreRef = useRef(0);
    const keysRef = useRef({});
    const finishTimeoutRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // 1. Initial Load
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const skill = boss.skills[0]?.name || 'JavaScript';
                const res = await axios.get(`${API_URL}/skillpop/questions/${skill}`, { withCredentials: true });
                const fetched = res.data.length ? res.data : getFallbackQuestions();
                questionsRef.current = fetched;
                setCurrentQuestion(fetched[0]);
            } catch (err) {
                const fallback = getFallbackQuestions();
                questionsRef.current = fallback;
                setCurrentQuestion(fallback[0]);
            }
        };
        fetchQuestions();
    }, [boss]);

    const getFallbackQuestions = () => [
        { question: "Which symbol is used for comments in JS?", options: ["//", "/*", "#", "--"], correctIndex: 0 },
        { question: "What is the output of 2 + '2' in JS?", options: ["4", "'22'", "NaN", "Error"], correctIndex: 1 },
        { question: "Which hook handles state in React?", options: ["useEffect", "useState", "useMemo", "useRef"], correctIndex: 1 }
    ];

    // 2. Input Handlers
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;
            if (e.key === ' ' && gameStateRef.current === 'playing') {
                bulletsRef.current.push({ id: Date.now(), x: playerXRef.current, y: PLAYER_Y - 5 });
            }

            if ((e.key === ' ' || e.key === 'Enter') && (gameStateRef.current === 'won' || gameStateRef.current === 'lost')) {
                if (finishTimeoutRef.current) {
                    clearTimeout(finishTimeoutRef.current);
                    onFinish(gameStateRef.current === 'won');
                    finishTimeoutRef.current = null;
                }
            }
        };
        const handleKeyUp = (e) => keysRef.current[e.key] = false;
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // 3. Round Setup
    const setupRound = () => {
        const q = questionsRef.current[roundRef.current];
        if (!q) {
            finishGame(true);
            return;
        }

        setCurrentQuestion(q);
        timeLeftRef.current = TIME_PER_ROUND;
        setTimeLeft(TIME_PER_ROUND);

        // Spawn 4 enemies
        enemiesRef.current = q.options.map((opt, i) => ({
            id: i,
            x: 12.5 + (i * 25), // Centered in 4 columns
            y: -10,
            text: opt,
            isCorrect: i === q.correctIndex
        }));
        bulletsRef.current = [];
    };

    // 4. Game Loop
    useEffect(() => {
        let raf;
        const loop = () => {
            if (gameStateRef.current !== 'playing') return;

            // Move Player
            if (keysRef.current['ArrowLeft']) playerXRef.current = Math.max(5, playerXRef.current - 1.5);
            if (keysRef.current['ArrowRight']) playerXRef.current = Math.min(95, playerXRef.current + 1.5);

            // Move Bullets
            bulletsRef.current = bulletsRef.current
                .map(b => ({ ...b, y: b.y - BULLET_SPEED }))
                .filter(b => b.y > -5);

            // Move Enemies
            const speed = 0.10 + (roundRef.current * 0.03);
            enemiesRef.current = enemiesRef.current.map(e => ({ ...e, y: e.y + speed }));

            // Timer
            timeLeftRef.current -= 0.016;
            if (timeLeftRef.current <= 0) {
                handleGameOver("TIMEOUT: Neural Link Unstable");
            }

            // Collision Check
            checkCollisions();

            // Check Missed
            if (enemiesRef.current.some(e => e.y > 100 && e.isCorrect)) {
                handleGameOver("MISSED: Data packet lost");
            }

            // Sync States for Render
            setRenderPlayerX(playerXRef.current);
            setRenderBullets([...bulletsRef.current]);
            setRenderEnemies([...enemiesRef.current]);
            setTimeLeft(Math.ceil(timeLeftRef.current));

            raf = requestAnimationFrame(loop);
        };

        if (gameState === 'playing') {
            gameStateRef.current = 'playing';
            setupRound();
            raf = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(raf);
            if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
        };
    }, [gameState]);

    const checkCollisions = () => {
        let hitCorrect = false;
        let hitWrong = false;

        bulletsRef.current = bulletsRef.current.filter(bullet => {
            let hit = false;
            enemiesRef.current.forEach(enemy => {
                const dx = Math.abs(bullet.x - enemy.x);
                const dy = Math.abs(bullet.y - enemy.y);

                // Simple box collision
                if (dx < ENEMY_WIDTH / 2 && dy < ENEMY_HEIGHT / 2) {
                    hit = true;
                    if (enemy.isCorrect) hitCorrect = true;
                    else hitWrong = true;
                }
            });
            return !hit;
        });

        if (hitWrong) handleGameOver("SYNC ERROR: Incompatible logic detected");
        if (hitCorrect) handleCorrect();
    };

    const handleCorrect = () => {
        scoreRef.current += 25;
        setScore(scoreRef.current);
        setFeedback({ text: "LOGIC SYNCED! +25", color: "emerald" });
        setTimeout(() => setFeedback(null), 1000);

        roundRef.current += 1;
        if (roundRef.current < questionsRef.current.length) {
            setupRound();
        } else {
            finishGame(true);
        }
    };

    const handleGameOver = (msg) => {
        if (gameStateRef.current !== 'playing') return;
        gameStateRef.current = 'lost';
        setGameState('lost');
        setFeedback({ text: msg, color: "red" });
        finishGame(false);
    };

    const finishGame = async (success) => {
        gameStateRef.current = success ? 'won' : 'lost';
        setGameState(gameStateRef.current);

        try {
            await axios.post(`${API_URL}/skillpop/finish`, {
                score: scoreRef.current,
                skill: boss.skills[0]?.name || 'Adaptive Learning'
            }, { withCredentials: true });
        } catch (e) { }

        const tId = setTimeout(() => {
            onFinish(success);
        }, 4000);
        finishTimeoutRef.current = tId;
    };

    const HUDLabel = ({ text, subtext, align = "left", color = "indigo" }) => (
        <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start"}`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${color}-500/60 mb-1`}>{text}</span>
            <div className={`text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                {subtext}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl h-[650px] bg-slate-950 rounded-[40px] border-4 border-slate-900 overflow-hidden relative shadow-3xl text-white select-none">
            {/* Neural Background Layer */}
            <div className="absolute inset-0 bg-[#05070a]">
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 via-transparent to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                {/* Horizontal Scanline */}
                <motion.div
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-[2px] bg-indigo-500/10 z-10 pointer-events-none"
                />
            </div>

            {/* HUD: Upper Tactical Bar */}
            <div className="absolute top-0 inset-x-0 py-6 px-10 flex justify-between items-start z-30 pointer-events-none">
                <HUDLabel text="Neural Data" subtext={score.toLocaleString()} color="indigo" />

                <div className="flex flex-col items-center max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity size={14} className="text-red-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Active Core Scan</span>
                        <Activity size={14} className="text-red-500 animate-pulse" />
                    </div>

                    <AnimatePresence mode="wait">
                        {gameState === 'playing' && currentQuestion && (
                            <motion.div
                                key={round}
                                initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                className="relative py-4 px-8"
                            >
                                <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-md rounded-2xl border border-white/10" />
                                <h2 className="relative text-lg font-black text-white leading-tight text-center tracking-tight">
                                    {currentQuestion.question}
                                </h2>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <HUDLabel text="Sync Stability" subtext={`${timeLeft}s`} align="right" color={timeLeft < 5 ? "red" : "amber"} />
            </div>

            {/* Game Canvas (Using Percentages for coordinates) */}
            <div className="relative w-full h-full pt-44">
                <AnimatePresence mode="wait">
                    {gameState === 'menu' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-40 p-12"
                        >
                            <div className="relative group max-w-md w-full">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-black/60 backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 text-center space-y-8">
                                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                                        <Rocket size={40} className="text-indigo-400" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-4xl font-black tracking-tighter italic uppercase text-white">Initialize Link</h3>
                                        <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-wider">
                                            Tactical Interface v2.4 initialized.<br />
                                            Objective: Defend neural core via pulse logic.<br />
                                            Inputs: <span className="text-indigo-400">ARROWS</span> to move, <span className="text-indigo-400">SPACE</span> to fire.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setGameState('playing')}
                                        className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-400 transition-colors shadow-2xl"
                                    >
                                        Establish Connection
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <div className="w-full h-full relative">
                            {/* Enemies */}
                            {renderEnemies.map(e => (
                                <motion.div
                                    key={e.id}
                                    style={{ left: `${e.x}%`, top: `${e.y}%`, width: `${ENEMY_WIDTH}%`, height: `${ENEMY_HEIGHT}%`, transform: 'translateX(-50%)' }}
                                    className="absolute bg-slate-900 border-2 border-indigo-500/30 rounded-2xl shadow-xl flex items-center justify-center p-3 text-center overflow-hidden"
                                >
                                    <span className="text-[9px] font-black text-white uppercase leading-tight line-clamp-3">{e.text}</span>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500/20" />
                                </motion.div>
                            ))}

                            {/* Bullets */}
                            {renderBullets.map(b => (
                                <div
                                    key={b.id}
                                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                                    className="absolute w-2 h-6 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)] transform -translate-x-1/2"
                                />
                            ))}

                            {/* Player */}
                            <div
                                style={{ left: `${renderPlayerX}%`, top: `${PLAYER_Y}%` }}
                                className="absolute flex flex-col items-center transform -translate-x-1/2"
                            >
                                <div className="w-12 h-16 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-3xl border-x-4 border-white/10 relative">
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-6 bg-slate-950 rounded-full" />
                                </div>
                                <div className="w-20 h-4 bg-indigo-900 rounded-full" />
                                <motion.div
                                    animate={{ scaleY: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 0.1 }}
                                    className="w-4 h-12 bg-amber-500/20 blur-sm rounded-b-full"
                                />
                            </div>
                        </div>
                    )}

                    {(gameState === 'won' || gameState === 'lost') && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-md p-10"
                        >
                            <div className="relative flex flex-col items-center max-w-lg w-full">
                                {/* Result Glow Background */}
                                <div className={`absolute inset-0 blur-[100px] opacity-20 ${gameState === 'won' ? 'bg-emerald-500' : 'bg-red-600'}`} />

                                <div className="relative w-full bg-[#0d1117] border border-white/5 p-12 rounded-[50px] overflow-hidden shadow-3xl flex flex-col items-center">
                                    {/* Scanline Overlay */}
                                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                                    <motion.div
                                        initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                                        className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-10 ${gameState === 'won' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}
                                    >
                                        {gameState === 'won' ? <Target size={48} /> : <Skull size={48} />}
                                    </motion.div>

                                    <h2 className="text-5xl font-black uppercase italic tracking-[0.05em] text-white text-center leading-none mb-10">
                                        {gameState === 'won' ? 'Neural Link Verified' : 'Neural Link Unstable'}
                                    </h2>

                                    <div className="w-full flex justify-between items-center px-4 py-8 border-y border-white/5 mb-10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Final Gain</span>
                                            <span className="text-4xl font-black italic text-white">{score}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Session Status</span>
                                            <div className={`text-sm font-black uppercase italic ${gameState === 'won' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {feedback?.text.split(':')[0] || (gameState === 'won' ? 'Complete' : 'Re-Calibrating')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/40">
                                        <div className="w-8 h-px bg-white/10" />
                                        <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Press Space to Return</span>
                                        <div className="w-8 h-px bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* In-game feedback popups */}
            <AnimatePresence>
                {feedback && gameState === 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 2 }}
                        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 text-4xl font-black italic uppercase text-${feedback.color}-500`}
                    >
                        {feedback.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tactical Footer */}
            <div className="absolute bottom-4 inset-x-0 px-10 flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em] py-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />
                        Neural Link: Active
                    </div>
                </div>
                <div className="flex gap-8">
                    <span>Move: [Left/Right]</span>
                    <span>Pulse: [Space]</span>
                </div>
                <div className="text-indigo-500/60">Sector: {boss.skills[0]?.name || 'Adaptive'}</div>
            </div>
        </div>
    );
};

export default BossCombatGame;
