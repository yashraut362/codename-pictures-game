'use client';

import { useState, useEffect } from 'react';

export default function GameHistoryModal({ onClose }: { onClose: () => void }) {
    const [gameHistory, setgameHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3001/api/gameHistory')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                setgameHistory(data?.gameStates);
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));

    }, []);

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Game History</h2>
                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                <div className='h-52 overflow-y-scroll'>
                    {gameHistory && (
                        <div className="space-y-4">
                            {gameHistory.map((game, index) => (
                                <div key={index} className='flex flex-col border border-black p-2 rounded-xl'>
                                    <div className='flex flex-row items-center justify-around'>
                                        <p className='text-blue-600 font-semibold text-xl'>Winner :{game.winner}</p>
                                        <div className='flex flex-col'>
                                            <div className='text-blue-600 font-semibold text-base'>Blue score: {7 - game.remainingBlue}</div>
                                            <div className='text-red-600 font-semibold text-base'>Red score: {8 - game.remainingRed}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
