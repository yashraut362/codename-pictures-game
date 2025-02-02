'use client'
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import AddClueModal from "@/components/addClueModal";
import Image from "next/image";
const Home: React.FC = () => {
  const { socket, gameState } = useSocket();
  const router = useRouter()
  const [currentPlayer, setCurrentPlayer] = useState<any | null>(null);
  const [clueModalOpen, setClueModalOpen] = useState(false);

  useEffect(() => {
    if (!gameState) return;
    if (gameState?.winner) {
      toast(`Game Over! ${gameState.winner} team won the game`);
      // setTimeout(() => {
      //   router.push('/winner?winner=' + gameState.winner);
      // }, 3000);
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
      <div className="flex flex-row items-center justify-between ">
        <div className={`${gameState?.turn === 'Blue' ? 'bg-blue-50' : 'bg-red-50'} h-screen w-9/12`}>
          <div className="grid grid-cols-4 gap-5 p-12 items-center justify-center h-full z-50">
            {gameState?.board.map((card: any) => {
              return (
                <div key={card.id} onClick={() => selectCard(card.id, card.revealed)}
                  className={`${card.revealed ?
                    card.cardType === 'Blue' ? 'shadow-[5px_5px_0px_0px_rgba(37,99,235,1)]' :
                      card.cardType === 'Red' ? 'shadow-[5px_5px_0px_0px_rgba(220,38,38,1)]' :
                        card.cardType === 'Bystander' ? 'shadow-[5px_5px_0px_0px_rgba(34,197,94,1)]' :
                          card.cardType === 'Assassin' ? 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]' : ''
                    : ''} 
                  h-full w-full cursor-pointer flex rounded-xl bg-slate-400 items-center justify-center`}>
                  <div className="relative w-full  h-full">
                    <Image
                      src={card.image}
                      alt={card.image}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className={` h-screen w-3/12 ${gameState?.turn === 'Blue' ? 'bg-blue-50' : 'bg-red-50'}`}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="space-y-10">
              {gameState?.currentClue?.clue &&
                <div className="flex items-center space-x-4 border-2 border-black p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Current Clue</p>
                    <p className="text-xl font-bold">{gameState?.currentClue?.clue} {gameState?.currentClue?.count}</p>
                  </div>
                </div>
              }
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Your Role</p>
                  <p className="text-xl font-bold">{currentPlayer?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Current turn</p>
                  <p className={`text-xl font-bold ${gameState?.turn === 'Blue' ? 'text-blue-600' : 'text-red-600'}`}>{gameState?.turn}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>


                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Blue remaining</p>
                  <p className="text-xl text-blue-600 font-bold">{gameState?.remainingBlue}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>


                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Red remaining</p>
                  <p className="text-xl text-red-600 font-bold">{gameState?.remainingRed}</p>
                </div>
              </div>
              {currentPlayer?.role.includes('Spymaster') && currentPlayer?.role.includes(gameState?.turn) && gameState?.currentClue === null &&
                <button onClick={handleOpenModal} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 mt-10 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-lg font-medium text-white backdrop-blur-3xl">
                    Add new clue
                  </span>
                </button>
              }
            </div>
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
