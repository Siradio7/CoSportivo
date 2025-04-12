import Header from "../components/header"
import { Link } from "react-router-dom"
import Button from "../components/button"

const Home = () => {
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Header />

            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-4xl px-4">
                    En partageant votre trajet, vous partagez l'expérience du match !
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link to="/trips">
                        <Button className="w-48" variant="primary">
                            Voir les covoiturages
                        </Button>
                    </Link>

                    <Link to="/trips/create">
                        <Button className="w-48" variant="secondary">
                            Proposer un covoiturage
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
