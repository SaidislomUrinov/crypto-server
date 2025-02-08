import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js";

export default Router()
    .post('/auth', userController.auth)
    .get('/activate', userController.activate)
    .get('/verify', userAuth, userController.verify)
    .get('/currencies', userController.currencies)
    .get('/configs', userController.configs)
    // 
    .post('/deposit', userAuth, userController.deposit)
