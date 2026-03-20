import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ChevronRight, ShieldCheck, Zap, Sword, Target, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [requirements, setRequirements] = useState({
        length: false,
        upper: false,
        number: false,
        special: false
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        setRequirements({
            length: pass.length >= 8,
            upper: /[A-Z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[^A-Za-z0-9]/.test(pass)
        });
    };

    const handlePasswordChange = (e) => {
        const pass = e.target.value;
        setFormData({ ...formData, password: pass });
        validatePassword(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isStrong = Object.values(requirements).every(Boolean);
        if (!isStrong) {
            alert('Protocol Violation: Password does not meet security requirements.');
            return;
        }

        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/character-select');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container min-h-screen relative flex items-center justify-center overflow-hidden p-6">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-600/10 blur-[130px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[130px] animate-pulse" style={{ animationDelay: '3s' }}></div>

                {/* Floating Decorative Icons */}
                <motion.div
                    animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[20%] text-emerald-500/20"
                >
                    <Sword size={100} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 50, 0], x: [0, -30, 0], rotate: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] left-[15%] text-indigo-500/10"
                >
                    <Target size={140} />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Left Side: Brand/Visual */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-emerald-600/10 to-transparent border-r border-white/5 relative">
                    <div className="absolute top-10 left-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                <ShieldCheck size={16} className="text-white" />
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
                                Forge your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500">Legendary</span> Identity
                            </h2>
                            <p className="text-slate-400 mt-4 text-lg font-medium max-w-sm">
                                Join thousands of heroes leveling up their real-world skills through tactical mini-games.
                            </p>
                        </motion.div>

                        <div className="space-y-4 mt-8">
                            {[
                                { icon: <Zap size={16} />, text: "Instant Skill Gap Detection", color: "text-amber-500" },
                                { icon: <Target size={16} />, text: "Customized Career Roadmaps", color: "text-emerald-500" },
                                { icon: <Code size={16} />, text: "Practice in a Safe Sandbox", color: "text-indigo-400" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-wider text-[11px]"
                                >
                                    <div className={`${item.color} drop-shadow-glow`}>{item.icon}</div>
                                    {item.text}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12 lg:p-16 space-y-8 bg-slate-900/20">
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Registration</h1>
                            <div className="flex items-center gap-3">
                                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Initialize your hero profile</p>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Forge Active
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-emerald-400">
                                    <User size={12} /> Call Sign
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/40 border-2 border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-slate-700 shadow-inner group-hover:border-slate-700"
                                        placeholder="Choose username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-emerald-400">
                                    <Mail size={12} /> Com Link
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full bg-slate-950/40 border-2 border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-slate-700 shadow-inner group-hover:border-slate-700"
                                        placeholder="hero@quest.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>

                            <div className="space-y-4 group">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-400">
                                    <Lock size={12} /> Cipher Protocol
                                </label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="password"
                                            className="w-full bg-slate-950/40 border-2 border-slate-800/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-700 shadow-inner group-hover:border-slate-700"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                                    </div>

                                    {/* Password Strength Checklist */}
                                    <div className="px-4 py-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Cyber Resilience</span>
                                            <span className={`text-[9px] font-black uppercase tracking-wider ${Object.values(requirements).filter(Boolean).length === 4 ? 'text-emerald-400' :
                                                Object.values(requirements).filter(Boolean).length >= 2 ? 'text-amber-500' : 'text-red-500'
                                                }`}>
                                                {Object.values(requirements).filter(Boolean).length * 25}% Secure
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5 h-1">
                                            {[1, 2, 3, 4].map((step) => (
                                                <div
                                                    key={step}
                                                    className={`rounded-full transition-all duration-500 ${Object.values(requirements).filter(Boolean).length >= step
                                                        ? (Object.values(requirements).filter(Boolean).length === 4 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-indigo-500')
                                                        : 'bg-slate-800'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                            {[
                                                { key: 'length', label: '8+ Units' },
                                                { key: 'upper', label: 'Upper Protocol' },
                                                { key: 'number', label: 'Numeric Vector' },
                                                { key: 'special', label: 'Special Cipher' }
                                            ].map((req) => (
                                                <div key={req.key} className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${requirements[req.key] ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-slate-700'}`}></div>
                                                    <span className={`text-[8px] font-bold uppercase tracking-widest ${requirements[req.key] ? 'text-slate-300' : 'text-slate-600'}`}>
                                                        {req.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white py-5 rounded-2xl text-[12px] font-black flex items-center justify-center gap-3 group/btn uppercase tracking-[0.2em] shadow-xl border border-white/10 transition-all mt-4"
                            >
                                Forge Identity <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                        </form>

                        <div className="pt-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-slate-800 flex-1 opacity-50"></div>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Or Connect With</span>
                                <div className="h-px bg-slate-800 flex-1 opacity-50"></div>
                            </div>

                            <a href={`${API_URL}/auth/google`} className="block">
                                <motion.button
                                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                    type="button"
                                    className="w-full py-4 rounded-2xl border-2 border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3 group/google"
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                    Google Link
                                </motion.button>
                            </a>
                            
                            <Link to="/login" className="block text-center group/enter">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                    Already Enlisted? <span className="text-emerald-400 group-hover/enter:text-white transition-colors ml-1">Establish Link </span>
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Micro-decorations */}
            <div className="fixed top-6 right-6 flex flex-col items-end gap-1 text-slate-600/30 font-mono text-[8px] tracking-[0.4em] pointer-events-none uppercase">
                <span>Registration_Link_Active</span>
                <span className="text-emerald-500/50">Stability_99.8%</span>
            </div>
        </div>
    );
};

export default Register;
