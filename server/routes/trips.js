import { Router } from "express"
import { getAllTrips, getTripById, addTrip, updateTrip, deleteTrip, getAllTripsByMatchId, getAllTripsByUserId } from "../controllers/trips.js"

const router = Router()

router.get("/", getAllTrips)
router.get("/:id", getTripById)
router.post("/", addTrip)
router.patch("/:id", updateTrip)
router.delete("/:id", deleteTrip)
router.get("/match/:id", getAllTripsByMatchId)
router.get("/user/:id", getAllTripsByUserId)

export default router