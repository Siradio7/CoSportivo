import Button from "./button"
import { LogIn, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import Avatar from "./avatar"

const Header = () => {
    const isAuthenticated = localStorage.getItem("token") !== null
    const pathname = window.location.pathname
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const name = user ? user.first_name + " " + user.last_name : "Invité"
    const email = user ? user.email : "Invité"

    return (
        <header className="w-screen flex items-center justify-between p-4 bg-white shadow-md">
            <Link to="/">
                <h1 className="text-cyan-500 font-bold text-xl">⚽️CoSportivo</h1>
            </Link>

            <div className="flex items-center justify-between gap-2">
                {
                    !isAuthenticated && pathname !== "/login" && pathname !== "/register" ? (
                        <>
                            <Link to="/login">
                                <Button icon={<LogIn size={16} />} variant="primary">
                                    Se connecter
                                </Button>
                            </Link>

                            <Link to="/register">
                                <Button icon={<UserPlus size={16} />} variant="secondary">
                                    S'inscrire
                                </Button>
                            </Link>
                        </>
                    ) : pathname !== "/login" && pathname !== "/register" ? (
                        <Avatar name={name} email={email} />
                    ) : null
                }
            </div>
        </header>
    )
}

export default Header