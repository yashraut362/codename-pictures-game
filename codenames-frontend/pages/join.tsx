import { useState, useEffect } from 'react';
import { useSocket } from "../context/SocketContext";
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import { BackgroundLines } from "@/components/ui/background-lines";

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
            toast("Joining Game ...", {
                theme: "dark",
                autoClose: 3000,
            });
            router.push('/')
        } else {
            toast.error("Please select a role.", {
                theme: "dark",
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                    Role Selection
                </h2>
                <div className='z-50 flex flex-col items-center justify-center'>
                    {availableRoles ? (
                        <div className="role-selection space-y-2">
                            {filteredRoles.map((role) => (
                                <label key={role} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value={role}
                                        checked={selectedRole === role}
                                        onChange={handleRoleChange}
                                        className="mr-2"
                                    />
                                    <p className='text-white text-2xl'> {role}</p>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <div>Loading roles...</div>
                    )}
                    <button onClick={handleSubmit} className="p-[3px] relative mt-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Lets start the game !
                        </div>
                    </button>
                </div>
            </BackgroundLines>

        </>

    );
}