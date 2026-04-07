import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sword, TrendingUp, Trophy, LogOut, Zap, Shield, Sun, Moon, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'DASHBOARD', icon: <LayoutDashboard size={18} /> },
        { path: '/boss-battle', label: 'THE ARENA', icon: <Sword size={18} /> },
        { path: '/roadmap', label: 'QUEST LOG', icon: <TrendingUp size={18} /> },
        { path: '/leaderboard', label: 'RANKINGS', icon: <Trophy size={18} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 z-50 px-6 shadow-2xl transition-colors duration-500" style={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(2, 6, 23, 0.9)', borderColor: theme === 'light' ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.05)' }}>
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-indigo-500/20"
                    >
                        <Shield size={20} fill="currentColor" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className={`font-black text-lg md:text-xl tracking-tighter leading-none group-hover:text-indigo-400 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>SKILL QUEST</span>
                        <span className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase transition-colors">Career RPG</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-3 bg-white/5 px-2 py-1.5 rounded-2xl border border-white/5 shadow-inner" style={{ backgroundColor: theme === 'light' ? 'rgba(15,23,42,0.03)' : 'rgba(255,255,255,0.05)', borderColor: theme === 'light' ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative px-6 py-2.5 group"
                            >
                                <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative z-10 ${isActive ? (theme === 'light' ? 'text-indigo-600' : 'text-white') : (theme === 'light' ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400')
                                    }`}>
                                    {React.cloneElement(item.icon, { size: 16, className: isActive ? 'text-indigo-400' : (theme === 'light' ? 'text-slate-400 group-hover:text-indigo-600' : 'text-slate-500 group-hover:text-indigo-400') })}
                                    {item.label}
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="navActiveBg"
                                        className="absolute inset-0 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Character Stats (Mobile Small) */}
                    {user && (
                        <div className="flex items-center gap-4 bg-slate-900/50 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-white/5 shadow-inner" style={{ backgroundColor: theme === 'light' ? 'rgba(15,23,42,0.03)' : 'rgba(255,255,255,0.05)', borderColor: theme === 'light' ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.05)' }}>
                            <div className="hidden sm:flex flex-col items-end">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{user.username}</span>
                                <div className="flex items-center gap-1.5">
                                    <Zap size={10} className="text-amber-500" fill="currentColor" />
                                    <span className="text-[10px] text-amber-500 font-black uppercase">LV {user.level}</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&mouth=smile`} alt="Avatar" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            onClick={toggleTheme}
                            className={`p-3 rounded-xl transition-all border hidden sm:block ${theme === 'light' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500 hover:text-white' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white'}`}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            onClick={logout}
                            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 hidden sm:block"
                            title="Abandon Quest"
                        >
                            <LogOut size={18} />
                        </button>

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all border border-indigo-500/20"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="lg:hidden fixed top-20 left-0 right-0 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden z-40 shadow-2xl"
                    >
                        <div className="p-6 space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                        location.pathname === item.path
                                        ? 'bg-indigo-500/20 border-indigo-500/30 text-white'
                                        : 'bg-white/5 border-white/5 text-slate-400'
                                    }`}
                                >
                                    {React.cloneElement(item.icon, { size: 20 })}
                                    <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
                                </Link>
                            ))}
                            
                            {/* Mobile Theme & Logout Toggle */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                                    className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl text-slate-400"
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                    <span className="font-black text-[10px] uppercase">Theme</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500"
                                >
                                    <LogOut size={18} />
                                    <span className="font-black text-[10px] uppercase">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
