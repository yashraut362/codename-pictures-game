import { useState, useEffect } from 'react';
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'

export default function Home() {
    const { socket, availableRoles } = useSocket();
    const [selectedRole, setSelectedRole] = useState(null);
    const [submittedRole, setSubmittedRole] = useState(null);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const router = useRouter()
    useEffect(() => {
        console.log("Available Roles from Socket:", availableRoles);

        if (availableRoles) {
            const filtered = availableRoles.filter(role =>
                role === "Red Spymaster" ||
                role === "Red Player" ||
                role === "Blue Spymaster" ||
                role === "Blue Player"
            );
            setFilteredRoles(filtered);
        } else {
            setFilteredRoles([])
        }
    }, [availableRoles]);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleSubmit = () => {
        if (!socket) return;
        if (selectedRole) {
            setSubmittedRole(selectedRole);
            socket.emit('selectRole', selectedRole);
            setTimeout(() => { { router.push('/'); } }, 3000);
        } else {
            alert("Please select a role.");
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen font-sans">
            <h1 className="text-3xl font-bold mb-4">Role Selection</h1>

            {availableRoles ? (
                <div className="role-selection space-y-2">
                    {filteredRoles.map((role) => (
                        <label key={role} className="flex items-center">
                            <input
                                type="radio"
                                value={role}
                                checked={selectedRole === role}
                                onChange={handleRoleChange}
                                className="mr-2"
                            />
                            {role}
                        </label>
                    ))}
                </div>
            ) : (
                <div>Loading roles...</div>
            )}

            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={!selectedRole}
            >
                Submit
            </button>

            {submittedRole && (
                <div className="result mt-4 font-bold">
                    You selected: {submittedRole}
                </div>
            )}
        </div>
    );
}