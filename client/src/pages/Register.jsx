import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import Loader from "../components/loader"

import Header from "../components/header"
import Button from "../components/button"

const API_URL = import.meta.env.VITE_DEV_BACKEND_URL

const Register = () => {
    const [teams, setTeams] = useState([])
    const { register, handleSubmit, reset } = useForm()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

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
        if (data.password !== data.confirmation_password) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }
        
        if (!data.id_favourite_team) {
            toast.error("Veuillez sélectionner une équipe favorite")
            return
        }

        if (!data.first_name || !data.last_name || !data.email || !data.password) {
            toast.error("Veuillez remplir tous les champs")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            const res = await response.json()
            setIsSubmitting(false)

            if (response.ok) {
                reset()

                toast.success("Inscription réussie")
                setTimeout(() => {
                    navigate("/login")
                }, 1000)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Erreur lors de l'inscription")
            console.error("Error during registration:", error)
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
                        <form className="w-sm mx-auto bg-gray-200 px-5 py-8 rounded-sm shadow-md" onSubmit={handleSubmit(handleRegister)}>
                            <h1 className="text-4xl text-cyan-500 font-bold text-center mb-3">Inscription</h1>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Prénom</label>
                                <input {...register("first_name")} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" required />
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                                <input {...register("last_name")} type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" placeholder="name@gmail.com" required />
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input {...register("email")} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" placeholder="name@gmail.com" required />
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
                                <input {...register("password")} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" required />
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Confirmation du mot de passe</label>
                                <input {...register("confirmation_password")} type="password" id="confirmation_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500" required />
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Équipe favorite</label>
                                <select
                                    {...register("id_favourite_team")}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-cyan-500"
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

                            <div className="mb-5">
                                <Link to="/register" className="text-sm text-cyan-500  hover:underline">Déjà un compte ?</Link>
                            </div>

                            <Button type="submit" icon={<LogIn size={16} />} className="w-full">
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