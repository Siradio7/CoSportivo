import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"
import { Navigate } from "react-router-dom"


const PrivateRoute = ({ element }) => {
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
        localStorage.removeItem('user')
        toast.error("Session expirée, veuillez vous reconnecter.")
        
        return <Navigate to="/login" />
    }

    return element
}

export default PrivateRoute

