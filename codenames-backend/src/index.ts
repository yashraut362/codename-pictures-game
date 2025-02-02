import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { Card, GameState, Team } from "./types";
import {createClient} from 'redis';

// Create a Redis client
const client = createClient({
    url: 'redis://localhost:6379' 
});

// Handle Redis connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.log('Redis error:', err);
});

client.connect();
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3001;

const codenamePicturesWords = [
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2808&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1723733104322-827186b5eb9e?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661873863027-51b409f112f5?q=80&w=2856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1429041966141-44d228a42775?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554219374-6d2c029f855e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=2449&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579470785623-3d2c229f4fc6?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1541480601022-2308c0f02487?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1693169973609-342539dea9dc?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?q=80&w=2996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1522679056866-8dbbc8774a9d?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600456548090-7d1b3f0bbea5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1617191979724-f755c6d83e01?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675865393754-67eac4271eb8?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1586941962519-b1a78cf17677?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1514923995763-768e52f5af87?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1632809199725-72a4245e846b?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

let takenRoles: Record<string, boolean> = {
    "Red Spymaster": false,
    "Red Player": false,
    "Blue Spymaster": false,
    "Blue Player": false,
};


let availableRoles = ["Red Spymaster", "Red Player", "Blue Spymaster", "Blue Player"];

const generateBoard = (): GameState => {
    const cardType: Team[] = [
        ...Array(8).fill("Red"),
        ...Array(7).fill("Blue"),
        ...Array(4).fill("Bystander"),
        "Assassin",
    ];

    cardType.sort(() => Math.random() - 0.5);

    const board: Card[] = cardType.map((cardType, index) => ({
        id: index,
        image: codenamePicturesWords[index],
        revealed: false,
        cardType,
    }));

    return {
        board,
        turn: "Red",
        winner: null,
        currentClue: null,
        players: {},
        remainingBlue: 7,
        remainingRed: 8,
    };
};

let gameState: GameState = generateBoard();


const saveGameStateToRedis = async (gameState: GameState): Promise<void> => {
    const gameStateKey = `codenames:gameState:${Date.now()}`;  // Key for storing game state
    try {
        const reply = await client.set(gameStateKey, JSON.stringify(gameState));  // Use await for promise
        console.log('Game state saved to Redis:', reply);
    } catch (err) {
        console.error('Error saving game state to Redis', err);
    }
};

io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.emit("availableRoles", availableRoles);
    socket.emit("gameState", gameState);

    socket.on("selectRole", (role: string) => {
        let team: Team;
        if (role === "Red Spymaster") {
            team = "Red";
        } else if (role === "Red Player") {
            team = "Red";
        } else if (role === "Blue Spymaster") {
            team = "Blue";
        } else if (role === "Blue Player") {
            team = "Blue";
        } else {
            console.log("Role not available", role);
            socket.emit("roleError", "Role not available");
            return;
        }
        gameState.players[socket.id] = { role, team };

        takenRoles[role] = true;

        availableRoles = availableRoles.filter(r => !takenRoles[r]);
        console.log("availableRoles", availableRoles, gameState.players);


        io.emit("availableRoles", availableRoles);
        socket.emit("gameState", gameState);
        io.emit("playerJoined", { id: socket.id, role, team });
    });

    socket.on("giveClue", ({ clue, count }) => {
        gameState.currentClue = { clue, count };
        io.emit("gameState", gameState);
    });

    socket.on('switchTurn', () => {
        gameState.turn = gameState.turn === "Red" ? "Blue" : "Red";
        gameState.currentClue = null;
        io.emit("gameState", gameState);
    });


    socket.on("restartGame", () => {
        gameState = generateBoard();
        console.log("Game restarted");
        io.emit("gameState", gameState);
    });

    socket.on("makeGuess", ({ id }) => {
        console.log("makeGuess", id);
        if (gameState.winner || gameState.board[id].revealed) return;
        const selectedCard = gameState.board[id];
        console.log(selectedCard.cardType)
        const remainingBlue = gameState.board.filter(card => card.cardType === "Blue" && !card.revealed).length;
        const remainingRed = gameState.board.filter(card => card.cardType === "Red" && !card.revealed).length;
        gameState.remainingBlue = remainingBlue;
        gameState.remainingRed = remainingRed;
        if(remainingBlue === 0) {
            gameState.winner = "Blue";
            saveGameStateToRedis(gameState);
        }else if(remainingRed === 0) {
            gameState.winner = 'Red';
            saveGameStateToRedis(gameState);
        }else if (selectedCard.cardType === "Assassin") {
            gameState.currentClue = null;
            gameState.winner = gameState.turn === "Red" ? "Blue" : "Red";
            saveGameStateToRedis(gameState);
        } else if (selectedCard.cardType !== gameState.turn) {
            gameState.board[id].revealed = true;
            gameState.currentClue = null;
            gameState.turn = gameState.turn === "Red" ? "Blue" : "Red"; // Wrong guess, switch turn
        } else {
            gameState.board[id].revealed = true;
        }

        io.emit("gameState", gameState);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (gameState.players[socket.id]) {
            const playerRole = gameState.players[socket.id].role;
            const playerTeam = gameState.players[socket.id].team;

            delete gameState.players[socket.id];

            takenRoles[playerRole] = false;
            availableRoles.push(playerRole);

            //if player disconnects, then switch turn
            // if (gameState.turn === playerTeam) {
            //     gameState.turn = gameState.turn === "Red" ? "Blue" : "Red";
            // }

            io.emit("gameState", gameState);
            io.emit("availableRoles", availableRoles);
        }
    });
});


app.get('/api/gameHistory', async (req, res) => {
    try {
      // Fetch all keys with pattern for game states
      const keys = await client.keys('codenames:gameState:*');
      console.log('Found keys:', keys);
  
      // Fetch all game states from Redis
      const gameStates = await Promise.all(
        keys.map(async (key) => {
          const gameState = await client.get(key);
          return JSON.parse(gameState!);  // Parse game state string into object
        })
      );
  
      res.json({ gameStates });  // Send game states as JSON response
    } catch (err) {
      console.error('Error fetching game states:', err);
      res.status(500).json({ error: 'Error fetching game states' });
    }
  });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
