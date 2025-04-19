import fetch from 'node-fetch';

const API_KEY = process.env.FOOTBALL_DATA_API_KEY
const BASE_URL = process.env.FOOTBALL_DATA_API_URL
const HEADERS = {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
}

const CURRENT_DATE = new Date().toISOString().split('T')[0]
const END_DATE = new Date(new Date().setDate(new Date().getDate() + 13)).toISOString().split('T')[0]
const ALL_TEAMS = []
const competitions = [
    2021, // Premier League
    2002, // Bundesliga
    2014, // La Liga
    2019, // Serie A
    2015 // Ligue 1
]

const fetchFromAPI = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: HEADERS
    })

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
    }

    return response.json()
}

const getCompetitions = async (req, res) => {
    try {
        const data = await fetchFromAPI('/competitions')
        const leagues = data.competitions.filter(competition => competition.type === 'LEAGUE')

        res.status(200).json(leagues)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getCompetitionById = async (req, res) => {
    const { id } = req.params

    try {
        const data = await fetchFromAPI(`/competitions/${id}`)

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getMatchesByCompetitionId = async (req, res) => {
    const { id } = req.params

    try {
        const data = await fetchFromAPI(`/competitions/${id}/matches?status=SCHEDULED&dateFrom=${CURRENT_DATE}&dateTo=${END_DATE}`)

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTeamsByCompetitionId = async (req, res) => {
    const { id } = req.params

    try {
        const data = await fetchFromAPI(`/competitions/${id}/teams`)

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTeams = async (req, res) => {
    if (ALL_TEAMS.length > 0) {
        return res.status(200).json(ALL_TEAMS)
    }

    let teams = []
    for (const competition of competitions) {
        try {
            const response = await fetchFromAPI(`/competitions/${competition}/teams`)

            teams.push(...response.teams.map(team => ({
                id: team.id,
                name: team.name,
                competition: competition
            })))
        } catch (error) {
            console.error(`Error fetching teams for competition ${competition}:`, error)
        }
    }

    if (teams.length === 0) {
        return res.status(404).json({ error: 'No teams found' })
    }

    
    teams = teams.sort((a, b) => a.name.localeCompare(b.name))
    teams = teams.filter((team, index, self) =>
        index === self.findIndex((t) => (
            t.id === team.id
        ))
    )
    ALL_TEAMS.push(...teams)
    res.status(200).json(teams)
}

const getTeamById = async (req, res) => {
    const { id } = req.params

    try {
        const data = await fetchFromAPI(`/teams/${id}`)

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getMatchById = async (req, res) => {
    const { id } = req.params

    try {
        const data = await fetchFromAPI(`/matches/${id}`)

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTeamMatches = async (req, res) => {
    const { id } = req.params

    try {
        const data = await fetchFromAPI(`/teams/${id}/matches?status=SCHEDULED&dateFrom=${CURRENT_DATE}&dateTo=${END_DATE}`)

        const matches = []
        for (const competition of competitions) {
            try {
                const response = await fetchFromAPI(`/competitions/${competition}/matches?status=SCHEDULED&dateFrom=${CURRENT_DATE}&dateTo=${END_DATE}`)
                const filteredMatches = response.matches.filter(match => match.homeTeam.id === id || match.awayTeam.id === id)
                matches.push(...filteredMatches)
            } catch (error) {
                console.error(`Error fetching matches for competition ${competition}:`, error)
            }
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export {
    getCompetitions,
    getCompetitionById,
    getMatchesByCompetitionId,
    getTeamsByCompetitionId,
    getTeamById,
    getMatchById,
    getTeams,
    getTeamMatches
}