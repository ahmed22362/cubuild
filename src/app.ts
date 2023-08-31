import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"

import sanitizeRequestData from "./middleware/sanitize"
import connectDB from "./utils/connectDB"
import routes from "./routes"
import logger from "./utils/logger"
dotenv.config()

const app = express()
//config.get<number>("PORT")
// Get the PORT value from the environment variable
const portString = process.env.PORT

// Convert the PORT string to a number (if it's defined and valid)
const PORT: number | undefined = portString
  ? parseInt(portString, 10)
  : undefined

if (PORT !== undefined && isNaN(PORT)) {
  // Handle the case where the PORT value is not a valid number
  console.error("Invalid PORT value:", portString)
}
// Set security HTTP headers
app.use(helmet())
app.use(bodyParser.json())
if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("dev"))
}
// set rate limiter for the ips to secure from Brute-force attack
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // one hour
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per one hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "too many requests from the same IP, Please try again in one hour",
})
// Apply the rate limiting middleware to all requests
app.use(limiter)

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
// app.use(sanitizeRequestData)// i comment it because it make problem with params it return it as object object

app.set("trust proxy", false)
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE,PATCH, OPTIONS"
  )
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

app.get("/", (req, res) => {
  res.send(
    `<h1 style="text-align:center; padding-top:100px" >Up And Running🚀</h1>`
  )
})
app.listen(PORT, async () => {
  logger.info(`app is running on http://localhost:1337/`)
  await connectDB()
  routes(app)
})
