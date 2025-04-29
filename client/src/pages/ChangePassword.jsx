import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Header from "../components/header"
import Button from "../components/button"
import Loader from "../components/loader"
import { Lock, CheckCircle, EyeOff, Eye, Mail } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

const ChangePassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onTouched"
    })
    
    const newPassword = watch("newPassword", "")
    const onSubmit = async (data) => {
        setIsSubmitting(true)

        try {
            const response = await fetch(`${API_URL}/users/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.email,
                    new_password: data.newPassword
                })
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success("Mot de passe modifié avec succès !")
                setTimeout(() => {
                    navigate("/login")
                }, 1500)
            } else {
                toast.error(responseData.message || "Erreur lors de la modification du mot de passe")
            }
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Une erreur est survenue lors de la modification du mot de passe")
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword)
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>
            
            <div className="max-w-2xl mx-auto p-4 md:p-6 relative z-10">
                {isSubmitting ? (
                    <div className="flex-1 flex items-center justify-center mt-20">
                        <Loader />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
                                <Lock className="w-8 h-8 text-cyan-600" />
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            Réinitialiser votre mot de passe
                        </h1>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-cyan-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                        {...register("email", { 
                                            required: "Ce champ est requis",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Adresse email invalide"
                                            }
                                        })}
                                        placeholder="nom@exemple.com"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.newPassword ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-cyan-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                        {...register("newPassword", { 
                                            required: "Ce champ est requis",
                                            minLength: {
                                                value: 8,
                                                message: "Le mot de passe doit contenir au moins 8 caractères"
                                            }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleNewPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.newPassword ? (
                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Minimum 8 caractères
                                    </p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-cyan-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                        {...register("confirmPassword", { 
                                            required: "Ce champ est requis",
                                            validate: value => value === newPassword || "Les mots de passe ne correspondent pas"
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all text-base font-medium"
                                    icon={<CheckCircle size={18} />}
                                >
                                    Réinitialiser mon mot de passe
                                </Button>
                                
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all text-base font-medium"
                                >
                                    Retour à la connexion
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default ChangePassword