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
                setTimeout(() => {
                    navigate("/matches")
                }, 1000)
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
                    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
                        <Loader />
                    </div>
                ) : (
                    <div className="w-full flex-1 flex items-center justify-center">
                        <form className="w-sm mx-auto bg-gray-200 px-5 py-8 rounded-sm shadow-md" onSubmit={handleSubmit(handleLogin)}>
                            <h1 className="text-4xl text-cyan-500 font-bold text-center mb-3">Connexion</h1>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input {...register("email")} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" placeholder="name@gmail.com" required />
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
                                <input {...register("password")} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" required />
                            </div>

                            <div className="mb-5">
                                <Link to="/register" className="text-sm text-cyan-500  hover:underline">Pas de compte ?</Link>
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