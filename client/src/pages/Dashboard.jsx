import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Target, Award, TrendingUp, Star, Briefcase, ChevronRight, Lock, CheckCircle2, Activity, ShieldAlert, Cpu, RotateCcw, Terminal } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILL_TARGETS } from '../constants/skillTargets';

import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [analysisReport, setAnalysisReport] = useState(null);
    const [skillGapReport, setSkillGapReport] = useState(null);
    const [showGapModal, setShowGapModal] = useState(false);
    const [showRadar, setShowRadar] = useState(true);

    useEffect(() => {
        console.log('DASHBOARD: Syncing state for', user?.username, 'XP:', user?.xp);

        const fetchAnalysis = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/analysis`);
                setAnalysisReport(res.data);
            } catch (err) {
                console.error('Failed to fetch analysis:', err);
            }
        };

        const fetchSkillGap = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/skill-gap`);
                setSkillGapReport(res.data.report);
            } catch (err) {
                console.error('Failed to fetch skill gap:', err);
            }
        };

        fetchAnalysis();
        fetchSkillGap();

        const fetchData = async () => {
            if (!user) return;
            try {
                // 1. Fetch Personalized chain for the "Projects" section
                const targets = SKILL_TARGETS[user.characterClass] || [];
                const chainRes = await axios.post(`${API_URL}/missions/generate-chain`, {
                    requirements: targets
                });

                if (chainRes.data.missions && chainRes.data.missions.length > 0) {
                    setProjects(chainRes.data.missions.slice(0, 2));
                } else {
                    const fallback = await axios.get(`${API_URL}/missions`);
                    setProjects(fallback.data.filter(m => (m.role === user.characterClass || m.role === 'All') && m.isProject && m.status !== 'completed').slice(0, 2));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user.characterClass, user.xp]);

    if (!user) return null;

    const targets = SKILL_TARGETS[user.characterClass] || [];

    // PERFORMANCE MULTIPLIER for the graph and stability
    const syncMultiplier = user.syncRate || 1;

    // Create combined data for Radar: Actual vs Target
    const skillData = targets.map(t => {
        const actualSkill = (user.skills || []).find(s => s && s.name && s.name.toLowerCase() === t.name.toLowerCase());

        let mastery = 0;
        if (actualSkill) {
            const pointMastery = (actualSkill.skillPoints || 0) / 40;
            const levelMastery = (actualSkill.level || 0) + ((actualSkill.xp || 0) / 100);
            mastery = Math.max(pointMastery, levelMastery);
        }

        // The graph increases/decreases based on current performance (Neural Sync Rate)
        const performanceMastery = mastery * syncMultiplier;

        return {
            subject: t.name,
            Actual: Number(performanceMastery.toFixed(2)),
            Target: t.level,
            fullMark: 100,
        };
    });

    // ROLE XP PROGRESS LOGIC:
    // We synchronize with the User's Power Score (Profile XP)
    // The Mastery Goal (100,000) represents a specialized warrior (Quests + Quizzes + Sync + Games)
    // Level 20 is approximately 100,000 XP in the quadratic progression engine.
    // PHASE 1 MASTERY: The "Career Foundation" milestone (Approx. Level 20 in the quadratic curve)
    const masteryGoal = 100000;
    const securedRoleXP = user.xp;
    const progress = Math.min(100, (securedRoleXP / masteryGoal) * 100);
    const displayLevel = user.level; // Use persistent backend level for the avatar badge

    // Calculate total gap
    const totalGapPoints = skillData.reduce((acc, s) => acc + Math.max(0, s.Target - s.Actual), 0);
    const denominator = targets.length > 0 ? targets.length * 100 : 1;
    const gapPercentage = Math.round((totalGapPoints / denominator) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
        >
            {/* Profile Header - Premium Glassmorphism */}
            <div className="game-card relative overflow-hidden border-indigo-500/30 bg-slate-900/40 backdrop-blur-xl">
                {/* Evolution Tier Background Hint */}
                <div className="absolute top-0 right-10 p-0 opacity-[0.03] pointer-events-none select-none">
                    <span className="text-[180px] font-black uppercase italic tracking-tighter">{user.evolutionTier}</span>
                </div>

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-32 h-32 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&mouth=smile`}
                                alt="Avatar"
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-2 -right-2 bg-indigo-600 px-4 py-1.5 rounded-full text-sm font-black shadow-lg border-2 border-slate-800"
                        >
                            LVL {displayLevel}
                        </motion.div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <h1 className={`text-4xl font-black italic tracking-tighter drop-shadow-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                    {user.username}
                                </h1>
                                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                                    {user.evolutionTier}
                                </span>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <Shield className="text-indigo-400" size={14} />
                                    <span className="text-sm font-black text-indigo-100 uppercase tracking-widest">
                                        {user.characterClass || 'Classless'}
                                    </span>
                                </div>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                                <div className="flex items-center gap-2 text-amber-500 italic font-bold">
                                    <Star size={14} />
                                    <span className="tracking-tight text-sm">{user.rank}</span>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-md mx-auto md:mx-0">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Neural Phase Progress</span>
                                <span className="text-xs font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                                    {user.xp.toLocaleString()} <span className="text-slate-600 font-medium">/ 100k <span className="text-[8px]">XP (PHASE 1)</span></span>
                                </span>
                            </div>
                            <div className="xp-bar-container">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="xp-bar-fill"
                                ></motion.div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="game-card p-4 min-w-[110px] text-center group cursor-help transition-all hover:bg-emerald-500/5 hover:border-emerald-500/30" title="Sync Rate: Multiplier for XP gains based on consistency.">
                            <Activity className="w-6 h-6 text-emerald-500 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                            <div className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Sync Rate</div>
                            <div className="text-2xl font-black text-emerald-400">{user.syncRate?.toFixed(2)}x</div>
                        </div>
                        <div className="game-card p-4 min-w-[110px] text-center transition-all hover:bg-amber-500/5 hover:border-amber-500/30">
                            <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
                            <div className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Streak</div>
                            <div className="text-2xl font-black text-white">{user.streak}d</div>
                        </div>
                        <div className="game-card p-4 min-w-[110px] text-center transition-all hover:bg-indigo-500/5 hover:border-indigo-500/30">
                            <Award className="w-6 h-6 text-indigo-500 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                            <div className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Badges</div>
                            <div className="text-2xl font-black text-white">{user.badges?.length || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Projects */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Skill Radar - THE GAP VISUALIZER */}
                    <div className="game-card relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <TrendingUp className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">Neural Network</h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Efficiency Analysis (Sync: {user.syncRate?.toFixed(2)}x)</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Performance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Protocol</span>
                                </div>
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {showRadar ? (
                                <motion.div 
                                    key="radar"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-[450px] w-full flex items-center justify-center relative"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                            <PolarGrid stroke={theme === 'light' ? '#e2e8f0' : '#1e293b'} />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: theme === 'light' ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                            />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Target Profile"
                                                dataKey="Target"
                                                stroke={theme === 'light' ? '#cbd5e1' : '#334155'}
                                                strokeWidth={1}
                                                fill={theme === 'light' ? '#f1f5f9' : '#1e293b'}
                                                fillOpacity={theme === 'light' ? 0.7 : 0.3}
                                            />
                                            <Radar
                                                name="Current Skill"
                                                dataKey="Actual"
                                                stroke="#6366f1"
                                                strokeWidth={4}
                                                fill="url(#radarGradient)"
                                                fillOpacity={0.75}
                                            />
                                            <defs>
                                                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.4} />
                                                </linearGradient>
                                            </defs>
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="grid"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-[450px] w-full grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar p-2"
                                >
                                    {skillData.map((s, idx) => (
                                        <div key={idx} className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group/card hover:border-indigo-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                                    <Cpu size={16} className="text-indigo-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-700">0{idx + 1}</span>
                                            </div>
                                            
                                            <div className="space-y-1 mb-6">
                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-8 line-clamp-2">{s.subject}</h4>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-white italic">{Math.round(s.Actual)}%</span>
                                                    <span className="text-[10px] font-bold text-slate-600">/ {s.Target}%</span>
                                                </div>
                                            </div>

                                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (s.Actual / s.Target) * 100)}%` }}
                                                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1] group-hover/card:bg-indigo-400 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 flex justify-center relative z-10">
                            <button
                                onClick={() => setShowRadar(!showRadar)}
                                className="group flex items-center gap-3 px-8 py-3 bg-slate-900 border border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all shadow-xl"
                            >
                                <div className="p-1.5 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                    {showRadar ? <Activity size={14} className="text-indigo-400 group-hover:text-white" /> : <TrendingUp size={14} className="text-indigo-400 group-hover:text-white" />}
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                    {showRadar ? 'Enable Detailed Metrics' : 'Switch to Neural Radar'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* GAP ANALYSIS PANEL - REVAMPED */}
                    <div className="game-card border-slate-800 bg-slate-900/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Target size={120} className="text-indigo-500" />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase italic">Neural Proficiency Audit</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strategic growth paths identified</p>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                {skillData.filter(s => s.Target > s.Actual).length} EVOLUTION TARGETS
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {skillData.filter(s => s.Target > s.Actual).sort((a, b) => (b.Target - b.Actual) - (a.Target - a.Actual)).slice(0, 4).map((s, i) => {
                                const gap = s.Target - s.Actual;
                                const priority = s.Actual === 0 ? 'PENDING' : gap > 40 ? 'CRITICAL' : gap > 20 ? 'HIGH' : 'STANDARD';
                                const advice = s.Actual === 0 ? "Initial sync required. Engage foundational modules to bridge the gap." :
                                    gap > 40 ? "Substantial growth margin. Recommended for focused development cycle." :
                                        gap > 20 ? "Optimizable proficiency identified. Training will enhance performance." :
                                            "Fine-tuning required to reach peak sector mastery.";

                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        className="flex flex-col md:flex-row md:items-center gap-6 p-5 bg-slate-800/10 border border-slate-800/50 rounded-2xl group hover:border-red-500/30 transition-all hover:bg-slate-800/20"
                                    >
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-white uppercase text-base tracking-tight">{s.subject}</h4>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm ${priority === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' :
                                                    priority === 'HIGH' ? 'bg-orange-500 text-white' :
                                                        priority === 'PENDING' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                                                            'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {priority} {priority === 'PENDING' ? 'SCAN' : 'PRIORITY'}
                                                </span>
                                                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded ml-auto md:ml-0">{Math.ceil(gap)} Levels Remaining</span>
                                            </div>

                                            <div className="relative h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute left-0 top-0 h-full bg-slate-700"
                                                    style={{ width: `${s.Target}%` }}
                                                ></div>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${s.Actual}%` }}
                                                    className={`absolute left-0 top-0 h-full ${priority === 'CRITICAL' ? 'bg-red-500' : 'bg-indigo-500'}`}
                                                ></motion.div>
                                            </div>

                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <p className="text-slate-500 italic uppercase flex items-center gap-2">
                                                    <Activity size={12} className="text-indigo-500" />
                                                    Neural Directive: <span className="text-slate-400">{advice}</span>
                                                </p>
                                                <span className="text-slate-600 uppercase tracking-tighter">{s.Actual}% / {s.Target}%</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/balloon-survival/${s.subject}`)}
                                                className="flex-1 md:flex-initial px-5 py-2.5 bg-red-500 text-[10px] font-black uppercase text-white rounded-lg hover:bg-red-600 transition-all shadow-lg shadow-red-500/10 hover:shadow-red-500/20 flex items-center justify-center gap-2"
                                            >
                                                <Zap size={14} className="fill-white" />
                                                Train
                                            </button>
                                            <button
                                                onClick={() => navigate('/roadmap')}
                                                className="flex-1 md:flex-initial px-5 py-2.5 bg-slate-800 text-[10px] font-black uppercase text-slate-400 rounded-lg hover:bg-slate-700 transition-all border border-slate-700 hover:text-white"
                                            >
                                                Quests
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Project Quests - Replaced with Terminal Velocity Entry */}
                    <div className="game-card border-emerald-500/10 bg-emerald-500/[0.01] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                                <Terminal className="text-emerald-400 group-hover:scale-110 transition-transform" size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">Neural <span className="text-emerald-500">Sprint</span></h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">High-Frequency Data Input</p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/terminal-velocity')}
                            className="relative z-10 p-8 rounded-[2.5rem] border border-emerald-500/10 bg-[#020617] hover:bg-emerald-500/[0.02] hover:border-emerald-500/30 transition-all cursor-pointer group/game overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <div className="flex justify-between items-start mb-10">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <Activity size={10} className="text-emerald-400 animate-pulse" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Kernel Link Ready</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-tight">Terminal <br /> Velocity</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">Elite Challenge</span>
                                    <div className="text-2xl font-black text-emerald-400 mt-2">WPM REFLEX</div>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mb-12">
                                Synchronize your typing speed with the neural core. Execute code snippets perfectly to maintain your connection.
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-emerald-900">
                                    <Cpu size={18} />
                                    <div className="h-[2px] w-24 bg-emerald-900/30 relative overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-100, 100] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="absolute inset-0 bg-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 py-2 px-6 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    Initialize Link <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Map & Badges */}
                <div className="space-y-8">
                    {/* Visual Career Map - Premium Glassy Aesthetic */}
                    {/* Neural Skill Matrix - High Fidelity Grid */}
                    <div className="game-card border-none bg-slate-950/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_70%)]"></div>
                        
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors shadow-inner">
                                    <Cpu className="text-indigo-400 group-hover:scale-110 transition-transform" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">Skill Matrix</h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Neural Specialization</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {user.skills.slice(0, 4).map((skill, i) => {
                                const isUnlocked = skill.level >= 10;
                                return (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => navigate(`/bird-game/${skill.name}`)}
                                        className={`p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer group/skill relative overflow-hidden ${
                                            isUnlocked 
                                            ? 'bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/80 shadow-2xl' 
                                            : 'bg-slate-950/20 border-white/[0.05] hover:border-white/20 hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover/skill:border-indigo-500/50 transition-all">
                                                {isUnlocked ? <Zap size={18} className="text-indigo-400 fill-indigo-400/20" /> : <Lock size={16} className="text-slate-600" />}
                                            </div>
                                            <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10 uppercase tracking-widest">
                                                LV {Math.floor(skill.level / 10)}
                                            </div>
                                        </div>

                                        <h4 className={`text-lg font-black uppercase tracking-tight mb-4 ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                                            {skill.name}
                                        </h4>

                                        <div className="relative h-1.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.level}%` }}
                                                className={`h-full rounded-full ${
                                                    isUnlocked ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-slate-800'
                                                }`}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 relative z-10 flex items-center justify-between">
                            <div className="flex -space-x-3">
                                {user.skills.slice(0, 3).map((s, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-4 border-slate-950 bg-indigo-600 flex items-center justify-center shadow-lg">
                                        <Star size={12} className="text-white fill-current" />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                                    +{user.skills.length - 3}
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/roadmap')}
                                className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors group/link"
                            >
                                Open Full Roadmap <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Neural Analysis Report Card - Enhanced Data Visualization */}
                    <div
                        onClick={() => setShowGapModal(true)}
                        className={`game-card relative overflow-hidden transition-all duration-700 mb-8 cursor-pointer group bg-black shadow-2xl ${analysisReport?.available ? 'border-indigo-500/40' : 'border-white/5 opacity-80'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl border transition-colors duration-500 ${analysisReport?.available ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg tracking-tighter uppercase italic leading-none">Neural Analysis</h3>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">v4.0 Core Protocol</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Access Gap Report</span>
                                <ChevronRight size={10} className="text-indigo-400" />
                            </div>
                        </div>

                        {!analysisReport?.available ? (
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                    <Lock className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Incomplete Matrix</p>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase italic">
                                            Sync {10 - (analysisReport?.count || 0)} more data shards for scan
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                                        <span>Synthesis Progress</span>
                                        <span>{((analysisReport?.count || 0) / 10) * 100}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((analysisReport?.count || 0) / 10) * 100}%` }}
                                            className="h-full bg-slate-800"
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-3xl group-hover:border-emerald-500/30 transition-all duration-500">
                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Peak Proficiency
                                        </div>
                                        <div className="text-sm font-black text-white italic truncate">{analysisReport.strongestSkill}</div>
                                    </div>
                                    <div className="p-5 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-3xl group-hover:border-indigo-500/30 transition-all duration-500">
                                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            Focus Area
                                        </div>
                                        <div className="text-sm font-black text-white italic truncate">{analysisReport.weakestSkill}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Stability</span>
                                            <span className="text-2xl font-black text-white tracking-tighter italic leading-none mt-1">{analysisReport.overallAccuracy}%</span>
                                        </div>
                                        <div className="p-2bg-white/5 rounded-xl border border-white/10">
                                            <Shield className="text-indigo-400" size={16} />
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${analysisReport.overallAccuracy}%` }}
                                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                        ></motion.div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                                        <Target size={20} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">Neural Recommendation</p>
                                        <p className="text-sm font-black text-white italic uppercase tracking-tighter mt-1">
                                            PRIORITY TARGET :: <span className="text-amber-400">{analysisReport.recommendedFocus}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active Quest Chain - Real Mission Data */}
                    {projects && projects.length > 0 && (
                        <div className="game-card border-indigo-500/10 bg-indigo-500/[0.01] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                                        <Briefcase className="text-indigo-400 group-hover:scale-110 transition-transform" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-white">Active <span className="text-indigo-500">Quests</span></h2>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Directives for Evolution</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {projects.map((project, idx) => (
                                    <motion.div
                                        key={project._id || idx}
                                        whileHover={{ x: 5 }}
                                        onClick={() => navigate('/roadmap')}
                                        className="p-5 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group/quest overflow-hidden relative"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase ${
                                                project.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                project.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-rose-500/20 text-rose-400'
                                            }`}>
                                                {project.difficulty} Protocol
                                            </span>
                                            <span className="text-[10px] font-black text-amber-500">+{project.xpReward} XP</span>
                                        </div>
                                        <h4 className="text-base font-black text-white uppercase tracking-tight mb-2 group-hover/quest:text-indigo-400 transition-colors">{project.title}</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{project.skill} SPECIALIZATION</span>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-700 group-hover/quest:text-white transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Badge Wall - Premium Illuminated Trophy Case */}
                    <div className="game-card border-white/5 bg-white/[0.01] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-purple-500/40 transition-colors">
                                <Award className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">Collection</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Special Achievement Shards</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 relative z-10">
                            {user.badges && user.badges.length > 0 ? (
                                user.badges.map((b, i) => {
                                    const badge = b.badgeId || { name: 'Unknown', icon: 'Star', description: 'Legendary Shard' };
                                    return (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            onClick={() => setSelectedBadge(badge)}
                                            className="aspect-square rounded-3xl border border-white/10 bg-white/[0.03] shadow-lg flex items-center justify-center transition-all group/badge relative cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.08]"
                                            title={badge.description}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity rounded-3xl"></div>
                                            <div className="transform transition-transform text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                                                {badge.icon === 'Star' ? <Star size={28} fill="currentColor" /> :
                                                    badge.icon === 'Award' ? <Award size={28} fill="currentColor" /> :
                                                        badge.icon === 'Zap' ? <Zap size={28} fill="currentColor" /> :
                                                            badge.icon === 'Shield' ? <Shield size={28} fill="currentColor" /> :
                                                                badge.icon === 'Trophy' ? <Award size={28} fill="currentColor" /> :
                                                                    <Star size={28} fill="currentColor" />}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1 border-2 border-[#030712] shadow-lg">
                                                <CheckCircle2 size={10} className="text-white" />
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="col-span-4 py-16 text-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <Lock size={32} className="text-slate-600" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No trophies synthesized yet</p>
                                    </div>
                                </div>
                            )}

                            {/* Locked Slots */}
                            {Array.from({ length: Math.max(0, 4 - (user.badges?.length || 0)) }).map((_, i) => (
                                <div key={`lock-${i}`} className="aspect-square rounded-3xl border border-white/5 bg-white/[0.01] flex items-center justify-center scale-90 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Lock size={20} className="text-slate-600" />
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-[10px] text-center font-bold text-slate-600 uppercase tracking-widest">
                            {user.badges?.length || 0} COLLECTABLES ACHIEVED
                        </p>
                    </div>

                    {/* Sector Global Feed - Premium Filler & Immersion */}
                    <div className="game-card border-none bg-indigo-500/[0.02] relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Sector Status :: Stable</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 transition-all hover:translate-x-1 group/row cursor-default">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black group-hover/row:border-indigo-500/50 transition-colors">#1</div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Global Architect</p>
                                    <p className="text-xs font-bold text-slate-200 uppercase tracking-tight">Vortex_Quantum</p>
                                </div>
                                <div className="ml-auto text-[10px] font-black text-indigo-400 italic">482k XP</div>
                            </div>

                            <div className="flex items-center gap-4 py-4 border-t border-white/[0.03] transition-all hover:translate-x-1 group/row cursor-default">
                                <div className="relative">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&mouth=smile`}
                                        className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30"
                                        alt="Current User"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-slate-950"></div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Your Sector Standing</p>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight italic">{user.rank}</p>
                                </div>
                                <div className="ml-auto flex flex-col items-end">
                                    <span className="text-[10px] font-black text-white">{user.xp.toLocaleString()}</span>
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Current Sync</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    onClick={() => navigate('/leaderboard')}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all"
                                >
                                    View Global Leaderboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badge Detail Modal */}
            <AnimatePresence>
                {selectedBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedBadge(null)}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-indigo-500/30 p-8 rounded-[32px] max-w-sm w-full shadow-2xl relative overflow-hidden text-center"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                {selectedBadge.icon === 'Star' ? <Star size={40} className="text-amber-500 fill-amber-500" /> :
                                    selectedBadge.icon === 'Award' ? <Award size={40} className="text-indigo-500 fill-indigo-500" /> :
                                        selectedBadge.icon === 'Zap' ? <Zap size={40} className="text-amber-400 fill-amber-400" /> :
                                            selectedBadge.icon === 'Shield' ? <Shield size={40} className="text-emerald-500 fill-emerald-500" /> :
                                                <Star size={40} className="text-slate-400" />}
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{selectedBadge.name}</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">{selectedBadge.description}</p>
                            <div className="py-3 px-6 bg-slate-800 rounded-2xl inline-block border border-slate-700">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Achievement Unlocked</span>
                            </div>
                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                            >
                                <Lock size={16} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mastery Trajectory Analysis (Proficiency Audit) Modal - Redesigned for Clarity & WOW factor */}
            <AnimatePresence>
                {showGapModal && skillGapReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowGapModal(false)}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-6 md:p-12 bg-slate-950/90 backdrop-blur-xl overflow-hidden"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0f1d] border border-white/10 rounded-[3rem] max-w-5xl w-full shadow-[0_0_150px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Technical Grid Background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                            <div className="relative flex flex-col h-full overflow-hidden">
                                {/* Refined Header */}
                                <div className="p-10 md:p-12 pb-6 flex items-start justify-between shrink-0">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-1bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                                                <Activity size={18} className="text-indigo-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Neural Audit :: System 7.0</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                            Proficiency <span className="text-indigo-500 italic">Audit</span>
                                        </h3>
                                        <p className="text-slate-500 font-medium max-w-lg text-sm leading-relaxed">
                                            Advanced telemetry comparing your skill matrix against industry-standard requirements for <span className="text-white font-bold">{user.characterClass.toUpperCase()}</span>.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowGapModal(false)}
                                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all group"
                                    >
                                        <Lock size={20} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                </div>

                                {/* Skill Matrix Grid - Dossier Style */}
                                <div className="px-10 md:px-12 pb-12 overflow-y-auto custom-scrollbar space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {skillGapReport.map((skill, idx) => {
                                            const Icon = skill.name.toLowerCase().includes('cloud') ? Activity :
                                                skill.name.toLowerCase().includes('docker') ? Cpu :
                                                    skill.name.toLowerCase().includes('kubernetes') ? Shield :
                                                        skill.name.toLowerCase().includes('aws') ? Zap : Target;

                                            const statusColor = skill.severity === 'Mastered' ? 'emerald' :
                                                skill.severity === 'Critical' ? 'rose' : 'indigo';

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
                                                >
                                                    <div className="flex items-center gap-6 relative z-10">
                                                        {/* Circular Mastery Indicator */}
                                                        <div className="relative w-20 h-20 shrink-0">
                                                            <svg className="w-full h-full transform -rotate-90">
                                                                <circle
                                                                    cx="40" cy="40" r="36"
                                                                    fill="transparent"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                    className="text-white/5"
                                                                />
                                                                <motion.circle
                                                                    cx="40" cy="40" r="36"
                                                                    fill="transparent"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                    strokeDasharray={226}
                                                                    initial={{ strokeDashoffset: 226 }}
                                                                    animate={{ strokeDashoffset: 226 - (226 * skill.currentLevel / 100) }}
                                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                                    className={`text-${statusColor}-500 drop-shadow-[0_0_8px_rgba(var(--color-${statusColor}-500),0.5)]`}
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                                                                <Icon size={24} className={`text-${statusColor}-400 opacity-80`} />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none">{skill.name}</h4>
                                                                <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-${statusColor}-500/30 bg-${statusColor}-500/10 text-${statusColor}-400`}>
                                                                    {skill.severity}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-end justify-between pt-2">
                                                                <div className="space-y-0.5">
                                                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mastery Margin</div>
                                                                    <div className="text-2xl font-black text-white tracking-tighter italic">
                                                                        {skill.gap === 0 ? 'SYNCED' : skill.gap.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target</div>
                                                                    <div className="text-sm font-bold text-white/50">{skill.targetLevel}%</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Hover Details */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-700"></div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Functional Footer */}
                                <div className="mt-auto p-10 bg-black/40 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                            <Award className="text-indigo-400 outline-none" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Session Integrity</p>
                                            <p className="text-sm font-black text-white tracking-widest uppercase italic">{user.username} :: VERIFIED</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowGapModal(false)}
                                        className="group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                                    >
                                        Dismiss Analysis
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
