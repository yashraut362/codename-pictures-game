import { useState } from 'react';
import { useSocket } from "@/context/SocketContext";
import Image from "next/image";

const AddClueModal = ({ onClose, onSubmit }: {
    onClose: () => void,
    onSubmit: (clue: string, number: number) => void
}) => {
    const { gameState } = useSocket();
    const [textValue, setTextValue] = useState('');
    const [numberValue, setNumberValue] = useState('');

    const handleCloseModal = () => {
        setTextValue('');
        setNumberValue('');
        onClose();
    };

    const handleSubmit = () => {
        onSubmit(textValue, parseInt(numberValue));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className='flex flex-row bg-white rounded-xl items-center justify-between'>
                <div className="grid grid-cols-4 gap-5 p-5 items-center justify-center h-full z-50">
                    {gameState?.board.map((card: any) => {
                        return (
                            <div key={card.id}
                                className={`h-[100px] w-full cursor-pointer flex rounded-xl bg-slate-400 items-center justify-center ${card.cardType === 'Blue' ? 'shadow-[5px_5px_0px_0px_rgba(37,99,235,1)]' :
                                    card.cardType === 'Red' ? 'shadow-[5px_5px_0px_0px_rgba(220,38,38,1)]' :
                                        card.cardType === 'Bystander' ? 'shadow-[5px_5px_0px_0px_rgba(34,197,94,1)]' :
                                            card.cardType === 'Assassin' ? 'shadow-[5px_5px_0px_0px_rgba(234,179,8,1)]' : ''
                                    }`}
                            >
                                <div className="relative w-[100px] h-[100px]">
                                    {!card.revealed ?
                                        <Image
                                            src={card.image}
                                            alt={card.image}
                                            layout="fill"  // Make the image fill the entire container
                                            objectFit="cover" // Ensure the image covers the entire area without distortion
                                            className="rounded-xl"
                                        /> :
                                        <div className={`w-full h-full rounded-xl ${card.cardType === 'Blue' ? 'bg-blue-500' :
                                            card.cardType === 'Red' ? 'bg-red-500' :
                                                card.cardType === 'Bystander' ? 'bg-green-500' :
                                                    card.cardType === 'Assassin' ? 'bg-yellow-500' : ''}`}></div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>


                <div className="flex flex-col pr-5">
                    <div className='pb-10'>
                        <div className='flex flex-row items-center space-x-3'>
                            <div className='h-5 w-5 bg-yellow-500'></div>
                            <p>Assassin</p>
                        </div>
                        <div className='flex flex-row items-center space-x-3'>
                            <div className='h-5 w-5 bg-green-500'></div>
                            <p>Bystander</p>
                        </div>
                        <div className='flex flex-row items-center space-x-3'>
                            <div className='h-5 w-5 bg-red-600'></div>
                            <p>Red team</p>
                        </div>
                        <div className='flex flex-row items-center space-x-3'>
                            <div className='h-5 w-5 bg-blue-600'></div>
                            <p>Blue team</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Enter Clue</h2>

                    <div className="mb-4">
                        <label htmlFor="text" className="block text-gray-700 font-bold mb-2">
                            Text:
                        </label>
                        <input
                            type="text"
                            id="text"
                            className="border border-gray-300 rounded w-full py-2 px-3"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="number" className="block text-gray-700 font-bold mb-2">
                            Number:
                        </label>
                        <input
                            type="number" // Use type="number" for number input
                            id="number"
                            className="border border-gray-300 rounded w-full py-2 px-3"
                            value={numberValue}
                            onChange={(e) => setNumberValue(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleCloseModal}
                            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClueModal;