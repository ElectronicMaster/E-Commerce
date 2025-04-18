import express from "express";
import { salesmanLogin, salesmanSignUp } from "../component/salesmanController";
import { newAccessToken } from "../component/authGenerator";
import { loginValidationSalesman, signupValidationSalesman } from "../middlewares/validationForSalesman";
import { forgotPassword, resetPassword } from "../component/passwordReset_handler";

const router = express.Router();

router.post("/signup",signupValidationSalesman,salesmanSignUp);
router.post("/login",loginValidationSalesman,salesmanLogin);
router.get("/refresh",newAccessToken);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

export default router;