import { Link, useNavigate } from "react-router-dom"
import Button from "./button"
import { LogIn, UserPlus, LogOut } from "lucide-react"
import toast from "react-hot-toast"

const Header = () => {
    const navigate = useNavigate()
    const isAuthenticated = localStorage.getItem("token") !== null

    const handleLogout = () => {
        localStorage.removeItem("token")
        toast.success("Déconnexion réussie")
        setTimeout(() => {
            navigate("/login")
        }, 1000)
    }

    return (
        <header className="w-screen flex items-center justify-between p-4 bg-white shadow-md">
            <Link to="/">
                <h1 className="text-cyan-500 font-bold text-xl">CoSportivo</h1>
            </Link>

            <div className="flex items-center justify-between gap-2">
                {!isAuthenticated ? (
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
                ) : (
                    <Button 
                        className="w-40"
                        icon={<LogOut size={16} />} 
                        variant="danger"
                        onClick={handleLogout}
                    >
                        Se déconnecter
                    </Button>
                )}
            </div>
        </header>
    )
}

export default Header