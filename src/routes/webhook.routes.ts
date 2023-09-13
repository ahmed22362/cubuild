import { Router } from "express"
import logger from "../utils/logger"
const hookRouter = Router()

hookRouter.get("/", (req, res) => {
  res.send("<h1>Done</h1>")
})
hookRouter.post("/accept", (req, res, next) => {
  logger.info("Yes!!!!!!")
  res.status(200)
})

hookRouter.post("/decline", (req, res, next) => {
  logger.info("No!!!!!!")
  res.status(400)
})

export default hookRouter
