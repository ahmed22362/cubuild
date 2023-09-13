import Offer from "../models/offer.model"
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./factory.controller"

export const createOffer = createOne(Offer)
export const updateOffer = updateOne(Offer)
export const deleteOffer = deleteOne(Offer)
export const getAllOffers = getAll(Offer)
export const getOneOffer = getOne(Offer)
