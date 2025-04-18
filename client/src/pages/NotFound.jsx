import { useNavigate } from "react-router-dom"
import Header from "../components/header"
import Button from "../components/button"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />

            <div className="flex flex-col items-center justify-center p-6 text-center h-[calc(100vh-80px)]">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                    alt="404"
                    className="w-40 h-40 mb-6 opacity-80"
                />

                <h1 className="text-5xl font-extrabold text-red-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups ! Cette page n'existe pas.</h2>
                <p className="text-gray-600 mb-6">
                    Peut-être que tu as mal tapé l'URL ou que cette page a été déplacée.
                </p>

                <Button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl"
                    onClick={() => navigate("/")}
                >
                    Retour à l'accueil
                </Button>
            </div>
        </div>
    )
}

export default NotFound
