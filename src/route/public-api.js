import express from "express";
import userController from "../controller/user-controller"


/**
 * api untuk yang belum ada user
 */
const publicRouter = new express.Router();

publicRouter.post('/api/users/', userController.register);
publicRouter.post('/api/users/login', userController.login);

export {
    publicRouter
}