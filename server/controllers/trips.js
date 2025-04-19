import db from "../config/database.js"

const addTrip = async (req, res) => {
    const { match_id, driver_id, departure_time, departure_location, arrival_location, available_seats, price } = req.body
    const sql = "INSERT INTO trips (match_id, driver_id, departure_time, departure_location, arrival_location, available_seats, price) VALUES (?, ?, ?, ?, ?, ?, ?)"

    db.query(sql, [match_id, driver_id, departure_time, departure_location, arrival_location, available_seats, price], (err) => {
        if (err) {
            console.error("Erreur lors de l'ajout du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(201).json({ message: "Trajet ajouté avec succès" })
    })
}

const getAllTrips = async (req, res) => {
    const sql = "SELECT * FROM trips"

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des trajets:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json(result)
    })
}

const getTripById = async (req, res) => {
    const tripId = req.params.id
    const sql = "SELECT * FROM trips WHERE id = ?"
    
    db.query(sql, [tripId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Trajet non trouvé" })
        }

        res.status(200).json(result[0])
    })
}

const getAllTripsByMatchId = async (req, res) => {
    const matchId = req.params.id
    const sql = "SELECT trips.*, users.first_name, users.last_name FROM trips, users WHERE users.id = trips.driver_id AND match_id = ? ORDER BY departure_time ASC "

    db.query(sql, [matchId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des trajets:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json(result)
    })
}

const getAllTripsByUserId = async (req, res) => {
    const userId = req.params.id
    const sql = "SELECT * FROM trips WHERE driver_id = ?"

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des trajets:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json(result)
    })
}

const updateTrip = async (req, res) => {
    const tripId = req.params.id
    const { departure_time, departure_location, arrival_location, available_seats, price } = req.body
    const sql = "UPDATE trips SET departure_time = ?, departure_location = ?, arrival_location = ?, available_seats = ?, price = ? WHERE id = ?"

    db.query(sql, [departure_time, departure_location, arrival_location, available_seats, price, tripId], (err) => {
        if (err) {
            console.error("Erreur lors de la mise à jour du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json({ message: "Trajet mis à jour avec succès" })
    })
}

const deleteTrip = async (req, res) => {
    const tripId = req.params.id
    const sql = "DELETE FROM trips WHERE id = ?"

    db.query(sql, [tripId], (err) => {
        if (err) {
            console.error("Erreur lors de la suppression du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json({ message: "Trajet supprimé avec succès" })
    })
}

export { getAllTrips, getTripById, addTrip, updateTrip, deleteTrip, getAllTripsByMatchId, getAllTripsByUserId }