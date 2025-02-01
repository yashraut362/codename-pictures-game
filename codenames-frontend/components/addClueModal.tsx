import { useState } from 'react';

const AddClueModal = ({ onClose, onSubmit }: {
    onClose: () => void,
    onSubmit: (clue: string, number: number) => void
}) => {
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
            <div className="bg-white p-8 rounded-lg shadow-md">
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
    );
};

export default AddClueModal;