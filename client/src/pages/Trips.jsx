import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../components/header"
import Button from "../components/button"
import { motion } from "framer-motion"
import { UserPlus, MessageSquare } from "lucide-react"

const Trips = () => {
    const { id } = useParams()
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [joinedTrips, setJoinedTrips] = useState([])
    
    const user = JSON.parse(localStorage.getItem("user"))

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
    
    useEffect(() => {
        const fetchJoinedTrips = async () => {
            try {
                const response = await fetch(`${API_URL}/trip-passengers/user/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    setJoinedTrips(data)
                } else if (response.status !== 404) {
                    console.error("Erreur lors de la récupération des trajets rejoints")
                }
            } catch (err) {
                console.error("Erreur:", err)
            }
        }
        
        fetchJoinedTrips()
    }, [API_URL, user.id])
    
    const hasJoinedTrip = (tripId) => {
        return joinedTrips.some(joinedTrip => 
            joinedTrip.trip_id === tripId || joinedTrip.id === tripId
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">
                    Covoiturages disponibles 🚗
                </h2>

                {loading && (
                    <div className="text-center text-gray-600 animate-pulse">Chargement des trajets...</div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                    >
                        {error}
                    </motion.div>
                )}

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
                        <Link to={`/create-trip/${id}`}>
                            <Button
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl"
                            >
                                Proposer un trajet
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {trips.map((trip) => {
                        const joined = hasJoinedTrip(trip.id)
                        
                        return (
                            <motion.div
                                key={trip.id}
                                layout
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300"
                            >
                                {joined && (
                                    <div className="absolute -top-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full -right-2 shadow-md">
                                        Trajet rejoint
                                    </div>
                                )}
                                
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

                                {joined ? (
                                    <Link to={`/chat/${trip.id}`} state={{ from: `/trips/${id}` }} className="w-full">
                                        <Button
                                            className="mt-2 mx-auto w-full bg-emerald-600 text-white hover:bg-emerald-700 transition rounded-xl py-2"
                                            icon={<MessageSquare size={18} />}
                                        >
                                            Accéder au chat
                                        </Button>
                                    </Link>
                                ) : trip.driver_id === user.id ? (
                                    <div className="text-center mt-2 p-2 bg-gray-100 rounded-xl text-gray-600">
                                        Vous êtes le conducteur de ce trajet
                                    </div>
                                ) : (
                                    <Link to={`/join-trip/${trip.id}`} className="w-full">
                                        <Button
                                            className="mt-2 mx-auto w-full bg-cyan-600 text-white hover:bg-cyan-700 transition rounded-xl py-2"
                                            icon={<UserPlus size={18} />}
                                        >
                                            Rejoindre le trajet
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Trips
