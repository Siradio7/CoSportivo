import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PrivateRoute from "./utils/privateRoute"
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import CreateTrip from "./pages/CreateTrip"
import Matches from "./pages/Matches"

const App = () => {
    return (
        <Router>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000
                }}
            />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/matches" element={<PrivateRoute element={<Matches />} />} />
                <Route
                    path="/dashboard"
                    element={<PrivateRoute element={<Dashboard />} />}
                />
            </Routes>
        </Router>
    )
}

export default App
