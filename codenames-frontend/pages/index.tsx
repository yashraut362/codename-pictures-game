'use client'
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import AddClueModal from "@/components/addClueModal";

const Home: React.FC = () => {
  const { socket, gameState } = useSocket();
  const router = useRouter()
  const [currentPlayer, setCurrentPlayer] = useState<any | null>(null);
  const [clueModalOpen, setClueModalOpen] = useState(false);

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
        router.push('/join')
      }
    }
    if (gameState?.currentClue) {
      toast(`Current Clue :- ${gameState.currentClue.clue} ${gameState.currentClue.count}`);
    }
    console.log(gameState)
  }, [gameState]);


  const selectCard = (id: number, revealed: boolean) => {
    if (!socket || !gameState) return;
    if (currentPlayer?.role.includes('Spymaster')) {
      toast.info("You are a spymaster, you can't make a guess");
      return
    }
    if (revealed) {
      toast.info("This card is already revealed");
      return
    }
    if (currentPlayer.team !== gameState.turn) {
      toast.info("wait for your turn");
      return
    }
    console.log("makeGuess", id);
    socket.emit('makeGuess', { id });
  }

  const handleOpenModal = () => {
    setClueModalOpen(true);
  };

  const handleCloseModal = () => {
    setClueModalOpen(false);
  }

  const addClue = (clue: string, count: number) => {
    if (!socket) return;
    console.log(clue, count);
    socket.emit('giveClue', { clue, count });
    handleCloseModal();
  }


  return (
    <>
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
            <p>Current Clue :- {gameState?.currentClue?.clue} {gameState?.currentClue?.count}</p>
            <p>Blue remaining :- {gameState?.remainingBlue}</p>
            <p>Red remaining :- {gameState?.remainingRed}</p>
            {currentPlayer?.role.includes('Spymaster') && currentPlayer?.role.includes(gameState?.turn) && gameState?.currentClue === null &&
              <button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Clue
              </button>
            }
          </div>
        </div>
      </div>
      {clueModalOpen &&
        <AddClueModal
          onClose={handleCloseModal}
          onSubmit={addClue}
        />}
    </>
  );
};

export default Home;
