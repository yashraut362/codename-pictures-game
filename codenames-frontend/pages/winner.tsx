import { useSearchParams } from 'next/navigation';
import React from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'


const WinnerPage = () => {
    const { socket } = useSocket();
    const router = useRouter()
    const searchParams = useSearchParams();
    const name = searchParams.get('winner');

    const resetGame = () => {
        if (!socket) return;
        socket.emit('restartGame');
        router.push('/');
    }
    return (
        <div>
            <h1>Winner: {name}</h1>
            <button onClick={() => resetGame()}>Restart game</button>
        </div>
    );
};

export default WinnerPage;