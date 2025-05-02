import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Header from "../components/header"
import Button from "../components/button"
import Loader from "../components/loader"
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react"
import toast from "react-hot-toast"

const Register = () => {
    const [teams, setTeams] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    
    const password = watch("password", "")

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${API_URL}/api/teams`)
                const data = await response.json()

                setTeams(data)
            } catch (error) {
                console.error("Erreur lors du chargement des équipes :", error)
                setTimeout(fetchTeams, 2000)
            }
        }

        fetchTeams()
    }, [])

    const handleRegister = async (data) => {
        if (data.password !== data.confirm_password) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        setIsSubmitting(true)

        try {
            const { confirm_password, ...formData } = data

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (response.ok) {
                toast.success("Compte créé avec succès !")
                navigate("/login")
            } else {
                toast.error(result.message || "Une erreur s'est produite lors de l'inscription")
            }
        } catch (error) {
            toast.error("Une erreur s'est produite lors de l'inscription")
            console.error("Error during registration:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>

            {
                isSubmitting ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 z-10">
                        <form
                            onSubmit={handleSubmit(handleRegister)}
                            className="w-full max-w-md bg-white px-8 py-10 rounded-2xl shadow-lg space-y-6 transform transition-all hover:shadow-xl border border-gray-100"
                        >
                            <h2 className="text-3xl font-bold text-center text-cyan-600 mb-6">Inscription</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Prénom</label>
                                    <div className="relative">
                                        <input
                                            {...register("first_name", { required: "Le prénom est requis" })}
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pl-10"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <User size={18} />
                                        </div>
                                    </div>
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
                                    <div className="relative">
                                        <input
                                            {...register("last_name", { required: "Le nom est requis" })}
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pl-10"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <User size={18} />
                                        </div>
                                    </div>
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <input
                                        {...register("email", { 
                                            required: "L'email est requis",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Adresse email invalide"
                                            }
                                        })}
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pl-10"
                                        placeholder="name@gmail.com"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        {...register("password", { 
                                            required: "Le mot de passe est requis",
                                            minLength: {
                                                value: 8,
                                                message: "Le mot de passe doit contenir au moins 8 caractères"
                                            }
                                        })}
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pl-10"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password ? (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <input
                                        {...register("confirm_password", { 
                                            required: "La confirmation du mot de passe est requise",
                                            validate: value => value === password || "Les mots de passe ne correspondent pas"
                                        })}
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pl-10"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirm_password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Équipe favorite
                                </label>
                                <select 
                                    {...register("id_favourite_team")} 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
                                    required
                                >
                                    <option value="">Sélectionnez une équipe</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-center">
                                <Link to="/login" className="text-cyan-600 hover:text-cyan-800 hover:underline transition-colors text-sm">
                                    Déjà un compte ? Se connecter
                                </Link>
                            </div>

                            <Button 
                                type="submit" 
                                icon={<UserPlus size={16} />} 
                                className="w-full py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-base font-medium mt-4"
                            >
                                S'inscrire
                            </Button>
                        </form>
                    </div>
                )
            }
        </div>
    )
}

export default Register
