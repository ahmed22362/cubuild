const cloudinary = require("cloudinary").v2
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import { Request } from "express"
import AppError from "../utils/AppError"

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

const imageFilter = async (
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
const userFileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: Function
) => {
  const ext = file.mimetype.split("/")[1]
  const accepted = [
    "stl",
    "obj",
    "octet-stream",
    "vnd.dwg",
    "zip",
    "vnd.rar",
    "svg",
  ]
  console.log(file.mimetype, accepted.includes(ext))
  if (!accepted.includes(ext)) {
    cb(
      new AppError(
        400,
        `Only ["stl", "obj", "factory", "octet-stream","vnd.dwg", "zip", "rar","svg"] files allowed`
      ),
      false
    )
  } else {
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

const parser = multer({ storage: cloudStorage, fileFilter: imageFilter })

// file upload filter
const memoryStorage = multer.memoryStorage()
export const memoryMulter = multer({
  storage: memoryStorage,
  fileFilter: userFileFilter,
})

export default parser
