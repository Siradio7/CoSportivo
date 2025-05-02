import { Router } from "express"
import { joinTrip, getAllTripPassengers, getTripPassengerById, updateTripPassenger, cancelReservation, getTripsByPassengerId } from "../controllers/tripPassengers.js"

const router = Router()

router.post("/", joinTrip)
router.get("/", getAllTripPassengers)
router.get("/:id", getTripPassengerById)
router.get("/user/:id", getTripsByPassengerId)
router.patch("/:id", updateTripPassenger)
router.delete("/:id", cancelReservation)

export default router