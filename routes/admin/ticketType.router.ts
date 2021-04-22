import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";
import {TicketTypeController} from "../../controllers/ticketType.controller";
import {TicketTypeInstance} from "../../models/ticketType.model";

const ticketTypeRouter = express.Router();

/**
 * Create a simple ticket
 * @return ticket
 */
ticketTypeRouter.post("/create", adminMiddleware, async function(req, res) {
    const name: string = req.body.name;
    const price: number = req.body.price;
    const data: JSON = req.body.data;
    if (name === undefined || price === undefined || data === undefined) {
        res.status(400).end();
        return;
    }
    const ticketTypeController: TicketTypeController = await TicketTypeController.getInstance();
    const ticketType: TicketTypeInstance |null = await ticketTypeController.create({name, price, data});
    if (ticketType === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(ticketType).end();
});

/**
 * Get a ticket by id
 * @return ticket
 */
ticketTypeRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const ticketTypeController: TicketTypeController = await TicketTypeController.getInstance();
    const ticketType: TicketTypeInstance | null = await ticketTypeController.read(id);
    if (ticketType === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(ticketType).end();
});

/**
 * Update a ticket by id
 * @return ticket
 */
ticketTypeRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const name: string = req.body.name;
    const price: number = req.body.price;
    const data: JSON = req.body.data;
    if (name === undefined || price === undefined || data === undefined) {
        res.status(400).end();
        return;
    }
    const ticketTypeController: TicketTypeController = await TicketTypeController.getInstance();
    const ticketType: TicketTypeInstance | null = await ticketTypeController.update(id, {name, price, data});
    if (ticketType === null) {
        res.status(409).end();
        return;
    }
    res.status(200).json(ticketType).end();
});

/**
 * Delete a ticket by id
 * @return void
 */
ticketTypeRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.params.id, 10);
    const ticketTypeController: TicketTypeController = await TicketTypeController.getInstance();
    const isDeleted = ticketTypeController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
    }
    res.status(200).end();
});

export {
    ticketTypeRouter
};