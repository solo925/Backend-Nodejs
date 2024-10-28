import express from "express";
import { RegisterController } from "../controllers/Accounts/loginRegisetrController";

export const authRouter = express.Router();

authRouter.use('/', RegisterController)