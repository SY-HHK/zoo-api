import express from "express";
import {authMiddleware, shopMiddleware} from "../middlewares/auth.middleware";
import {checkIdMiddleware} from "../middlewares/utils.middleware";
import {VisitController} from "../controllers/visit.controller";

const visitRouter = express.Router();

/**
 * Set your ticket to active
 */
visitRouter.get('enter/:id', authMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id);
    const visitController: VisitController = await VisitController.getInstance();
    const isUpdated: boolean = await visitController.enter(id);
    if (isUpdated) {
        res.status(400).end();
        return;
    }
    res.status(200).end();
});

/**
 * Set your current area
 */
visitRouter.put('visit/:id', authMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id);
    const nextArea: number = req.body.nextArea;
    if (nextArea === undefined) {
        res.status(400).end();
        return;
    }
    const visitController: VisitController = await VisitController.getInstance();
    const isUpdated: boolean = await visitController.visit(id, nextArea);
    if (isUpdated) {
        res.status(400).end();
        return;
    }
    res.status(200).end();
});

/**
 * Set your ticket to inactive
 */
visitRouter.delete('leave/:id', authMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id);
    const visitController: VisitController = await VisitController.getInstance();
    const isUpdated: boolean = await visitController.leave(id);
    if (isUpdated) {
        res.status(400).end();
        return;
    }
    res.status(200).end();
});

export {
    visitRouter
};
