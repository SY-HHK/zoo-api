import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {AreaTypeController} from "../../controllers/areaType.controller";
import {AreaTypeInstance} from "../../models/areaType.model";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";
import {animalRouter} from "./animal.router";

const areaTypeRouter = express.Router();

/**
 * Create a simple areaType
 * @return areaType
 */
areaTypeRouter.post("/create", adminMiddleware,async function (req, res) {
    const name: string = req.body.name;
    if(name === undefined) {
        res.status(400).end();
        return;
    }
    const areaTypeController: AreaTypeController = await AreaTypeController.getInstance();
    const areaType: AreaTypeInstance | null = await areaTypeController.create({name});
    if(areaType === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(areaType).end();
});


/**
 * Get an areaType by id
 * @return areaType
 */
areaTypeRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const areaTypeController: AreaTypeController = await AreaTypeController.getInstance();
    const areaType: AreaTypeInstance | null = await areaTypeController.read(id);
    if (areaType === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(areaType).end();
});

/**
 * Update an areaType by id
 * @return areaType
 */
animalRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const name: string = req.body.name;
    if(name === undefined) {
        res.status(400).end();
        return;
    }
    const areaTypeController: AreaTypeController = await AreaTypeController.getInstance();
    const areaType: AreaTypeInstance | null = await areaTypeController.update(id, {name})
    if (areaType === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(areaType).end();
});

/**
 * Delete an areaType by id
 * @return void
 */
animalRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const areaTypeController: AreaTypeController = await AreaTypeController.getInstance();
    const isDeleted: boolean = await areaTypeController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    areaTypeRouter
};
