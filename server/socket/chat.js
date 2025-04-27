import { dbQuery } from "../utils/dbQuery.js"

const setupChat = (io) => {
    io.on('connection', (socket) => {

        socket.on("joinTrip", async ({ tripId }) => {
            socket.join(tripId)
            socket.broadcast.to(tripId).emit("userJoined", "Un utilisateur a rejoint la conversation")
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
