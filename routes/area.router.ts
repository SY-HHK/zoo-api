import express from "express";
import {adminMiddleware} from "../middlewares/auth.middleware";
import {AreaController} from "../controllers/area.controller";
import {AreaInstance} from "../models/area.model";
import {checkIdMiddleware} from "../middlewares/utils.middleware";

const areaRouter = express.Router();

/**
 * Create a simple area
 * @return area
 */
areaRouter.post("/createArea", adminMiddleware, async function(req, res) {
    const name: string = req.body.name;
    const description: string = req.body.description;
    const capacity: number = req.body.capacity;
    const duration: number = req.body.duration;
    const openAt: Date = req.body.openAt;
    const closeAt: Date = req.body.closeAt;
    const handicapAccess: boolean = req.body.handicapAccess;
    const journal: string = req.body.journal;

    if (name === undefined || description === undefined || capacity === undefined || duration === undefined || openAt === undefined || closeAt === undefined || handicapAccess === undefined || journal === undefined) {
        res.status(400).end();
        return;
    }
    const areaController: AreaController = await AreaController.getInstance();
    const area: AreaInstance |null = await areaController.create({name, description, capacity, duration, openAt, closeAt, handicapAccess, journal});
    if (area === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(area).end();
});

/**
 * Get a area by id
 * @return area
 */
areaRouter.get("/getArea/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const areaController: AreaController = await AreaController.getInstance();
    const area: AreaInstance | null = await areaController.read(id);
    if (area === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(area).end();
});

/**
 * Update a area by id
 * @return area
 */
areaRouter.put("/updateArea/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const name: string = req.body.name;
    const description: string = req.body.description;
    const capacity: number = req.body.capacity;
    const duration: number = req.body.duration;
    const openAt: Date = req.body.openAt;
    const closeAt: Date = req.body.closeAt;
    const handicapAccess: boolean = req.body.handicapAccess;
    const journal: string = req.body.journal;

    if (name === undefined || description === undefined || capacity === undefined || duration === undefined || openAt === undefined || closeAt === undefined || handicapAccess === undefined || journal === undefined ) {
        res.status(400).end();
        return;
    }
    const areaController: AreaController = await AreaController.getInstance();
    const area: AreaInstance | null = await areaController.update(id, {name, description, capacity, duration, openAt, closeAt, handicapAccess, journal});
    if (area === null) {
        res.status(409).end();
        return;
    }
    res.status(200).json(area).end();
});

/**
 * Delete a area by id
 */
areaRouter.delete("/deleteArea/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const areaController: AreaController = await AreaController.getInstance();
    const isDeleted = await areaController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    areaRouter
};
