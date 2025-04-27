import express from "express"
import { dbQuery } from "../utils/dbQuery.js"

const router = express.Router()

router.get("/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params
        
        const messages = await dbQuery(
            "SELECT m.*, u.first_name, u.last_name FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.trip_id = ? ORDER BY m.created_at ASC", 
            [tripId]
        )
        
        res.status(200).json(messages)
    } catch (err) {
        console.error("Erreur lors de la récupération des messages:", err)
        res.status(500).json({ message: "Erreur serveur lors de la récupération des messages" })
    }
})

export default router