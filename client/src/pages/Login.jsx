import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sword, Mail, Lock, ChevronRight, Zap, Shield, Star, Code, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const isLight = theme === 'light';

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
        <div
            className="min-h-screen relative flex items-center justify-center overflow-hidden p-6"
            style={{
                background: isLight
                    ? 'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(168,85,247,0.09) 0%, transparent 50%), #eef0f6'
                    : 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
            }}
        >
            {/* Animated Background Grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: isLight
                        ? 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)'
                        : 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Glow Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
                style={{ background: isLight ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', filter: 'blur(120px)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
                style={{ background: isLight ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.06)', filter: 'blur(120px)', animationDelay: '2s' }} />

            {/* Floating Decorative Icons */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[15%] pointer-events-none"
                style={{ color: isLight ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.15)' }}
            >
                <Code size={120} />
            </motion.div>
            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[15%] left-[10%] pointer-events-none"
                style={{ color: isLight ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.08)' }}
            >
                <Shield size={160} />
            </motion.div>
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[15%] pointer-events-none"
                style={{ color: isLight ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.15)' }}
            >
                <Star size={80} />
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all"
                style={{
                    background: isLight
                        ? 'rgba(255,255,255,0.9)'
                        : 'rgba(30,41,59,0.8)',
                    border: isLight
                        ? '1px solid rgba(99,102,241,0.2)'
                        : '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                }}
                title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
                {isLight
                    ? <Moon size={18} style={{ color: '#6366f1' }} />
                    : <Sun size={18} style={{ color: '#f59e0b' }} />
                }
            </motion.button>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 rounded-[40px] overflow-hidden"
                style={{
                    background: isLight
                        ? 'rgba(255,255,255,0.82)'
                        : 'rgba(15,23,42,0.55)',
                    border: isLight
                        ? '1px solid rgba(99,102,241,0.2)'
                        : '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: isLight
                        ? '0 25px 60px -10px rgba(99,102,241,0.2), 0 8px 20px rgba(0,0,0,0.05)'
                        : '0 25px 80px rgba(0,0,0,0.5)',
                }}
            >
                {/* Left Side: Brand/Visual */}
                <div
                    className="hidden lg:flex flex-col justify-center p-12 relative"
                    style={{
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 100%)'
                            : 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
                        borderRight: isLight
                            ? '1px solid rgba(99,102,241,0.15)'
                            : '1px solid rgba(255,255,255,0.05)',
                    }}
                >
                    <div className="absolute top-10 left-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                <Sword size={16} className="text-white" />
                            </div>
                            <span
                                className="font-black italic tracking-tighter uppercase"
                                style={{ color: isLight ? '#0d1321' : '#ffffff' }}
                            >
                                SkillQuest
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2
                                className="text-5xl font-black leading-tight uppercase italic tracking-tighter"
                                style={{ color: isLight ? '#0d1321' : '#ffffff' }}
                            >
                                Journey to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Mastery</span> Starts Here
                            </h2>
                            <p
                                className="mt-4 text-lg font-medium max-w-sm"
                                style={{ color: isLight ? '#475569' : '#94a3b8' }}
                            >
                                Bridge your skill gaps through gamified missions and career-shaping quests.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div
                                className="p-4 rounded-2xl"
                                style={{
                                    background: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
                                    border: isLight ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <Zap className="text-amber-500 mb-2" size={20} />
                                <div style={{ color: isLight ? '#6366f1' : '#64748b' }} className="text-[10px] font-black uppercase">Live Feedback</div>
                                <div style={{ color: isLight ? '#1e293b' : '#e2e8f0' }} className="text-sm font-bold">Neural Sync Active</div>
                            </div>
                            <div
                                className="p-4 rounded-2xl"
                                style={{
                                    background: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
                                    border: isLight ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <Shield className="text-indigo-500 mb-2" size={20} />
                                <div style={{ color: isLight ? '#6366f1' : '#64748b' }} className="text-[10px] font-black uppercase">Secure Vault</div>
                                <div style={{ color: isLight ? '#1e293b' : '#e2e8f0' }} className="text-sm font-bold">End-to-End Encryption</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}&mouth=smile`}
                                    className="w-8 h-8 rounded-full border-2"
                                    style={{ borderColor: isLight ? '#e0e7ff' : '#0f172a', background: isLight ? '#eef2ff' : '#1e293b' }}
                                    alt="user" />
                            ))}
                        </div>
                        <span style={{ color: isLight ? '#6366f1' : '#475569' }} className="text-[10px] font-black tracking-widest uppercase italic">2.4k Heroes Online</span>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div
                    className="p-8 md:p-12 lg:p-16 space-y-8"
                    style={{
                        background: isLight
                            ? 'rgba(255,255,255,0.6)'
                            : 'rgba(15,23,42,0.3)',
                    }}
                >
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                            <Sword size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1
                                className="text-3xl font-black italic uppercase tracking-tighter"
                                style={{ color: isLight ? '#0d1321' : '#ffffff' }}
                            >
                                Identity Check
                            </h1>
                            <div className="flex items-center gap-3">
                                <p style={{ color: isLight ? '#475569' : '#64748b' }} className="font-bold uppercase tracking-[0.2em] text-[10px]">Access your customized roadmap</p>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> System Live
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label style={{ color: isLight ? '#6366f1' : '#64748b' }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-500">
                                    <Mail size={12} /> Com Link
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl px-5 py-4 focus:outline-none transition-all font-medium"
                                        style={{
                                            background: isLight ? 'rgba(238,240,246,0.7)' : 'rgba(2,6,23,0.4)',
                                            border: isLight ? '2px solid rgba(99,102,241,0.2)' : '2px solid rgba(30,41,59,0.5)',
                                            color: isLight ? '#0d1321' : '#ffffff',
                                        }}
                                        placeholder="Username or Email"
                                        value={identity}
                                        onChange={(e) => setIdentity(e.target.value)}
                                        required
                                        onFocus={e => e.target.style.borderColor = isLight ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.5)'}
                                        onBlur={e => e.target.style.borderColor = isLight ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.5)'}
                                    />
                                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label style={{ color: isLight ? '#6366f1' : '#64748b' }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-500">
                                    <Lock size={12} /> Access Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full rounded-2xl px-5 py-4 focus:outline-none transition-all font-medium"
                                        style={{
                                            background: isLight ? 'rgba(238,240,246,0.7)' : 'rgba(2,6,23,0.4)',
                                            border: isLight ? '2px solid rgba(99,102,241,0.2)' : '2px solid rgba(30,41,59,0.5)',
                                            color: isLight ? '#0d1321' : '#ffffff',
                                        }}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        onFocus={e => e.target.style.borderColor = isLight ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.5)'}
                                        onBlur={e => e.target.style.borderColor = isLight ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.5)'}
                                    />
                                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button type="button" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
                                    Recovery Protocol?
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-5 rounded-2xl text-[12px] font-black flex items-center justify-center gap-3 group/btn uppercase tracking-[0.2em] shadow-xl border border-white/10 transition-all"
                            >
                                Establish Link <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                        </form>

                        <div className="pt-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1" style={{ background: isLight ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,0.8)' }} />
                                <span style={{ color: isLight ? '#6366f1' : '#475569' }} className="text-[9px] font-black uppercase tracking-[0.3em]">Or Connect With</span>
                                <div className="h-px flex-1" style={{ background: isLight ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,0.8)' }} />
                            </div>

                            <a href={`${API_URL}/auth/google`} className="block">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    type="button"
                                    className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group/google"
                                    style={{
                                        border: isLight ? '2px solid rgba(99,102,241,0.2)' : '2px solid rgba(30,41,59,0.8)',
                                        color: isLight ? '#475569' : '#64748b',
                                        background: 'transparent',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = isLight ? '#0d1321' : '#ffffff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.8)'; e.currentTarget.style.color = isLight ? '#475569' : '#64748b'; }}
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                    Google Link
                                </motion.button>
                            </a>

                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1" style={{ background: isLight ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,0.8)' }} />
                                <span style={{ color: isLight ? '#6366f1' : '#475569' }} className="text-[9px] font-black uppercase tracking-[0.3em]">New Expedition?</span>
                                <div className="h-px flex-1" style={{ background: isLight ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,0.8)' }} />
                            </div>

                            <Link to="/register" className="block">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group/reg"
                                    style={{
                                        border: isLight ? '2px solid rgba(99,102,241,0.2)' : '2px solid rgba(30,41,59,0.8)',
                                        color: isLight ? '#475569' : '#64748b',
                                        background: 'transparent',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = isLight ? '#0d1321' : '#ffffff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.8)'; e.currentTarget.style.color = isLight ? '#475569' : '#64748b'; }}
                                >
                                    Forge New Identity <Zap size={14} className="text-amber-500 group-hover/reg:animate-bounce" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bottom label */}
            <div className="absolute bottom-6 w-full text-center pointer-events-none z-20">
                <p style={{ color: isLight ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.2)' }} className="text-[10px] font-black uppercase tracking-[0.3em]">
                    © {new Date().getFullYear()} SKILL QUEST. ALL NEURAL RIGHTS RESERVED.
                </p>
            </div>
        </div>
    );
};

export default Login;
