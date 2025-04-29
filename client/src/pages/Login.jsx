import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import Loader from "../components/loader"

import Header from "../components/header"
import Button from "../components/button"

const API_URL = import.meta.env.VITE_DEV_BACKEND_URL

const Login = () => {

    const { register, handleSubmit, reset } = useForm()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogin = async (data) => {
        setIsSubmitting(true)

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            setIsSubmitting(false)

            if (response.ok) {
                reset()

                const res = await response.json()
                localStorage.setItem("token", res.token)
                localStorage.setItem("user", JSON.stringify(res.user))
                toast.success("Connexion réussie !")
                navigate("/matches")
            } else {
                toast.error("Email ou mot de passe incorrect")
            }
        } catch (error) {
            toast.error("Une erreur s'est produite lors de la connexion")
            console.error("Error during login:", error)
        }
    }

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
                            onSubmit={handleSubmit(handleLogin)}
                            className="w-full max-w-md bg-white px-8 py-10 rounded-2xl shadow-lg space-y-6 transform transition-all hover:shadow-xl border border-gray-100"
                        >
                            <h2 className="text-3xl font-bold text-center text-cyan-600 mb-6">Connexion</h2>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    placeholder="name@gmail.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
                                <input
                                    {...register("password")}
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <Link to="/register" className="text-cyan-600 hover:text-cyan-800 hover:underline transition-colors">
                                    Pas de compte ?
                                </Link>
                                <Link to={"/change-password"} className="text-gray-500 hover:text-cyan-600 cursor-pointer transition-colors">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <Button 
                                type="submit" 
                                icon={<LogIn size={16} />} 
                                className="w-full py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-base font-medium mt-4"
                            >
                                Se connecter
                            </Button>
                        </form>
                    </div>
                )
            }
        </div>
    )
}

export default Login