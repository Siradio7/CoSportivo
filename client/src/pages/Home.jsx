import Header from "../components/header"
import { Link } from "react-router-dom"
import Button from "../components/button"

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-5xl font-extrabold text-gray-800 mb-6 max-w-3xl leading-tight">
                    En partageant votre trajet,<br />
                    <span className="text-cyan-600">vous partagez l'expérience du match !</span>
                </h2>

                <p className="text-lg text-gray-600 mb-10 max-w-xl">
                    Rejoignez la communauté des supporters qui allient passion, écologie et économie grâce au covoiturage sportif.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/trips">
                        <Button className="w-64 transition-transform hover:scale-105 duration-200" variant="primary">
                            Voir les covoiturages
                        </Button>
                    </Link>
                </div>
            </main>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-5xl animate-bounce">
                ⚽️
            </div>
        </div>
    )
}

export default Home
