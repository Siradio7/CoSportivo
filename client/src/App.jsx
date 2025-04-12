import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PrivateRoute from "./utils/privateRoute"
import Dashboard from "./pages/Dashboard"

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
                <Route
                    path="/dashboard"
                    element={<PrivateRoute element={<Dashboard />} />}
                />
            </Routes>
        </Router>
    )
}

export default App
