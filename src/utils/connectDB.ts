import mongoose from "mongoose"
import logger from "./logger"
import dotenv from "dotenv"
dotenv.config()
// const mongodb_uri = config.get<string>("MONGO_DB_URI")
const mongodb_uri = process.env.MONGO_DB_URI as string
const mongodb_local_uri = process.env.MONGO_DB_LOCAL_URL as string

async function connectDB() {
  try {
    await mongoose.connect(mongodb_uri)
    logger.info("db is connected successfully!")
  } catch (error) {
    logger.error(`some this wrong happened like ${error}`)
    process.exit(1)
  }
}
export default connectDB
