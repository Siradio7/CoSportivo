import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import Header from "../components/header"
import Button from "../components/button"

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Header />

            <main className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl mb-8 font-semibold text-center text-cyan-600">🚘 Proposer un covoiturage</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Lieu de départ</label>
                        <input
                            type="text"
                            placeholder="Ex : 18 Rue de la Paix, Paris"
                            {...register("departure_location", { required: "Lieu de départ requis" })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.departure_location && <p className="text-sm text-red-500 mt-1">{errors.departure_location.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Lieu d’arrivée</label>
                        <input
                            type="text"
                            placeholder="Ex : Stade de France, Saint-Denis"
                            {...register("arrival_location", { required: "Lieu d’arrivée requis" })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.arrival_location && <p className="text-sm text-red-500 mt-1">{errors.arrival_location.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Heure de départ</label>
                        <input
                            type="time"
                            {...register("departure_time", { required: "Heure de départ requise" })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.departure_time && <p className="text-sm text-red-500 mt-1">{errors.departure_time.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Places disponibles</label>
                        <input
                            type="number"
                            placeholder="Ex : 3"
                            {...register("available_seats", {
                                required: "Nombre de places requis",
                                min: { value: 1, message: "Au moins une place" }
                            })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.available_seats && <p className="text-sm text-red-500 mt-1">{errors.available_seats.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Prix par personne (€)</label>
                        <input
                            type="number"
                            placeholder="Ex : 5"
                            step="0.01"
                            {...register("price", {
                                required: "Prix requis",
                                min: { value: 1, message: "Le prix doit être d'au moins 1€" }
                            })}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                    </div>

                    {watchFields.every(Boolean) && (
                        <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-800">
                            <p className="mb-2 font-semibold text-center text-cyan-700">📝 Résumé de ton trajet :</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Départ :</strong> {watchFields[0]}</li>
                                <li><strong>Arrivée :</strong> {watchFields[1]}</li>
                                <li><strong>Heure :</strong> {watchFields[2]}</li>
                                <li><strong>Places dispos :</strong> {watchFields[3]}</li>
                                <li><strong>Prix :</strong> {watchFields[4]} € / personne</li>
                            </ul>
                        </div>
                    )}

                    <Button type="submit" className="w-full" variant="primary">
                        ✨ Créer le trajet
                    </Button>
                </form>
            </main>
        </div>
    )
}

export default CreateTrip
