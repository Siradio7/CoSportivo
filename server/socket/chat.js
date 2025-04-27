import { dbQuery } from "../utils/dbQuery.js"

const setupChat = (io) => {
    io.on('connection', (socket) => {

        socket.on("joinTrip", async ({ tripId }) => {
            try {
                const messages = await dbQuery("SELECT * FROM messages WHERE trip_id = ?", [tripId])

                socket.emit("loadMessages", messages)
                socket.broadcast.to(tripId).emit("userJoined", "Un utilisateur a rejoint la conversation")
                socket.join(tripId)
            } catch (err) {
                socket.emit("error", { message: "Erreur lors de la récupération des messages" })
                console.error("Erreur récupération messages:", err)
            }
        })

        socket.on("sendMessage", async ({ message, tripId, user }) => {
            try {
                const sql = "INSERT INTO messages (trip_id, user_id, username, message) VALUES (?, ?, ?, ?)"

                await dbQuery(sql, [tripId, user.id, user.first_name, message])
                io.to(tripId).emit("receiveMessage", {
                    message,
                    user,
                    time: new Date()
                })
            } catch (err) {
                socket.emit("error", { message: "Erreur lors de l'envoi du message" })
                console.error("Erreur envoi message:", err)
            }
        })
    })
}

export default setupChat
