import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CLASSES = ['All', 'Frontend Warrior', 'Data Mage', 'Cloud Engineer', 'Cyber Ninja', 'AI Architect', 'DevOps Paladin', 'UI/UX Sorcerer', 'Mobile Monk', 'Blockchain Bard', 'QA Shadow', 'Data Warden', 'Backend Titan'];

const Leaderboard = () => {
    const { theme } = useTheme();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('All');

    useEffect(() => {
        const fetchLeaders = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/leaderboard`, {
                    params: { characterClass: selectedClass }
                });
                setLeaders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, [selectedClass]);

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="relative inline-block">
                    <Crown className="text-amber-400 w-16 h-16 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                </div>
                <h1 className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme === 'light' ? 'from-indigo-600 via-indigo-500 to-purple-600' : 'from-amber-400 via-amber-200 to-amber-500'} uppercase tracking-tighter italic`}>Hall of Fame</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">The world's most elite skill warriors</p>
            </motion.div>

            {/* Category Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CLASSES.map((cls) => (
                    <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClass === cls
                            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                            : (theme === 'light' ? 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 shadow-sm' : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800')
                            }`}
                    >
                        {cls}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Zap className="text-amber-500 animate-pulse" size={32} />
                    <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Rankings...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {leaders.length > 0 ? leaders.map((player, index) => (
                        <motion.div
                            key={player._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01, x: 5 }}
                            className={`relative game-card group border-none transition-all ${index === 0 ? (theme === 'light' ? 'border-l-4 border-amber-500 bg-amber-50/50 shadow-lg' : 'border-l-4 border-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent shadow-amber-500/10 shadow-lg') :
                                index === 1 ? (theme === 'light' ? 'border-l-4 border-slate-300 bg-slate-50' : 'border-l-4 border-slate-300 bg-gradient-to-r from-slate-300/5 to-transparent') :
                                    index === 2 ? (theme === 'light' ? 'border-l-4 border-amber-700 bg-amber-50/10' : 'border-l-4 border-amber-700 bg-gradient-to-r from-amber-700/5 to-transparent') :
                                        'border-l-4 border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 flex justify-center items-center">
                                    {index === 0 ? <Crown className="text-amber-400 drop-shadow-glow" size={32} /> :
                                        index === 1 ? <Medal className="text-slate-300" size={28} /> :
                                            index === 2 ? <Medal className="text-amber-700" size={24} /> :
                                                <span className={`text-xl font-black ${theme === 'light' ? 'text-slate-300' : 'text-slate-700'} font-mono`}>#{index + 1}</span>}
                                </div>

                                <div className="relative">
                                    <div className={`absolute -inset-1 blur-md transition-opacity opacity-0 group-hover:opacity-100 ${index === 0 ? 'bg-amber-500' : 'bg-indigo-500'
                                        }`}></div>
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}&mouth=smile`}
                                        alt=""
                                        className={`relative w-14 h-14 rounded-2xl bg-slate-950 border-2 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'} p-1 object-cover`}
                                    />
                                    {index === 0 && (
                                        <div className="absolute -top-1 -right-1 bg-amber-500 p-1 rounded-full border-2 border-slate-900">
                                            <Zap size={8} className="text-white fill-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`font-black uppercase tracking-tighter text-xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{player.username}</div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-800 text-slate-500'}`}>LVL {player.level}</span>
                                    </div>
                                    <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1 opacity-70">{player.characterClass || 'Apprentice'}</div>
                                </div>

                                <div className="text-right space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Power Score</div>
                                    <div className="flex items-center justify-end gap-2 text-2xl font-black italic">
                                        <span className={`${index === 0 ? 'text-amber-400' : (theme === 'light' ? 'text-slate-900' : 'text-white')
                                            }`}>{player.xp.toLocaleString()}</span>
                                        <Star size={14} className="text-amber-500 fill-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No warriors found in this sector yet.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center pt-8">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Universal Rankings Synchronized</p>
            </div>
        </div>
    );
};

export default Leaderboard;
