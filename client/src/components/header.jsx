import { useState, useEffect } from "react"
import Button from "./button"
import { LogIn, Menu, UserPlus, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import Avatar from "./avatar"

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const isAuthenticated = localStorage.getItem("token") !== null
    const location = useLocation()
    const pathname = location.pathname
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const name = user ? `${user.first_name} ${user.last_name}` : "Invité"
    const email = user ? user.email : "Invité"

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY
            if (offset > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        // Ferme le menu mobile lors du changement de page
        setMenuOpen(false)
    }, [pathname])

    return (
        <header className={`w-full backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 
            ${scrolled 
                ? 'bg-white/95 shadow-md border-b border-gray-100' 
                : 'bg-white/90 shadow-sm border-b border-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-1 sm:gap-2 group">
                    <span className="text-lg sm:text-xl font-bold text-cyan-600 group-hover:text-cyan-700 transition-all duration-300 relative">
                        ⚽ CoSportivo
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-3">
                    {!isAuthenticated && pathname !== "/login" && pathname !== "/register" ? (
                        <>
                            <Link to="/login">
                                <Button
                                    icon={<LogIn size={16} />}
                                    variant="outline"
                                    size="md"
                                >
                                    Se connecter
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button
                                    icon={<UserPlus size={16} />}
                                    variant="primary"
                                    size="md"
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
                            className="text-cyan-600 hover:text-cyan-700 focus:outline-none p-1.5 rounded-full hover:bg-cyan-50 transition-all active:bg-cyan-100"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    ) : null}
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden py-4 px-4 border-t border-gray-100 shadow-inner bg-gray-50/70 flex flex-col items-center gap-3 animate-fadeIn">
                    {!isAuthenticated && pathname !== "/login" && pathname !== "/register" ? (
                        <>
                            <Link to="/login" className="w-full">
                                <Button
                                    icon={<LogIn size={16} />}
                                    variant="outline"
                                    fullWidth
                                >
                                    Se connecter
                                </Button>
                            </Link>
                            <Link to="/register" className="w-full">
                                <Button
                                    icon={<UserPlus size={16} />}
                                    variant="primary"
                                    fullWidth
                                >
                                    S'inscrire
                                </Button>
                            </Link>
                        </>
                    ) : null}
                </div>
            )}
        </header>
    )
}

export default Header
