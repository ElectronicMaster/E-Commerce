import express from "express";
import { salesmanLogin, salesmanSignUp } from "../component/salesmanController";
import { newAccessToken } from "../component/authGenerator";
import { loginValidationSalesman, signupValidationSalesman } from "../middlewares/validationForSalesman";

const router = express.Router();

router.post("/signup",signupValidationSalesman,salesmanSignUp);
router.post("/login",loginValidationSalesman,salesmanLogin);
router.use("/refresh",newAccessToken);

export default router;