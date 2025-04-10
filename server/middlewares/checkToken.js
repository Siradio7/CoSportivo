import jwt from 'jsonwebtoken'

const checkToken = (req, res, next) => {
    const header = req.headers['authorization']

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès refusé: Token invalide' });
    }

    const token = header && header.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé: Token manquant' })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide ou expiré' })
        }

        req.user = user
        next()
    })
}

export default checkToken