import { Link } from "react-router-dom"
import Button from "./button"
import { isAuthenticated } from "../hooks/useAuth"

const Match = ({ id, competition_emblem, competition_name, area_flag, home_team_name, home_team_crest, away_team_name, away_team_crest, utcDate }) => {
    return (
        <div
            key={id}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4 hover:shadow-xl transition duration-300"
        >
            <div className="flex items-center justify-between">
                <img
                    src={competition_emblem}
                    alt="Logo compétition"
                    className="h-8 w-auto"
                    onError={(e) => (e.target.style.display = "none")}
                />

                <span className="text-xs bg-cyan-100 text-cyan-700 font-medium px-2 py-1 rounded-full truncate">
                    {competition_name}
                </span>

                <img
                    src={area_flag}
                    alt="Drapeau"
                    className="h-6 w-auto"
                    onError={(e) => (e.target.style.display = "none")}
                />
            </div>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 max-w-[130px]">
                    <img src={home_team_crest} alt="Home" className="h-8 w-8" />

                    <span className="font-medium truncate" title={home_team_name}>
                        {home_team_name}
                    </span>
                </div>

                <span className="text-gray-500 font-semibold text-sm">vs</span>

                <div className="flex items-center gap-2 max-w-[130px] justify-end">
                    <span className="font-medium truncate text-right" title={away_team_name}>
                        {away_team_name}
                    </span>

                    <img src={away_team_crest} alt="Away" className="h-8 w-8" />
                </div>
            </div>

            <p className="text-center text-sm text-gray-600">
                📅{" "}
                {
                    new Date(utcDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }
            </p>

            <Link to={`/trips/${id}`}>
                <Button
                    className="mt-2 mx-auto w-full bg-cyan-600 text-white hover:bg-cyan-700 transition rounded-xl py-2"
                    variant="primary"
                >
                    Voir les covoiturages
                </Button>
            </Link>
        </div>
    )
}

export default Match