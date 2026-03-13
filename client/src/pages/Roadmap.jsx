import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, Star, Zap, ChevronRight, Target, Shield, ExternalLink, Activity, Terminal, X, BookOpen, Lock, Info, Save, Database, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { SKILL_TARGETS } from '../constants/skillTargets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Roadmap = () => {
    const { user, checkUser } = useAuth();
    const navigate = useNavigate();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMission, setSelectedMission] = useState(null);
    const [proof, setProof] = useState('');
    const [completedTasks, setCompletedTasks] = useState([]);
    const [verifying, setVerifying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [victoryData, setVictoryData] = useState(null);
    const [scanningProgress, setScanningProgress] = useState(0);
    const [saving, setSaving] = useState(false);
    const [blinkingSkill, setBlinkingSkill] = useState(null);

    const fetchMissions = async () => {
        try {
            const res = await axios.get(`${API_URL}/missions`);
            setMissions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    const completeMission = async () => {
        if (!proof) {
            alert('Mission record required for verification.');
            return;
        }

        setVerifying(true);
        setScanningProgress(0);

        // Simulated scanning steps
        const steps = [20, 45, 75, 90, 100];
        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 400));
            setScanningProgress(steps[i]);
        }

        try {
            const res = await axios.post(`${API_URL}/missions/complete/${selectedMission._id}`, {
                proofOfWork: proof,
                tasksCompleted: completedTasks
            });

            setVictoryData({
                xp: res.data.xpEarned,
                feedback: res.data.neuralFeedback,
                score: res.data.validationScore
            });

            await checkUser();
            fetchMissions();

            setVerifying(false);
            setShowSuccess(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Neural Link Timeout: Verification Incomplete');
            setVerifying(false);
            setScanningProgress(0);
        }
    };
    const saveProgress = async () => {
        setSaving(true);
        try {
            await axios.post(`${API_URL}/missions/save-draft/${selectedMission._id}`, {
                proofOfWork: proof,
                tasksCompleted: completedTasks
            });
            fetchMissions();
            setTimeout(() => setSaving(false), 800);
        } catch (err) {
            alert('Failed to sync progress');
            setSaving(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedMission(null);
        setShowSuccess(false);
        setProof('');
        setCompletedTasks([]);
        setVictoryData(null);
        setVerifying(false);
        setScanningProgress(0);
    };

    const completeDaily = async (stepId, xp) => {
        if (user?.dailyProgress?.completedSteps?.includes(stepId)) return;
        try {
            await axios.post(`${API_URL}/user/complete-daily`, { stepId, xp });
            await checkUser();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTask = (task) => {
        setCompletedTasks(prev =>
            prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <Zap className="text-indigo-500 animate-pulse" size={48} />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Scanning Quest Log</p>
        </div>
    );

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <Target className="text-amber-500" size={24} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Active Missions</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Strategic roadmap for your career transformation</p>
                </div>
            </motion.div>

            {/* Specialization Dossiers - High Fidelity Grid */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/40 rounded-[3rem] p-12 border border-white/5 shadow-3xl relative overflow-hidden backdrop-blur-xl"
            >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Target size={200} className="text-white" />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-inner">
                            <Zap size={14} className="text-indigo-400 fill-indigo-400/20" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Career Progression</span>
                        </div>
                        <h2 className="text-5xl font-[1000] text-white italic tracking-tighter uppercase leading-none">Specialization Dossier</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Strategic Roadmap for {user?.characterClass}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-3xl border border-white/5">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rank</div>
                            <div className="text-xl font-black text-white italic">#14,204</div>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-2"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Rate</div>
                            <div className="text-xl font-black text-emerald-400 italic">+12.4%</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                    {(SKILL_TARGETS[user?.characterClass] || [{ name: 'General Knowledge' }]).map((skillObj, i) => {
                        const skillName = skillObj.name;
                        const skillData = user?.skills?.find(s => s.name.toLowerCase() === skillName.toLowerCase());
                        const isUnlocked = skillData && skillData.level > 0;

                        return (
                            <motion.div
                                key={skillName}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => {
                                    const arenaElement = document.getElementById(`arena-${skillName.toLowerCase()}`);
                                    if (arenaElement) {
                                        arenaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        setBlinkingSkill(skillName.toLowerCase());
                                        setTimeout(() => setBlinkingSkill(null), 3500);
                                    } else {
                                        navigate(`/bird-game/${skillName}`);
                                    }
                                }}
                                className={`p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer group/node relative overflow-hidden flex flex-col h-full ${
                                    isUnlocked 
                                    ? 'bg-slate-950/60 border-indigo-500/20 hover:border-indigo-500/50 hover:bg-slate-950 shadow-2xl shadow-indigo-500/5' 
                                    : 'bg-slate-950/20 border-white/[0.05] hover:border-indigo-500/30 hover:bg-slate-900/40'
                                }`}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                                        isUnlocked ? 'bg-indigo-500/10 border-indigo-500/30 group-hover/node:bg-indigo-500 group-hover/node:text-white' : 'bg-slate-900 border-slate-800'
                                    }`}>
                                        <Shield size={24} className={isUnlocked ? 'text-indigo-400 group-hover/node:text-white group-hover/node:fill-white/20' : 'text-slate-700'} />
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isUnlocked ? 'text-indigo-400' : 'text-slate-500'}`}>
                                            {isUnlocked ? `LV ${Math.floor(skillData.level / 10)} Proficient` : 'Initiate Training'}
                                        </div>
                                        <div className="flex gap-1 justify-end">
                                            {[...Array(5)].map((_, stars) => (
                                                <Star 
                                                    key={stars} 
                                                    size={8} 
                                                    className={stars < Math.floor(skillData?.level / 20) ? "text-amber-500 fill-amber-500" : "text-slate-800"} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="mb-8 flex-grow">
                                    <h4 className={`text-2xl font-black uppercase tracking-tighter italic leading-none mb-2 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                        {skillName}
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Technical Module</p>
                                </div>

                                {/* Footer Progress */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Mastery Progress</span>
                                        <span className="text-indigo-400">{skillData?.level || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skillData?.level || 0}%` }}
                                            className={`h-full rounded-full ${
                                                isUnlocked ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-slate-800'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Hover Hint */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover/node:opacity-100 transition-opacity"></div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence>
                        {missions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="game-card text-center py-20 border-dashed border-slate-800"
                            >
                                <Shield className="text-slate-800 mx-auto mb-4" size={48} />
                                <p className="text-slate-500 font-bold">No active missions. Visit the Arena to scout your path.</p>
                            </motion.div>
                        ) : (
                            missions.map((mission, index) => (
                                <motion.div
                                    key={mission._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    id={`mission-${mission.skill.toLowerCase()}`}
                                    className={`relative group game-card border-none bg-slate-900/40 hover:bg-slate-900/80 transition-all ${mission.status === 'completed' ? 'opacity-40 grayscale pointer-events-none' : ''
                                        }`}
                                >
                                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl ${mission.status === 'completed' ? 'bg-emerald-500' :
                                        mission.difficulty === 'Hard' ? 'bg-red-500 shadow-[2px_0_10px_rgba(239,68,68,0.4)]' :
                                            mission.difficulty === 'Medium' ? 'bg-indigo-500 shadow-[2px_0_10px_rgba(99,102,241,0.4)]' : 'bg-slate-500'
                                        }`} />

                                    {/* Scanning Line Animation */}
                                    {mission.status !== 'completed' && (
                                        <motion.div
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 right-0 h-[1px] bg-indigo-500/20 z-0 pointer-events-none"
                                        />
                                    )}

                                    <div className="flex flex-col md:flex-row justify-between gap-8 ml-4 relative z-10">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 uppercase tracking-[0.2em] italic">
                                                    Quest Protocol #{index + 1}
                                                </div>
                                                <div className="flex gap-1">
                                                    {['Easy', 'Medium', 'Hard'].map((d, i) => (
                                                        <div key={d} className={`h-1.5 w-6 rounded-full transition-colors ${i <= ['Easy', 'Medium', 'Hard'].indexOf(mission.difficulty) ?
                                                            (mission.difficulty === 'Hard' ? 'bg-red-500' : mission.difficulty === 'Medium' ? 'bg-indigo-500' : 'bg-emerald-500')
                                                            : 'bg-slate-800'
                                                            }`} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{mission.title}</h3>
                                                <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">{mission.description}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-6 items-center">
                                                <div className="flex items-center gap-2 group/stat">
                                                    <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover/stat:bg-amber-500/20 transition-colors">
                                                        <Zap size={14} className="text-amber-500" />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-300 tracking-tighter">{mission.xpReward} XP</span>
                                                </div>
                                                <div className="flex items-center gap-2 group/stat">
                                                    <div className="p-1.5 bg-slate-800 rounded-lg group-hover/stat:bg-slate-700 transition-colors">
                                                        <Clock size={14} className="text-slate-500" />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-300 tracking-tighter">{mission.estimatedTime}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center min-w-[160px]">
                                            {mission.status === 'completed' ? (
                                                <div className="flex items-center justify-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500 font-black text-xs uppercase tracking-[0.2em]">
                                                    <CheckCircle2 size={16} /> Verified
                                                </div>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedMission(mission);
                                                        setProof(mission.proofOfWork || '');
                                                        setCompletedTasks(mission.tasksCompleted || []);
                                                    }}
                                                    className="w-full btn-primary py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                                                >
                                                    {mission.status === 'in-progress' ? 'Continue Path' : 'Claim Victory'} <ChevronRight size={16} />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-8">
                    {/* Daily Challenge Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative p-[2px] rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500"
                    >
                        <div className="bg-[#0b0f1a] p-8 rounded-3xl h-full space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Daily Spike</h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Level Up Faster</p>
                                </div>
                                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 animate-pulse">
                                    <Zap className="text-amber-500" fill="currentColor" size={24} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {(
                                    user?.characterClass === 'Frontend Warrior' ? [
                                        { id: 1, text: 'Fix 3 CSS layout bugs', xp: 50 },
                                        { id: 2, text: 'Optimize React render cycle', xp: 150 },
                                        { id: 3, text: 'Implement accessible modal', xp: 100 },
                                    ] :
                                        user?.characterClass === 'Data Mage' ? [
                                            { id: 1, text: 'Clean 1 messy dataset', xp: 50 },
                                            { id: 2, text: 'Train 1 Linear Regression model', xp: 150 },
                                            { id: 3, text: 'Optimize SQL JOIN query', xp: 100 },
                                        ] :
                                            user?.characterClass === 'Cloud Engineer' ? [
                                                { id: 1, text: 'Deploy 1 Nginx container', xp: 50 },
                                                { id: 2, text: 'Configure VPC peering', xp: 150 },
                                                { id: 3, text: 'Setup S3 bucket policy', xp: 100 },
                                            ] :
                                                user?.characterClass === 'Cyber Ninja' ? [
                                                    { id: 1, text: 'Scan 1 local network', xp: 50 },
                                                    { id: 2, text: 'Crack 1 example hash', xp: 150 },
                                                    { id: 3, text: 'Secure 1 SSH config', xp: 100 },
                                                ] :
                                                    user?.characterClass === 'AI Architect' ? [
                                                        { id: 1, text: 'Refine 3 LLM prompts', xp: 50 },
                                                        { id: 2, text: 'Tune hyper-parameters', xp: 150 },
                                                        { id: 3, text: 'Setup vector index', xp: 100 },
                                                    ] :
                                                        user?.characterClass === 'Backend Titan' ? [
                                                            { id: 1, text: 'Optimize 1 slow query', xp: 50 },
                                                            { id: 2, text: 'Refactor 1 microservice', xp: 150 },
                                                            { id: 3, text: 'Setup Redis cache', xp: 100 },
                                                        ] :
                                                            user?.characterClass === 'UI/UX Sorcerer' ? [
                                                                { id: 1, text: 'Conduct 1 user interview', xp: 50 },
                                                                { id: 2, text: 'Build 1 Figma prototype', xp: 150 },
                                                                { id: 3, text: 'Audit accessibility', xp: 100 },
                                                            ] :
                                                                user?.characterClass === 'Blockchain Bard' ? [
                                                                    { id: 1, text: 'Audit 1 Smart Contract', xp: 100 },
                                                                    { id: 2, text: 'Deploy to Testnet', xp: 150 },
                                                                    { id: 3, text: 'Connect Web3 provider', xp: 50 },
                                                                ] :
                                                                    user?.characterClass === 'DevOps Paladin' ? [
                                                                        { id: 1, text: 'Write 1 Dockerfile', xp: 50 },
                                                                        { id: 2, text: 'Harden 1 Linux server', xp: 150 },
                                                                        { id: 3, text: 'Setup CI pipeline', xp: 100 },
                                                                    ] :
                                                                        user?.characterClass === 'Mobile Monk' ? [
                                                                            { id: 1, text: 'Fix 1 memory leak', xp: 50 },
                                                                            { id: 2, text: 'Implement push alerts', xp: 150 },
                                                                            { id: 3, text: 'Design 1 splash screen', xp: 100 },
                                                                        ] :
                                                                            user?.characterClass === 'QA Shadow' ? [
                                                                                { id: 1, text: 'Run 10 unit tests', xp: 50 },
                                                                                { id: 2, text: 'Find 1 regression bug', xp: 150 },
                                                                                { id: 3, text: 'Write 1 E2E script', xp: 100 },
                                                                            ] :
                                                                                user?.characterClass === 'Data Warden' ? [
                                                                                    { id: 1, text: 'Mask 1 PII column', xp: 50 },
                                                                                    { id: 2, text: 'Audit 1 access log', xp: 150 },
                                                                                    { id: 3, text: 'Build 1 data lineage', xp: 100 },
                                                                                ] : [
                                                                                    { id: 1, text: 'Analyze 3 data points', xp: 50 },
                                                                                    { id: 2, text: 'Contribute to open repo', xp: 150 },
                                                                                    { id: 3, text: 'Optimize 1 function', xp: 100 },
                                                                                ]
                                ).map((task) => {
                                    const isCompleted = user?.dailyProgress?.completedSteps?.includes(task.id);
                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => !isCompleted && navigate(`/daily-spike/${task.id}/${task.xp}/${encodeURIComponent(task.text)}`)}
                                            className={`flex items-start gap-4 cursor-pointer transition-all ${isCompleted ? 'opacity-30' : 'opacity-100 hover:translate-x-1'
                                                }`}
                                        >
                                            <div className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800 group-hover:border-indigo-500'
                                                }`}>
                                                {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-200">{task.text}</p>
                                                <div className="text-[10px] font-black text-indigo-400 mt-1 uppercase tracking-widest">{task.xp} XP BONUS</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-6 border-t border-slate-900">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
                                    <span className="text-xs font-black text-white">{user?.dailyProgress?.completedSteps?.length || 0} / 3</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((user?.dailyProgress?.completedSteps?.length || 0) / 3) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Streak Wall */}
                    <div className="game-card bg-slate-900/40 border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <Star className="text-amber-500" size={18} />
                            <h3 className="font-black text-white text-sm uppercase tracking-widest">Streak Record</h3>
                        </div>
                        <div className="flex gap-2 justify-between">
                            {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                <div key={day} className={`h-10 flex-1 rounded-lg border-2 flex flex-col items-center justify-center gap-1 ${day <= (user?.streak || 0) ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-slate-800'
                                    }`}>
                                    <div className="text-[8px] font-black text-slate-500">D{day}</div>
                                    <Zap size={10} className={day <= (user?.streak || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-800'} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill Training Arena */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="game-card bg-indigo-500/5 border-indigo-500/20 p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Zap size={150} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Skill Training Arena</h2>
                        <p className="text-slate-500 font-medium">Test your neural bandwidth with scenario-based challenges</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {(user?.skills?.length > 0 ? user.skills : [
                            { name: 'HTML' }, { name: 'CSS' }, { name: 'JavaScript' }, { name: 'React' }
                        ]).map((s) => (
                            <motion.button
                                key={s.name}
                                id={`arena-${s.name.toLowerCase()}`}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/bird-game/${s.name}`)}
                                className={`p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3 group transition-all duration-700 ${blinkingSkill === s.name.toLowerCase()
                                    ? 'animate-pulse-glow ring-2 ring-indigo-500/20'
                                    : blinkingSkill ? 'opacity-30 grayscale blur-[1px] pointer-events-none' : ''
                                    }`}
                            >
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/10 group-hover:border-indigo-500/50 inline-block transition-all">
                                    <Zap className="text-indigo-400" size={20} />
                                </div>
                                <div className="font-black text-white uppercase tracking-tighter text-sm">{s.name}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Journey</div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Integrated Verification & Victory UI */}
            <AnimatePresence>
                {selectedMission && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-4xl h-[75vh] bg-[#0f172a] border border-white/10 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative"
                        >
                            {!showSuccess ? (
                                <>
                                    {/* Header */}
                                    <div className="pt-10 pb-8 px-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                                                <Target className="text-indigo-400" size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Mission Verification</h2>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Mastery Validation Protocol</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={saveProgress}
                                                disabled={saving || verifying}
                                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${saving ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                                    'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5'
                                                    }`}
                                            >
                                                {saving ? <CloudUpload size={14} className="animate-bounce" /> : <Save size={14} />}
                                                {saving ? 'Syncing...' : 'Save Draft'}
                                            </button>
                                            <button
                                                onClick={handleCloseModal}
                                                className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sub-header Progress */}
                                    <div className="bg-white/[0.01] px-10 py-3 flex items-center justify-between border-b border-white/5">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Database size={12} className="text-slate-600" />
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Local Buffer: {proof?.length || 0} bits</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Zap size={12} className="text-amber-500" />
                                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Current Sync: {Math.round((completedTasks.length / (selectedMission.tasks?.length || 1)) * 100)}%</span>
                                            </div>
                                        </div>
                                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(completedTasks.length / (selectedMission.tasks?.length || 1)) * 100}%` }}
                                                className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                                        {/* Left Side: Tasks */}
                                        <div className="flex-1 p-10 overflow-y-auto space-y-8 border-r border-white/5 custom-scrollbar">
                                            {/* Mission Intelligence */}
                                            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[32px] p-6 flex flex-wrap gap-6 items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-indigo-400">
                                                    <Lock size={14} />
                                                    {selectedMission.intel?.securityLevel || 'Standard'}
                                                    <span className="text-slate-700 mx-2">|</span>
                                                    <Activity size={14} />
                                                    {selectedMission.intel?.encryption || 'AES-256'}
                                                </div>
                                                {selectedMission.estimatedTime && (
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                                                        <Clock size={12} /> {selectedMission.estimatedTime}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Tactical Briefing</label>
                                                <div className="bg-slate-950/40 p-8 rounded-[32px] border border-white/5 space-y-4">
                                                    <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                                                        {selectedMission.briefing || selectedMission.description}
                                                    </p>

                                                    {selectedMission.docs?.length > 0 && (
                                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                                            {selectedMission.docs.map((doc, dIdx) => (
                                                                <a
                                                                    key={dIdx}
                                                                    href={doc.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-[10px] font-black uppercase text-indigo-400 transition-all hover:border-indigo-500/50 group"
                                                                >
                                                                    <BookOpen size={12} className="group-hover:scale-110 transition-transform" />
                                                                    {doc.label}
                                                                    <ExternalLink size={10} className="opacity-40" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Requirement Checklist</label>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {(selectedMission.tasks || []).map((task) => (
                                                        <div
                                                            key={task}
                                                            onClick={() => toggleTask(task)}
                                                            className={`group flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all cursor-pointer ${completedTasks.includes(task)
                                                                ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-[0_0_30px_rgba(99,102,241,0.05)]'
                                                                : 'bg-transparent border-white/5 text-slate-500 hover:border-white/10'
                                                                }`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${completedTasks.includes(task)
                                                                ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                                                : 'border-white/10 group-hover:border-white/20'
                                                                }`}>
                                                                {completedTasks.includes(task) && <CheckCircle2 size={16} className="text-white" />}
                                                            </div>
                                                            <span className="text-sm font-black uppercase tracking-tight italic">{task}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Proof */}
                                        <div className="w-full md:w-[380px] p-10 bg-white/[0.01] flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Proof of Work</label>
                                                    <div className="relative group">
                                                        <textarea
                                                            value={proof}
                                                            onChange={(e) => setProof(e.target.value)}
                                                            placeholder="LINK GITHUB / REPO / PDF / TEXT SUMMARY..."
                                                            className="w-full h-48 bg-slate-950/50 border-2 border-white/5 rounded-[32px] p-8 text-white text-xs font-mono focus:outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-800 shadow-inner custom-scrollbar overflow-y-auto"
                                                        />
                                                        <div className="absolute top-6 right-6 text-slate-800 group-hover:text-indigo-500 transition-colors">
                                                            <Terminal size={18} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="space-y-5 mt-auto pt-6">
                                                <button
                                                    onClick={completeMission}
                                                    disabled={verifying || (selectedMission.isProject && !proof)}
                                                    className="w-full py-7 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white rounded-[28px] text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-95 italic"
                                                >
                                                    {verifying ? (
                                                        <div className="w-full space-y-3">
                                                            <div className="flex justify-between items-center px-2">
                                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">
                                                                    {scanningProgress < 30 ? 'Synchronizing Patterns' :
                                                                        scanningProgress < 60 ? 'Decrypting Proof' :
                                                                            scanningProgress < 90 ? 'Validating Cryptography' :
                                                                                'Neural Uplink Established'}
                                                                </span>
                                                                <span className="text-[10px] font-black text-white">{scanningProgress}%</span>
                                                            </div>
                                                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${scanningProgress}%` }}
                                                                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>Finalize Mission <ChevronRight size={18} /></>
                                                    )}
                                                </button>
                                                <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.3em] leading-relaxed">
                                                    Validation is permanent and<br />recorded to neural profile
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full bg-[#020617] relative flex items-center justify-center overflow-hidden">
                                    {/* Success Background Elements */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
                                        <motion.div
                                            animate={{
                                                rotate: [0, 360],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
                                        />
                                        <div className="absolute top-0 left-0 w-full h-full bg-[size:40px_40px] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
                                    </div>

                                    <div className="relative z-10 text-center space-y-12 px-8 max-w-2xl">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="space-y-4"
                                        >
                                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                                                <CheckCircle2 className="text-emerald-500" size={16} />
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Validation Confirmed</span>
                                            </div>
                                            <h2 className="text-5xl md:text-6xl font-[1000] text-white italic uppercase tracking-tighter leading-none">
                                                MISSION<br />RESOLVED
                                            </h2>
                                        </motion.div>

                                        <div className="grid grid-cols-2 gap-6 pb-4">
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="p-8 bg-slate-900/50 border border-white/5 rounded-[40px] shadow-2xl space-y-2 backdrop-blur-xl"
                                            >
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">XP Gain</div>
                                                <div className="text-4xl font-black text-amber-500 tracking-tight">+{selectedMission.xpReward}</div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="p-8 bg-slate-900/50 border border-white/5 rounded-[40px] shadow-2xl space-y-2 backdrop-blur-xl"
                                            >
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Sync</div>
                                                <div className="text-4xl font-black text-emerald-500 tracking-tight italic">{victoryData?.score || 100}%</div>
                                            </motion.div>
                                        </div>

                                        {victoryData?.feedback && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] text-left"
                                            >
                                                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                                                    <Info size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Validation Intelligence</span>
                                                </div>
                                                <p className="text-slate-400 text-xs leading-relaxed font-mono italic">
                                                    {victoryData.feedback}
                                                </p>
                                            </motion.div>
                                        )}

                                        <motion.button
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            onClick={handleCloseModal}
                                            className="w-full py-8 bg-white text-slate-950 text-sm font-black uppercase tracking-[0.4em] rounded-[32px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
                                        >
                                            Commit & Return
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Roadmap;
