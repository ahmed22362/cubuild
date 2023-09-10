import { Express, Request, Response } from "express"
import productRouter from "./routes/product.routes"
import userRouter from "./routes/user.routes"
import AppError from "./utils/AppError"
import errorHandler from "./middleware/errorhandler"
import dummyDataRouter from "./routes/dummyData.routes"
import reviewRouter from "./routes/review.routes"
import cartRouter from "./routes/cart.routes"
import orderRouter from "./routes/order.routes"
import wishlistRouter from "./routes/wishlist.routes"
import FileCart from "./routes/fileCart.router"

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  app.use("/insertDummyData", dummyDataRouter)
  app.use("/api/v1/product", productRouter)
  app.use("/api/v1/user", userRouter)
  app.use("/api/v1/review", reviewRouter)
  app.use("/api/v1/cart", cartRouter)
  app.use("/api/v1/wishlist", wishlistRouter)
  app.use("/api/v1/order", orderRouter)
  app.use("/api/v1/fileCart", FileCart)
  app.all("*", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`))
  })
  app.use(errorHandler)
}

export default routes
