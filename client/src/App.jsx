import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PrivateRoute from "./utils/privateRoute"
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import Matches from "./pages/Matches"
import Trips from "./pages/Trips"
import NotFound from "./pages/NotFound"
import CreateTrip from "./pages/CreateTrip"
import Settings from "./pages/Settings"

const App = () => {
    return (
        <Router>
            <Toaster
                position="bottom-right"
                containerStyle={{ margin: "8px" }}
                gutter={12}
                toastOptions={{
                    success: { duration: 3500 },
                    error: { duration: 4000 },
                    style: {
                        fontSize: "16px",
                        padding: "16px 24px"
                    },
                }}
            />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/matches" element={<PrivateRoute element={<Matches />} />} />
                <Route path="/trips/:id" element={<PrivateRoute element={<Trips />} />} />
                <Route path="/create-trip/:id" element={<PrivateRoute element={<CreateTrip />} />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
