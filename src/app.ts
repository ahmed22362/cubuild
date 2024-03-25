import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./utils/connectDB";
import routes from "./routes";
import logger from "./utils/logger";
import cors from "cors";
import User from "./models/user.model";
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
async function updateNames() {
  try {
    const users = <any>await User.find({});

    for (const user of users) {
      const name = `${user.billing.first_name.split(" ")[0]} ${
        user.billing.last_name
      }`;
      await User.findByIdAndUpdate(user._id, { name });
      console.log(`${user._id} name to ${name} updated successfully`);
    }
    await User.updateMany({}, { $unset: { fName: 1, lName: 1 } });

    console.log("Names updated successfully!");
  } catch (error) {
    console.error("Error updating names:", error);
  }
}
app.get("/", (req: Request, res: Response) => {
  res.send(
    `<h1 style="text-align:center; padding-top:100px" >Up And Running🚀</h1>`,
  );
});
app.listen(PORT, async () => {
  logger.info(`app is running on ${PORT}`);
  await connectDB();
  routes(app);
});
