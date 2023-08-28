import express from "express";
import userController from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";

/**
 * api untuk yang sudah ada user
 */

const userRouter = new express.Router();

userRouter.use(authMiddleware);
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

export {
    userRouter
}