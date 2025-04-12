import { jwtDecode } from "jwt-decode"
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('token')

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token)
            const currentTime = Date.now() / 1000

            return decoded.exp < currentTime
        } catch (error) {
            return true
        }
    }

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token')
        
        return <Navigate to="/login" />
    }

    return element
}

export default PrivateRoute

