import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Shield, TrendingUp, Skull, Trophy, ChevronRight, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GameRun = () => {
    const { skill } = useParams();
    const navigate = useNavigate();
    const { checkUser } = useAuth();

    const [runId, setRunId] = useState(null);
    const [state, setState] = useState(null);
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [finishReason, setFinishReason] = useState('');

    const startRun = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/run/start/${skill}`);
            setRunId(res.data.runId);
            setState(res.data.state);
            setQuestion(res.data.currentQuestion);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start neural journey');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        startRun();
    }, [skill]);

    const submitAnswer = async (index) => {
        if (selectedAnswer !== null || feedback) return;

        setSelectedAnswer(index);
        try {
            const res = await axios.post(`${API_URL}/run/answer/${runId}`, { answerIndex: index });

            setFeedback(res.data.isCorrect ? 'correct' : 'wrong');

            // Wait for feedback animation
            setTimeout(async () => {
                const newState = res.data.state;
                setState(newState);

                if (newState.finished) {
                    setFinishReason(res.data.finishReason);
                    setShowResults(true);
                    await checkUser(); // Refresh XP/Level on end
                } else {
                    setQuestion(res.data.nextQuestion);
                    setSelectedAnswer(null);
                    setFeedback(null);
                }
            }, 1000);

        } catch (err) {
            alert(err.response?.data?.message || 'Neural Link Error');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 border-t-4 border-indigo-500 rounded-full"
                />
                <h2 className="text-xl font-black uppercase tracking-[0.3em] text-indigo-500 animate-pulse">Initializing Neural Path...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game-card border-red-500/50 bg-red-500/5 p-12 text-center max-w-2xl mx-auto mt-10">
                <AlertTriangle className="mx-auto text-red-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-black uppercase mb-4">Journey Interrupted</h2>
                <p className="text-slate-400 mb-8">{error}</p>
                <button onClick={() => navigate('/roadmap')} className="btn-primary px-8 py-3">Return to Roadmap</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 relative pb-20">
            {/* Top HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sticky top-24 z-50">
                <motion.div
                    className="game-card p-3 flex items-center gap-3 border-red-500/20 shadow-lg"
                    animate={{ scale: feedback === 'wrong' ? [1, 1.1, 1] : 1 }}
                >
                    <Heart className={`w-5 h-5 ${state.health < 40 ? 'text-red-500 animate-pulse' : 'text-red-500'}`} fill="currentColor" />
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Health</div>
                        <div className="text-lg font-black leading-none">{state.health}%</div>
                    </div>
                </motion.div>

                <motion.div
                    className="game-card p-3 flex items-center gap-3 border-amber-500/20 shadow-lg"
                    animate={{ scale: feedback === 'correct' ? [1, 1.1, 1] : 1 }}
                >
                    <Zap className="w-5 h-5 text-amber-500" fill="currentColor" />
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Speed</div>
                        <div className="text-lg font-black leading-none">{state.speed}u/s</div>
                    </div>
                </motion.div>

                <div className="game-card p-3 flex items-center gap-3 border-indigo-500/20 shadow-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Combo</div>
                        <div className="text-lg font-black leading-none">x{state.combo}</div>
                    </div>
                </div>

                <div className="game-card p-3 flex items-center gap-3 border-emerald-500/20 shadow-lg">
                    <Trophy className="w-5 h-5 text-emerald-500" />
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</div>
                        <div className="text-lg font-black leading-none">{state.score.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Journey Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                    <span>Distance: {state.distance}km</span>
                    <span>Progress: {state.currentIndex}/{state.totalQuestions} Events</span>
                </div>
                <div className="h-4 bg-slate-900 border border-slate-800 rounded-full p-1 overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(state.currentIndex / state.totalQuestions) * 100}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full relative"
                    >
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 text-white"
                        >
                            <Zap size={14} fill="currentColor" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Main Interactive Scene */}
            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.div
                        key={question?._id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                    >
                        <div className="game-card p-8 md:p-12 relative overflow-hidden bg-slate-900 shadow-2xl min-h-[400px] flex flex-col justify-center border-white/5">
                            {/* Visual Effect Layer */}
                            <div className="absolute inset-0 pointer-events-none opacity-20">
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>

                            <div className="relative z-10 text-center space-y-8">
                                <div className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-indigo-500/20">
                                    Incoming Obstacle Triggered
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
                                    {question.question}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {question.options.map((option, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => submitAnswer(idx)}
                                            disabled={!!feedback}
                                            className={`
                                                p-5 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center group
                                                ${selectedAnswer === idx ? (feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-red-500 bg-red-500/10 text-red-500')
                                                    : 'border-slate-800 bg-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-300'}
                                            `}
                                        >
                                            <span className="flex-grow">{option}</span>
                                            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${selectedAnswer === idx ? 'opacity-100' : 'opacity-0'}`} />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 py-10"
                    >
                        <div className="game-card p-12 bg-slate-900 border-indigo-500/20 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 inset-x-4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                            {finishReason === 'GOAL_REACHED' ? (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 animate-bounce">
                                        <Trophy className="text-emerald-500 w-12 h-12" strokeWidth={3} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Goal Reached!</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Neural Network Synchronized Successfully</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                        <Skull className="text-red-500 w-12 h-12" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Journey Critical</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Internal Systems Overheated - Repair Required</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 py-8 border-y border-slate-800">
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Score</div>
                                    <div className="text-2xl font-black text-indigo-400">{state.score.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Earned</div>
                                    <div className="text-2xl font-black text-emerald-400">+{state.score}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Max Combo</div>
                                    <div className="text-2xl font-black text-amber-500">x{state.combo}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                                    <div className={`text-sm font-black uppercase px-2 py-1 rounded-lg ${finishReason === 'GOAL_REACHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                                        {finishReason === 'GOAL_REACHED' ? 'SYNCHED' : 'ABORTED'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                                <button onClick={() => startRun()} className="btn-primary px-10 py-4 flex items-center gap-3">
                                    <Zap size={18} fill="currentColor" /> Re-engage Link
                                </button>
                                <button onClick={() => navigate('/roadmap')} className="px-10 py-4 bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 transition-all">
                                    Portal Return
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Visualizations */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="grid grid-cols-12 h-screen w-screen opacity-10">
                    {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-indigo-500/10 h-full w-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameRun;
