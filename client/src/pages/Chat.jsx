import { useEffect, useState, useRef } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import Header from "../components/header"
import { getSocket, disconnectSocket } from "../sockets/socket"
import { Send, ArrowLeft, MessageSquare, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

const Chat = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const messagesEndRef = useRef(null)
    const chatContainerRef = useRef(null)
    const socket = getSocket()
    const user = JSON.parse(localStorage.getItem("user"))
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const returnPath = location.state?.from || "/my-trips"
    const messagesLoadedRef = useRef(false)

    useEffect(() => {
        const fetchTripData = async () => {
            try {
                const response = await fetch(`${API_URL}/trips/${tripId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Impossible de récupérer les informations du trajet")
                }

                const data = await response.json()
                setTrip(data)
            } catch (err) {
                setError("Erreur lors du chargement des informations du trajet")
                toast.error("Erreur de chargement")
            }
        }

        fetchTripData()
    }, [tripId, API_URL])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_URL}/messages/${tripId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Impossible de récupérer les messages")
                }

                const data = await response.json()
                setMessages(data)
                messagesLoadedRef.current = true
                
                if (trip !== null) {
                    setLoading(false)
                }
            } catch (err) {
                console.error("Erreur lors du chargement des messages:", err)
                setError("Erreur lors du chargement des messages")
                setLoading(false)
            }
        }

        if (tripId) {
            fetchMessages()
        }
    }, [tripId, API_URL, trip])

    useEffect(() => {
        if (tripId) {
            socket.emit("joinTrip", { tripId })

            socket.on("receiveMessage", (data) => {
                if (data && data.message) {
                    setMessages((prev) => [...prev, data])
                }
            })
            
            socket.on("userJoined", (message) => {
                toast.success(message, {
                    icon: "👋",
                    style: {
                        borderRadius: '10px',
                        background: '#E9F7FF',
                        color: '#0284C7',
                    },
                    duration: 3000
                })
            })
        }

        return () => {
            socket.off("receiveMessage")
            socket.off("userJoined")
            disconnectSocket()
        }
    }, [tripId, socket])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault()
        
        if (message.trim() === "") return

        socket.emit("sendMessage", {
            message: message.trim(),
            tripId,
            user
        })

        setMessage("")
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ""
        
        const date = new Date(timestamp)
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    const formatMessageDate = (timestamp) => {
        if (!timestamp) return ""
        
        const date = new Date(timestamp)
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long'
        })
    }

    const groupMessagesByDate = () => {
        const groups = {}
        
        messages.forEach(msg => {
            const date = formatMessageDate(msg.created_at || msg.time)
            if (!groups[date]) groups[date] = []
            groups[date].push(msg)
        })
        
        return groups
    }

    const getInitials = (name) => {
        if (!name) return "?"
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const messageGroups = groupMessagesByDate()

    const handleGoBack = () => {
        navigate(returnPath)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
            <Header />
            
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
                {loading ? (
                    <div className="text-center my-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Chargement de la conversation...</p>
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
                    >
                        {error}
                    </motion.div>
                ) : (
                    <>
                        <div className="bg-white rounded-t-2xl p-3 sm:p-4 shadow-md border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <button 
                                    onClick={handleGoBack}
                                    className="text-gray-600 hover:text-gray-800 transition flex items-center gap-1"
                                >
                                    <ArrowLeft size={18} />
                                    <span className="text-sm sm:text-base">Retour</span>
                                </button>
                                <div className="flex items-center gap-1 text-cyan-600">
                                    <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    <span className="font-medium text-sm sm:text-base">Chat de trajet</span>
                                </div>
                            </div>
                            
                            {trip && (
                                <div className="bg-cyan-50 rounded-xl p-2 sm:p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center border border-cyan-100 gap-2">
                                    <div className="overflow-hidden">
                                        <h2 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                                            {trip.departure_location} → {trip.arrival_location}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            🕒 Départ le {new Date().toLocaleDateString('fr-FR')} à {trip.departure_time?.slice(0, 5)}
                                        </p>
                                    </div>
                                    <div className="bg-cyan-100 text-cyan-800 p-1 px-2 rounded-lg text-xs font-medium flex items-center self-start sm:self-auto">
                                        <Users size={14} className="mr-1" />
                                        {trip.available_seats} places
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div 
                            ref={chatContainerRef}
                            className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-4 overflow-y-auto h-full min-h-0 flex flex-col shadow-inner"
                            style={{ height: 'calc(100vh - 280px)' }}
                        >
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center my-12 text-gray-500">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <MessageSquare size={32} className="text-cyan-600" />
                                    </div>
                                    <p className="font-medium text-gray-700">Aucun message pour le moment</p>
                                    <p className="text-sm mt-2 max-w-xs">Soyez le premier à envoyer un message pour communiquer avec les autres passagers !</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {Object.entries(messageGroups).map(([date, dateMessages]) => (
                                        <div key={date}>
                                            <div className="flex justify-center my-4">
                                                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                                    {date}
                                                </div>
                                            </div>
                                            
                                            {dateMessages.map((msg, index) => {
                                                const isCurrentUser = msg.user_id === user.id || msg.user?.id === user.id
                                                const username = msg.username || msg.user?.first_name || "Utilisateur"
                                                
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        {!isCurrentUser && (
                                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center mr-1 sm:mr-2 flex-shrink-0 text-xs font-bold">
                                                                {getInitials(username)}
                                                            </div>
                                                        )}
                                                        
                                                        <div className="flex flex-col max-w-[75%] sm:max-w-[70%]">
                                                            {!isCurrentUser && (
                                                                <span className="text-xs text-gray-500 ml-1 sm:ml-2 mb-0.5 sm:mb-1">
                                                                    {username}
                                                                </span>
                                                            )}
                                                            
                                                            <div 
                                                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm ${
                                                                    isCurrentUser 
                                                                        ? 'bg-cyan-600 text-white rounded-tr-none ml-auto' 
                                                                        : 'bg-white text-gray-800 rounded-tl-none'
                                                                }`}
                                                            >
                                                                <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{msg.message}</p>
                                                                <p className={`text-[10px] text-right mt-1 ${isCurrentUser ? 'text-cyan-100' : 'text-gray-500'}`}>
                                                                    {formatTime(msg.created_at || msg.time)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        {isCurrentUser && (
                                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-100 flex items-center justify-center ml-1 sm:ml-2 flex-shrink-0 text-xs font-bold text-cyan-800">
                                                                {getInitials(user.first_name + ' ' + user.last_name)}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <form 
                            onSubmit={sendMessage}
                            className="bg-white rounded-b-2xl shadow-md p-2 sm:p-4 flex items-center gap-2 border border-gray-200 border-t-0"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-xl py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Écrire un message..."
                            />
                            <button
                                type="submit"
                                className={`p-2 sm:p-3 rounded-xl transition-colors duration-200 ${
                                    message.trim() === "" 
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                    : "bg-cyan-600 text-white hover:bg-cyan-700"
                                }`}
                                disabled={message.trim() === ""}
                                aria-label="Envoyer"
                            >
                                <Send size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default Chat