import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";
import {MaintenanceController} from "../../controllers/maintenance.controller";
import {MaintenanceInstance} from "../../models/maintenance.model";

const maintenanceRouter = express.Router();

/**
 * Create a simple maintenance
 * @return maintenance
 */
maintenanceRouter.post("/create", adminMiddleware, async function(req, res) {
    const start: string = req.body.startDate;
    const end: string = req.body.endDate;
    const areaId: number = req.body.areaId !== undefined ? parseInt(req.body.areaId, 10) : 0;
    if (start === undefined || end === undefined || areaId === 0) {
        res.status(400).end();
        return;
    }
    const startDate: Date = new Date(start);
    const endDate: Date = new Date(end);
    const maintenanceController: MaintenanceController = await MaintenanceController.getInstance();
    const maintenance: MaintenanceInstance | null = await maintenanceController.create({startDate, endDate}, areaId);
    if (maintenance === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(maintenance).end();
});

/**
 * Get an animal by id
 * @return animal
 */
maintenanceRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const maintenanceController: MaintenanceController = await MaintenanceController.getInstance();
    const maintenance: MaintenanceInstance | null = await maintenanceController.read(id);
    if (maintenance === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(maintenance).end();
});

/**
 * Update a maintenance by id
 * @return maintenance
 */
maintenanceRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const start: string = req.body.startDate;
    const end: string = req.body.endDate;
    const areaId: number = req.body.areaId !== undefined ? parseInt(req.body.areaId, 10) : 0;
    if (start === undefined || end === undefined || areaId === 0) {
        res.status(400).end();
        return;
    }
    const startDate: Date = new Date(start);
    const endDate: Date = new Date(end);
    const maintenanceController: MaintenanceController = await MaintenanceController.getInstance();
    const maintenance: MaintenanceInstance | null = await maintenanceController.update(id, {startDate, endDate}, areaId);
    if (maintenance === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(maintenance).end();
});

/**
 * Delete a maintenance by id
 * @return void
 */
maintenanceRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const maintenanceController: MaintenanceController = await MaintenanceController.getInstance();
    const isDeleted: boolean = await maintenanceController.delete(id);
    if (isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    maintenanceRouter
};