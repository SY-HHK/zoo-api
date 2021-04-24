import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";
import {ImageController} from "../../controllers/image.controller";
import {ImageInstance} from "../../models/image.model";

const imageRouter = express.Router();

/**
 * Create a simple image
 * @return image
 */
imageRouter.post("/create", adminMiddleware, async function(req, res) {
    const base64: string = req.body.base64;
    const areaId: number = req.body.areaId !== undefined ? parseInt(req.body.areaId, 10) : 0;
    if (base64 === undefined || areaId === 0) {
        res.status(400).end();
        return;
    }
    const imageController: ImageController = await ImageController.getInstance();
    const image: ImageInstance | null = await imageController.create({path:''}, base64, areaId);
    if (image === null) {
        res.status(409).end();
        return;
    }
    const imageData: string | Buffer = await require('fs/promises').readFile(image.path);
    res.status(201).send(imageData).end();
});

/**
 * Get an image by id
 * @return image
 */
imageRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const imageController: ImageController = await ImageController.getInstance();
    const image: ImageInstance | null = await imageController.read(id);
    if (image === null) {
        res.status(404).end();
        return;
    }
    const imageData: string | Buffer = await require('fs/promises').readFile(image.path);
    res.status(200).send(imageData).end();
});

/**
 * Update an image by id
 * @return image
 */
imageRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const areaId: number = req.body.areaId !== undefined ? parseInt(req.body.areaId, 10) : 0;
    if (areaId === 0) {
        res.status(400).end();
        return;
    }
    const imageController: ImageController = await ImageController.getInstance();
    const image: ImageInstance | null = await imageController.update(id, areaId);
    if (image === null) {
        res.status(404).end();
        return;
    }
    const imageData: string | Buffer = await require('fs/promises').readFile(image.path);
    res.status(200).send(imageData).end();
});

/**
 * Delete an image by id
 * @return void
 */
imageRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const imageController: ImageController = await ImageController.getInstance();
    const isDeleted: boolean = await imageController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    imageRouter
};