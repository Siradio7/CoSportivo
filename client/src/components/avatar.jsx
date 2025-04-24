import { useState } from "react"
import user_icon from "../assets/user.jpg"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

const Avatar = ({ name, email }) => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

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
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
        >
            <img
                className="w-10 h-10 rounded-full shadow-md cursor-pointer transition-transform duration-200 hover:scale-105"
                src={user_icon}
                alt="User dropdown"
            />

            {isOpen && (
                <div className="absolute right-0 mt-1 z-20 bg-white rounded-xl shadow-lg w-56 border border-gray-100">
                    <div className="px-4 py-3 text-sm text-gray-800">
                        <div className="font-semibold text-base">{name}</div>
                        <div className="text-xs text-gray-500 truncate">{email}</div>
                    </div>

                    <ul className="py-2 text-sm text-gray-700">
                        <li>
                            <Link
                                to="/my-trips"
                                className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                            >
                                Mes covoiturages
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                            >
                                Paramètres
                            </Link>
                        </li>
                    </ul>

                    <div
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-150"
                    >
                        Se déconnecter
                    </div>
                </div>
            )}
        </div>
    )
}

export default Avatar
