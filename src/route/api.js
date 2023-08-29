import express from "express";
import userController from "../controller/user-controller";
import contactController from "../controller/contact-controller";
import { authMiddleware } from "../middleware/auth-middleware";

/**
 * api untuk yang sudah ada user
 */

const userRouter = new express.Router();

userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Contact API
userRouter.post('/api/contacts', contactController.create);

export {
    userRouter
}