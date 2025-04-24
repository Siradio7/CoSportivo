import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import Header from "../components/header"
import Button from "../components/button"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Settings = () => {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: ""
        }
    })
    const [myData, setMyData] = useState([])
    const [favouriteTeamData, setFavouriteTeamData] = useState(null)
    const [loading, setLoading] = useState(false)
    const API_URL = import.meta.env.VITE_DEV_BACKEND_URL
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const fetchFavouriteTeamData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/teams/${user.id_favourite_team}`)
                const data = await response.json()

                setFavouriteTeamData(data)
            } catch (error) {
                console.error("Erreur lors du chargement des équipes :", error)
                setTimeout(fetchFavouriteTeamData, 2000)
            }
        }

        fetchFavouriteTeamData()
    }, [user.id_favourite_team, API_URL])

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const response = await fetch(`${API_URL}/users/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                const data = await response.json()
                setMyData(data)

                setValue("first_name", data.first_name)
                setValue("last_name", data.last_name)
                setValue("email", data.email)
            } catch (err) {
                toast.error("Une erreur s'est produite lors du chargement de vos informations")
            }
        }
        fetchMyData()
    }, [user.id, API_URL, setValue])


    const onSubmit = async (data) => {
        const { first_name, last_name, email } = data

        if (!first_name || !last_name || !email) {
            toast.error("Veuillez remplir tous les champs")
            return
        }

        if (first_name === myData.first_name && last_name === myData.last_name && email === myData.email) {
            toast.error("Aucune modification apportée")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Adresse e-mail invalide")
            return
        }

        if (email !== myData.email) {
            try {
                const response = await fetch(`${API_URL}/auth/check-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ email })
                })

                const res = await response.json()
                if (res.exists) {
                    toast.error("Cette adresse e-mail est déjà utilisée")
                    return
                }
            } catch (error) {
                toast.error("Erreur lors de la vérification de l'e-mail")
                return
            }
        }

        try {
            setLoading(true)

            const response = await fetch(`${API_URL}/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    email,
                    id_favourite_team: user.id_favourite_team
                })
            })

            if (!response.ok) {
                toast.error("Erreur lors de la mise à jour des informations")
                setLoading(false)
                return
            }

            toast.success("Informations mises à jour avec succès")

            const updatedUser = {
                ...user,
                first_name,
                last_name,
                email
            }
            localStorage.setItem("user", JSON.stringify(updatedUser))

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            toast.error("Une erreur est survenue pendant la mise à jour")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="flex flex-col items-center justify-center px-4 py-10">
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow space-y-8"
                >
                    <h2 className="text-3xl font-semibold text-center text-cyan-600">
                        Modifier mes informations
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Prénom
                            </label>
                            <input {...register("first_name")} type="text" className="input" defaultValue={myData.first_name} />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <input {...register("last_name")} type="text" className="input" defaultValue={myData.last_name} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input {...register("email")} type="email" className="input" defaultValue={myData.email} />
                        </div>
                    </div>

                    {favouriteTeamData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-6 rounded-2xl mt-8 shadow border border-gray-200"
                        >
                            <h3 className="text-2xl font-bold text-cyan-700 mb-6 text-center">🏟️ Mon club favori</h3>

                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="h-28 w-28 rounded-full bg-gray-100 p-2 shadow flex items-center justify-center">
                                    <img
                                        src={favouriteTeamData.crest}
                                        alt="Logo du club"
                                        className="h-full w-full object-contain"
                                    />
                                </div>


                                <div className="flex-1 space-y-3">
                                    <h4 className="text-xl font-semibold text-gray-800">{favouriteTeamData.name}</h4>

                                    <p className="text-sm text-gray-600">
                                        <strong>Pays :</strong> {favouriteTeamData.area?.name || "N/A"}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        <strong>Fondé en :</strong> {favouriteTeamData.founded || "N/A"}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        <strong>Stade :</strong> {favouriteTeamData.venue || "N/A"}
                                    </p>
                                    {favouriteTeamData.website && (
                                        <a
                                            href={favouriteTeamData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-2 text-cyan-600 underline text-sm"
                                        >
                                            🔗 Site officiel
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-md font-semibold text-gray-700 mb-2">Compétitions en cours :</h4>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                    {favouriteTeamData.runningCompetitions.map((comp) => (
                                        <li key={comp.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                                            {comp.emblem && <img src={comp.emblem} alt={comp.name} className="h-5 w-5" />}
                                            {comp.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                            {loading ? "Enregistrement..." : "Sauvegarder les modifications"}
                        </Button>
                    </div>
                </motion.form>
            </main>
        </div>
    )
}

export default Settings