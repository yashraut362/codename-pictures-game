'use client';
import { useSearchParams } from 'next/navigation';
import React from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'
import Confetti from 'react-confetti'
import { WavyBackground } from "@/components/ui/wavy-background";

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
        <>
            {/* <Confetti
                width={1400}
                height={1000}
            /> */}
            <WavyBackground className="max-w-4xl mx-auto ">
                <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
                    {name} team won the game
                </p>
                <div class="text-center">
                    <button onClick={resetGame} className="p-[3px] relative mt-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Start New Game
                        </div>
                    </button>
                </div>
            </WavyBackground>
        </>
    );
};

export default WinnerPage;