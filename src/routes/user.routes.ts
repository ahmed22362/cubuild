import { Router } from "express"
import authRouter from "./auth.routes"
import {
  findAllUsers,
  findUser,
  createUser,
  updateUserById,
  deleteUserById,
  deleteAllUsers,
  updateMe,
} from "../controllers/user.controller"
import { protect, restrictTo } from "../controllers/auth.controller"
import validate from "../utils/validateSchema"
import { updateMeSchema } from "../schema/user.schema"

const userRouter = Router()

userRouter.use("/auth", authRouter)
// only for ADMIN
userRouter.route("/updateMe").patch(protect, validate(updateMeSchema), updateMe)
userRouter
  .route("/:id")
  .get(findUser)
  .patch(updateUserById)
  .delete(deleteUserById)
userRouter
  .route("/")
  .get(protect, restrictTo("admin", "user"), findAllUsers)
  .post(createUser)
  .delete(deleteAllUsers)

export default userRouter
