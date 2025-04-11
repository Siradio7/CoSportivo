import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import checkToken from "./middlewares/checkToken.js"
import footballDataRoutes from "./routes/footballData.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/api", checkToken, footballDataRoutes)

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`)
})