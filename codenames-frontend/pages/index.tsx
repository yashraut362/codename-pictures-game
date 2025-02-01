// pages/index.tsx
import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const Home: React.FC = () => {
  const { gameState } = useSocket();
  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  return (
    <div className="flex flex-row  items-center justify-between ">
      <div className="bg-black h-screen w-9/12">hello</div>
      <div className="bg-red-500 h-screen w-3/12">hello2</div>
    </div>
  );
};

export default Home;
