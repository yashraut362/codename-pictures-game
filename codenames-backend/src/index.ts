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

let gameState: GameState = generateBoard();

io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);
    
    socket.emit("gameState", gameState);

    socket.on("restartGame", () => {
        gameState = generateBoard();
        io.emit("gameState", gameState);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
