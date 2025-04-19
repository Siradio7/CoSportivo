import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/header"
import Button from "../components/button"

const Trips = () => {
    const { id } = useParams()
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch(`${API_URL}/trips/match/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!response.ok)
                    throw new Error("Erreur lors du chargement")

                const data = await response.json()
                setTrips(data || [])
            } catch (err) {
                setError("Impossible de récupérer les trajets 😢")
            } finally {
                setLoading(false)
            }
        }

        fetchTrips()
    }, [id, API_URL])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">
                    Covoiturages disponibles 🚗
                </h2>

                {loading && <p className="text-center text-gray-600">Chargement des trajets...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && trips.length === 0 && (
                    <div className="text-center mt-10">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                            alt="Pas de trajet"
                            className="mx-auto w-24 h-24 opacity-80 mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Aucun trajet disponible pour ce match
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Et si tu étais le premier à en proposer un ? 🚗
                        </p>
                        <Button
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl"
                            onClick={() => window.location.href = `/create-trip/${id}`}
                        >
                            Proposer un trajet
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition duration-300"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-cyan-700 mb-2 flex items-center gap-2">
                                    👤 {trip.first_name + " " + trip.last_name}
                                </h3>

                                <p className="text-gray-700 mb-1 flex items-center gap-2">
                                    🕒 Départ :{" "}
                                    <strong>
                                        {trip.departure_location} à {trip.departure_time?.slice(0, 5)}
                                    </strong>
                                </p>

                                <p className="text-gray-700 mb-1 flex items-center gap-2">
                                    📍 Arrivée : <strong>{trip.arrival_location}</strong>
                                </p>

                                <p className="text-gray-700 mb-1 flex items-center gap-2">
                                    🚘 Voiture : {trip.car_model || "Modèle inconnu"} • {trip.car_color || "Couleur inconnue"}
                                </p>

                                <p className="text-gray-700 mb-1 flex items-center gap-2">
                                    💺 Places disponibles : <strong>{trip.available_seats}</strong>
                                </p>

                                <p className="text-gray-700 mb-1 flex items-center gap-2">
                                    💰 Prix : <strong>{trip.price} €</strong>
                                </p>
                            </div>

                            <Button
                                className="mt-2 mx-auto w-full bg-cyan-600 text-white hover:bg-cyan-700 transition rounded-xl py-2"
                                onClick={() => alert("Fonctionnalité à venir 😉")}
                            >
                                Rejoindre le trajet
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Trips
