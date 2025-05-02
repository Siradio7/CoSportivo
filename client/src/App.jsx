import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PrivateRoute from "./utils/privateRoute"
import Register from "./pages/Register"
import Matches from "./pages/Matches"
import Trips from "./pages/Trips"
import NotFound from "./pages/NotFound"
import CreateTrip from "./pages/CreateTrip"
import Settings from "./pages/Settings"
import MyTrips from "./pages/MyTrips"
import Chat from "./pages/Chat"
import JoinTrip from "./pages/JoinTrip"
import ChangePassword from "./pages/ChangePassword"


const App = () => {
    return (
        <Router>
            <Analytics />
            <SpeedInsights />
            <Toaster
                position="bottom-right"
                gutter={16}
                toastOptions={{
                    success: { 
                        duration: 3500,
                        icon: '✅',
                        style: {
                            background: '#ecfdf5',
                            color: '#065f46',
                            border: '1px solid #d1fae5'
                        }
                    },
                    error: { 
                        duration: 4000,
                        icon: '❌',
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #fee2e2'
                        }
                    },
                    style: {
                        fontSize: "16px",
                        maxWidth: '100%',
                        padding: "16px 24px",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        fontWeight: "500",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb"
                    },
                    className: '',
                    custom: {
                        info: {
                            icon: 'ℹ️',
                            style: {
                                background: '#eff6ff',
                                color: '#1e40af',
                                border: '1px solid #dbeafe'
                            }
                        },
                        warning: {
                            icon: '⚠️',
                            style: {
                                background: '#fffbeb',
                                color: '#92400e',
                                border: '1px solid #fef3c7'
                            }
                        }
                    }
                }}
            />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/trips/:id" element={<PrivateRoute element={<Trips />} />} />
                <Route path="/my-trips" element={<PrivateRoute element={<MyTrips />} />} />
                <Route path="/create-trip/:id" element={<PrivateRoute element={<CreateTrip />} />} />
                <Route path="/join-trip/:tripId" element={<PrivateRoute element={<JoinTrip />} />} />
                <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
                <Route path="/chat/:tripId" element={<PrivateRoute element={<Chat />} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
