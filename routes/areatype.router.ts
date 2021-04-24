import express from "express";
import {adminMiddleware} from "../middlewares/auth.middleware";
import {AreaTypeController} from "../controllers/areatype.controller";
import {AreaTypeInstance} from "../models/areaType.model";
import {checkIdMiddleware} from "../middlewares/utils.middleware";


const areaTypeRouter = express.Router();

/**
 * Create a simple areaType
 * @return areaType
 */

areaTypeRouter.post("/createTypeArea", adminMiddleware,async function (req,res) {
    const name: string = req.body.name;
    const areaId: number = req.body.areaId;

    if(name == undefined || areaId == undefined) {
        res.status(400).end();
        return;
    }
    const areaTypeController: AreaTypeController = await AreaTypeController.getInstance();
    const areaType: AreaTypeInstance | null = await areaTypeController.create({name},areaId);
    if(areaType === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(areaType).end();
});


/**
 * Get a areaType by id
 * @return areaType
 */
areaTypeRouter.get("/getAreaType/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const areaTypeController: AreaTypeController = await AreaTypeController.getInstance();
    const areaType: AreaTypeInstance | null = await areaTypeController.read(id);
    if (areaType === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(areaType).end();
});



export {
    areaTypeRouter
};
