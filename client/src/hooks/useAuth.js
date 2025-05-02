import { jwtDecode } from "jwt-decode"

const token = localStorage.getItem("token")

const isTokenExpired = () => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000

        return decoded.exp < currentTime
    } catch (error) {
        return true
    }
}

const isAuthenticated = () => {
    const user = localStorage.getItem("user")

    return user && !isTokenExpired(token)
}

export { isAuthenticated, isTokenExpired }
