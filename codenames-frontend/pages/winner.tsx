'use client';
import { useSearchParams } from 'next/navigation';
import React from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'
import Confetti from 'react-confetti'

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
        <Confetti
            width={1400}
            height={1000}
        />

    );
};

export default WinnerPage;