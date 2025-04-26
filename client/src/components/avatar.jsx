import { useState, useRef, useEffect } from "react"
import user_icon from "../assets/user.svg"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, User, Car, Settings } from "lucide-react"

const Avatar = ({ name, email }) => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Déconnexion réussie")
        setTimeout(() => {
            navigate("/login")
        }, 1000)
    }

    return (
        <div
            className="relative inline-block"
            ref={dropdownRef}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded-full transition-all duration-200"
            >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-600 flex items-center justify-center shadow-sm overflow-hidden border-2 border-white">
                    <img
                        className="w-full h-full object-cover"
                        src={user_icon}
                        alt={name}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 z-20 bg-white rounded-xl shadow-xl w-56 sm:w-64 border border-gray-100 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-gray-50">
                        <div className="font-semibold text-base text-gray-800">{name}</div>
                        <div className="text-xs text-gray-500 truncate">{email}</div>
                    </div>

                    <ul className="py-2">
                        <li>
                            <Link
                                to="/my-trips"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 group"
                            >
                                <Car size={16} className="text-gray-500 group-hover:text-cyan-600 transition-colors" />
                                <span>Mes covoiturages</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 group"
                            >
                                <Settings size={16} className="text-gray-500 group-hover:text-cyan-600 transition-colors" />
                                <span>Paramètres</span>
                            </Link>
                        </li>
                    </ul>

                    <div
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer transition-colors duration-150 border-t border-gray-100 group"
                    >
                        <LogOut size={16} className="group-hover:text-red-600 transition-colors" />
                        <span>Se déconnecter</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Avatar
