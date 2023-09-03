const cloudinary = require("cloudinary").v2
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import { Request } from "express"
import AppError from "./AppError"
import sharp from "sharp"

require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
})

interface MyParams {
  folder: string
  public_id?: (req: Request, file: Express.Multer.File) => string
}

const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: Function
) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new AppError(400, "Only image files allowed"), false)
  } else {
    // const buffer = await sharp(file.buffer).resize(800, 600).toBuffer()

    // // set buffer back on file
    // file.buffer = buffer

    cb(null, true)
  }
}

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product-images",
    public_id: (req: Request, file: Express.Multer.File) =>
      `${file.originalname.split(".")[0]}-${Date.now()}`,
  } as MyParams,
})

const parser = multer({ storage: cloudStorage, fileFilter })

export default parser
