import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Zap, Trophy, Cpu, Terminal as TerminalIcon,
    Shield, Activity, AlertCircle, Ghost, Atom,
    Layers, Command, Share2, Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CODE_SNIPPETS = [
    // Generic / All Roles
    { text: "const neural_sync = async (data) => {", roles: ['all'], desc: "Starts an asynchronous process to sync data across the system." },
    { text: "git commit -m 'System evolution v4'", roles: ['all'], desc: "Saves your current work changes to the project history." },
    { text: "while(true) { optimize(); innovate(); }", roles: ['all'], desc: "A loop that constantly improves and creates new features." },
    { text: "npm install @neural/core-sync", roles: ['all'], desc: "Downloads and installs a specific code package for your project." },

    // UI/UX Sorcerer
    { text: "const [theme, setTheme] = useState('dark');", roles: ['UI/UX Sorcerer', 'Frontend Warrior'], desc: "Manages whether the app is in Dark Mode or Light Mode." },
    { text: "filter: blur(10px) saturate(150%);", roles: ['UI/UX Sorcerer'], desc: "Creates a frosted-glass effect by blurring the background." },
    { text: "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);", roles: ['UI/UX Sorcerer'], desc: "Adds smooth, professional animation timing to UI elements." },
    { text: "display: grid; grid-template-columns: repeat(12, 1fr);", roles: ['UI/UX Sorcerer', 'Frontend Warrior'], desc: "Sets up a 12-column layout grid to organize page content." },
    { text: "<motion.div animate={{ scale: 1.1 }} transition={{ duration: 0.5 }}>", roles: ['UI/UX Sorcerer'], desc: "Makes an element smoothly grow in size using animations." },
    { text: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);", roles: ['UI/UX Sorcerer'], desc: "Adds a subtle shadow to make a card look like it's floating." },
    { text: "@media (max-width: 768px) { flex-direction: column; }", roles: ['UI/UX Sorcerer', 'Frontend Warrior'], desc: "Changes the layout to look better on mobile screens." },
];

