import express from "express"
import { deliverLogin, deliverSignup } from "../component/deliveryController"
import { newAccessToken } from "../component/authGenerator";
import { loginValidationDeliver, signupValidationDeliver } from "../middlewares/validationForDeliver";

const router = express.Router()

router.post("/signup",signupValidationDeliver,deliverSignup);
router.post("/login",loginValidationDeliver,deliverLogin);
router.get("/refresh",newAccessToken);

export default router;