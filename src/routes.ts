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
import PrintCart from "./routes/printCart.router"
import hookRouter from "./routes/webhook.routes"
import offerRouter from "./routes/offer.routes"
import printOrderRouter from "./routes/printOrder.routes"

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  app.get("/test", (req, res) => {
    res.redirect("https://translate.google.com/")
  })
  app.use("/insertDummyData", dummyDataRouter)
  app.use("/api/v1/product", productRouter)
  app.use("/api/v1/user", userRouter)
  app.use("/api/v1/review", reviewRouter)
  app.use("/api/v1/cart", cartRouter)
  app.use("/api/v1/wishlist", wishlistRouter)
  app.use("/api/v1/order", orderRouter)
  app.use("/api/v1/offer", offerRouter)
  app.use("/api/v1/printCart", PrintCart)
  app.use("/api/v1/printOrder", printOrderRouter)
  app.use("/api/v1/webHook", hookRouter)
  app.all("*", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`))
  })
  app.use(errorHandler)
}

export default routes
