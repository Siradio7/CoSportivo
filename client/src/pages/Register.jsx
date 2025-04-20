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
        <div className="h-screen flex flex-col bg-gray-50">
            <Header />

            {
                isSubmitting ? (
                    <div className="h-screen flex items-center justify-center bg-gray-100">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center px-4">
                        <form
                            onSubmit={handleSubmit(handleRegister)}
                            className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg space-y-8"
                        >
                            <h2 className="text-3xl font-semibold text-center text-cyan-600">
                                Créer un compte
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Prénom
                                    </label>
                                    <input {...register("first_name")} type="text" className="input" required />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Nom
                                    </label>
                                    <input {...register("last_name")} type="text" className="input" required />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input {...register("email")} type="email" className="input" required />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Mot de passe
                                    </label>
                                    <input {...register("password")} type="password" className="input" required />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Confirmation du mot de passe
                                    </label>
                                    <input {...register("confirmation_password")} type="password" className="input" required />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Équipe favorite
                                    </label>
                                    <select {...register("id_favourite_team")} className="input" required>
                                        <option value="">Sélectionnez une équipe</option>
                                        {teams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <Link to="/login" className="text-sm text-cyan-600 hover:underline text-left w-full md:w-auto">
                                    Déjà un compte ?
                                </Link>

                                <Button type="submit" icon={<LogIn size={16} />} className="w-full md:w-auto">
                                    S'inscrire
                                </Button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    )
}

export default Register
