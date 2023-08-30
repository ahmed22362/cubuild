import { NextFunction, Router, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import { insertDummyProducts, insertDummyReviews } from "../utils/dummyData"
const dummyDataRouter = Router()

dummyDataRouter.get("/t", (req, res, next) => {
  res.send(200)
})
dummyDataRouter.get(
  "/products",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await insertDummyProducts()
    res.status(200).json({
      status: "success",
      message: "Dummy products inserted successfully!",
    })
  })
)

dummyDataRouter.get(
  "/reviews",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await insertDummyReviews()
    res.status(200).json({
      status: "success",
      message:
        "Reviews inserted successfully with the id of user 64ea4035d6bef77c1f1156d8",
    })
  })
)
export default dummyDataRouter
