import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Cpu, Activity, ChevronRight, Lock, CheckCircle2, Star, AlertCircle, Terminal, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SKILL_DATA = {
    'Frontend Warrior': [
        { q: "Which CSS property is used to create a flex container?", a: "display: flex", options: ["flex-direction", "display: flex", "align-items", "justify-content"] },
        { q: "Which hook is used for side effects in React?", a: "useEffect", options: ["useState", "useMemo", "useEffect", "useCallback"] },
        { q: "In React, which hook is used to persist values between renders without causing a re-render?", a: "useRef", options: ["useEffect", "useMemo", "useRef", "useState"] },
        { q: "What is the result of '[] + []' in JavaScript?", a: "''", options: ["'[]'", "0", "''", "undefined"] },
        { q: "Which CSS property is used to change the stacking order of elements?", a: "z-index", options: ["order", "z-index", "display", "float"] },
        { q: "What is the difference between 'interface' and 'type' in TypeScript?", a: "Interfaces can be merged, types cannot", options: ["Types can be merged, interfaces cannot", "Interfaces can be merged, types cannot", "Interfaces only work for objects", "They are identical"] },
        { q: "What is 'Hoisting' in JavaScript?", a: "Accessing variables before they are declared", options: ["Moving functions to bottom", "Accessing variables before they are declared", "Lifting state to parent", "Memory allocation"] },
        { q: "What is a 'Thunk' in Redux?", a: "A function that returns another function (usually for async)", options: ["A piece of state", "A function that returns another function (usually for async)", "A way to combine reducers", "A UI component"] },
        { q: "In high-intensity production, what is the primary risk of misconfiguring the React core?", a: "Memory leak in React stack", options: ["Memory leak in React stack", "Security breach in gateway", "Latency spikes", "Data corruption"] }
    ],
    'Data Mage': [
        { q: "Which SQL clause is used to filter group results?", a: "HAVING", options: ["WHERE", "GROUP BY", "HAVING", "FILTER"] },
        { q: "What is the primary library for data manipulation in Python?", a: "Pandas", options: ["Numpy", "Pandas", "Matplotlib", "Scikit-Learn"] },
        { q: "Which of these is a popular NoSQL document-oriented database?", a: "MongoDB", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"] },
        { q: "What is the difference between UNION and UNION ALL in SQL?", a: "UNION removes duplicates", options: ["UNION ALL removes duplicates", "UNION removes duplicates", "UNION is faster", "No difference"] },
        { q: "What is 'Overfitting' in Machine Learning?", a: "Model performs well on training but poorly on test data", options: ["Model is too simple", "Model performs well on training but poorly on test data", "Model takes too long", "Too many features"] },
        { q: "How do you select a specific column 'A' from a DataFrame 'df' in Pandas?", a: "All of the above", options: ["df['A']", "df.A", "df.get('A')", "All of the above"] },
        { q: "Which process is used to move data from a source to a data warehouse?", a: "ETL", options: ["ETL", "FTP", "DNS", "API"] },
        { q: "What type of key uniquely identifies a record in a database table?", a: "Primary Key", options: ["Primary Key", "Foreign Key", "Super Key", "Candidate Key"] },
        { q: "What is the primary risk of misconfiguring the Pandas core?", a: "Memory leak in Pandas stack", options: ["Memory leak in Pandas stack", "Security breach", "Latency spikes", "Data corruption"] }
    ],
    'Cloud Engineer': [
        { q: "Which service is used for scalable object storage in AWS?", a: "S3", options: ["EC2", "RDS", "S3", "VPC"] },
        { q: "What command lists all running Docker containers?", a: "docker ps", options: ["docker list", "docker ls", "docker ps", "docker containers"] },
        { q: "What does CIDR stand for in networking?", a: "Classless Inter-Domain Routing", options: ["Classless Inter-Domain Routing", "Cloud Data Registry", "Core Internal Router", "Connected Internet Resource"] },
        { q: "What is the purpose of a multi-stage build in a Dockerfile?", a: "To reduce the final image size", options: ["To run multiple processes", "To reduce the final image size", "To speed up download", "To allow cross-platform"] },
        { q: "What is the smallest deployable unit in Kubernetes?", a: "Pod", options: ["Container", "Pod", "Deployment", "Service"] },
        { q: "What does S3 stand for in AWS?", a: "Simple Storage Service", options: ["Simple Server Storage", "Simple Storage Service", "Secure Storage Solution", "Scalable System Service"] },
        { q: "Which tool is primarily used for Infrastructure as Code (IaC)?", a: "Terraform", options: ["Ansible", "Jenkins", "Terraform", "Prometheus"] },
        { q: "Which architectural pattern is most effective for scaling Kubernetes clusters across regions?", a: "Distributed Kubernetes state-sharding", options: ["Asynchronous replication", "Synchronous locking", "Shared-nothing architecture", "Distributed Kubernetes state-sharding"] }
    ],
    'Cyber Ninja': [
        { q: "Which nmap flag is used for a stealth SYN scan?", a: "-sS", options: ["-sT", "-sU", "-sS", "-sV"] },
        { q: "What type of attack involves intercepting communication?", a: "MITM", options: ["Phishing", "DDoS", "SQLi", "MITM"] },
        { q: "Which of these is a common vulnerability where an attacker injects malicious scripts?", a: "XSS", options: ["SQLi", "XSS", "CSRF", "DDoS"] },
        { q: "What is a 'Zero-Day' vulnerability?", a: "A vulnerability unknown to the software vendor", options: ["A bug that fixes itself", "A vulnerability unknown to the software vendor", "A patch released today", "A virus that deletes data"] },
        { q: "Which tool is commonly used for network protocol analysis (packet sniffing)?", a: "Wireshark", options: ["Metasploit", "Wireshark", "Nmap", "Burp Suite"] },
        { q: "What does 'salting' a password hash protect against?", a: "Rainbow table attacks", options: ["Brute force", "Rainbow table attacks", "SQL injection", "Phishing"] }
    ],
    'AI Architect': [
        { q: "What does RAG stand for in the context of LLMs?", a: "Retrieval-Augmented Generation", options: ["Retrieval-Augmented Generation", "Random Access Generation", "Refined Analytical Graph", "Rapid AI Growth"] },
        { q: "Which technique is used to make a pre-trained model perform better on a specific task?", a: "Fine-tuning", options: ["Hyper-threading", "Fine-tuning", "Over-fitting", "Pre-processing"] },
        { q: "Which neural network architecture is the foundation for models like GPT?", a: "Transformer", options: ["CNN", "RNN", "Transformer", "GAN"] },
        { q: "In the context of LLMs, what is 'Hallucination'?", a: "Generating factually incorrect but confident text", options: ["Slow response time", "Generating factually incorrect but confident text", "Memory loss during training", "Overfitting"] },
        { q: "What is the main advantage of Vector Databases for AI?", a: "Efficient similarity search", options: ["Faster SQL queries", "Efficient similarity search", "Better encryption", "Unlimited storage"] },
        { q: "What does 'Few-shot prompting' involve?", a: "Providing a few examples in the prompt", options: ["Training the model once", "Providing a few examples in the prompt", "Reducing the prompt length", "Using multiple GPUs"] },
        { q: "Which library is most commonly used for building LLM applications via chaining?", a: "LangChain", options: ["Pandas", "PyTorch", "LangChain", "Flask"] }
    ],
    'Backend Titan': [
        { q: "What does REST stand for?", a: "Representational State Transfer", options: ["Representative State Transfer", "Representational State Transfer", "Remote Execution Tool", "Relational System Transfer"] },
        { q: "Which HTTP method is typically used to update an entire resource?", a: "PUT", options: ["POST", "PUT", "PATCH", "GET"] },
        { q: "What is an advantage of using a microservices architecture?", a: "Independent scalability", options: ["Easier debugging", "Reduced latency", "Independent scalability", "Simpler deployments"] },
        { q: "What is the libuv library used for in Node.js?", a: "Handling asynchronous I/O", options: ["Managing V8 engine", "Handling asynchronous I/O", "Parsing JSON", "Executing shell commands"] },
        { q: "What does 'idempotency' provide during a failed operation?", a: "Safe retry without duplicates", options: ["Safe retry without duplicates", "Automatic data rollback", "Faster execution", "Encrypted logs"] },
        { q: "What is the purpose of a Message Queue (like RabbitMQ or Kafka)?", a: "Decoupling services and handling async tasks", options: ["Storing secrets", "Decoupling services and handling async tasks", "Serving static files", "Encrypting database connections"] },
        { q: "Which database indexing technique is best for range queries?", a: "B-Tree", options: ["Hash Index", "B-Tree", "Bitmap", "GIST"] }
    ],
    'UI/UX Sorcerer': [
        { q: "What is the primary tool for creating collaborative UI designs?", a: "Figma", options: ["Photoshop", "Figma", "Excel", "VS Code"] },
        { q: "Which design principle refers to the arrangement of elements to imply importance?", a: "Hierarchy", options: ["Contrast", "Hierarchy", "Alignment", "Proximity"] },
        { q: "What does 'A/B testing' compare?", a: "Two versions of a webpage", options: ["Two versions of a webpage", "Backend vs Frontend", "Mobile vs Desktop", "Designer vs Developer"] },
        { q: "What is 'Whitespace' in UI design?", a: "Space between elements", options: ["Empty background", "Space between elements", "Unused memory", "Missing data"] },
        { q: "What is the 'Golden Ratio' commonly used for in design?", a: "Creating balanced compositions", options: ["Calculating budget", "Creating balanced compositions", "Choosing button colors", "Measuring load time"] },
        { q: "What does 'Accessibility' (a11y) ensure?", a: "Usability for people with disabilities", options: ["Fast performance", "Usability for people with disabilities", "Support for old browsers", "Security compliance"] }
    ],
    'Blockchain Bard': [
        { q: "What is the programming language primarily used for Ethereum smart contracts?", a: "Solidity", options: ["JavaScript", "Python", "Solidity", "Rust"] },
        { q: "What does it mean for a blockchain to be decentralized?", a: "No single point of control", options: ["Controlled by a bank", "No single point of control", "Runs on a single server", "Requires permission"] },
        { q: "What is a 'gas fee' in blockchain?", a: "The cost of processing a transaction", options: ["The cost of processing a transaction", "A subscription fee", "A penalty", "A storage limit"] },
        { q: "What is a 'Genesis Block'?", a: "The first block of a blockchain", options: ["A backup block", "The first block of a blockchain", "A malicious block", "A block with no transactions"] },
        { q: "What is 'Proof of Stake' (PoS)?", a: "A consensus mechanism based on ownership", options: ["A system for verifying identity", "A consensus mechanism based on ownership", "A way to speed up mining", "A storage protocol"] },
        { q: "What is a 'Smart Contract'?", a: "Self-executing code on a blockchain", options: ["A legal document", "Self-executing code on a blockchain", "An AI algorithm", "A private message"] }
    ],
    'DevOps Paladin': [
        { q: "Which tool is commonly used for container orchestration?", a: "Kubernetes", options: ["Docker", "Kubernetes", "Jenkins", "Terraform"] },
        { q: "What does CI/CD stand for?", a: "Continuous Integration / Continuous Deployment", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Cloud Infrastructure / Cloud Data", "Core Interface / Core Design"] },
        { q: "Which tool is primarily used for Infrastructure as Code (IaC)?", a: "Terraform", options: ["Ansible", "Jenkins", "Terraform", "Prometheus"] },
        { q: "What is the primary role of an SRE (Site Reliability Engineer)?", a: "Bridging the gap between dev and ops", options: ["Writing UI code", "Managing HR", "Bridging the gap between dev and ops", "Selling the product"] },
        { q: "What is 'GitOps'?", a: "Using Git for infrastructure automation", options: ["Using Git for chat", "Using Git for infrastructure automation", "Uploading large files to Git", "Managing user accounts"] },
        { q: "Which tool is popular for monitoring and alerting?", a: "Prometheus", options: ["Postman", "Terraform", "Prometheus", "GitLab"] }
    ],
    'Mobile Monk': [
        { q: "Which framework allows you to build mobile apps using React?", a: "React Native", options: ["Flutter", "React Native", "SwiftUI", "Xamarin"] },
        { q: "What is the primary language for modern Android development?", a: "Kotlin", options: ["Java", "Kotlin", "C#", "Dart"] },
        { q: "Which service is commonly used for mobile app analytics?", a: "Firebase", options: ["S3", "Firebase", "Heroku", "MongoDB"] },
        { q: "What is 'Deep Linking' in mobile apps?", a: "Directing users to a specific page via URL", options: ["Hiding app source code", "Directing users to a specific page via URL", "Linking multiple apps together", "Internet connection"] },
        { q: "How does React Native achieve native performance?", a: "Using a bridge to native components", options: ["Compiling entirely to C++", "Using a bridge to native components", "Running in a hidden browser", "Directly executing JavaScript on CPU"] },
        { q: "What is 'Hot Reloading'?", a: "Injecting code changes without losing app state", options: ["Restarting the app quickly", "Injecting code changes without losing app state", "Charging the phone while debugging", "Speeding up the network"] }
    ],
    'QA Shadow': [
        { q: "Which testing framework is most popular for unit testing in JavaScript?", a: "Jest", options: ["Selenium", "Jest", "Cypress", "Postman"] },
        { q: "What is the term for testing a system after changes ensure old features still work?", a: "Regression Testing", options: ["Unit Testing", "Regression Testing", "Stress Testing", "Smoke Testing"] },
        { q: "Which tool is primarily used for API testing and documentation?", a: "Postman", options: ["GitHub", "Postman", "Figma", "Docker"] },
        { q: "What is 'Code Coverage'?", a: "Percentage of code executed by tests", options: ["Total lines of code", "Percentage of code executed by tests", "Number of files tested", "Security level"] },
        { q: "What is 'TDD' (Test-Driven Development)?", a: "Writing tests before writing production code", options: ["Writing tests after deployment", "Writing tests before writing production code", "Manual testing only", "Automated UI testing"] },
        { q: "Which tool is commonly used for end-to-end (E2E) testing?", a: "Cypress", options: ["Jest", "Cypress", "NPM", "VS Code"] }
    ],
    'Data Warden': [
        { q: "What does GDPR stand for?", a: "General Data Protection Regulation", options: ["Global Data Privacy Rules", "General Data Protection Regulation", "Group Data Policy", "Graphical Data Processing"] },
        { q: "Which process is used to move data from a source to a data warehouse?", a: "ETL", options: ["ETL", "FTP", "DNS", "API"] },
        { q: "What type of key uniquely identifies a record in a database table?", a: "Primary Key", options: ["Primary Key", "Foreign Key", "Super Key", "Candidate Key"] },
        { q: "What is 'Data Governance'?", a: "Managing data availability, usability, and security", options: ["Writing SQL queries", "Managing data availability, usability, and security", "Installing databases", "Backing up disks"] },
        { q: "What is 'Data Lineage'?", a: "Tracking data as it moves through pipelines", options: ["Naming database tables", "Tracking data as it moves through pipelines", "Deleting old data", "Encrypting passwords"] },
        { q: "Which of these is a data privacy technique?", a: "Anonymization", options: ["Indexing", "Normalization", "Anonymization", "Clustering"] }
    ]

};

const DailySpikeGame = () => {
    const { stepId, xp, taskText } = useParams();
    const decodedTaskText = decodeURIComponent(taskText || 'Security Protocol');
    const navigate = useNavigate();
    const { user, checkUser } = useAuth();

    const [gameState, setGameState] = useState('start'); // start, showing, playing, skillCheck, won, lost
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [level, setLevel] = useState(1);
    const [activeTile, setActiveTile] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [roundQuestions, setRoundQuestions] = useState([]);

    const generateSequence = (len) => {
        const newSeq = [];
        for (let i = 0; i < len; i++) {
            newSeq.push(Math.floor(Math.random() * 9));
        }
        return newSeq;
    };

    const startGame = () => {
        // Select 3 random questions for this spike session
        const pool = SKILL_DATA[user?.characterClass] || SKILL_DATA['Frontend Warrior'];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setRoundQuestions(selected);

        const firstSeq = generateSequence(3);
        setSequence(firstSeq);
        setUserSequence([]);
        setLevel(1);
        playSequence(firstSeq);
    };

    const playSequence = async (seq) => {
        setGameState('showing');
        setActiveTile(null);

        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setActiveTile(seq[i]);
            await new Promise(r => setTimeout(r, 600));
            setActiveTile(null);
        }

        setGameState('playing');
    };

    const handleTileClick = (index) => {
        if (gameState !== 'playing') return;

        const newUserSeq = [...userSequence, index];
        setUserSequence(newUserSeq);

        setActiveTile(index);
        setTimeout(() => setActiveTile(null), 200);

        if (index !== sequence[newUserSeq.length - 1]) {
            setGameState('lost');
            return;
        }

        if (newUserSeq.length === sequence.length) {
            // Time for a Skill Check
            setCurrentQuestion(roundQuestions[level - 1]);
            setSelectedOption(null);
            setGameState('skillCheck');
        }
    };


    const handleSkillAnswer = (option) => {
        setSelectedOption(option);
        setTimeout(() => {
            if (option === currentQuestion.a) {
                if (level === 3) {
                    handleVictory();
                } else {
                    const nextLevel = level + 1;
                    const nextSeq = generateSequence(3 + nextLevel);
                    setLevel(nextLevel);
                    setSequence(nextSeq);
                    setUserSequence([]);
                    playSequence(nextSeq);
                }
            } else {
                setGameState('lost');
            }
        }, 800);
    };

    const handleVictory = async () => {
        setGameState('won');
        try {
            await axios.post(`${API_URL}/user/complete-daily`, { stepId: parseInt(stepId), xp: parseInt(xp) });
            await checkUser();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full mb-8">
                <button 
                    onClick={() => navigate('/roadmap')}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portal
                </button>
            </div>
            <div className="max-w-md w-full">
                <AnimatePresence mode="wait">
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="game-card text-center p-12 space-y-8 bg-slate-900 border-indigo-500/30"
                        >
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
                                <Cpu className="text-indigo-400" size={40} />
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Neural Integration</h1>
                                    <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Calibration Required</p>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={14} className="text-amber-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Objective</span>
                                    </div>
                                    <p className="text-slate-300 font-bold text-sm italic">"{decodedTaskText}"</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                To complete this daily spike, you must synchronize your memory matrix AND validate your theoretical knowledge for the <span className="text-indigo-400 font-bold">{user?.characterClass}</span> class.
                            </p>
                            <button
                                onClick={startGame}
                                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-500/20"
                            >
                                Start Calibration <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {(gameState === 'showing' || gameState === 'playing') && (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center px-2">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Memory Sync</div>
                                    <div className="text-2xl font-black text-white uppercase italic">Phase {level} / 3</div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-2xl border border-slate-800">
                                    <Activity className="text-indigo-500 animate-pulse" size={16} />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        {gameState === 'showing' ? 'Scanning...' : 'Input Link'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 bg-slate-950 p-6 rounded-[40px] border-4 border-slate-900 shadow-2xl relative">
                                {[...Array(9)].map((_, i) => (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleTileClick(i)}
                                        className={`aspect-square rounded-2xl border-2 transition-all duration-300 relative ${activeTile === i
                                            ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.6)] z-20'
                                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                            <Shield size={24} />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Current Protocol</p>
                                <p className="text-xs font-bold text-indigo-300 italic">{decodedTaskText}</p>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'skillCheck' && (
                        <motion.div
                            key="skillCheck"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="game-card p-10 space-y-8 bg-slate-950 border-indigo-500/40 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Terminal size={120} className="text-indigo-500" />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                    <Terminal size={12} className="text-indigo-400" />
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Theoretical Buffer</span>
                                </div>
                                <h2 className="text-2xl font-black text-white italic leading-tight uppercase tracking-tight">
                                    {currentQuestion?.q}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-3 relative z-10">
                                {currentQuestion?.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => handleSkillAnswer(opt)}
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all relative overflow-hidden ${selectedOption === opt
                                            ? opt === currentQuestion.a ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-red-500 bg-red-500/10 text-red-400'
                                            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{opt}</span>
                                            {selectedOption === opt && (
                                                opt === currentQuestion.a ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                Neural stability required for data upload
                            </p>
                        </motion.div>
                    )}

                    {gameState === 'won' && (
                        <motion.div
                            key="won"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="game-card text-center p-12 space-y-8 bg-slate-900 border-emerald-500/30"
                        >
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="text-emerald-500" size={48} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Skill Verified</h2>
                                <p className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">Neural Data Synchronized</p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-left space-y-4">
                                <div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Fulfilled Objective</div>
                                    <div className="text-sm font-bold text-white italic">"{decodedTaskText}"</div>
                                </div>
                                <div className="h-px bg-slate-700 w-full"></div>
                                <div className="flex justify-between items-center">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bonus Applied</div>
                                    <div className="text-2xl font-black text-emerald-400">+{xp} XP</div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/roadmap')}
                                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20"
                            >
                                Collect Rewards <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {gameState === 'lost' && (
                        <motion.div
                            key="lost"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="game-card text-center p-12 space-y-8 bg-slate-900 border-red-500/30"
                        >
                            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                                <Lock className="text-red-500" size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">Neural Link Unstable</h2>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Validation failed. Practical experience or theoretical knowledge was insufficient to stabilize the connection.
                            </p>
                            <div className="space-y-4">
                                <button
                                    onClick={startGame}
                                    className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest"
                                >
                                    Re-Initiate Calibration
                                </button>
                                <button
                                    onClick={() => navigate('/roadmap')}
                                    className="w-full py-4 text-slate-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
                                >
                                    Return to Roadmap
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DailySpikeGame;
