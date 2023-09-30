import { Router } from "express"
import {
  loginUserSchema,
  signupUserSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  updateMyPasswordSchema,
} from "../schema/user.schema"
import {
  login,
  checkToken,
  signup,
  forgetPassword,
  resetPassword,
  updatePassword,
  googleOauthController,
} from "../controllers/auth.controller"
import validate from "../middleware/validateSchema"
import { protect } from "../controllers/auth.controller"
const authRouter = Router()

authRouter.get("/oauth/google/callback", googleOauthController)

authRouter.post("/signup", validate(signupUserSchema), signup)
authRouter.post("/login", validate(loginUserSchema), login)
authRouter.post(
  "/forgetPassword",
  validate(forgetPasswordSchema),
  forgetPassword
)
authRouter.route("/resetPassword/:token").get((req, res) => {
  const { token } = req.params
  res.render("resetPassword", { token })
})
authRouter.post("/resetPassword", validate(resetPasswordSchema), resetPassword)
authRouter
  .route("/updateMyPassword")
  .patch(protect, validate(updateMyPasswordSchema), updatePassword)
authRouter.get("/checkSign", protect, checkToken)

export default authRouter
