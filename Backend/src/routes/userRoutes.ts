import express from "express";
import { userLogin, userSignUp } from "../component/userController";
import { newAccessToken } from "../component/authGenerator";
import { forgotPassword, resetPassword } from "../component/passwordReset_handler";
import { loginValidationUser, signupValidationUser } from "../middlewares/validationForUser";

const router = express.Router();

router.post("/signup", signupValidationUser, userSignUp);
router.post("/login", loginValidationUser, userLogin);
router.get("/refresh", newAccessToken)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)

export default router;