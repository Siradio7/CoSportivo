import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/header"
import Button from "../components/button"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { User, Shield, Car, LogOut, Save, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Settings = () => {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: ""
        }
    })
    const navigate = useNavigate()
    const [myData, setMyData] = useState([])
    const [favouriteTeamData, setFavouriteTeamData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')
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

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/login")
        toast.success("Déconnexion réussie")
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-gray-100 relative overflow-hidden">
            <Header />

            <main className="container mx-auto z-10 px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-4xl font-bold text-center text-cyan-700 mb-8">
                        Paramètres
                    </h1>

                    <div className="bg-white rounded-2xl shadow-md p-2 mb-8">
                        <div className="flex flex-wrap md:flex-nowrap">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm md:text-base font-medium transition-all flex-1 
                                    ${activeTab === 'profile' 
                                        ? 'bg-cyan-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <User size={18} />
                                <span>Profil</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('team')}
                                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm md:text-base font-medium transition-all flex-1
                                    ${activeTab === 'team' 
                                        ? 'bg-cyan-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Shield size={18} />
                                <span>Club favori</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm md:text-base font-medium transition-all flex-1
                                    ${activeTab === 'account' 
                                        ? 'bg-cyan-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Car size={18} />
                                <span>Véhicule</span>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                                >
                                    <h2 className="text-2xl font-semibold text-cyan-700 mb-8 flex items-center gap-3">
                                        <User className="text-cyan-600" />
                                        Informations personnelles
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Prénom
                                            </label>
                                            <input 
                                                {...register("first_name")} 
                                                type="text" 
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none" 
                                                defaultValue={myData.first_name} 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Nom
                                            </label>
                                            <input 
                                                {...register("last_name")} 
                                                type="text" 
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none" 
                                                defaultValue={myData.last_name} 
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input 
                                                {...register("email")} 
                                                type="email" 
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none" 
                                                defaultValue={myData.email} 
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="px-6 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                                        >
                                            <LogOut size={18} />
                                            Se déconnecter
                                        </button>
                                        
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Enregistrement...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Sauvegarder
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'team' && (
                            <motion.div
                                key="team"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                            >
                                <h2 className="text-2xl font-semibold text-cyan-700 mb-8 flex items-center gap-3">
                                    <Shield className="text-cyan-600" />
                                    Mon club favori
                                </h2>

                                {favouriteTeamData ? (
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row gap-8 items-center">
                                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-50 to-cyan-50 p-3 shadow-md flex items-center justify-center border-4 border-white">
                                                <img
                                                    src={favouriteTeamData.crest}
                                                    alt="Logo du club"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <h3 className="text-2xl font-bold text-gray-800">{favouriteTeamData.name}</h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <p className="text-sm text-gray-500 font-medium">Pays</p>
                                                        <p className="text-base text-gray-700">{favouriteTeamData.area?.name || "Non disponible"}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <p className="text-sm text-gray-500 font-medium">Fondé en</p>
                                                        <p className="text-base text-gray-700">{favouriteTeamData.founded || "Non disponible"}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <p className="text-sm text-gray-500 font-medium">Stade</p>
                                                        <p className="text-base text-gray-700">{favouriteTeamData.venue || "Non disponible"}</p>
                                                    </div>

                                                    {favouriteTeamData.website && (
                                                        <div className="bg-gray-50 p-3 rounded-xl flex items-center">
                                                            <a
                                                                href={favouriteTeamData.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-cyan-600 hover:text-cyan-700 transition font-medium flex items-center gap-2"
                                                            >
                                                                🔗 Site officiel
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-4">Compétitions en cours :</h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {favouriteTeamData.runningCompetitions.map((comp) => (
                                                    <div key={comp.id} className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm border border-gray-200">
                                                        {comp.emblem && (
                                                            <div className="h-10 w-10 bg-white rounded-full p-1 shadow-sm flex items-center justify-center">
                                                                <img src={comp.emblem} alt={comp.name} className="h-6 w-6 object-contain" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-gray-700">{comp.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="animate-pulse mx-auto bg-gray-200 h-20 w-20 rounded-full mb-4"></div>
                                        <p className="text-gray-500">Chargement des informations du club...</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'account' && (
                            <motion.div
                                key="account"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                            >
                                <h2 className="text-2xl font-semibold text-cyan-700 mb-8 flex items-center gap-3">
                                    <Car className="text-cyan-600" />
                                    Informations sur votre véhicule
                                </h2>

                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center mb-8">
                                    <p className="text-gray-700 mb-2">Cette section est en cours de développement.</p>
                                    <p className="text-gray-500 text-sm">Bientôt, vous pourrez ajouter et gérer les informations sur votre véhicule pour faciliter vos covoiturages.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Marque du véhicule
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                                            disabled 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Modèle du véhicule
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Couleur
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Places disponibles
                                        </label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>

            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200 rounded-full opacity-20 z-0"></div>
        </div>
    )
}

export default Settings