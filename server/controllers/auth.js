import db from "../config/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    const { first_name, last_name, email, password, favourite_team } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const request = "INSERT INTO users (first_name, last_name, email, password, favourite_team) VALUES (?, ?, ?, ?, ?)"

    db.query(request, [first_name, last_name, email, hashedPassword, favourite_team], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de l'inscription" })
        }

        return res.status(201).json({ message: "Inscription réussie" })
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const request = "SELECT * FROM users WHERE email = ?"

    db.query(request, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la connexion" })
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Identifiants invalides" })
        }

        const user = result[0]
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants invalides" })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })

        return res.status(200).json({ token })
    })
}

export { register, login }