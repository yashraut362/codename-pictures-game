import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    gameState: any;
    availableRoles: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [gameState, setGameState] = useState<any>(null);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    useEffect(() => {
        const socketInstance = io("http://localhost:3001");
        setSocket(socketInstance);
        socketInstance.on("availableRoles", (state) => {
            setAvailableRoles(state);
        });

        socketInstance.on("gameState", (state) => {
            setGameState(state);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, gameState, availableRoles }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useSocket must be used within a SocketProvider");
    return context;
};
