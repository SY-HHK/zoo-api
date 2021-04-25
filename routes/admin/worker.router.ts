import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {WorkerController} from "../../controllers/worker.controller";
import {WorkerInstance} from "../../models/worker.model";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";

const workerRouter = express.Router();

/**
 * Create a simple worker
 * @return worker
 */
workerRouter.post("/create", adminMiddleware, async function(req, res) {
    const atWork: boolean = (req.body.atWork === 'true');
    const userId: number = parseInt(req.body.userId, 10);
    const roleId: number = parseInt(req.body.roleId, 10);
    if (atWork === undefined || userId === undefined || roleId === undefined) {
        res.status(400).end();
        return;
    }
    const workerController: WorkerController = await WorkerController.getInstance();
    const worker: WorkerInstance | null = await workerController.create({atWork}, userId, roleId);
    if (worker === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(worker).end();
});

/**
 * Get a worker by id
 * @return worker
 */
workerRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const workerController: WorkerController = await WorkerController.getInstance();
    const worker: WorkerInstance | null = await workerController.read(id);
    if (worker === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(worker).end();
});

/**
 * Update a worker by id
 * @return worker
 */
workerRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const atWork: boolean = (req.body.atWork === 'true');
    const userId: number = parseInt(req.body.userId, 10);
    const roleId: number = parseInt(req.body.roleId, 10);
    if (atWork === undefined || userId === undefined || roleId === undefined) {
        res.status(400).end();
        return;
    }
    const workerController: WorkerController = await WorkerController.getInstance();
    const worker: WorkerInstance | null = await workerController.update(id, {atWork}, userId, roleId);
    if (worker === null) {
        res.status(409).end();
        return;
    }
    res.status(200).json(worker).end();
});

/**
 * Delete a worker by id
 * @return void
 */
workerRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id);
    const workerController: WorkerController = await WorkerController.getInstance();
    const isDeleted: boolean = await workerController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    workerRouter
};
