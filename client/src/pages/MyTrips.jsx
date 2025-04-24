import { useEffect, useState } from "react"
import Header from "../components/header"
import { Link } from "react-router-dom"
import { MapPinOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const MyTrips = () => {
    const [trips, setTrips] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedTrip, setSelectedTrip] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch(`${API_URL}/trips/user/${user.id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                const data = await response.json()
                setTrips(data)
            } catch (err) {
                setError("Une erreur est survenue lors du chargement de vos voyages")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTrips()
    }, [])

    const openModal = (trip) => {
        setSelectedTrip(trip)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedTrip(null)
        setIsModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-4xl font-bold text-center text-cyan-700 mb-10">
                    Mes trajets proposés 🚗
                </h2>

                {isLoading && (
                    <div className="text-center text-gray-600 animate-pulse">Chargement...</div>
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

                {!isLoading && !error && trips.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center mt-10"
                    >
                        <MapPinOff className="mx-auto text-cyan-600 w-12 h-12 mb-4 animate-bounce" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Aucun covoiturage proposé
                        </h3>
                        <p className="text-gray-500">
                            Vous n'avez encore proposé aucun trajet pour un match.
                        </p>
                    </motion.div>
                )}

                {!isLoading && !error && trips.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        {trips.map((trip) => (
                            <motion.div
                                key={trip.id}
                                layout
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300"
                            >
                                <div className="mb-4 space-y-2">
                                    <p className="text-gray-700">🕒 Départ : <strong>{trip.departure_location} à {trip.departure_time?.slice(0, 5)}</strong></p>
                                    <p className="text-gray-700">📍 Arrivée : <strong>{trip.arrival_location}</strong></p>
                                    <p className="text-gray-700">🚘 Voiture : {trip.car_model || "Modèle inconnu"} • {trip.car_color || "Couleur inconnue"}</p>
                                    <p className="text-gray-700">💺 Places : <strong>{trip.available_seats}</strong></p>
                                    <p className="text-gray-700">💰 Prix : <strong>{trip.price} €</strong></p>
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <button
                                        onClick={() => openModal(trip)}
                                        className="bg-cyan-600 text-white hover:bg-cyan-700 transition rounded-xl py-2"
                                    >
                                        Détails du trajet
                                    </button>

                                    <Link
                                        to={`/chat/${trip.id}`}
                                        className="text-center bg-gray-600 hover:bg-gray-500 text-white transition rounded-xl py-2"
                                    >
                                        Accéder au chat
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && selectedTrip && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-1 right-3 text-gray-500 hover:text-gray-700 text-3xl"
                            >
                                &times;
                            </button>

                            <h2 className="text-2xl text-center mt-1 font-bold text-cyan-700 mb-4">Détails du trajet</h2>
                            <div className="space-y-2">
                                <p>🕒 Départ : <strong>{selectedTrip.departure_location}</strong> à <strong>{selectedTrip.departure_time?.slice(0, 5)}</strong></p>
                                <p>📍 Arrivée : <strong>{selectedTrip.arrival_location}</strong></p>
                                <p>🚘 Voiture : <strong>{selectedTrip.car_model || "Inconnu"}</strong> - {selectedTrip.car_color || "Inconnue"}</p>
                                <p>💺 Places : <strong>{selectedTrip.available_seats}</strong></p>
                                <p>💰 Prix : <strong>{selectedTrip.price} €</strong></p>
                            </div>
                            <p className="text-sm text-center text-gray-500 mt-4">Cliquez sur la croix pour fermer</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MyTrips
