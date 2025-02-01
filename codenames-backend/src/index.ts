import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { Card, GameState, Team } from "./types";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3001;

const codenamePicturesWords = [
    "Rocket",
    "Octopus",
    "Castle",
    "Bridge",
    "Glasses",
    "Umbrella",
    "Cactus",
    "Snail",
    "Clock",
    "Guitar",
    "Airplane",
    "Lighthouse",
    "Telescope",
    "Volcano",
    "Banana",
    "Mermaid",
    "Dragon",
    "Scissors",
    "Hot Air Balloon",
    "Treasure Chest"
];


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
    };
};

const endGame = () => {
    console.log("Game ended");
}

let gameState: GameState = generateBoard();

io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.emit("gameState", gameState);

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
        if (selectedCard.cardType === "Assassin") {
            gameState.winner = gameState.turn === "Red" ? "Blue" : "Red";
        } else if (selectedCard.cardType !== gameState.turn) {
            gameState.board[id].revealed = true;
            gameState.turn = gameState.turn === "Red" ? "Blue" : "Red"; // Wrong guess, switch turn
        } else {
            gameState.board[id].revealed = true;
        }

        io.emit("gameState", gameState);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
