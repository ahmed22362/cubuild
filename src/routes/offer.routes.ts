import { Router } from "express"
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOneOffer,
  updateOffer,
} from "../controllers/offer.controller"
import { protect, restrictTo } from "../controllers/auth.controller"
const offerRouter = Router()

offerRouter.use(protect, restrictTo("admin"))
offerRouter.route("/").post(createOffer).get(getAllOffers)
offerRouter
  .route("/:id")
  .patch(updateOffer)
  .delete(deleteOffer)
  .get(getOneOffer)

export default offerRouter
