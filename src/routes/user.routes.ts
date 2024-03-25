import { Router } from "express";
import authRouter from "./auth.routes";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUserById,
  deleteUserById,
  deleteAllUsers,
  updateMe,
  getMe,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../controllers/auth.controller";
import validate from "../middleware/validateSchema";
import {
  createUserSchema,
  deleteUserSchema,
  getMeSchema,
  getUserSchema,
  updateMeSchema,
  updateUserSchema,
} from "../schema/user.schema";

const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.get("/me", protect, getMe, validate(getMeSchema), getUser);
userRouter
  .route("/updateMe")
  .patch(protect, validate(updateMeSchema), getMe, updateMe);

// only for ADMIN
/*
since all routes run in sequence or linear one after one using use function to protect the routes 
that only available for the admin
*/
userRouter.use(protect, restrictTo("admin"));
userRouter
  .route("/:id")
  .get(validate(getUserSchema), getUser)
  .patch(validate(updateUserSchema), updateUserById)
  .delete(validate(deleteUserSchema), deleteUserById);
userRouter
  .route("/")
  .get(getAllUsers)
  .post(validate(createUserSchema), createUser)
  .delete(deleteAllUsers);

export default userRouter;
