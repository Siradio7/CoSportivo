import { useEffect, useState } from "react"
import Header from "../components/header"
import { Link } from "react-router-dom"
import { MapPinOff, User, UserPlus, Car, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const MyTrips = () => {
    const [createdTrips, setCreatedTrips] = useState([])
    const [joinedTrips, setJoinedTrips] = useState([])
    const [activeTab, setActiveTab] = useState('created')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedTrip, setSelectedTrip] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [matchDetails, setMatchDetails] = useState(null)
    const [loadingMatch, setLoadingMatch] = useState(false)

    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const fetchTrips = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                const createdResponse = await fetch(`${API_URL}/trips/user/${user.id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!createdResponse.ok) {
                    throw new Error("Erreur lors de la récupération des trajets créés")
                }
                
                const createdData = await createdResponse.json()
                setCreatedTrips(createdData)
                
                const joinedResponse = await fetch(`${API_URL}/trip-passengers/user/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                
                if (!joinedResponse.ok) {
                    if (joinedResponse.status === 404) {
                        setJoinedTrips([])
                        return
                    }

                    throw new Error("Erreur lors de la récupération des trajets rejoints")
                }
                
                const joinedData = await joinedResponse.json()
                setJoinedTrips(joinedData)
            } catch (err) {
                console.error(err)
                setError("Une erreur est survenue lors du chargement de vos trajets")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTrips()
    }, [])

    const openModal = async (trip) => {
        setSelectedTrip(trip)
        setIsModalOpen(true)
        setMatchDetails(null)
        
        if (trip.match_id) {
            setLoadingMatch(true)
            try {
                const response = await fetch(`${API_URL}/api/matches/${trip.match_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Impossible de récupérer les détails du match")
                }

                const data = await response.json()
                setMatchDetails(data)
            } catch (err) {
                console.error("Erreur lors de la récupération des détails du match:", err)
            } finally {
                setLoadingMatch(false)
            }
        }
    }

    const closeModal = () => {
        setSelectedTrip(null)
        setIsModalOpen(false)
        setMatchDetails(null)
    }

    const getActiveTrips = () => {
        return activeTab === 'created' ? createdTrips : joinedTrips
    }

    const formatMatchDate = (utcDate) => {
        if (!utcDate) return "Date non précisée"
        
        const date = new Date(utcDate)
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-4xl font-bold text-center text-cyan-700 mb-6">
                    Mes trajets 🚗
                </h2>

                <div className="bg-white rounded-xl shadow-sm mb-8 p-1 flex">
                    <button 
                        onClick={() => setActiveTab('created')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                            activeTab === 'created' 
                                ? 'bg-cyan-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Car size={18} />
                        <span className="font-medium">Trajets proposés</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('joined')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                            activeTab === 'joined' 
                                ? 'bg-cyan-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <UserPlus size={18} />
                        <span className="font-medium">Trajets rejoints</span>
                    </button>
                </div>

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

                {!isLoading && !error && getActiveTrips().length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-10"
                    >
                        <MapPinOff className="mx-auto text-cyan-600 w-12 h-12 mb-4 animate-bounce" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {activeTab === 'created' 
                                ? 'Aucun covoiturage proposé' 
                                : 'Aucun covoiturage rejoint'}
                        </h3>
                        <p className="text-gray-500">
                            {activeTab === 'created'
                                ? 'Vous n\'avez encore proposé aucun trajet pour un match.'
                                : 'Vous n\'avez encore rejoint aucun trajet pour un match.'}
                        </p>
                        {activeTab === 'joined' && (
                            <Link to="/matches" className="inline-block mt-4 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition">
                                Voir les matchs disponibles
                            </Link>
                        )}
                    </motion.div>
                )}

                {!isLoading && !error && getActiveTrips().length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        {getActiveTrips().map((trip) => (
                            <motion.div
                                key={trip.id}
                                layout
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300"
                            >
                                <div className={`absolute -top-2 ${activeTab === 'created' ? 'bg-cyan-600' : 'bg-emerald-600'} text-white text-xs px-3 py-1 rounded-full -right-2 shadow-md`}>
                                    {activeTab === 'created' 
                                        ? 'Conducteur'
                                        : `${trip.seats_reserved || 1} place${trip.seats_reserved > 1 ? 's' : ''}`
                                    }
                                </div>
                                
                                <div className="mb-4 space-y-2">
                                    <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">🕒 Départ : <strong className="break-all">{trip.departure_location}</strong> à <strong>{trip.departure_time?.slice(0, 5)}</strong></p>
                                    <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">📍 Arrivée : <strong className="break-all">{trip.arrival_location}</strong></p>
                                    
                                    {activeTab === 'created' ? (
                                        <>
                                            <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">🚘 Voiture : <span className="break-all">{trip.car_model || "Modèle inconnu"} • {trip.car_color || "Couleur inconnue"}</span></p>
                                            <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💺 Places : <strong>{trip.available_seats}</strong></p>
                                            <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💰 Prix : <strong>{trip.price} €</strong></p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1"><User size={16} className="inline mr-1" /> <strong className="break-all">{trip.driver_name || "Conducteur"}</strong></p>
                                            <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">🚘 Voiture : <span className="break-all">{trip.car_model || "Modèle inconnu"} • {trip.car_color || "Couleur inconnue"}</span></p>
                                            <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💰 Prix total : <strong>{(trip.price * (trip.seats_reserved || 1))} €</strong></p>
                                        </>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <button
                                        onClick={() => openModal(trip)}
                                        className="bg-cyan-600 text-white cursor-pointer hover:bg-cyan-700 transition rounded-xl py-2"
                                    >
                                        Détails du trajet
                                    </button>

                                    <Link
                                        to={`/chat/${trip.trip_id || trip.id}`}
                                        state={{ from: '/my-trips' }}
                                        className="text-center bg-gray-600 hover:bg-gray-500 text-white transition rounded-xl py-2"
                                    >
                                        Accéder au chat
                                    </Link>

                                    {activeTab === 'joined' && (
                                        <button
                                            onClick={() => {
                                                alert("Fonctionnalité d'annulation à venir")
                                            }}
                                            className="bg-red-100 text-red-600 hover:bg-red-200 transition rounded-xl py-2"
                                        >
                                            Annuler ma participation
                                        </button>
                                    )}
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
                            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 relative"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-1 right-3 text-gray-500 hover:text-gray-700 text-3xl"
                            >
                                &times;
                            </button>

                            <h2 className="text-2xl text-center mt-1 font-bold text-cyan-700 mb-4">Détails du trajet</h2>
                            
                            {loadingMatch ? (
                                <div className="bg-cyan-50 p-4 rounded-xl mb-4 border border-cyan-100 animate-pulse">
                                    <p className="text-center text-cyan-800">Chargement des informations du match...</p>
                                </div>
                            ) : matchDetails ? (
                                <div className="bg-cyan-50 p-4 rounded-xl mb-4 border border-cyan-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy size={18} className="text-cyan-700" />
                                        <h3 className="font-semibold text-cyan-800">Match</h3>
                                    </div>
                                    <p className="text-gray-700 font-medium">
                                        {matchDetails.match?.homeTeam?.name || matchDetails.homeTeam?.name} vs {matchDetails.match?.awayTeam?.name || matchDetails.awayTeam?.name}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {matchDetails.match?.competition?.name || matchDetails.competition?.name || "Compétition non précisée"}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {formatMatchDate(matchDetails.match?.utcDate || matchDetails.utcDate)}
                                    </p>
                                </div>
                            ) : selectedTrip.match_id ? (
                                <div className="bg-cyan-50 p-4 rounded-xl mb-4 border border-cyan-100">
                                    <p className="text-center text-cyan-800">Impossible de charger les détails du match</p>
                                </div>
                            ) : null}
                            
                            <div className="space-y-2">
                                <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">🕒 Départ : <strong className="break-all">{selectedTrip.departure_location}</strong> à <strong>{selectedTrip.departure_time?.slice(0, 5)}</strong></p>
                                <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">📍 Arrivée : <strong className="break-all">{selectedTrip.arrival_location}</strong></p>
                                <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">🚘 Voiture : <span className="break-all"><strong>{selectedTrip.car_model || "Inconnu"}</strong> - {selectedTrip.car_color || "Inconnue"}</span></p>
                                
                                {activeTab === 'created' ? (
                                    <>
                                        <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💺 Places : <strong>{selectedTrip.available_seats}</strong></p>
                                        <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💰 Prix : <strong>{selectedTrip.price} €</strong></p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💺 Places réservées : <strong>{selectedTrip.seats_reserved || 1}</strong></p>
                                        <p className="text-gray-700 text-sm md:text-base flex flex-wrap items-center gap-1">💰 Prix total : <strong>{(selectedTrip.price * (selectedTrip.seats_reserved || 1))} €</strong></p>
                                    </>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <Link
                                    to={`/chat/${selectedTrip.trip_id || selectedTrip.id}`}
                                    state={{ from: '/my-trips' }}
                                    className="block w-full text-center bg-cyan-600 text-white hover:bg-cyan-700 transition rounded-xl py-2"
                                >
                                    Accéder au chat
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MyTrips
