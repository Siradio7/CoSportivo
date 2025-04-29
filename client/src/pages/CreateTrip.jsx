import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import Header from "../components/header"
import Button from "../components/button"
import { Car, Clock, CreditCard, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const CreateTrip = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const { id: match_id } = useParams()
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const driver_id = user ? user.id : null

    const watchFields = watch(["departure_location", "arrival_location", "departure_time", "available_seats", "price"])

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            driver_id,
            match_id: parseInt(match_id),
            available_seats: parseInt(data.available_seats),
            price: parseInt(data.price)
        }

        const response = await fetch(`${API_URL}/trips/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        })

        if (response.ok) {
            toast.success("🚗 Trajet créé avec succès !")
            navigate(`/trips/${match_id}`)	
        } else {
            toast.error("❌ Erreur lors de la création du trajet")
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            } 
        }
    }
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />

            <motion.main 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl z-10 mx-auto mt-10 mb-10 bg-white p-8 rounded-2xl shadow-xl"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
                            <Car size={32} className="text-cyan-600" />
                        </div>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">Proposer un covoiturage</h2>
                    <p className="text-gray-500 mt-2">Partagez votre trajet et réduisez les coûts de transport</p>
                </div>

                <motion.form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="group">
                        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
                            <MapPin size={16} className="mr-1 text-cyan-600" />
                            Lieu de départ
                        </label>
                        <input
                            type="text"
                            placeholder="Ex : 18 Rue de la Paix, Paris"
                            {...register("departure_location", { required: "Lieu de départ requis" })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 group-hover:border-cyan-400 transition-all duration-300"
                        />
                        {errors.departure_location && <p className="text-sm text-red-500 mt-1">{errors.departure_location.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="group">
                        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
                            <MapPin size={16} className="mr-1 text-cyan-600" />
                            Lieu d'arrivée
                        </label>
                        <input
                            type="text"
                            placeholder="Ex : Stade de France, Saint-Denis"
                            {...register("arrival_location", { required: "Lieu d'arrivée requis" })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 group-hover:border-cyan-400 transition-all duration-300"
                        />
                        {errors.arrival_location && <p className="text-sm text-red-500 mt-1">{errors.arrival_location.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="group">
                        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
                            <Clock size={16} className="mr-1 text-cyan-600" />
                            Heure de départ
                        </label>
                        <input
                            type="time"
                            {...register("departure_time", { required: "Heure de départ requise" })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 group-hover:border-cyan-400 transition-all duration-300"
                        />
                        {errors.departure_time && <p className="text-sm text-red-500 mt-1">{errors.departure_time.message}</p>}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <motion.div variants={itemVariants} className="group">
                            <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
                                <Users size={16} className="mr-1 text-cyan-600" />
                                Places disponibles
                            </label>
                            <input
                                type="number"
                                placeholder="Ex : 3"
                                {...register("available_seats", {
                                    required: "Nombre de places requis",
                                    min: { value: 1, message: "Au moins une place" }
                                })}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 group-hover:border-cyan-400 transition-all duration-300"
                            />
                            {errors.available_seats && <p className="text-sm text-red-500 mt-1">{errors.available_seats.message}</p>}
                        </motion.div>

                        <motion.div variants={itemVariants} className="group">
                            <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
                                <CreditCard size={16} className="mr-1 text-cyan-600" />
                                Prix par personne (€)
                            </label>
                            <input
                                type="number"
                                placeholder="Ex : 5"
                                step="0.01"
                                {...register("price", {
                                    required: "Prix requis",
                                    min: { value: 1, message: "Le prix doit être d'au moins 1€" }
                                })}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 group-hover:border-cyan-400 transition-all duration-300"
                            />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                        </motion.div>
                    </div>

                    {watchFields.every(Boolean) && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="p-5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl text-sm text-gray-800 shadow-sm"
                        >
                            <p className="mb-3 font-semibold text-center text-cyan-700 flex items-center justify-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                                    📝
                                </span>
                                Résumé de ton trajet
                            </p>
                            <div className="space-y-2 pl-2">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-cyan-600 flex-shrink-0" />
                                    <div><strong>Départ :</strong> {watchFields[0]}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-cyan-600 flex-shrink-0" />
                                    <div><strong>Arrivée :</strong> {watchFields[1]}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-cyan-600 flex-shrink-0" />
                                    <div><strong>Heure :</strong> {watchFields[2]}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-cyan-600 flex-shrink-0" />
                                    <div><strong>Places dispos :</strong> {watchFields[3]}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-cyan-600 flex-shrink-0" />
                                    <div><strong>Prix :</strong> {watchFields[4]} € / personne</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3"
                    >
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium shadow-lg shadow-cyan-100 transition-all"
                        >
                            ✨ Créer le trajet
                        </Button>
                    </motion.div>
                </motion.form>
            </motion.main>

            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>
        </div>
    )
}

export default CreateTrip
