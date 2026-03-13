import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sword, Mail, Lock, ChevronRight, Zap, Shield, Star, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(identity, password);
            if (data.user?.characterClass === 'Unassigned') {
                navigate('/character-select');
            } else {
                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container min-h-screen relative flex items-center justify-center overflow-hidden p-6">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Floating Decorative Icons */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[15%] text-indigo-500/20"
                >
                    <Code size={120} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[15%] left-[10%] text-purple-500/10"
                >
                    <Shield size={160} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] right-[15%] text-amber-500/20"
                >
                    <Star size={80} />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Left Side: Brand/Visual */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-600/10 to-transparent border-r border-white/5 relative">
                    <div className="absolute top-10 left-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                <Sword size={16} className="text-white" />
                            </div>
                            <span className="font-black text-white italic tracking-tighter uppercase">SkillQuest</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
                                Journey to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Mastery</span> Starts Here
                            </h2>
                            <p className="text-slate-400 mt-4 text-lg font-medium max-w-sm">
                                Bridge your skill gaps through gamified missions and career-shaping quests.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Zap className="text-amber-500 mb-2" size={20} />
                                <div className="text-[10px] font-black uppercase text-slate-500">Live Feedback</div>
                                <div className="text-sm font-bold text-slate-200">Neural Sync Active</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Shield className="text-indigo-400 mb-2" size={20} />
                                <div className="text-[10px] font-black uppercase text-slate-500">Secure Vault</div>
                                <div className="text-sm font-bold text-slate-200">End-to-End Encryption</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}&mouth=smile`} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" alt="user" />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic">2.4k Heroes Online</span>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12 lg:p-16 space-y-8 bg-slate-900/20">
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                            <Sword size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Identity Check</h1>
                            <div className="flex items-center gap-3">
                                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Access your customized roadmap</p>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div> System Live
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-400">
                                    <Mail size={12} /> Com Link
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/40 border-2 border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-700 shadow-inner group-hover:border-slate-700"
                                        placeholder="Username or Email"
                                        value={identity}
                                        onChange={(e) => setIdentity(e.target.value)}
                                        required
                                    />
                                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-400">
                                    <Lock size={12} /> Access Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full bg-slate-950/40 border-2 border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-700 shadow-inner group-hover:border-slate-700"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button type="button" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                                    Recovery Protocol?
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-5 rounded-2xl text-[12px] font-black flex items-center justify-center gap-3 group/btn uppercase tracking-[0.2em] shadow-xl border border-white/10 transition-all"
                            >
                                Establish Link <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                        </form>

                        <div className="pt-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-slate-800 flex-1 opacity-50"></div>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">New Expedition?</span>
                                <div className="h-px bg-slate-800 flex-1 opacity-50"></div>
                            </div>

                            <Link to="/register" className="block">
                                <motion.button
                                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                    className="w-full py-4 rounded-2xl border-2 border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3 group/reg"
                                >
                                    Forge New Identity <Zap size={14} className="text-amber-500 group-hover/reg:animate-bounce" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Micro-decorations */}
            <div className="fixed bottom-6 left-6 flex items-center gap-4 text-slate-600 pointer-events-none">
                <div className="flex flex-col gap-1">
                    <div className="w-12 h-0.5 bg-slate-800 rounded-full"></div>
                    <div className="w-8 h-0.5 bg-slate-800 rounded-full"></div>
                </div>
                <span className="text-[8px] font-mono tracking-widest opacity-30">SECURE_CHANNEL_v4.2.0</span>
            </div>
        </div>
    );
};

export default Login;
