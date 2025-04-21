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
        <div className="h-screen flex flex-col bg-gray-100">
            <Header />

            {
                isSubmitting ? (
                    <div className="h-screen flex items-center justify-center bg-gray-100">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center px-4">
                        <form
                            onSubmit={handleSubmit(handleLogin)}
                            className="w-full max-w-md bg-white px-8 py-10 rounded-2xl shadow-lg space-y-6"
                        >
                            <h2 className="text-3xl font-semibold text-center text-cyan-600">Connexion</h2>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="input"
                                    placeholder="name@gmail.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
                                <input
                                    {...register("password")}
                                    type="password"
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <Link to="/register" className="text-cyan-600 hover:underline">
                                    Pas de compte ?
                                </Link>
                            </div>

                            <Button type="submit" icon={<LogIn size={16} />} className="w-full">
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