import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Cloud, Trophy, Skull, RotateCcw, ChevronRight, Zap, Navigation, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BalloonSurvival = () => {
    const { skill } = useParams();
    const navigate = useNavigate();
    const { checkUser } = useAuth();

    const [gameState, setGameState] = useState('START'); // START, PLAYING, FEEDBACK, END
    const [runId, setRunId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [runState, setRunState] = useState({ balloonsCount: 5, altitude: 0, status: 'flying' });
    const [loading, setLoading] = useState(false);

    const startSession = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/balloon/start/${skill}`);
            setRunId(res.data.runId);
            setRunState(res.data.state);
            fetchQuestion(res.data.runId);
        } catch (err) {
            console.error(err);
            alert('Atmospheric Interference Detected. Connection Failed.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestion = async (rid) => {
        try {
            const res = await axios.get(`${API_URL}/balloon/question/${rid}`);
            if (res.data.finished) {
                endSession();
            } else {
                setCurrentQuestion(res.data.question);
                setGameState('PLAYING');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitAnswer = async (index) => {
        setSelectedAnswer(index);
        try {
            const res = await axios.post(`${API_URL}/balloon/answer/${runId}`, { selectedIndex: index });
            setFeedback(res.data);
            setGameState('FEEDBACK');

            setTimeout(() => {
                setRunState(res.data.state);
                if (res.data.state.finished) {
                    endSession();
                } else {
                    setFeedback(null);
                    setSelectedAnswer(null);
                    fetchQuestion(runId);
                }
            }, 1200);
        } catch (err) {
            console.error(err);
        }
    };

    const endSession = async () => {
        setGameState('END');
        await checkUser();
    };

    // Calculate balloon positions for visualization
    const balloonColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-purple-500'];

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
            {/* Dynamic Sky Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-400 to-sky-100 dark:from-slate-900 dark:to-indigo-950">
                <AnimatePresence>
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: '120%' }}
                            animate={{ x: '-120%' }}
                            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'linear', delay: i * 2 }}
                            className="absolute opacity-20 text-white"
                            style={{ top: `${15 + i * 15}%` }}
                        >
                            <Cloud size={64 + i * 20} className="fill-current" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

                {/* Visualizer: Balloon Cluster */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    <div className="game-card bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border-white/30 dark:border-white/10 p-8 rounded-[40px] shadow-2xl relative min-h-[500px] flex flex-col items-center">
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                            <Navigation size={16} className="text-white fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Altimeter</span>
                        </div>

                        {/* ALTITUDE INDICATOR */}
                        <div className="absolute right-6 top-6 bottom-6 w-1 bg-white/20 rounded-full flex flex-col-reverse">
                            <motion.div
                                animate={{ height: `${runState.altitude}%` }}
                                className="w-full bg-white shadow-[0_0_15px_white] rounded-full"
                            />
                        </div>

                        {/* BALLOONS */}
                        <div className="flex-1 flex items-center justify-center perspective-[1000px]">
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-48 h-64 flex flex-wrap justify-center content-center gap-4"
                            >
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="relative w-16 h-20">
                                        <AnimatePresence mode="wait">
                                            {i < runState.balloonsCount ? (
                                                <motion.div
                                                    key="balloon"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 2, opacity: 0 }}
                                                    className={`w-14 h-16 ${balloonColors[i]} rounded-full relative shadow-lg`}
                                                >
                                                    {/* String */}
                                                    <div className="absolute left-1/2 -bottom-4 w-0.5 h-6 bg-white/40 -translate-x-1/2"></div>
                                                    {/* Reflection */}
                                                    <div className="absolute top-2 left-2 w-4 h-6 bg-white/30 rounded-full rotate-[30deg]"></div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="pop"
                                                    initial={{ scale: 1 }}
                                                    animate={{ scale: 0 }}
                                                    className="flex items-center justify-center h-full text-white/50"
                                                >
                                                    <Zap size={24} className="animate-ping" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <div className="mt-auto space-y-4 w-full">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Efficiency</span>
                                    <div className="text-3xl font-black text-white italic tracking-tighter">{runState.balloonsCount} / 5</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Altitude</span>
                                    <div className="text-3xl font-black text-white italic tracking-tighter">{runState.altitude}m</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area: Questions */}
                <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
                    <div className="flex justify-between items-start px-2">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white drop-shadow-lg flex items-center gap-3">
                                Balloon Survival <Wind className="animate-pulse" size={28} />
                            </h1>
                            <p className="text-white/70 font-bold uppercase tracking-[0.3em] text-[10px]">{skill.toUpperCase()} // FLIGHT TEST</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-indigo-600 border border-white/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Return
                        </button>
                    </div>

                    <div className="game-card bg-white/10 dark:bg-slate-900/40 border-white/20 dark:border-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[48px] shadow-2xl min-h-[450px] flex flex-col items-center justify-center relative">

                        <AnimatePresence mode="wait">
                            {gameState === 'START' && (
                                <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-10">
                                    <div className="space-y-4">
                                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto border-2 border-white/20 shadow-xl">
                                            <Cloud size={48} className="text-white" />
                                        </div>
                                        <h2 className="text-2xl font-black text-white uppercase italic tracking-widest">Launch Protocol Ready</h2>
                                        <p className="max-w-md mx-auto text-white/70 text-sm font-medium leading-relaxed">
                                            Keep your balloons afloat. Correct answers lift you higher. Wrong answers pop a balloon. Finish the route with at least one balloon left.
                                        </p>
                                    </div>
                                    <button
                                        onClick={startSession}
                                        disabled={loading}
                                        className="px-12 py-5 bg-white text-indigo-600 font-black uppercase text-sm tracking-[0.4em] rounded-2xl shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {loading ? 'Initializing...' : 'Lift Off'}
                                    </button>
                                </motion.div>
                            )}

                            {gameState === 'PLAYING' && currentQuestion && (
                                <motion.div key="playing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-12">
                                    <div className="text-center space-y-6">
                                        <div className="h-1 w-24 bg-white/20 mx-auto rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ x: [-100, 100] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="h-full w-1/2 bg-white"
                                            />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase italic drop-shadow-sm">
                                            "{currentQuestion.text}"
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQuestion.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => !selectedAnswer && submitAnswer(i)}
                                                disabled={selectedAnswer !== null}
                                                className={`group p-6 border-2 rounded-3xl text-left transition-all shadow-lg ${selectedAnswer === i
                                                    ? 'bg-white text-indigo-600 border-white'
                                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-black uppercase tracking-tight">{opt}</span>
                                                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {gameState === 'FEEDBACK' && feedback && (
                                <motion.div key="feedback" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 ${feedback.isCorrect ? 'bg-white/20 border-white text-white' : 'bg-red-500/20 border-red-500 text-red-500'
                                        }`}>
                                        {feedback.isCorrect ? <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity }}><Wind size={64} /></motion.div> : <Zap size={64} className="animate-pulse" />}
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                                            {feedback.isCorrect ? 'Ascending' : 'Balloon Pop!'}
                                        </h2>
                                        <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">
                                            {feedback.isCorrect ? 'Gaining altitude...' : 'Atmospheric failure...'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {gameState === 'END' && (
                                <motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
                                    <div className="space-y-4">
                                        {runState.status === 'landed' ? (
                                            <Trophy size={80} className="text-white mx-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                                        ) : (
                                            <Skull size={80} className="text-white/20 mx-auto" />
                                        )}
                                        <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                                            {runState.status === 'landed' ? 'Mission Success' : 'Crash Landing'}
                                        </h2>
                                        <p className="text-white/50 font-black uppercase tracking-[0.4em] text-[10px]">Flight Data Synced to Neural Log</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                        <HudCard label="Result" value={runState.status.toUpperCase()} />
                                        <HudCard label="Altitude" value={`${runState.altitude}m`} />
                                    </div>

                                    <div className="flex gap-4 max-w-sm mx-auto w-full">
                                        <button onClick={() => setGameState('START')} className="flex-1 py-4 bg-white text-indigo-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2">
                                            <RotateCcw size={16} /> Fly Again
                                        </button>
                                        <button onClick={() => navigate('/dashboard')} className="flex-1 py-4 bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/20">
                                            Ground Control
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HudStat = ({ label, value, color }) => (
    <div className="space-y-1">
        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block">{label}</span>
        <div className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</div>
    </div>
);

const HudCard = ({ label, value }) => (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
        <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-white italic">{value}</div>
    </div>
);

export default BalloonSurvival;
