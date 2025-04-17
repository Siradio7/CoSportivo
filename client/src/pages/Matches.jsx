import { useEffect, useState } from "react"
import Header from "../components/header"
import Button from "../components/button"
import toast from "react-hot-toast"

const Matches = () => {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const user = JSON.parse(localStorage.getItem("user"))
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`${API_URL}/api/teams/${user.id_favourite_team}/matches/`)
                const data = await response.json()
                setMatches(data.matches)
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
                            {
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-5 h-48 shadow">
                                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

                {error && <p className="text-center text-red-500">{error}</p>}

                {
                    !loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                matches.map((match) => (
                                    <div
                                        key={match.id}
                                        className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4 hover:shadow-xl transition duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <img
                                                src={match.competition.emblem}
                                                alt="Logo compétition"
                                                className="h-8 w-auto"
                                                onError={(e) => (e.target.style.display = "none")}
                                            />

                                            <span className="text-xs bg-cyan-100 text-cyan-700 font-medium px-2 py-1 rounded-full truncate">
                                                {match.competition.name}
                                            </span>

                                            <img
                                                src={match.area.flag}
                                                alt="Drapeau"
                                                className="h-6 w-auto"
                                                onError={(e) => (e.target.style.display = "none")}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 max-w-[130px]">
                                                <img src={match.homeTeam.crest} alt="Home" className="h-8 w-8" />

                                                <span className="font-medium truncate" title={match.homeTeam.name}>
                                                    {match.homeTeam.name}
                                                </span>
                                            </div>

                                            <span className="text-gray-500 font-semibold text-sm">vs</span>

                                            <div className="flex items-center gap-2 max-w-[130px] justify-end">
                                                <span className="font-medium truncate text-right" title={match.awayTeam.name}>
                                                    {match.awayTeam.name}
                                                </span>
                                                
                                                <img src={match.awayTeam.crest} alt="Away" className="h-8 w-8" />
                                            </div>
                                        </div>

                                        <p className="text-center text-sm text-gray-600">
                                            📅{" "}
                                            {
                                                new Date(match.utcDate).toLocaleDateString("fr-FR", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                            }
                                        </p>

                                        <Button
                                            className="mt-2 mx-auto w-full bg-cyan-600 text-white hover:bg-cyan-700 transition rounded-xl py-2"
                                            variant="primary"
                                        >
                                            Voir les covoiturages
                                        </Button>
                                    </div>
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
