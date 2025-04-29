import { useEffect, useState } from "react"
import Header from "../components/header"
import toast from "react-hot-toast"
import Match from "../components/match"
import { encryptData, decryptData } from "../utils/crypto"
import Loader from "../components/loader"

const Matches = () => {
    const [matches, setMatches] = useState([])
    const [filteredMatches, setFilteredMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
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
                    setFilteredMatches(decrypted.data)
                    setLoading(false)
                    return
                }
            }

            try {
                const response = await fetch(`${API_URL}/api/teams/${user.id_favourite_team}/matches/`)
                const data = await response.json()

                setMatches(data.matches)
                setFilteredMatches(data.matches)
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

    useEffect(() => {
        if (!matches.length) return

        let result = [...matches]

        if (filter === "week") {
            const nextWeek = new Date()

            nextWeek.setDate(nextWeek.getDate() + 7)
            result = result.filter(match => new Date(match.utcDate) <= nextWeek)
        } else if (filter === "month") {
            const nextMonth = new Date()

            nextMonth.setMonth(nextMonth.getMonth() + 1)
            result = result.filter(match => new Date(match.utcDate) <= nextMonth)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()

            result = result.filter(match => 
                match.homeTeam.name.toLowerCase().includes(query) || 
                match.awayTeam.name.toLowerCase().includes(query) ||
                match.competition.name.toLowerCase().includes(query)
            )
        }

        setFilteredMatches(result)
    }, [matches, filter, searchQuery])

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />

            <div className="max-w-6xl mx-auto p-6 z-10">
                <div className="text-center mb-10 bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-2xl shadow-md transform hover:scale-[1.01] transition duration-300">
                    <h2 className="text-3xl font-extrabold text-cyan-800 mb-4 relative inline-block">
                        Matchs à venir ⚽
                        <div className="absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </h2>

                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        Découvrez les prochains matchs de votre équipe favorite et organisez des covoiturages avec d'autres supporters.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher une équipe ou compétition..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full sm:w-64 transition-all duration-300"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute top-2.5 right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex gap-2 justify-center">
                            <button 
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${filter === "all" ? "bg-cyan-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                Tous
                            </button>

                            <button 
                                onClick={() => setFilter("week")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${filter === "week" ? "bg-cyan-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                Cette semaine
                            </button>

                            <button 
                                onClick={() => setFilter("month")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${filter === "month" ? "bg-cyan-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                Ce mois
                            </button>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader size="large" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {filteredMatches.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMatches.map((match, index) => (
                                    <div key={match.id} 
                                        className="transform transition duration-500 hover:scale-[1.02] z-10"
                                        style={{ 
                                            opacity: 0,
                                            animation: `fadeIn 0.6s ease-out forwards ${index * 0.1}s`
                                        }}
                                    >
                                        <Match 
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-lg text-gray-600">Aucun match ne correspond à votre recherche</p>
                                <button 
                                    onClick={() => { setFilter("all"); setSearchQuery(""); }}
                                    className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx="true">
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>
        </div>
    )
}

export default Matches
