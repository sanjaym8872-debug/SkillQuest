import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Swords, Zap, Users, Loader2, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CardClash.css';

const SOCKET_SERVER = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CardClash = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [searching, setSearching] = useState(false);
    const [lastAction, setLastAction] = useState("");

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER);
        setSocket(newSocket);

        newSocket.on('match_found', (data) => {
            setRoom(data.roomName);
            setGameState(data.gameState);
            setSearching(false);
        });

        newSocket.on('game_update', (state) => {
            setGameState(state);
            setLastAction(state.history[state.history.length - 1] || "");
        });

        return () => newSocket.close();
    }, []);

    const findMatch = () => {
        setSearching(true);
        socket.emit('find_match', user?.username || 'GUEST-RANGER');
    };

    const playCard = (cardId) => {
        if (!room || gameState.currentTurn !== socket.id) return;
        socket.emit('play_card', { roomName: room, cardId });
    };

    if (!gameState) {
        return (
            <div className="battle-arena-intro">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="intro-card"
                >
                    <Swords className="intro-icon" size={64} />
                    <h1>CARD CLASH : ARENA</h1>
                    <p>Engage in high-stakes tactical combat. Master the algorithms, destroy the mainframe.</p>
                    
                    {!searching ? (
                        <button className="start-battle-btn" onClick={findMatch}>
                            <Zap size={20} /> ENTER THE ARENA
                        </button>
                    ) : (
                        <div className="searching-status">
                            <Loader2 className="animate-spin" />
                            <span>SCANNING FOR OPPONENTS...</span>
                        </div>
                    )}

                    <div className="arena-stats">
                        <div className="stat">
                            <Users size={16} />
                            <span>Active Node: Bangalore_Mainframe</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const myId = socket.id;
    const oppId = Object.keys(gameState.players).find(id => id !== myId);
    const me = gameState.players[myId];
    const opponent = gameState.players[oppId];
    const isMyTurn = gameState.currentTurn === myId;

    if (gameState.status === 'finished') {
        const win = gameState.winner === myId;
        return (
            <div className="game-over-overlay">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="result-card">
                    {win ? <Trophy size={80} color="#ffd32a" /> : <Shield size={80} color="#636e72" />}
                    <h2>{win ? 'VICTORY SECURED' : 'SYSTEM OVERRIDE'}</h2>
                    <p>{win ? 'You’ve rewritten the mainframe.' : 'Access denied. Better luck next time, Ranger.'}</p>
                    <button onClick={() => window.location.reload()}>REBOOT ARENA</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="battle-matrix">
            {/* Header / Opponent HUD */}
            <div className="opponent-hud">
                <div className="hud-header">
                    <div className="status-badge">RANKED MATCH v1.2</div>
                    <div className="turn-indicator">
                        {!isMyTurn && <span className="active-turn">OPPONENT TURN</span>}
                    </div>
                </div>
                
                <div className="player-module opponent">
                    <div className="p-info">
                        <h3>{opponent.username}</h3>
                        <div className="health-bar-container">
                            <motion.div 
                                animate={{ width: `${opponent.health}%` }} 
                                className="health-bar"
                            />
                            <span className="health-text">{opponent.health}%</span>
                        </div>
                    </div>
                    <div className="avatar-placeholder">
                        <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${opponent.username}`} alt="Opponent Avatar" />
                    </div>
                </div>
            </div>

            {/* Battle History Ticker */}
            <div className="battle-ticker">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={lastAction}
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="ticker-msg"
                    >
                        {lastAction ? `>> ${lastAction}` : ">> System Initialized. Awaiting turn..."}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Combat Center */}
            <div className="battle-stage">
                <div className="energy-pulse" />
                <Swords className="stage-icon" size={120} />
            </div>

            {/* Player Hand & Controls */}
            <div className="player-hud">
                <div className="hand-container">
                    {me.hand.map((card, idx) => (
                        <motion.div 
                            key={`${card.id}-${idx}`}
                            whileHover={{ y: -40, scale: 1.1, zIndex: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playCard(card.id)}
                            className={`battle-card ${!isMyTurn ? 'disabled' : ''}`}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{ '--card-color': card.color }}
                        >
                            <div className="card-inner">
                                <span className="card-type">{card.type}</span>
                                <h4>{card.name}</h4>
                                <div className="card-stats">
                                    <div className="stat power">
                                        <Swords size={14} /> <span>{card.power}</span>
                                    </div>
                                    <div className="stat defense">
                                        <Shield size={14} /> <span>{card.defense}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="player-module me">
                    <div className="avatar-placeholder">
                        <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${me.username}`} alt="My Avatar" />
                    </div>
                    <div className="p-info">
                        <div className="flex justify-between items-center">
                            <h3>{me.username} (YOU)</h3>
                            <div className="sync-rate">SYNC: 1.2x</div>
                        </div>
                        <div className="health-bar-container">
                            <motion.div 
                                animate={{ width: `${me.health}%` }} 
                                className="health-bar"
                            />
                            <span className="health-text">{me.health}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Turn Banner */}
            <AnimatePresence>
                {isMyTurn && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="turn-banner"
                    >
                        YOUR TURN
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CardClash;
