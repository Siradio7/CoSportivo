import fetch from 'node-fetch';

const API_KEY = process.env.FOOTBALL_DATA_API_KEY
const BASE_URL = process.env.FOOTBALL_DATA_API_URL
const HEADERS = {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
}

const CURRENT_DATE = new Date().toISOString().split('T')[0]
const END_DATE = new Date(new Date().setDate(new Date().getDate() + 13)).toISOString().split('T')[0]

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

export {
    getCompetitions,
    getCompetitionById,
    getMatchesByCompetitionId,
    getTeamsByCompetitionId,
    getTeamById,
    getMatchById
}