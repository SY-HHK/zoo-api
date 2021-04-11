import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";
import {RoleController} from "../../controllers/role.controller";
import {RoleInstance} from "../../models/role.model";
import {UserController} from "../../controllers/user.controller";

const roleRouter = express.Router();

/**
 * Create a simple role
 * @return role
 */
roleRouter.post("/create", adminMiddleware, async function(req, res) {
    const name: string = req.body.name;
    if (name === undefined) {
        res.status(400).end();
        return;
    }
    const roleController: RoleController = await RoleController.getInstance();
    const role: RoleInstance | null = await roleController.create({name});
    if (role === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(role).end();
});

/**
 * Get a role by id
 * @return role
 */
roleRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const roleController: RoleController = await RoleController.getInstance();
    const role: RoleInstance | null = await roleController.read(id);
    if (role === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(role).end();
});

/**
 * Update a role by id
 * @return role
 */
roleRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const name: string = req.body.name;
    if (name === undefined) {
        res.status(400).end();
        return;
    }
    const roleController: RoleController = await RoleController.getInstance();
    const role: RoleInstance | null = await roleController.update(id, {name});
    if (role === null) {
        res.status(409);
        return;
    }
    res.status(200).json(role).end();
});

/**
 * Delete a role by id
 */
roleRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const userController: UserController = await UserController.getInstance();
    const isDeleted: boolean = await userController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    roleRouter
};