const TerminalVelocity = () => {
    const navigate = useNavigate();
    const { user, checkUser } = useAuth();
    const [gameState, setGameState] = useState('START'); // START, PLAYING, END
    const [currentSnippet, setCurrentSnippet] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isWrong, setIsWrong] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [particles, setParticles] = useState([]);

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    // Particle effect on type
    const createParticles = (x, y) => {
        const newParticles = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now() + i,
            x: x + (Math.random() - 0.5) * 50,
            y: y + (Math.random() - 0.5) * 50,
            color: 'emerald'
        }));
        setParticles(prev => [...prev.slice(-20), ...newParticles]);
    };

    const startSession = () => {
        setGameState('PLAYING');
        setTimeLeft(60);
        setCombo(0);
        setUserInput('');
        setNewSnippet();
        setIsTransitioning(false); // Reset transitioning state

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endSession();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Auto-focus management
    useEffect(() => {
        if (gameState === 'PLAYING' && !isTransitioning && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState, isTransitioning]);

    const setNewSnippet = useCallback(() => {
        const userRole = (user?.characterClass || 'all').toLowerCase();
        const filteredSnippets = CODE_SNIPPETS.filter(s =>
            s.roles.some(r => r.toLowerCase() === 'all' || r.toLowerCase() === userRole)
        );

        const pool = (filteredSnippets.length > 0 ? filteredSnippets : CODE_SNIPPETS)
            .filter(s => s.text !== currentSnippet?.text);

        const finalPool = pool.length > 0 ? pool : CODE_SNIPPETS;
        const randomSnippet = finalPool[Math.floor(Math.random() * finalPool.length)];
        setCurrentSnippet(randomSnippet);
        setUserInput('');
        setIsWrong(false);
    }, [user?.characterClass, currentSnippet]);

    const endSession = () => {
        clearInterval(timerRef.current);
        setGameState('END');
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        const target = currentSnippet.text;

        setUserInput(val);

        if (target.startsWith(val.trimEnd()) || target.startsWith(val)) {
            setIsWrong(false);
            if (val.length > userInput.length) {
                createParticles(window.innerWidth / 2, window.innerHeight / 2);
            }

            // Advance if the user matches the snippet (ignoring accidental trailing spaces)
            if (val.trim() === target.trim()) {
                setCombo(prev => prev + 1);
                setTimeLeft(prev => Math.min(prev + 15, 300));
                setIsTransitioning(true);

                // 3 second delay to allow user to read the description/insight
                setTimeout(() => {
                    setNewSnippet();
                    setIsTransitioning(false);
                }, 3000);
            }
        } else {
            setIsWrong(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-emerald-500 font-mono selection:bg-emerald-500/30 overflow-hidden relative cursor-crosshair">
            {/* --- ADAVANCED BACKGROUND ENGINE --- */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                {/* Neural Mesh */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Pulsing Nebulae */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>

                {/* Floating Particles */}
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0, y: p.y - 100 }}
                        className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                        style={{ left: p.x, top: p.y }}
                    />
                ))}
            </div>

            {/* --- HOLOGRAPHIC INTERFACE --- */}
            <div className="min-h-screen w-full flex flex-col p-4 md:p-8 lg:p-12 relative z-10 max-w-[1600px] mx-auto overflow-y-auto lg:overflow-hidden">

                {/* Top Telemetry Header - Now Grid Based for better flow */}
                <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 mb-8 lg:mb-12 w-full">
                    <div className="space-y-4 lg:space-y-6">
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-all font-black text-[9px] md:text-[10px] tracking-[0.5em] uppercase w-fit"
                        >
                            <div className="p-1.5 md:p-2 border border-emerald-500/20 rounded-lg group-hover:border-emerald-500/50">
                                <ChevronLeft size={12} />
                            </div>
                            Disconnect Link
                        </motion.button>

                        <div className="relative group">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[clamp(1.5rem,4vw,2.8rem)] font-black italic tracking-tighter uppercase leading-[0.95] select-none"
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-100 to-emerald-600">Terminal</span>
                                <br />
                                <span className="text-emerald-500/20 stroke-emerald-500 stroke-1" style={{ WebkitTextStroke: '1px rgba(16, 185, 129, 0.3)' }}>Velocity</span>
                            </motion.h1>
                            <div className="absolute -top-2 md:-top-4 left-0 md:left-auto md:right-0 px-3 py-0.5 md:px-4 md:py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full whitespace-nowrap">
                                <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase text-emerald-400 animate-pulse">Neural_Node_Active</span>
                            </div>
                        </div>
                    </div>

                    {/* HUD Modules - More Compact */}
                    <div className="flex flex-wrap lg:flex-nowrap gap-2 md:gap-3 self-end lg:self-start">
                        <HudModule label="Sync_Time" value={`${timeLeft}s`} critical={timeLeft < 15} icon={<Activity size={12} />} />
                        <HudModule label="Data_Laps" value={`${combo}`} icon={<Cpu size={12} />} />
                        <HudModule label="Class_ID" value={user?.characterClass?.split(' ')[0]} icon={<Shield size={12} />} />
                    </div>
                </header>

                {/* --- MAIN CORE CONSOLE area --- */}
                <main className="flex-1 flex flex-col items-center justify-center perspective-1000 w-full mb-8">
                    <AnimatePresence mode="wait">
                        {gameState === 'START' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                                className="relative text-center p-6"
                            >
                                <div className="absolute -inset-10 md:-inset-24 bg-emerald-500/5 rounded-full blur-[60px] md:blur-[100px] animate-pulse"></div>
                                <div className="space-y-4 md:space-y-6 relative z-10">
                                    <div className="p-4 md:p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-3xl shadow-xl inline-block">
                                        <Atom size={clampValue(30, 50)} className="text-emerald-500 animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <div className="space-y-1 md:space-y-2">
                                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em]">Initialize Link?</h2>
                                        <p className="text-emerald-400/60 text-[8px] md:text-[10px] tracking-widest uppercase italic font-black">Neural Architecture Validation Sync</p>
                                    </div>
                                    <button
                                        onClick={startSession}
                                        className="group relative px-8 py-4 md:px-10 md:py-5 bg-emerald-500 text-[#020617] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs rounded-lg md:rounded-xl overflow-hidden hover:scale-105 transition-all shadow-lg"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30"></div>
                                        <span className="relative z-10">Enter_Simulation</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'PLAYING' && (
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full h-full flex flex-col items-center justify-center max-w-6xl mx-auto"
                            >
                                {/* Advanced Code Reactor */}
                                <div className="w-full relative group space-y-8 md:space-y-12 lg:space-y-20">
                                    {/* Console Decoration */}
                                    <div className="absolute -top-10 left-4 md:left-0 flex items-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400/60">
                                        <span className="flex items-center gap-1.5 md:gap-2"><Layers size={10} /> stream_v2.0</span>
                                        <span className="flex items-center gap-1.5 md:gap-2"><Command size={10} /> encryption_aes_256</span>
                                    </div>

                                    {/* Crystal Glass Body - Reduced Height */}
                                    <div className={`
                                        relative p-6 md:p-10 lg:p-14 bg-[#020617]/60 border-[1px] rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-[0_0_80px_rgba(16,185,129,0.03)]
                                        ${isWrong ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-emerald-500/20'}
                                        transition-all duration-300 w-full min-h-[200px] md:min-h-[280px] flex items-center
                                    `}>
                                        {/* Scanning Line overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-1/2 w-full animate-scanline pointer-events-none"></div>

                                        <div className="relative z-10 w-full min-h-[4rem] flex items-center">
                                            {/* Code Display with Cursor Glow - Wrapped in AnimatePresence for Smooth Transition */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentSnippet.text}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                                    className="text-[1.2rem] md:text-[1.8rem] lg:text-[clamp(1.5rem,3vw,2.4rem)] font-black font-mono leading-[1.2] tracking-tighter break-words text-center md:text-left w-full"
                                                >
                                                    {currentSnippet.text.split('').map((char, i) => {
                                                        let color = "text-emerald-500/20";
                                                        let glow = "";
                                                        if (i < userInput.length) {
                                                            const isCorrect = currentSnippet.text[i] === userInput[i];
                                                            color = isCorrect ? "text-emerald-400" : "text-rose-500";
                                                            glow = isCorrect ? "0 0 20px rgba(16, 185, 129, 0.4)" : "0 0 20px rgba(244, 63, 94, 0.4)";
                                                        }
                                                        return (
                                                            <span key={i} className={`relative inline-block ${color} transition-all duration-150`} style={{ textShadow: glow }}>
                                                                {char === ' ' ? '\u00A0' : char}
                                                                {/* Sync Cursor (Strictly in front of character) */}
                                                                {i === userInput.length && (
                                                                    <motion.span
                                                                        animate={{ opacity: [0, 1, 0] }}
                                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                                        className="absolute left-0 inset-y-0 w-[1.5px] md:w-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                                                    />
                                                                )}
                                                                {/* Final indicator if everything is typed but state hasn't advanced yet */}
                                                                {i === currentSnippet.text.length - 1 && userInput.length >= currentSnippet.text.length && (
                                                                    <motion.span
                                                                        animate={{ opacity: [0, 1, 0] }}
                                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                                        className="absolute -right-2 inset-y-0 w-[4px] bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,1)]"
                                                                    />
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        {/* Transparent Hidden Input */}
                                        <input
                                            autoFocus
                                            ref={inputRef}
                                            type="text"
                                            value={userInput}
                                            onChange={handleInputChange}
                                            disabled={isTransitioning}
                                            className={`absolute inset-0 w-full h-full opacity-0 ${isTransitioning ? 'cursor-wait' : 'cursor-default'}`}
                                            onBlur={(e) => !isTransitioning && e.target.focus()}
                                        />

                                        {/* Transition Overlay */}
                                        {isTransitioning && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-x-0 -bottom-6 flex items-center justify-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]"
                                            >
                                                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></div>
                                                Next Concept Syncing...
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Holographic Insight Dock - Tucked Closer with Unified Transition */}
                                    <div className="flex justify-center w-full mt-8 lg:mt-12">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentSnippet.text}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                className="relative p-5 md:p-7 bg-emerald-500/[0.04] border border-emerald-500/10 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-xl max-w-2xl w-full text-center overflow-hidden shadow-lg"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20"></div>
                                                <div className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2 md:mb-3">Neural_Optimization_Protocol</div>
                                                <p className="text-emerald-500/90 text-xs md:text-sm font-bold italic leading-relaxed px-4">
                                                    "{currentSnippet.desc}"
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'END' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#020617]/60 border border-emerald-500/20 p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[4rem] max-w-[90%] md:max-w-2xl w-full text-center shadow-2xl relative backdrop-blur-3xl overflow-hidden mt-[-10vh]"
                            >
                                <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>

                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="mb-6 md:mb-8 p-4 md:p-6 border-[1px] border-emerald-500/20 rounded-full inline-block"
                                >
                                    <Trophy size={clampValue(30, 48)} className="text-emerald-400" />
                                </motion.div>

                                <h2 className="text-[clamp(1.5rem,5vw,2.8rem)] font-black text-white uppercase tracking-tighter mb-3 md:mb-5 italic leading-none">Simulation<br />Terminated</h2>
                                <p className="text-emerald-400 font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[7px] md:text-[9px] mb-8 md:mb-12">Intelligence Retrieval Complete</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-12 text-left">
                                    <EndStat label="Concepts_Mastered" value={combo} />
                                    <EndStat label="Reflex_Rate" value={`${Math.floor(((combo * 20) / 5) / (60 / 60))} WPM`} />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                    <button
                                        onClick={startSession}
                                        className="flex-1 py-4 md:py-5 bg-emerald-500 text-[#020617] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-emerald-400 transition-all shadow-xl"
                                    >
                                        Restart_Loop
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="flex-1 py-4 md:py-5 border border-emerald-500/20 text-emerald-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-emerald-500/10 transition-all shadow-sm"
                                    >
                                        Seal_Nexus
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Vertical Data Stream Labels (Floating Deck) */}
                <div className="fixed bottom-8 right-8 space-y-4 opacity-10 hidden xl:block">
                    <VerticalTag label="ENC_V4" />
                    <VerticalTag label="NET_R" />
                    <VerticalTag label="CORE_X" />
                </div>
            </div>

            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
                .animate-scanline {
                    animation: scanline 4s linear infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
};

// Helper to handle scaling
const clampValue = (min, max) => {
    return `${Math.max(min, Math.min(max, (window?.innerWidth || 1200) * 0.05))}px`;
};

const HudModule = ({ label, value, critical, icon }) => (
    <div className={`px-4 py-3 md:px-6 md:py-4 bg-[#020617]/60 border-[1px] rounded-[1rem] md:rounded-[1.5rem] text-center backdrop-blur-2xl transition-all flex-1 min-w-[100px] max-w-[160px] ${critical ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)] animate-pulse' : 'border-emerald-500/10 shadow-lg'}`}>
        <div className="flex items-center justify-center gap-1 mb-1 text-emerald-400 font-black text-[7px] md:text-[8px] uppercase tracking-widest whitespace-nowrap">
            {icon} {label}
        </div>
        <div className={`text-lg md:text-2xl font-black italic tracking-tighter ${critical ? 'text-rose-400' : 'text-emerald-100'}`}>
            {value}
        </div>
    </div>
);

const EndStat = ({ label, value }) => (
    <div className="p-4 md:p-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[1.5rem] md:rounded-[2rem] shadow-inner">
        <div className="text-[7px] md:text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-xl md:text-3xl font-black text-white italic tracking-tighter">{value}</div>
    </div>
);

const VerticalTag = ({ label }) => (
    <div className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-[1em] text-emerald-500 border-l border-emerald-500/20 pl-2">
        {label}
    </div>
);

export default TerminalVelocity;
