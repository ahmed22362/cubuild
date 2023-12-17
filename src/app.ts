import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./utils/connectDB";
import routes from "./routes";
import logger from "./utils/logger";
import cors from "cors";
dotenv.config();

const app = express();
//config.get<number>("PORT")
// Get the PORT value from the environment variable
const portString = process.env.PORT as string;

// Convert the PORT string to a number (if it's defined and valid)
const PORT: number = parseInt(portString, 10) as number;

if (PORT !== undefined && isNaN(PORT)) {
  // Handle the case where the PORT value is not a valid number
  console.error("Invalid PORT value:", portString);
}

// Set trust proxy to true to trust proxy headers
app.enable("trust proxy");
// Set security HTTP headers
app.use(helmet());
// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan(
      ":date[web] :remote-addr :method :url :status :response-time ms - :res[content-length]",
    ),
  );
}
// set rate limiter for the ips to secure from Brute-force attack
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // one hour
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per one hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "too many requests from the same IP, Please try again in one hour",
  validate: false,
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(sanitizeRequestData)// i comment it because it make problem with params it return it as object object

app.set("trust proxy", false);
app.use(
  cors({
    origin: [
      /http:\/\/localhost:\d*/,
      "https://cubuild.net",
      "https://cubeart.vercel.app/",
    ],
    optionsSuccessStatus: 200,
  }),
);
// disable core for the front local dev
// app.use(
//   cors({
//     origin: "https://cubuild.net",
//     credentials: true,
//   })
// )

app.get("/", (req, res) => {
  res.send(
    `<h1 style="text-align:center; padding-top:100px" >Up And Running🚀</h1>`,
  );
});
app.listen(PORT, async () => {
  logger.info(`app is running on ${PORT}`);
  await connectDB();
  routes(app);
});
