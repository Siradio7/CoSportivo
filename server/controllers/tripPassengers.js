import db from "../config/database.js"

const joinTrip = async (req, res) => {
    const { trip_id, user_id, seats_reserved } = req.body
    const checkSeatsSql = "SELECT available_seats FROM trips WHERE id = ?"

    db.query(checkSeatsSql, [trip_id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la vérification des sièges disponibles:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Trajet non trouvé" })
        }

        const availableSeats = result[0].available_seats

        if (seats_reserved > availableSeats) {
            return res.status(400).json({ message: "Nombre de sièges réservés supérieur au nombre de sièges disponibles" })
        }

        const sql = "INSERT INTO trip_passengers (trip_id, user_id, seats_reserved) VALUES (?, ?, ?)"

        db.query(sql, [trip_id, user_id, seats_reserved], (err) => {
            if (err) {
                console.error("Erreur lors de l'ajout du passager au trajet:", err)

                return res.status(500).json({ message: "Erreur interne du serveur" })
            }

            const updateSeatsSql = "UPDATE trips SET available_seats = available_seats - ? WHERE id = ?"
            db.query(updateSeatsSql, [seats_reserved, trip_id], (err) => {
                if (err) {
                    console.error("Erreur lors de la mise à jour des sièges disponibles:", err)
                    return res.status(500).json({ message: "Erreur interne du serveur" })
                }

                res.status(201).json({ message: "Passager ajouté avec succès" })
            })
        })
    })
}

const getAllTripPassengers = async (req, res) => {
    const tripId = req.params.id
    const sql = "SELECT * FROM trip_passengers WHERE trip_id = ?"

    db.query(sql, [tripId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des passagers du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json(result)
    })
}

const getTripPassengerById = async (req, res) => {
    const tripPassengerId = req.params.id
    const sql = "SELECT * FROM trip_passengers WHERE id = ?"

    db.query(sql, [tripPassengerId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération du passager du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Passager non trouvé" })
        }

        res.status(200).json(result[0])
    })
}

const updateTripPassenger = async (req, res) => {
    const tripPassengerId = req.params.id
    const { status, seats_reserved } = req.body
    const sql = "UPDATE trip_passengers SET status = ?, seats_reserved = ? WHERE id = ?"

    db.query(sql, [status, seats_reserved, tripPassengerId], (err) => {
        if (err) {
            console.error("Erreur lors de la mise à jour du passager du trajet:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json({ message: "Passager mis à jour avec succès" })
    })
}

const cancelReservation = async (req, res) => {
    const trip_id = req.params.id
    const { user_id } = req.body
    const sql = "SELECT seats_reserved FROM trip_passengers WHERE trip_id = ? AND user_id = ?"

    db.query(sql, [trip_id, user_id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération de la réservation:", err)

            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Réservation non trouvée" })
        }

        const seatsReserved = result[0].seats_reserved
        const deleteSql = "DELETE FROM trip_passengers WHERE trip_id = ? AND user_id = ?"

        db.query(deleteSql, [trip_id, user_id], (err) => {
            if (err) {
                console.error("Erreur lors de la suppression de la réservation:", err)

                return res.status(500).json({ message: "Erreur interne du serveur" })
            }

            const updateSeatsSql = "UPDATE trips SET available_seats = available_seats + ? WHERE id = ?"

            db.query(updateSeatsSql, [seatsReserved, trip_id], (err) => {
                if (err) {
                    console.error("Erreur lors de la mise à jour des sièges disponibles:", err)

                    return res.status(500).json({ message: "Erreur interne du serveur" })
                }

                res.status(200).json({ message: "Réservation annulée avec succès" })
            })
        })
    })
}

const getTripsByPassengerId = async (req, res) => {
    const userId = req.params.id
    const sql = `
        SELECT 
            tp.id as passenger_id,
            tp.seats_reserved,
            tp.status,
            t.*,
            u.first_name,
            u.last_name,
            CONCAT(u.first_name, ' ', u.last_name) as driver_name
        FROM 
            trip_passengers tp
        JOIN 
            trips t ON tp.trip_id = t.id
        JOIN
            users u ON t.driver_id = u.id
        WHERE 
            tp.user_id = ?
    `

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des trajets du passager:", err)
            return res.status(500).json({ message: "Erreur interne du serveur" })
        }

        res.status(200).json(result)
    })
}

export {
    joinTrip,
    getAllTripPassengers,
    getTripPassengerById,
    updateTripPassenger,
    cancelReservation,
    getTripsByPassengerId
}