import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../components/header"
import Button from "../components/button"
import { motion } from "framer-motion"
import { UserPlus, MessageSquare, MapPin } from "lucide-react"

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
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>
            
            <div className="max-w-4xl mx-auto p-4 md:p-6 relative z-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-cyan-700 inline-block">
                        <span className="relative">
                            Covoiturages disponibles 🚗
                            <span className="absolute bottom-0 left-0 w-full h-[4px] bg-cyan-200 opacity-50 rounded-full"></span>
                        </span>
                    </h2>
                </div>

                <div className="flex justify-end mb-6">
                    <Link to={`/create-trip/${id}`}>
                        <Button
                            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            icon={<MapPin size={16} />}
                        >
                            Proposer un trajet
                        </Button>
                    </Link>
                </div>

                {loading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des trajets...</p>
                    </div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl shadow-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {!loading && !error && trips.length === 0 && (
                    <div className="text-center mt-8 sm:mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                            alt="Pas de trajet"
                            className="mx-auto w-20 h-20 sm:w-24 sm:h-24 opacity-80 mb-4 drop-shadow"
                        />
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">
                            Aucun trajet disponible pour ce match
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Sois le premier à proposer un trajet ! 🚗
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {trips.map((trip) => {
                        const joined = hasJoinedTrip(trip.id)
                        
                        return (
                            <motion.div
                                key={trip.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 border border-gray-100 relative"
                            >
                                {joined && (
                                    <div className="absolute -top-2 right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                        Trajet rejoint
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-cyan-700 mb-3 flex items-center gap-2">
                                        <div className="bg-cyan-100 p-2 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-700" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {trip.first_name + " " + trip.last_name}
                                    </h3>

                                    <div className="space-y-2 text-sm md:text-base">
                                        <p className="text-gray-700 flex items-center gap-2">
                                            <span className="bg-gray-100 p-1 rounded-full flex-shrink-0">🕒</span>
                                            <span>Départ : <strong className="text-gray-800">{trip.departure_location} à {trip.departure_time?.slice(0, 5)}</strong></span>
                                        </p>

                                        <p className="text-gray-700 flex items-center gap-2">
                                            <span className="bg-gray-100 p-1 rounded-full flex-shrink-0">📍</span>
                                            <span>Arrivée : <strong className="text-gray-800">{trip.arrival_location}</strong></span>
                                        </p>

                                        <p className="text-gray-700 flex items-center gap-2">
                                            <span className="bg-gray-100 p-1 rounded-full flex-shrink-0">🚘</span>
                                            <span>Voiture : <span className="text-gray-800">{trip.car_model || "Modèle inconnu"} • {trip.car_color || "Couleur inconnue"}</span></span>
                                        </p>

                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <p className="text-gray-700 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-100 flex items-center gap-1">
                                                <span>💺</span>
                                                <span><strong>{trip.available_seats}</strong> places</span>
                                            </p>

                                            <p className="text-gray-700 bg-green-50 px-3 py-1 rounded-lg border border-green-100 flex items-center gap-1">
                                                <span>💰</span>
                                                <span><strong>{trip.price} €</strong></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {joined ? (
                                    <Link to={`/chat/${trip.id}`} state={{ from: `/trips/${id}` }} className="w-full">
                                        <Button
                                            className="mt-3 mx-auto w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition rounded-xl py-2.5 shadow-md hover:shadow-lg"
                                            icon={<MessageSquare size={18} />}
                                        >
                                            Accéder au chat
                                        </Button>
                                    </Link>
                                ) : trip.driver_id === user.id ? (
                                    <div className="text-center mt-3 p-2.5 bg-gray-100 rounded-xl text-gray-600 border border-gray-200">
                                        Vous êtes le conducteur de ce trajet
                                    </div>
                                ) : (
                                    <Link to={`/join-trip/${trip.id}`} className="w-full">
                                        <Button
                                            className="mt-3 mx-auto w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 transition rounded-xl py-2.5 shadow-md hover:shadow-lg"
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
