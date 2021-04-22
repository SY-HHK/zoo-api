import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {ShopController} from "../controllers/shop.controller";
import {checkIdMiddleware} from "../middlewares/utils.middleware";
import {TicketInstance} from "../models/ticket.model";

const shopRouter = express.Router();

/**
 * Create a ticket
 * @return ticket
 */
shopRouter.post("/buy", authMiddleware, async function (req, res) {
    const ticketTypeId: number = parseInt(req.body.ticketTypeId, 10);
    const userId: number = parseInt(req.body.userId, 10);
    const start: string = req.body.startDate;
    const end: string = req.body.endDate;
    if (ticketTypeId === undefined || userId === undefined || start === undefined || end === undefined) {
        res.status(400).end();
        return;
    }
    const startDate: Date = new Date(start);
    const endDate: Date = new Date(end);
    const shopController: ShopController = await ShopController.getInstance();
    const ticket: TicketInstance | null = await shopController.buy({startDate, endDate}, ticketTypeId, userId);
    if (ticket === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(ticket).end();
});

/**
 * get a ticket by id
 * @return ticket
 */
shopRouter.get("/get/:id", authMiddleware, checkIdMiddleware, async function (req, res) {
    const id: number = parseInt(req.params.id);
    const shopController: ShopController = await ShopController.getInstance();
    const ticket: TicketInstance | null = await shopController.read(id);
    if (ticket === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(ticket).end();
});

/**
 * transfer a ticket to another user
 * @return ticket
 */
shopRouter.put("/give", authMiddleware, checkIdMiddleware, async function (req, res) {
    const id: number = parseInt(req.params.id, 10);
    const userId: number = parseInt(req.body.userId, 10);
    if (userId === undefined) {
        res.status(400).end();
        return;
    }
    const shopController: ShopController = await ShopController.getInstance();
    const ticket: TicketInstance | null = await shopController.give(id, userId);
    if (ticket === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(ticket).end();
});

/**
 * cancel a user's ticket
 * @return void
 */
shopRouter.delete("/cancel", authMiddleware, checkIdMiddleware, async function (req, res) {
    const id: number = parseInt(req.params.id, 10);
    const shopController: ShopController = await ShopController.getInstance();
    const isDeleted: boolean = await shopController.cancel(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    shopRouter
};
