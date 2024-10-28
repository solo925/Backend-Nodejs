import express from "express";
import { authRouter } from "./authentication";

const mainRoute = express.Router();

mainRoute.use('/auth/register', authRouter)

export default mainRoute;