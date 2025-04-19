import { useEffect, useState } from "react"
import Header from "../components/header"
import toast from "react-hot-toast"
import Match from "../components/match"
import { encryptData, decryptData } from "../utils/crypto"

const Matches = () => {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const user = JSON.parse(localStorage.getItem("user"))
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL

    useEffect(() => {
        const fetchMatches = async () => {
            const cacheKey = `matches_${user.id_favourite_team}`
            const cached = sessionStorage.getItem(cacheKey)

            if (cached) {
                const decrypted = decryptData(cached)

                if (decrypted && Date.now() - decrypted.timestamp < 5 * 60 * 1000) {
                    setMatches(decrypted.data)
                    setLoading(false)
                    return
                }
            }

            try {
                const response = await fetch(`${API_URL}/api/teams/${user.id_favourite_team}/matches/`)
                const data = await response.json()

                setMatches(data.matches)
                sessionStorage.setItem(
                    cacheKey,
                    encryptData({ data: data.matches, timestamp: Date.now() })
                )
            } catch (err) {
                toast.error("Une erreur s'est produite lors du chargement des matchs")
                setError("Erreur lors du chargement des matchs 😢")
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
    }, [user.id_favourite_team, API_URL])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />

            <div className="max-w-6xl mx-auto p-6">
                <h2 className="text-3xl font-extrabold text-center text-cyan-700 mb-8">
                    Matchs à venir ⚽
                </h2>

                {
                    loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 h-48 shadow">
                                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                                </div>
                            ))}
                        </div>
                    )
                }

                {error && <p className="text-center text-red-500">{error}</p>}

                {
                    !loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                matches.map((match) => (
                                    <Match 
                                        key={match.id}
                                        id={match.id} 
                                        competition_emblem={match.competition.emblem} 
                                        competition_name={match.competition.name}
                                        area_flag={match.area.flag}
                                        home_team_crest={match.homeTeam.crest}
                                        home_team_name={match.homeTeam.name}
                                        away_team_crest={match.awayTeam.crest}
                                        away_team_name={match.awayTeam.name}
                                        utcDate={match.utcDate}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Matches
