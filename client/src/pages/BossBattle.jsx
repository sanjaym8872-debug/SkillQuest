import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sword, Skull, ShieldAlert, CheckCircle2, ChevronRight, Briefcase, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ALL_BOSSES = [
    // Frontend Warrior Bosses
    { id: 'senior-frontend', role: 'Frontend Warrior', title: 'Senior Frontend Dragon', skills: [{ name: 'React', level: 80 }, { name: 'JavaScript', level: 70 }, { name: 'HTML', level: 60 }] },
    { id: 'ux-chimera', role: 'Frontend Warrior', title: 'Creative UX Chimera', skills: [{ name: 'Tailwind', level: 85 }, { name: 'CSS', level: 75 }, { name: 'HTML', level: 70 }] },
    { id: 'ts-titan', role: 'Frontend Warrior', title: 'TypeScript Titan', skills: [{ name: 'TypeScript', level: 80 }, { name: 'Next.js', level: 70 }, { name: 'Redux', level: 65 }] },
    { id: 'next-nexus', role: 'Frontend Warrior', title: 'Fullstack Necromancer', skills: [{ name: 'Next.js', level: 85 }, { name: 'React', level: 85 }, { name: 'Tailwind', level: 80 }] },

    // Data Mage Bosses
    { id: 'data-scientist-titan', role: 'Data Mage', title: 'Data Scientist Titan', skills: [{ name: 'Python', level: 85 }, { name: 'SQL', level: 70 }, { name: 'Pandas', level: 60 }] },
    { id: 'neural-hydra', role: 'Data Mage', title: 'Neural Net Hydra', skills: [{ name: 'Deep Learning', level: 90 }, { name: 'Machine Learning', level: 80 }, { name: 'Statistics', level: 75 }] },
    { id: 'spark-specter', role: 'Data Mage', title: 'Big Data Specter', skills: [{ name: 'Spark', level: 85 }, { name: 'SQL', level: 80 }, { name: 'Python', level: 75 }] },
    { id: 'prob-prophet', role: 'Data Mage', title: 'Probabilistic Prophet', skills: [{ name: 'Statistics', level: 90 }, { name: 'Python', level: 80 }, { name: 'Tableau', level: 70 }] },

    // Cloud Engineer Bosses
    { id: 'cloud-arch-colossus', role: 'Cloud Engineer', title: 'Cloud Arch Colossus', skills: [{ name: 'Cloud', level: 75 }, { name: 'Docker', level: 65 }, { name: 'Kubernetes', level: 50 }] },
    { id: 'terraform-terror', role: 'Cloud Engineer', title: 'Infrastructure Overlord', skills: [{ name: 'Terraform', level: 85 }, { name: 'Ansible', level: 75 }, { name: 'AWS', level: 80 }] },
    { id: 'jenkins-juggernaut', role: 'Cloud Engineer', title: 'DevOps Dreadnought', skills: [{ name: 'Jenkins', level: 80 }, { name: 'Kubernetes', level: 85 }, { name: 'Docker', level: 70 }] },
    { id: 'azure-archon', role: 'Cloud Engineer', title: 'Multi-Cloud Archon', skills: [{ name: 'Azure', level: 85 }, { name: 'Cloud', level: 80 }, { name: 'AWS', level: 75 }] },

    // Cyber Ninja Bosses
    { id: 'cyber-sec-specter', role: 'Cyber Ninja', title: 'Cyber Security Specter', skills: [{ name: 'Cyber', level: 80 }, { name: 'Networking', level: 65 }, { name: 'Encryption', level: 55 }] },
    { id: 'malware-manticore', role: 'Cyber Ninja', title: 'Malware Manticore', skills: [{ name: 'Metasploit', level: 85 }, { name: 'Pentesting', level: 80 }, { name: 'Linux', level: 75 }] },
    { id: 'firewall-zodiac', role: 'Cyber Ninja', title: 'Zero Trust Zodiac', skills: [{ name: 'Firewall', level: 90 }, { name: 'Networking', level: 85 }, { name: 'Wireshark', level: 80 }] },
    { id: 'crypto-kraken', role: 'Cyber Ninja', title: 'Cryptographic Kraken', skills: [{ name: 'Encryption', level: 90 }, { name: 'Cyber', level: 85 }, { name: 'Linux', level: 80 }] },

    // AI Architect Bosses
    { id: 'llm-overlord', role: 'AI Architect', title: 'LLM Overlord', skills: [{ name: 'LLMs', level: 90 }, { name: 'OpenAI API', level: 85 }, { name: 'LangChain', level: 80 }] },
    { id: 'tensor-titan', role: 'AI Architect', title: 'Tensor Titan', skills: [{ name: 'PyTorch', level: 85 }, { name: 'Neural Networks', level: 85 }, { name: 'TensorFlow', level: 80 }] },
    { id: 'agent-swarm', role: 'AI Architect', title: 'Agentic Swarm Lord', skills: [{ name: 'LangChain', level: 90 }, { name: 'Vector DBs', level: 85 }, { name: 'LLMs', level: 80 }] },
    { id: 'hf-hero', role: 'AI Architect', title: 'Model Librarian God', skills: [{ name: 'HuggingFace', level: 90 }, { name: 'Neural Networks', level: 80 }, { name: 'PyTorch', level: 75 }] },

    // DevOps Paladin Bosses
    { id: 'sre-saint', role: 'DevOps Paladin', title: 'Stability Saint', skills: [{ name: 'SRE', level: 90 }, { name: 'Grafana', level: 85 }, { name: 'Nginx', level: 80 }] },
    { id: 'pipe-pontiff', role: 'DevOps Paladin', title: 'Pipeline Pontiff', skills: [{ name: 'GitLab CI', level: 90 }, { name: 'ArgoCD', level: 85 }, { name: 'Helm', level: 80 }] },
    { id: 'k8s-king', role: 'DevOps Paladin', title: 'Cluster King', skills: [{ name: 'Helm', level: 85 }, { name: 'SRE', level: 80 }, { name: 'GitLab CI', level: 75 }] },
    { id: 'elk-emperor', role: 'DevOps Paladin', title: 'Log Sentinel Emperor', skills: [{ name: 'ELK Stack', level: 90 }, { name: 'Prometheus', level: 85 }, { name: 'Grafana', level: 80 }] },

    // UI/UX Sorcerer Bosses
    { id: 'canvas-cardinal', role: 'UI/UX Sorcerer', title: 'Canvas Cardinal', skills: [{ name: 'Figma', level: 95 }, { name: 'Typography', level: 85 }, { name: 'Color Theory', level: 80 }] },
    { id: 'empathy-emperor', role: 'UI/UX Sorcerer', title: 'Empathy Emperor', skills: [{ name: 'User Research', level: 90 }, { name: 'A/B Testing', level: 85 }, { name: 'Design Systems', level: 80 }] },
    { id: 'proto-prince', role: 'UI/UX Sorcerer', title: 'Prototype Prince', skills: [{ name: 'Prototyping', level: 90 }, { name: 'Figma', level: 85 }, { name: 'Webflow', level: 75 }] },
    { id: 'ds-deity', role: 'UI/UX Sorcerer', title: 'Design System Deity', skills: [{ name: 'Design Systems', level: 95 }, { name: 'Prototyping', level: 85 }, { name: 'Color Theory', level: 80 }] },

    // Mobile Monk Bosses
    { id: 'native-nomad', role: 'Mobile Monk', title: 'Native Nomad', skills: [{ name: 'React Native', level: 90 }, { name: 'Swift', level: 85 }, { name: 'Kotlin', level: 85 }] },
    { id: 'flutter-friar', role: 'Mobile Monk', title: 'Flutter Friar', skills: [{ name: 'Flutter', level: 90 }, { name: 'Firebase', level: 85 }, { name: 'Mobile UX', level: 80 }] },
    { id: 'bridge-bishop', role: 'Mobile Monk', title: 'Bridge Builder Bishop', skills: [{ name: 'Expo', level: 90 }, { name: 'React Native', level: 85 }, { name: 'App Store', level: 80 }] },
    { id: 'mobile-messiah', role: 'Mobile Monk', title: 'Mobile UX Messiah', skills: [{ name: 'Mobile UX', level: 95 }, { name: 'Flutter', level: 80 }, { name: 'Swift', level: 75 }] },

    // Blockchain Bard Bosses
    { id: 'solid-sultan', role: 'Blockchain Bard', title: 'Solidity Sultan', skills: [{ name: 'Solidity', level: 95 }, { name: 'Hardhat', level: 90 }, { name: 'Ethereum', level: 85 }] },
    { id: 'web3-wizard', role: 'Blockchain Bard', title: 'Protocol Wizard', skills: [{ name: 'Web3.js', level: 90 }, { name: 'Ethers.js', level: 85 }, { name: 'IPFS', level: 80 }] },
    { id: 'defi-duke', role: 'Blockchain Bard', title: 'DeFi Duke', skills: [{ name: 'DeFi', level: 95 }, { name: 'Solidity', level: 90 }, { name: 'NFTs', level: 80 }] },
    { id: 'bard-baron', role: 'Blockchain Bard', title: 'Decentralized Baron', skills: [{ name: 'IPFS', level: 90 }, { name: 'Ethereum', level: 85 }, { name: 'Web3.js', level: 80 }] },

    // QA Shadow Bosses
    { id: 'jest-juggernaut', role: 'QA Shadow', title: 'Jest Juggernaut', skills: [{ name: 'Jest', level: 95 }, { name: 'Postman', level: 90 }, { name: 'Performance', level: 85 }] },
    { id: 'cy-ceph', role: 'QA Shadow', title: 'Cypress Ceph', skills: [{ name: 'Cypress', level: 95 }, { name: 'Playwright', level: 90 }, { name: 'Selenium', level: 80 }] },
    { id: 'auto-archon', role: 'QA Shadow', title: 'Automation Archon', skills: [{ name: 'CI Testing', level: 90 }, { name: 'Playwright', level: 85 }, { name: 'Cypress', level: 80 }] },
    { id: 'bug-baron', role: 'QA Shadow', title: 'Error Reaper Baron', skills: [{ name: 'Bug Hunting', level: 95 }, { name: 'Jest', level: 85 }, { name: 'Performance', level: 80 }] },

    // Data Warden Bosses
    { id: 'gov-giant', role: 'Data Warden', title: 'Governance Giant', skills: [{ name: 'Data Governance', level: 95 }, { name: 'Data Privacy', level: 90 }, { name: 'PostgreSQL', level: 85 }] },
    { id: 'etl-elder', role: 'Data Warden', title: 'ETL Elder', skills: [{ name: 'ETL', level: 95 }, { name: 'Airflow', level: 90 }, { name: 'Data Modeling', level: 85 }] },
    { id: 'snowflake-sov', role: 'Data Warden', title: 'Cloud Vault Sovereign', skills: [{ name: 'Snowflake', level: 95 }, { name: 'Databricks', level: 85 }, { name: 'Airflow', level: 80 }] },
    { id: 'warden-warlord', role: 'Data Warden', title: 'Privacy Warlord', skills: [{ name: 'Data Privacy', level: 95 }, { name: 'Data Governance', level: 85 }, { name: 'Data Modeling', level: 80 }] },

    // Backend Titan Bosses
    { id: 'node-nautilus', role: 'Backend Titan', title: 'Node.js Nautilus', skills: [{ name: 'Node.js', level: 95 }, { name: 'GraphQL', level: 90 }, { name: 'Redis', level: 85 }] },
    { id: 'go-goliath', role: 'Backend Titan', title: 'Concurrency Goliath', skills: [{ name: 'Go', level: 95 }, { name: 'Kafka', level: 90 }, { name: 'System Design', level: 85 }] },
    { id: 'ms-monarch', role: 'Backend Titan', title: 'Microservice Monarch', skills: [{ name: 'Microservices', level: 95 }, { name: 'System Design', level: 90 }, { name: 'PostgreSQL', level: 85 }] },
    { id: 'titan-tyrant', role: 'Backend Titan', title: 'Persistence Tyrant', skills: [{ name: 'PostgreSQL', level: 95 }, { name: 'Redis', level: 90 }, { name: 'Node.js', level: 85 }] }
];

