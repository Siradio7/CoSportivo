import db from "../config/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    const { first_name, last_name, email, password, id_favourite_team, brand, color, nb_seats, license_plate } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const registration_date = new Date().toISOString().slice(0, 19).replace("T", " ")

    const checkUserQuery = "SELECT * FROM users WHERE email = ?"
    db.query(checkUserQuery, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de l'inscription" })
        }

        if (result.length > 0) {
            return res.status(409).json({ message: "Cet utilisateur existe déjà" })
        }

        const insertQuery = "INSERT INTO users (first_name, last_name, email, password, id_favourite_team, registration_date) VALUES (?, ?, ?, ?, ?, ?)"
        db.query(insertQuery, [first_name, last_name, email, hashedPassword, id_favourite_team, registration_date], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de l'inscription" })
            }

            const id_user = result.insertId
            const insertCarQuery = "INSERT INTO cars (id_user, brand, color, nb_seats, license_plate) VALUES (?, ?, ?, ?, ?)"
            db.query(insertCarQuery, [id_user, brand, color, nb_seats, license_plate], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de l'ajout des informations du véhicule" })
                }

                return res.status(201).json({ message: "Inscription réussie" })
            })
        })
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

        return res.status(200).json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, id_favourite_team: user.id_favourite_team } })
    })
}

const checkEmail = (req, res) => {
    const { email } = req.body
    const request = "SELECT * FROM users WHERE email = ?"

    db.query(request, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la vérification de l'email" })
        }

        if (result.length > 0) {
            return res.status(200).json({ exists: true })
        }

        return res.status(200).json({ exists: false })
    })
}

export { register, login }