import express from "express"
import { deliverLogin, deliverSignup } from "../component/deliveryController"
import { newAccessToken } from "../component/authGenerator";
import { loginValidationDeliver, signupValidationDeliver } from "../middlewares/validationForDeliver";
import { forgotPassword, resetPassword } from "../component/passwordReset_handler";

const router = express.Router()

router.post("/signup",signupValidationDeliver,deliverSignup);
router.post("/login",loginValidationDeliver,deliverLogin);
router.get("/refresh",newAccessToken);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

export default router;