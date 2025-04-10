import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`)
})