import { Router } from "express"
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOneOffer,
  updateOffer,
} from "../controllers/offer.controller"
import { protect, restrictTo } from "../controllers/auth.controller"
import validate from "../middleware/validateSchema"
import { createOfferSchema, updateOfferSchema } from "../schema/offer.schema"
const offerRouter = Router()

offerRouter.use(protect, restrictTo("admin"))
offerRouter
  .route("/")
  .post(validate(createOfferSchema), createOffer)
  .get(getAllOffers)
offerRouter
  .route("/:id")
  .patch(validate(updateOfferSchema), updateOffer)
  .delete(deleteOffer)
  .get(getOneOffer)

export default offerRouter
