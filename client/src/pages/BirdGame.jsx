import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Zap, AlertTriangle, Skull, Ship, Star, Clock, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GRAVITY = 0.6;
const JUMP_STRENGTH = -8;
const SPAWN_RATE = 1500; // ms
const GAME_SPEED = 5;

const BirdGame = () => {
    const { skill } = useParams();
    const navigate = useNavigate();
    const { checkUser } = useAuth();

    // Game State
    const [runId, setRunId] = useState(null);
    const [gameState, setGameState] = useState('loading'); // loading, playing, paused, finished
    const [birdY, setBirdY] = useState(250);
    const [velocity, setVelocity] = useState(0);
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(100);
    const [combo, setCombo] = useState(0);
    const [objects, setObjects] = useState([]); // { id, x, y, type }
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [screenShake, setScreenShake] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    const requestRef = useRef();
    const lastSpawnTime = useRef(0);
    const timerRef = useRef();
    const gameContainerRef = useRef();

    useEffect(() => {
        if (currentQuestion && gameState === 'paused') {
            setTimeLeft(10);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        submitAnswer(-1); // Auto-fail on timeout
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [currentQuestion, gameState]);

    const startRun = async () => {
        try {
            const res = await axios.post(`${API_URL}/birdgame/start/${skill}`);
            setRunId(res.data.runId);
            setHealth(res.data.state.health);
            setGameState('playing');
        } catch (err) {
            alert('Failed to initialize neural link');
            navigate('/roadmap');
        }
    };

    useEffect(() => {
        startRun();
    }, [skill]);

    const handleJump = useCallback(() => {
        if (gameState !== 'playing') return;
        setVelocity(JUMP_STRENGTH);
    }, [gameState]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleJump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleJump]);

    const spawnObject = (time) => {
        if (time - lastSpawnTime.current > SPAWN_RATE) {
            const type = Math.random() > 0.3 ? 'fruit' : 'bomb';
            const newObj = {
                id: Date.now(),
                x: 800,
                y: 50 + Math.random() * 300,
                type
            };
            setObjects(prev => [...prev, newObj]);
            lastSpawnTime.current = time;
        }
    };

    const handleCollision = async (obj) => {
        setGameState('paused');
        setObjects(prev => prev.filter(o => o.id !== obj.id));

        try {
            const res = await axios.post(`${API_URL}/birdgame/event/${runId}`);
            if (res.data.finished) {
                setGameState('finished');
            } else {
                setCurrentQuestion({ ...res.data.question, objectType: obj.type });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitAnswer = async (index) => {
        setSelectedAnswer(index);
        try {
            const res = await axios.post(`${API_URL}/birdgame/answer/${runId}`, {
                selectedIndex: index,
                objectType: currentQuestion.objectType
            });

            setFeedback(res.data.isCorrect ? 'correct' : 'wrong');
            if (res.data.effect?.screenShake) {
                setScreenShake(true);
                setTimeout(() => setScreenShake(false), 500);
            }

            setTimeout(async () => {
                const newState = res.data.state;
                setScore(newState.score);
                setHealth(newState.health);
                setCombo(newState.combo);

                if (newState.finished) {
                    setGameState('finished');
                    await checkUser();
                } else {
                    setGameState('playing');
                    setCurrentQuestion(null);
                    setSelectedAnswer(null);
                    setFeedback(null);
                }
            }, 1000);
        } catch (err) {
            alert(err.response?.data?.message || 'Answer error');
        }
    };

    const update = (time) => {
        if (gameState === 'playing') {
            // physics
            setBirdY(prev => {
                const newY = prev + velocity;
                if (newY < 0) return 0;
                if (newY > 460) {
                    // Critical hit from ground
                    setHealth(h => Math.max(0, h - 0.5));
                    return 460;
                }
                return newY;
            });
            setVelocity(v => v + GRAVITY);

            // update objects
            const adaptiveSpeed = GAME_SPEED + (combo * 0.1);
            setObjects(prev => {
                const moved = prev.map(o => ({ ...o, x: o.x - adaptiveSpeed }));
                const remaining = moved.filter(o => o.x > -50);

                // collision check
                const birdRect = { x: 100, y: birdY, w: 40, h: 40 };
                const collider = remaining.find(o => {
                    const objRect = { x: o.x, y: o.y, w: 30, h: 30 };
                    return (
                        birdRect.x < objRect.x + objRect.w &&
                        birdRect.x + birdRect.w > objRect.x &&
                        birdRect.y < objRect.y + objRect.h &&
                        birdRect.y + birdRect.h > objRect.y
                    );
                });

                if (collider) {
                    handleCollision(collider);
                }

                return remaining;
            });

            spawnObject(time);
        }

        if (health <= 0) {
            setGameState('finished');
        }

        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, birdY, velocity, health]);

    if (gameState === 'finished') {
        return (
            <div className="max-w-2xl mx-auto py-20">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="game-card text-center p-12 space-y-8 bg-slate-900 border-indigo-500/30"
                >
                    <Trophy className="w-20 h-20 text-amber-500 mx-auto animate-bounce" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                        {health > 0 ? 'Session Complete' : 'Session Interrupted'}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Score</div>
                            <div className="text-3xl font-black text-white">{score}</div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Bonus</div>
                            <div className="text-3xl font-black text-emerald-500">+{score}</div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button onClick={() => window.location.reload()} className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-sm">
                            <Zap fill="currentColor" size={18} /> Re-link Session
                        </button>
                        <button onClick={() => navigate('/roadmap')} className="w-full py-4 text-slate-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors">
                            Return to Portal
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`max-w-4xl mx-auto space-y-6 ${screenShake ? 'animate-shake' : ''}`}>
            {/* Navigation & HUD */}
            <div className="flex justify-between items-center px-4">
                <button 
                    onClick={() => navigate('/roadmap')}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portal
                </button>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Heart className="text-red-500" fill="currentColor" size={20} />
                        <div className="w-32 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${health}%` }}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="text-amber-500" fill="currentColor" size={20} />
                        <span className="text-xl font-black italic">x{combo}</span>
                    </div>
                </div>
                <div className="text-3xl font-black tracking-tighter text-indigo-400 italic">
                    {score.toString().padStart(5, '0')}
                </div>
            </div>

            {/* Game Canvas Overlay */}
            <div
                ref={gameContainerRef}
                onClick={handleJump}
                className="relative h-[500px] w-full bg-slate-950 rounded-[40px] border-4 border-slate-900 overflow-hidden cursor-pointer shadow-2xl"
                style={{
                    background: 'linear-gradient(to bottom, #020617, #0f172a, #1a2e5a)',
                }}
            >
                {/* Visual Decorations */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="grid grid-cols-12 h-full w-full">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-indigo-500/20"></div>
                        ))}
                    </div>
                </div>

                {/* The Bird (Neural Core) */}
                <motion.div
                    className="absolute left-[100px] w-10 h-10 z-20"
                    style={{ top: birdY }}
                    animate={{ rotate: velocity * 2 }}
                >
                    <div className="w-full h-full bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border-2 border-white flex items-center justify-center">
                        <Zap size={20} fill="white" className="text-white" />
                    </div>
                    {/* Propulsion trail */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-white/30 blur-sm"></div>
                </motion.div>

                {/* Objects */}
                {objects.map(obj => (
                    <div
                        key={obj.id}
                        className="absolute w-8 h-8 z-10 transition-transform"
                        style={{ left: obj.x, top: obj.y }}
                    >
                        {obj.type === 'fruit' ? (
                            <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-white flex items-center justify-center">
                                <Star size={14} fill="white" className="text-white" />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-red-600 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-white flex items-center justify-center animate-pulse">
                                <Skull size={14} fill="white" className="text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Event Overlay */}
                <AnimatePresence>
                    {currentQuestion && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-sm bg-slate-950/60"
                        >
                            <div className="game-card max-w-lg w-full p-8 space-y-6 border-white/10 shadow-3xl">
                                <div className="flex justify-between items-center">
                                    <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentQuestion.objectType === 'fruit' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-500'
                                        }`}>
                                        {currentQuestion.objectType === 'fruit' ? 'Optimization Opportunity' : 'Data Integrity Risk'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className={timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                                        <span className={`text-xs font-black ${timeLeft < 4 ? 'text-red-500' : 'text-slate-500'}`}>{timeLeft}s</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white leading-relaxed">
                                    {currentQuestion.question}
                                </h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); submitAnswer(idx); }}
                                            disabled={!!feedback}
                                            className={`
                                                p-4 rounded-2xl border-2 text-left text-sm font-bold transition-all
                                                ${selectedAnswer === idx ? (feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-red-500 bg-red-500/10 text-red-500')
                                                    : 'border-slate-800 bg-slate-900 hover:border-indigo-500/50 text-slate-300'}
                                            `}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="text-center text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                Tip: Press <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Space</span> or <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Click</span> to flutter your core
            </div>
        </div>
    );
};

export default BirdGame;
