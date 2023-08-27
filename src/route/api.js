import express from "express";
import userController from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";

/**
 * api untuk yang sudah ada user
 */

const userRouter = new express.Router();

userRouter.use(authMiddleware);
userRouter.get('/api/users/current', userController.get);

export {
    userRouter
}