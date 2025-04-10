import jwt from 'jsonwebtoken'

const checkToken = (req, res, next) => {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé: Token manquant' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide ou expiré' })
        }

        req.user = user
        next()
    })
}

export default checkToken