import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Header from "../components/header"
import Button from "../components/button"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { ArrowLeft, UserPlus, Trophy } from "lucide-react"

const JoinTrip = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [seats, setSeats] = useState(1)
    const [matchDetails, setMatchDetails] = useState(null)
    const [loadingMatch, setLoadingMatch] = useState(false)
    
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${API_URL}/trips/${tripId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Impossible de récupérer les détails du trajet")
                }

                const data = await response.json()
                setTrip(data)
                
                // Après avoir récupéré les détails du trajet, récupérer les informations du match
                if (data.match_id) {
                    setLoadingMatch(true)
                    try {
                        const matchResponse = await fetch(`${API_URL}/api/matches/${data.match_id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        })
                        
                        if (matchResponse.ok) {
                            const matchData = await matchResponse.json()
                            setMatchDetails(matchData)
                        }
                    } catch (matchErr) {
                        console.error("Erreur lors de la récupération des informations du match:", matchErr)
                    } finally {
                        setLoadingMatch(false)
                    }
                }
            } catch (err) {
                setError("Une erreur est survenue lors du chargement des détails du trajet")
                toast.error("Erreur de chargement")
            } finally {
                setLoading(false)
            }
        }

        fetchTripDetails()
    }, [tripId, API_URL])

    const handleJoinTrip = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const selectedSeats = parseInt(seats)

        try {
            if (selectedSeats <= 0 || selectedSeats > trip.available_seats) {
                toast.error("Nombre de places invalide")
                setSubmitting(false)
                return
            }

            const response = await fetch(`${API_URL}/trip-passengers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    trip_id: parseInt(tripId),
                    user_id: user.id,
                    passenger_id: user.id,
                    seats_reserved: selectedSeats
                })
            })

            if (!response.ok) {
                throw new Error("Erreur lors de l'inscription au trajet")
            }

            toast.success("🎉 Vous avez rejoint ce trajet avec succès !")
            navigate(`/chat/${tripId}`)
        } catch (err) {
            toast.error("Une erreur est survenue lors de l'inscription")
            console.error("Erreur:", err)
        } finally {
            setSubmitting(false)
        }
    }
    
    // Formater la date du match
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

            <div className="max-w-3xl mx-auto p-6">
                <Link 
                    to={`/trips/${trip?.match_id || ""}`} 
                    className="flex items-center text-cyan-600 hover:text-cyan-700 transition mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Retour aux trajets
                </Link>

                <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">
                    Rejoindre un trajet 🚗
                </h2>

                {loading ? (
                    <div className="text-center text-gray-600 animate-pulse my-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-4">Chargement des détails du trajet...</p>
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                    >
                        {error}
                    </motion.div>
                ) : trip ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-md p-6"
                    >
                        {/* Information du match */}
                        {loadingMatch ? (
                            <div className="bg-cyan-50 p-4 rounded-xl mb-6 border border-cyan-100 animate-pulse">
                                <p className="text-center text-cyan-800">Chargement des informations du match...</p>
                            </div>
                        ) : matchDetails ? (
                            <div className="bg-cyan-50 p-4 rounded-xl mb-6 border border-cyan-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy size={18} className="text-cyan-700" />
                                    <h3 className="font-semibold text-cyan-800">Match</h3>
                                </div>
                                <p className="text-gray-700 font-medium text-lg">
                                    {matchDetails.match?.homeTeam?.name || matchDetails.homeTeam?.name} vs {matchDetails.match?.awayTeam?.name || matchDetails.awayTeam?.name}
                                </p>
                                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                                    <span>{matchDetails.match?.competition?.name || matchDetails.competition?.name || "Compétition non précisée"}</span>
                                    <span>
                                        {formatMatchDate(matchDetails.match?.utcDate || matchDetails.utcDate)}
                                    </span>
                                </div>
                            </div>
                        ) : trip.match_id ? (
                            <div className="bg-cyan-50 p-4 rounded-xl mb-6 border border-cyan-100">
                                <p className="text-center text-cyan-800">Impossible de charger les détails du match</p>
                            </div>
                        ) : null}
                        
                        <div className="mb-6 space-y-3">
                            <h3 className="text-xl font-semibold text-gray-800">Détails du trajet</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Conducteur </span> {trip.first_name} {trip.last_name}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">🕒 Départ </span> {trip.departure_location} à {trip.departure_time?.slice(0, 5)}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">📍 Arrivée </span> {trip.arrival_location}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">🚘 Voiture </span> {trip.car_model || "Non précisé"} - {trip.car_color || "Couleur non précisée"}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">💺 Places disponibles </span> {trip.available_seats}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">💰 Prix </span> {trip.price} € par personne
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleJoinTrip} className="mt-6 border-t border-gray-200 pt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Réserver votre place</h3>
                            
                            {trip.available_seats > 0 ? (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de places à réserver
                                        </label>
                                        <select 
                                            id="seats"
                                            value={seats}
                                            onChange={(e) => setSeats(parseInt(e.target.value))}
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        >
                                            {[...Array(Math.min(4, trip.available_seats)).keys()].map(i => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1} {i === 0 ? "place" : "places"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-cyan-50 p-4 rounded-xl mb-6">
                                        <p className="font-semibold text-cyan-800">Récapitulatif </p>
                                        <p className="text-cyan-700">
                                            {seats} {seats === 1 ? "place" : "places"} x {trip.price} € = <span className="font-bold">{seats * trip.price} €</span>
                                        </p>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        variant="primary"
                                        icon={<UserPlus size={18} />}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Inscription en cours..." : "Rejoindre ce trajet"}
                                    </Button>

                                    <p className="text-sm text-gray-500 text-center mt-4">
                                        En rejoignant ce trajet, vous acceptez de partager vos informations avec le conducteur.
                                    </p>
                                </>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-center">
                                    <p className="font-semibold">Désolé, ce trajet est complet !</p>
                                    <p className="text-sm mt-2">Vous pouvez consulter d'autres trajets disponibles.</p>
                                </div>
                            )}
                        </form>
                    </motion.div>
                ) : null}
            </div>
        </div>
    )
}

export default JoinTrip