import BossCombatGame from '../components/BossCombatGame';

const BossBattle = () => {
    const { user, checkUser } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [selectedBoss, setSelectedBoss] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [quests, setQuests] = useState([]);
    const [chainInfo, setChainInfo] = useState(null);

    // Combat State
    const [inCombat, setInCombat] = useState(false);
    const [playerHP, setPlayerHP] = useState(100);
    const [bossHP, setBossHP] = useState(100);
    const [battleResult, setBattleResult] = useState(null);
    const [combatText, setCombatText] = useState("SYNCING NEURAL LINK...");

    // Dynamic filtering for bosses
    const relevantBosses = ALL_BOSSES.filter(b => b.role === user?.characterClass);

    const getSkillStatus = (name, reqLevel) => {
        const userSkill = user?.skills?.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (!userSkill) return { color: 'text-red-500', label: 'Missing', width: 0, diff: reqLevel };
        if (userSkill.level < reqLevel) return { color: 'text-amber-500', label: 'Weak', width: userSkill.level, diff: reqLevel - userSkill.level };
        return { color: 'text-emerald-500', label: 'Strong', width: userSkill.level, diff: 0 };
    };

    const startCombat = async () => {
        setInCombat(true);
        setPlayerHP(100);
        setBossHP(100);
        setBattleResult(null);
        setCombatText(`NEURAL CONFRONTATION: ${selectedBoss.title.toUpperCase()}`);
    };

    const handleBattleEnd = async (didWin) => {
        setInCombat(false); // Close the game overlay
        setGenerating(true); // Show loader for mission generation

        try {
            if (didWin) {
                setBattleResult('win');
                setBossHP(0);
                setCombatText("CRITICAL FAILURE DETECTED IN BOSS CORE. VICTORY.");

                // Grant reward via backend
                await axios.post(`${API_URL}/user/boss-victory`, {
                    bossId: selectedBoss.id,
                    bossTitle: selectedBoss.title
                });

                await checkUser();
            } else {
                setBattleResult('lose');
                setPlayerHP(0);
                setCombatText("NEURAL OVERLOAD. RETREATING TO TRAINING SECTOR.");
            }

            // Generate mission chain
            const missionRes = await axios.post(`${API_URL}/missions/generate-chain`, {
                requirements: selectedBoss.skills
            });
            setQuests(missionRes.data.missions || []);
            setChainInfo({
                skill: missionRes.data.targetSkill,
                gap: missionRes.data.gapPoints
            });

        } catch (err) {
            console.error('BATTLE RESULT ERR:', err);
        } finally {
            setGenerating(false);
        }
    };

    if (inCombat) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[100] bg-slate-950 flex flex-col p-6 items-center justify-center overflow-hidden"
            >
                <BossCombatGame
                    boss={selectedBoss}
                    userClass={user?.characterClass}
                    onFinish={handleBattleEnd}
                />
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="inline-block relative mb-4">
                    <Sword className="text-red-500 w-12 h-12 rotate-45 mb-2" />
                    <div className="absolute inset-0 blur-xl bg-red-500/20 rounded-full animate-pulse"></div>
                </div>
                <h1 className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme === 'light' ? 'from-red-600 via-orange-500 to-amber-600' : 'from-red-500 via-orange-400 to-amber-500'} uppercase tracking-tighter`}>
                    Ultimate Boss Battle
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Reveal the path to mastery</p>
            </motion.div>

            {!selectedBoss ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relevantBosses.length > 0 ? relevantBosses.map((role, i) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.02 }}
                            className={`game-card cursor-pointer group hover:border-red-500/50 shadow-xl overflow-hidden relative ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}
                            onClick={() => setSelectedBoss(role)}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Skull size={80} />
                            </div>
                            <div className="flex justify-between items-center relative z-10">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Rank: Guardian</div>
                                    <h3 className={`text-2xl font-black group-hover:text-red-400 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{role.title}</h3>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-amber-500 fill-amber-500" />)}
                                    </div>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 group-hover:bg-red-50' : 'bg-slate-800 border-slate-700 group-hover:bg-red-500/10'} group-hover:border-red-500/50`}>
                                    <Skull className={`w-8 h-8 ${theme === 'light' ? 'text-slate-300' : 'text-slate-400'} group-hover:text-red-500`} />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-2 text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs">
                            No bosses detected in this sector.
                        </div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <button
                        onClick={() => { setSelectedBoss(null); setQuests([]); }}
                        className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors mb-4"
                    >
                        <ChevronRight className="rotate-180" size={14} /> Back to Arena
                    </button>

                    <AnimatePresence>
                        {battleResult && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-8 rounded-[32px] border-2 shadow-2xl text-center space-y-4 mb-8 ${battleResult === 'win'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/10'
                                    : 'bg-red-500/10 border-red-500/30 shadow-red-500/10'
                                    }`}
                            >
                                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${battleResult === 'win' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                    {battleResult === 'win' ? <CheckCircle2 size={40} /> : <ShieldAlert size={40} />}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                                        {battleResult === 'win' ? 'Core Integrity Compromised' : 'Neural Buffer Expired'}
                                    </h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        {battleResult === 'win'
                                            ? 'You have successfully breached the target. Rewards synchronized.'
                                            : 'System defense too strong. Extraction initiated for retraining.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="game-card border-red-500/20 bg-slate-900 shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <div className="p-6 bg-red-950/20 rounded-2xl border border-red-500/10 text-center md:text-left">
                                    <div className="text-red-500 font-black text-[10px] tracking-[0.3em] uppercase mb-4 py-1 px-3 bg-red-500/10 rounded inline-block">Elimination Target</div>
                                    <h2 className="text-4xl font-black text-white leading-tight uppercase">{selectedBoss.title}</h2>
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className="flex justify-between text-[10px] font-black text-slate-500">
                                            <span>DIFFICULTY LEVEL</span>
                                            <span className="text-red-500">S-RANK</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                className="h-full bg-red-500 animate-pulse"
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Briefcase size={16} />
                                        <span className="text-xs font-black uppercase tracking-widest">Victory Rewards</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 text-center">
                                            <div className="text-xs font-black text-white">+5000 XP</div>
                                            <div className="text-[10px] text-slate-500 font-bold">Base Exp</div>
                                        </div>
                                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 text-center">
                                            <div className="text-xs font-black text-amber-500">Elite Badge</div>
                                            <div className="text-[10px] text-slate-500 font-bold">Trophy</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                                    <Zap size={16} className="text-amber-500" /> Required Skill Attributes
                                </h3>

                                <div className="space-y-5">
                                    {selectedBoss?.skills?.map(skill => {
                                        const status = getSkillStatus(skill.name, skill.level);
                                        return (
                                            <div key={skill.name} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="font-black text-xs text-white uppercase tracking-tighter">{skill.name}</span>
                                                    <span className={`${status.color} font-black text-[10px] uppercase bg-slate-800 px-2 py-0.5 rounded`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="relative h-5 bg-slate-800/50 rounded-lg p-0.5 border border-slate-800 shadow-inner">
                                                    <div
                                                        className="absolute top-0 bottom-0 w-1 bg-red-500 z-20 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                                        style={{ left: `${skill.level}%` }}
                                                        title={`Goal: ${skill.level}`}
                                                    />
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${status.width}%` }}
                                                        className={`h-full rounded transition-all duration-1000 ${status.label === 'Strong' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-800">
                            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700 flex items-start gap-5">
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <ShieldAlert className="text-red-500" size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-white text-sm uppercase tracking-widest">Tactical Scan</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        System vulnerabilities identified in {selectedBoss?.skills?.filter(s => getSkillStatus(s.name, s.level).label !== 'Strong').map(s => s.name).join(', ')}.
                                        Engaging the boss directly without training is high-risk. Proceed?
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-8">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={startCombat}
                                    disabled={generating}
                                    className="w-full btn-primary py-5 text-sm font-black uppercase tracking-[0.2em] shadow-2xl relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 border-red-500"
                                >
                                    {generating ? 'Scanning Systems...' : 'Engage Tactical Confrontation'}
                                    {generating && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        />
                                    )}
                                </motion.button>
                                <p className="text-[10px] text-center text-slate-600 font-black uppercase tracking-widest">Warning: Direct combat bypasses training protocols</p>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {quests.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-6 pt-10 border-t border-slate-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-lg">
                                            <Star className="text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                                {battleResult === 'lose' ? 'Required Mastery Tasks' : 'Final Specialization Tasks'}
                                            </h2>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Link: {chainInfo?.skill}</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                                        Sequence Initialized
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
                                    {quests.map((q, i) => (
                                        <React.Fragment key={i}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex-1 flex flex-col min-w-[280px] max-w-[350px] game-card bg-slate-900 border-indigo-500/20 group hover:border-indigo-500/50 transition-all relative overflow-hidden"
                                            >
                                                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/5 rotate-45 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

                                                <div className="flex justify-between items-start mb-4 relative z-10">
                                                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {q.difficulty}
                                                    </div>
                                                    <div className="text-[10px] font-black text-white">+{q.xpReward} XP</div>
                                                </div>

                                                <div className="flex-1 flex flex-col relative z-10">
                                                    <h4 className="font-black text-lg text-white mb-2 leading-tight uppercase">{q.title}</h4>

                                                    <div className="space-y-1.5 mb-6">
                                                        {q?.tasks?.slice(0, 3).map((task, ti) => (
                                                            <div key={ti} className="flex items-start gap-2 text-[10px] text-slate-500 font-medium leading-relaxed">
                                                                <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1 shrink-0" />
                                                                <span>{task}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => navigate('/roadmap')}
                                                    className="w-full py-3 bg-slate-800 hover:bg-emerald-600 text-[10px] font-black uppercase tracking-widest text-white rounded-lg transition-all border border-slate-700 hover:border-emerald-500 flex items-center justify-center gap-2 mt-auto"
                                                >
                                                    <Zap size={12} className="fill-white" />
                                                    Start Quest
                                                </button>
                                            </motion.div>

                                            {i < quests.length - 1 && (
                                                <div className="hidden lg:flex items-center justify-center">
                                                    <ChevronRight className="text-slate-800 animate-pulse" />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default BossBattle;
