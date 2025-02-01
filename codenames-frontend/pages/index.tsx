'use client'
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'

const Home: React.FC = () => {
  const { socket, gameState } = useSocket();
  const router = useRouter()
  const [currentPlayer, setCurrentPlayer] = useState<any | null>(null);

  useEffect(() => {
    if (!gameState) return;
    if (gameState?.winner) {
      router.push('/winner?winner=' + gameState.winner);
    }
    const myId = socket?.id;
    console.log(gameState.players);
    if (gameState?.players) {
      if (gameState?.players[myId]) {
        setCurrentPlayer(gameState?.players[myId]);
      } else {
        setTimeout(() => { { router.push('/join'); } }, 3000);
      }
    }
    console.log(gameState)
  }, [gameState]);


  const selectCard = (id: number, revealed: boolean) => {
    if (!socket || !gameState) return;
    if (currentPlayer?.role.includes('Spymaster')) return;
    if (revealed) return;
    if (currentPlayer.team !== gameState.turn) return;
    console.log("makeGuess", id);
    socket.emit('makeGuess', { id });
  }

  return (
    <div className="flex flex-row  items-center justify-between ">
      <div className="bg-white h-screen w-9/12">
        <div className="grid grid-cols-4 gap-5 p-12 items-center justify-center h-full">
          {gameState?.board.map((card: any) => {
            return (
              <div key={card.id} onClick={() => selectCard(card.id, card.revealed)}
                className={`${card.revealed ? 'bg-slate-600' : 'bg-slate-300'} h-full w-full cursor-pointer flex rounded-xl bg-slate-400 items-center justify-center`}>
                <p>{card.image}</p> <br />
                <p>{String(card.revealed)}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className={`${gameState?.turn === 'Blue' ? 'bg-blue-300' : 'bg-red-300'} h-screen w-3/12`}>
        <div className="flex flex-col items-center justify-center h-full">
          <p>Your Role :- {currentPlayer?.role}</p>
          <p>Current turn :- {gameState?.turn} </p>
          <p>Blue points :- </p>
          <p>Red points :- </p>
          <p>Winner :- {gameState?.winner}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
