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
import offerRouter from "./routes/offer.routes"
import printOrderRouter from "./routes/printOrder.routes"
import Paymob from "./payments/paymobStrategy"
import payRouter from "./routes/pay.routes"
import { getGoogleOAuthURL } from "./services/googleOauth.service"

const API_TOKEN = process.env.PAYMOB_API as string

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  app.get("/test_payment", async (req, res) => {
    const paymob = new Paymob(API_TOKEN)
    const orderId = await paymob.registerOrder([], 3403)
    const iFrame = await paymob.payWithCard(5493, {}, orderId)
    res.redirect(iFrame)
  })
  app.get("/signinwithgoogle", (req, res, next) => {
    const google_redirect_url = process.env.GOOGLE_REDIRECT_URL_PRO as string
    const google_redirect_url_local = process.env
      .GOOGLE_REDIRECT_URL_LOCAL as string
    let runningRedirectLink = google_redirect_url
    if (process.env.NODE_ENV?.trim() === "development") {
      runningRedirectLink = google_redirect_url_local
    }
    const client_id = process.env.GOOGLE_CLIENT_ID as string
    const OAuthConsentURL = getGoogleOAuthURL({
      redirect_uri: runningRedirectLink,
      client_id,
    })
    res.redirect(OAuthConsentURL)
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
  app.use("/api/v1/pay", payRouter)
  app.all("*", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`))
  })
  app.use(errorHandler)
}

export default routes
