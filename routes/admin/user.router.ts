import express from "express";
import {adminMiddleware, authMiddleware} from "../../middlewares/auth.middleware";
import {UserController} from "../../controllers/user.controller";
import {UserInstance} from "../../models/user.model";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";

const userRouter = express.Router();

/**
 * Create a simple user
 * @return user
 */
userRouter.post("/create", adminMiddleware, async function(req, res) {
    const email: string = req.body.email;
    const password: string = req.body.password;
    if (email === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const userController: UserController = await UserController.getInstance();
    const user: UserInstance |null = await userController.create({email, password});
    if (user === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(user).end();
});

/**
 * Get a user by id
 * @return user
 */
userRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const userController: UserController = await UserController.getInstance();
    const user: UserInstance | null = await userController.read(id);
    if (user === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(user).end();
});

/**
 * Update a user by id
 * @return user
 */
userRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const email: string = req.body.email;
    const password: string = req.body.password;
    if (email === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const userController: UserController = await UserController.getInstance();
    const user: UserInstance | null = await userController.update(id, {email, password});
    if (user === null) {
        res.status(409).end();
        return;
    }
    res.status(200).json(user).end();
});

/**
 * Delete a user by id
 */
userRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const userController: UserController = await UserController.getInstance();
    const isDeleted = await userController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    userRouter
};
