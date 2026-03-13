import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sword, TrendingUp, Trophy, LogOut, Zap, Shield, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'DASHBOARD', icon: <LayoutDashboard size={18} /> },
        { path: '/boss-battle', label: 'THE ARENA', icon: <Sword size={18} /> },
        { path: '/roadmap', label: 'QUEST LOG', icon: <TrendingUp size={18} /> },
        { path: '/leaderboard', label: 'RANKINGS', icon: <Trophy size={18} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 z-50 px-6 shadow-2xl transition-colors duration-500" style={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(2, 6, 23, 0.9)', borderColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-indigo-500/20"
                    >
                        <Shield size={20} fill="currentColor" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className={`font-black text-xl tracking-tighter leading-none group-hover:text-indigo-400 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>SKILL QUEST</span>
                        <span className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase transition-colors">Career RPG</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-3 bg-white/5 px-2 py-1.5 rounded-2xl border border-white/5 shadow-inner" style={{ backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', borderColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative px-6 py-2.5 group"
                            >
                                <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative z-10 ${isActive ? (theme === 'light' ? 'text-indigo-600' : 'text-white') : 'text-slate-500 hover:text-indigo-400'
                                    }`}>
                                    {React.cloneElement(item.icon, { size: 16, className: isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400' })}
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

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden sm:flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5 shadow-inner" style={{ backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', borderColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                            <div className="flex flex-col items-end">
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

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className={`p-3 rounded-xl transition-all border ${theme === 'light' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500 hover:text-white' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white'}`}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={logout}
                            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                            title="Abandon Quest"
                        >
                            <LogOut size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
