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

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 max-w-2xl md:max-w-3xl leading-snug sm:leading-tight"
                >
                    En partageant votre trajet,<br />
                    <span className="text-cyan-600">vous partagez l'expérience du match !</span>
                </motion.h2>

                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    src={illustration}
                    alt="Illustration covoiturage"
                    className="w-[260px] sm:w-[360px] md:w-[400px] mb-12"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg text-gray-600 mb-10 max-w-xl"
                >
                    Rejoignez la communauté des supporters qui allient <strong>passion</strong>, <strong>écologie</strong> et <strong>économie</strong> grâce au covoiturage sportif.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                    <Link to="/trips">
                        <Button className="w-64 rounded-xl transition-transform hover:scale-105 duration-200" variant="primary">
                            Voir les covoiturages
                        </Button>
                    </Link>

                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button className="w-64 rounded-xl transition-transform hover:scale-105 duration-200" variant="secondary">
                                Rejoindre la communauté
                            </Button>
                        </Link>
                    )}
                </motion.div>

                

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                    {[
                        { icon: "🚗", text: "Trajets partout en France" },
                        { icon: "♻️", text: "Économie + Écologie" },
                        { icon: "🤝", text: "Rencontres entre passionnés" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                            className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-center"
                        >
                            <div className="text-4xl sm:text-5xl mb-2">{item.icon}</div>
                            <p className="font-semibold text-gray-700 text-base sm:text-lg">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Home
