import { Router } from "express"
import authRouter from "./auth.routes"
import {
  getAllUsers,
  getUser,
  createUser,
  updateUserById,
  deleteUserById,
  deleteAllUsers,
  updateMe,
  getMe,
} from "../controllers/user.controller"
import { protect, restrictTo } from "../controllers/auth.controller"
import validate from "../middleware/validateSchema"
import { updateMeSchema } from "../schema/user.schema"

const userRouter = Router()

userRouter.use("/auth", authRouter)
userRouter.get("/me", protect, getMe, getUser)
userRouter
  .route("/updateMe")
  .patch(protect, validate(updateMeSchema), getMe, updateMe)

// only for ADMIN
/*
since all routes run in sequence or linear one after one using use function to protect the routes 
that only available for the admin
*/
userRouter.use(protect, restrictTo("admin"))
userRouter
  .route("/:id")
  .get(getUser)
  .patch(updateUserById)
  .delete(deleteUserById)
userRouter.route("/").get(getAllUsers).post(createUser).delete(deleteAllUsers)

export default userRouter
