import db from "../config/database.js"
import bcrypt from "bcrypt"

const getUserById = (req, res) => {
    const { id } = req.params

    const request = "SELECT * FROM users WHERE id = ?"

    db.query(request, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" })
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" })
        }

        result[0].password = undefined

        return res.status(200).json(result[0])
    })
}

const updateUser = (req, res) => {
    const { id } = req.params
    const { first_name, last_name, email, id_favourite_team } = req.body

    const request = "UPDATE users SET first_name = ?, last_name = ?, email = ?, id_favourite_team = ? WHERE id = ?"

    db.query(request, [first_name, last_name, email, id_favourite_team, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" })
        }

        return res.status(200).json({ message: "Utilisateur mis à jour avec succès" })
    })
}

const deleteUser = (req, res) => {
    const { id } = req.params

    const request = "DELETE FROM users WHERE id = ?"

    db.query(request, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" })
        }

        return res.status(200).json({ message: "Utilisateur supprimé avec succès" })
    })
}

const updatePassword = async (req, res) => {
    const { id } = req.params
    const { password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const request = "UPDATE users SET password = ? WHERE id = ?"

    db.query(request, [hashedPassword, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" })
        }

        return res.status(200).json({ message: "Mot de passe mis à jour avec succès" })
    })
}

export { getUserById, updateUser, deleteUser, updatePassword }