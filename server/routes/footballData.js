import { Router } from "express"
import { getCompetitions, getCompetitionById, getMatchesByCompetitionId, getMatchById, getTeamById, getTeamsByCompetitionId, getTeams } from "../controllers/footballData.js"

const router = Router()

router.get("/competitions", getCompetitions)
router.get("/competitions/:id", getCompetitionById)
router.get("/competitions/:id/matches", getMatchesByCompetitionId)
router.get("/competitions/:id/teams", getTeamsByCompetitionId)
router.get("/teams/:id", getTeamById)
router.get("/matches/:id", getMatchById)
router.get("/teams", getTeams)

export default router