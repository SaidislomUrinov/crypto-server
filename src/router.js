import { Router } from "express";
import userRouter from "./routers/user.router.js";

export default Router()
    .use('/user', userRouter)