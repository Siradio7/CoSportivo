import { useState } from "react"
import Button from "./button"
import { LogIn, Menu, UserPlus, X } from "lucide-react"
import { Link } from "react-router-dom"
import Avatar from "./avatar"

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const isAuthenticated = localStorage.getItem("token") !== null
    const pathname = window.location.pathname
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const name = user ? `${user.first_name} ${user.last_name}` : "Invité"
    const email = user ? user.email : "Invité"

    return (
        <header className="w-full bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-cyan-600 hover:text-cyan-700 transition duration-300">
                        ⚽CoSportivo
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-3">
                    {!isAuthenticated && pathname !== "/login" && pathname !== "/register" ? (
                        <>
                            <Link to="/login">
                                <Button
                                    icon={<LogIn size={16} />}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl transition duration-300"
                                >
                                    Se connecter
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button
                                    icon={<UserPlus size={16} />}
                                    className="bg-gray-600 hover:bg-gray-500 text-cyan-700 px-4 py-2 rounded-xl transition duration-300"
                                >
                                    S'inscrire
                                </Button>
                            </Link>
                        </>
                    ) : pathname !== "/login" && pathname !== "/register" ? (
                        <Avatar name={name} email={email} />
                    ) : null}
                </div>

                <div className="md:hidden">
                    {isAuthenticated ? (
                        <Avatar name={name} email={email} />
                    ) : pathname !== "/login" && pathname !== "/register" ? (
                        <button
                            className="text-cyan-600 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    ) : null}
                </div>

            </div>

            {menuOpen && (
                <div className="md:hidden mt-4 flex flex-col items-start gap-3 px-2">
                    {!isAuthenticated && pathname !== "/login" && pathname !== "/register" ? (
                        <>
                            <Link to="/login" className="w-full">
                                <Button
                                    icon={<LogIn size={16} />}
                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl"
                                >
                                    Se connecter
                                </Button>
                            </Link>
                            <Link to="/register" className="w-full">
                                <Button
                                    icon={<UserPlus size={16} />}
                                    className="w-full bg-gray-600 hover:bg-gray-500 text-cyan-700 px-4 py-2 rounded-xl"
                                >
                                    S'inscrire
                                </Button>
                            </Link>
                        </>
                    ) : pathname !== "/login" && pathname !== "/register" ? (
                        <Avatar name={name} email={email} />
                    ) : null}
                </div>
            )}
        </header>
    )
}

export default Header
