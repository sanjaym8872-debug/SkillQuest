const { Server } = require('socket.io');

const CARDS = [
    { id: 1, name: 'Neural Strike', power: 25, defense: 5, type: 'Attack', color: '#ff4757' },
    { id: 2, name: 'Data Aegis', power: 5, defense: 20, type: 'Defense', color: '#1e90ff' },
    { id: 3, name: 'Logic Pierce', power: 15, defense: 10, type: 'Balanced', color: '#ffa502' },
    { id: 4, name: 'System Crash', power: 40, defense: 0, type: 'Heavy', color: '#2ed573' },
    { id: 5, name: 'Firewall Warp', power: 0, defense: 30, type: 'Shield', color: '#a29bfe' }
];

let waitingPlayer = null;
const rooms = new Map();

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('find_match', (username) => {
            if (waitingPlayer && waitingPlayer.id !== socket.id) {
                const roomName = `room_${Math.random().toString(36).substr(2, 9)}`;
                const p1 = waitingPlayer;
                const p2 = { id: socket.id, username };

                const gameState = {
                    players: {
                        [p1.id]: { username: p1.username, health: 100, hand: drawInitialHand(), ready: false },
                        [p2.id]: { username: p2.username, health: 100, hand: drawInitialHand(), ready: false }
                    },
                    currentTurn: p1.id,
                    status: 'active',
                    history: []
                };

                rooms.set(roomName, gameState);
                p1.socket.join(roomName);
                socket.join(roomName);

                io.to(roomName).emit('match_found', { roomName, gameState, p1, p2 });
                waitingPlayer = null;
            } else {
                waitingPlayer = { id: socket.id, username, socket };
                socket.emit('waiting_for_match');
            }
        });

        socket.on('play_card', ({ roomName, cardId }) => {
            const game = rooms.get(roomName);
            if (!game || game.currentTurn !== socket.id) return;

            const opponentId = Object.keys(game.players).find(id => id !== socket.id);
            const card = CARDS.find(c => c.id === cardId);
            
            // Calculate Damage / Defense
            // Basic logic: subtract card power from opponent health
            game.players[opponentId].health -= card.power;
            if (game.players[opponentId].health < 0) game.players[opponentId].health = 0;

            // Remove card from hand and draw new one
            game.players[socket.id].hand = game.players[socket.id].hand.filter(c => c.id !== cardId);
            game.players[socket.id].hand.push(CARDS[Math.floor(Math.random() * CARDS.length)]);

            // Switch turn
            game.currentTurn = opponentId;
            game.history.push(`${game.players[socket.id].username} used ${card.name}`);

            if (game.players[opponentId].health <= 0) {
                game.status = 'finished';
                game.winner = socket.id;
            }

            io.to(roomName).emit('game_update', game);
        });

        socket.on('disconnect', () => {
            if (waitingPlayer && waitingPlayer.id === socket.id) {
                waitingPlayer = null;
            }
        });
    });
}

function drawInitialHand() {
    return Array.from({ length: 4 }, () => CARDS[Math.floor(Math.random() * CARDS.length)]);
}

module.exports = { setupSocket };
