import Header from "../components/header"
import { Link } from "react-router-dom"
import Button from "../components/button"
import illustration from "../assets/illustration_covoiturage.svg"
import { motion } from "framer-motion"

const Home = () => {
    const isAuthenticated = localStorage.getItem("token") !== null

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10 md:py-16">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 sm:mb-8 max-w-2xl md:max-w-3xl leading-snug sm:leading-tight"
                >
                    En partageant votre trajet,<br />
                    <span className="text-cyan-600 relative inline-block">
                        vous partagez l'expérience du match !
                        <span className="absolute bottom-0 left-0 w-full h-[5px] bg-cyan-200 opacity-50 rounded-full -z-10"></span>
                    </span>
                </motion.h2>

                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    src={illustration}
                    alt="Illustration covoiturage"
                    className="w-[280px] sm:w-[380px] md:w-[420px] mb-10 sm:mb-12 drop-shadow-xl"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed"
                >
                    Rejoignez la communauté des supporters qui allient <strong className="text-cyan-700">passion</strong>, <strong className="text-green-600">écologie</strong> et <strong className="text-amber-600">économie</strong> grâce au covoiturage sportif.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16"
                >
                    <Link to="/trips">
                        <Button className="w-64 rounded-xl transition-all hover:scale-105 duration-200 shadow-md hover:shadow-lg py-3 text-base font-medium" variant="primary">
                            Voir les covoiturages
                        </Button>
                    </Link>

                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button className="w-64 rounded-xl transition-all hover:scale-105 duration-200 shadow-md hover:shadow-lg py-3 text-base font-medium" variant="secondary">
                                Rejoindre la communauté
                            </Button>
                        </Link>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl px-4">
                    { [
                        { icon: "🚗", text: "Trajets partout en France", color: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200" },
                        { icon: "♻️", text: "Économie + Écologie", color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200" },
                        { icon: "🤝", text: "Rencontres entre passionnés", color: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                            className={`flex flex-col items-center justify-center ${item.color} p-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-center border`}
                        >
                            <div className="text-4xl sm:text-5xl mb-3">{item.icon}</div>
                            <p className="font-semibold text-gray-700 text-base sm:text-lg">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>
        </div>
    )
}

export default Home
