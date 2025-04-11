import { Router } from "express"
import { joinTrip, getAllTripPassengers, getTripPassengerById, updateTripPassenger, cancellReservation } from "../controllers/tripPassengers.js"

const router = Router()

router.post("/", joinTrip)
router.get("/", getAllTripPassengers)
router.get("/:id", getTripPassengerById)
router.patch("/:id", updateTripPassenger)
router.delete("/", cancellReservation)

export default router