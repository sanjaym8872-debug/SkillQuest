import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Sword, Wand2, Cloud, ShieldCheck, Zap, Star, ChevronRight,
    Brain, Activity, Palette, Smartphone, Coins, Bug, Database, Server
} from 'lucide-react';
import { motion } from 'framer-motion';

const CLASSES = [
    {
        name: 'Frontend Warrior',
        description: 'Masters of the Visual Realm. Wields React and CSS with deadly precision.',
        icon: <Sword size={40} />,
        accent: 'from-blue-500 to-cyan-400',
        textColor: 'text-blue-400',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Tailwind', 'Next.js', 'Redux']
    },
    {
        name: 'Data Mage',
        description: 'Architects of Knowledge. Uses Python and SQL to reveal hidden truths.',
        icon: <Wand2 size={40} />,
        accent: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-400',
        skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Deep Learning', 'Statistics', 'Spark', 'Tableau']
    },
    {
        name: 'Cloud Engineer',
        description: 'Masters of the Infrastructure. Deploys armies across AWS and Google Cloud.',
        icon: <Cloud size={40} />,
        accent: 'from-orange-500 to-amber-500',
        textColor: 'text-orange-400',
        skills: ['Cloud', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Ansible', 'Azure']
    },
    {
        name: 'Cyber Ninja',
        description: 'Guardians of the Perimeter. Protecting the realm from digital threats.',
        icon: <ShieldCheck size={40} />,
        accent: 'from-emerald-500 to-teal-500',
        textColor: 'text-emerald-400',
        skills: ['Cyber', 'Networking', 'Encryption', 'Pentesting', 'Linux', 'Wireshark', 'Metasploit', 'Firewall']
    },
    {
        name: 'AI Architect',
        description: 'Synapse Weavers. Building the minds of the future with LLMs and Neural Nets.',
        icon: <Brain size={40} />,
        accent: 'from-rose-500 to-pink-600',
        textColor: 'text-rose-400',
        skills: ['LLMs', 'Neural Networks', 'PyTorch', 'OpenAI API', 'LangChain', 'Vector DBs', 'TensorFlow', 'HuggingFace']
    },
    {
        name: 'DevOps Paladin',
        description: 'Sentinels of Stability. Orchestrating the flow of code through the void.',
        icon: <Activity size={40} />,
        accent: 'from-indigo-500 to-blue-700',
        textColor: 'text-indigo-400',
        skills: ['SRE', 'Prometheus', 'Grafana', 'ELK Stack', 'GitLab CI', 'ArgoCD', 'Nginx', 'Helm']
    },
    {
        name: 'UI/UX Sorcerer',
        description: 'Masters of Intent. Crafting experiences that bridge the gap between human and machine.',
        icon: <Palette size={40} />,
        accent: 'from-fuchsia-500 to-pink-400',
        textColor: 'text-fuchsia-400',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Color Theory', 'Typography', 'Webflow', 'A/B Testing']
    },
    {
        name: 'Mobile Monk',
        description: 'Nomads of the Interface. Building the portals we carry in our pockets.',
        icon: <Smartphone size={40} />,
        accent: 'from-lime-500 to-green-500',
        textColor: 'text-lime-400',
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Firebase', 'Mobile UX', 'App Store']
    },
    {
        name: 'Blockchain Bard',
        description: 'Chronicles of the Ledger. Weaving trust into the decentralized web.',
        icon: <Coins size={40} />,
        accent: 'from-yellow-400 to-amber-600',
        textColor: 'text-amber-400',
        skills: ['Solidity', 'Ethereum', 'Web3.js', 'Ethers.js', 'Hardhat', 'IPFS', 'DeFi', 'NFTs']
    },
    {
        name: 'QA Shadow',
        description: 'Seekers of Flaws. Ensuring the integrity of the digital realm through rigorous trial.',
        icon: <Bug size={40} />,
        accent: 'from-red-500 to-orange-600',
        textColor: 'text-red-400',
        skills: ['Jest', 'Cypress', 'Selenium', 'Playwright', 'Bug Hunting', 'Performance', 'Postman', 'CI Testing']
    },
    {
        name: 'Data Warden',
        description: 'Custodians of the Flow. Protecting and refining the lifeblood of the empire.',
        icon: <Database size={40} />,
        accent: 'from-cyan-500 to-blue-600',
        textColor: 'text-cyan-400',
        skills: ['Data Governance', 'Airflow', 'Snowflake', 'Data Privacy', 'ETL', 'Databricks', 'PostgreSQL', 'Data Modeling']
    },
    {
        name: 'Backend Titan',
        description: 'Foundations of the World. Engineering the vast systems that hold the sky aloft.',
        icon: <Server size={40} />,
        accent: 'from-slate-500 to-slate-700',
        textColor: 'text-slate-300',
        skills: ['Node.js', 'Go', 'Microservices', 'System Design', 'GraphQL', 'Redis', 'Kafka', 'PostgreSQL']
    }
];

const CharacterSelect = () => {
    const { updateCharacter } = useAuth();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const handleSelect = async () => {
        if (!selected) return;
        try {
            await updateCharacter(selected.name);
            navigate('/');
        } catch (err) {
            alert('Failed to select class');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-4"
            >
                <div className="inline-block relative">
                    <Star className="text-amber-500 w-12 h-12 mx-auto mb-2 animate-pulse" fill="currentColor" />
                    <div className="absolute inset-0 blur-xl bg-amber-500/20 rounded-full"></div>
                </div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500 italic uppercase tracking-tighter">Choose Your Path</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">A single choice determines your starting attributes</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {CLASSES.map((cls, i) => (
                    <motion.div
                        key={cls.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => setSelected(cls)}
                        className={`relative game-card cursor-pointer border-2 h-full transition-all duration-500 overflow-hidden group ${selected?.name === cls.name
                            ? `border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.3)]`
                            : 'border-white/5 hover:border-white/10'
                            }`}
                    >
                        {selected?.name === cls.name && (
                            <motion.div
                                layoutId="selectedGlow"
                                className={`absolute inset-0 bg-gradient-to-br ${cls.accent} opacity-10 pointer-events-none`}
                            />
                        )}

                        <div className={`mb-6 p-4 rounded-[2rem] bg-slate-950 inline-block border border-slate-800 group-hover:border-indigo-500/50 transition-all duration-500 ${selected?.name === cls.name ? cls.textColor + ' shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-600'
                            }`}>
                            {cls.icon}
                        </div>

                        <h3 className={`text-2xl font-black mb-2 uppercase tracking-tighter transition-colors ${selected?.name === cls.name ? 'text-white' : 'text-slate-400'}`}>
                            {cls.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">{cls.description}</p>

                        <div className="space-y-3">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Base Skills</div>
                            <div className="flex flex-wrap gap-2">
                                {cls.skills.map(s => (
                                    <span key={s} className="text-[9px] px-2 py-1 bg-slate-950 rounded-lg text-slate-400 font-black border border-slate-800 uppercase tracking-tighter">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {selected?.name === cls.name && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 bg-white p-1 rounded-full text-slate-900 shadow-xl"
                            >
                                <Zap size={12} fill="currentColor" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-6"
            >
                <button
                    onClick={handleSelect}
                    disabled={!selected}
                    className={`group relative overflow-hidden px-16 py-6 rounded-3xl font-black text-xl uppercase tracking-[0.2em] transition-all ${selected
                        ? 'btn-primary shadow-[0_0_50px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {selected ? 'Claim Destiny' : 'Select a Class'}
                        {selected && <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />}
                    </span>
                    {selected && (
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    )}
                </button>
                {selected && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-black text-indigo-400 uppercase tracking-widest animate-pulse"
                    >
                        Initializing Attribute Matrix for {selected.name}...
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default CharacterSelect;
