import { useNavigate } from "react-router-dom"
import Header from "../components/header"
import Button from "../components/button"
import { Home, MapPinOff } from "lucide-react"
import { motion } from "framer-motion"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50">
            <Header />

            <motion.div 
                className="flex flex-col items-center justify-center p-6 text-center h-[calc(100vh-80px)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-cyan-200 rounded-full blur-3xl opacity-20 transform scale-150"></div>
                    
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="relative"
                    >
                        <div className="w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center">
                            <MapPinOff size={80} className="text-cyan-600" strokeWidth={1.5} />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-lg"
                >
                    <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 mb-4">404</h1>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Oups ! Cette page n'existe pas.</h2>
                    
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Peut-être que vous avez mal tapé l'URL ou que cette page a été déplacée vers une autre destination.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex justify-center w-full"
                    >
                        <Button
                            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-cyan-100 transition-all"
                            onClick={() => navigate("/")}
                        >
                            <Home size={18} />
                            Retour à l'accueil
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default NotFound
