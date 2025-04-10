import express from "express"
import xss from "xss-clean"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(xss())
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`)
})