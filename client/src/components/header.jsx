import { Link } from "react-router-dom"
import Button from "./button"
import { LogIn } from "lucide-react"
import { UserPlus } from "lucide-react"

const Header = () => {
    return (
        <header className="w-screen flex items-center justify-between p-4 bg-white shadow-md">
            <Link to="/">
                <h1 className="text-cyan-500 font-bold text-xl">CoSportivo</h1>
            </Link>

            <div className="flex items-center justify-between gap-2">
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
            </div>
        </header>
    )
}

export default Header