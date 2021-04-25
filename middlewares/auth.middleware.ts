import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {ShopController} from "../controllers/shop.controller";
import {TicketInstance} from "../models/ticket.model";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";

/**
 * Check if token is valid
 */
export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const auth = req.headers["authorization"];
    if(auth !== undefined) {
        const token = auth.slice(7);
        const authController = await AuthController.getInstance();
        const session = await authController.getSession(token);
        if(session !== null) {
            next();
            return;
        } else {
            res.status(403).end();
            return;
        }
    } else {
        res.status(401).end();
    }
}

/**
 * Check if token belongs to an admin
 */
export async function adminMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const auth = req.headers["authorization"];
    if(auth === undefined) {
        res.status(401).end();
        return;
    }
    const token = auth.slice(7);
    const authController = await AuthController.getInstance();
    const session = await authController.getSession(token);
    if(session === null) {
        res.status(403).end();
        return;
    }
    const isAdmin = await authController.isAdmin(session)
    if (isAdmin) {
        next();
        return;
    }
    res.status(403).end();
    return;
}

/**
 * Check if token is valid and if user has rights to interact with ticket
 */
export async function shopMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if(auth === undefined) {
        res.status(401).end();
        return;
    }
    const token = auth.slice(7);
    const shopController: ShopController = await ShopController.getInstance();
    const ticket: TicketInstance | null = await shopController.read(parseInt(req.params.id, 10));
    if (ticket === null) {
        res.status(404).end();
        return;
    }
    const ticketUser: UserInstance = await ticket.getUser();
    const ticketUserSessions: SessionInstance[] = await ticketUser.getSessions({where: { token }});
    if (ticketUserSessions.length > 0) {
        next();
    }
    const authController: AuthController = await AuthController.getInstance();
    const session: SessionInstance | null = await authController.getSession(token);
    if (session === null) {
        res.status(403).end();
        return;
    }
    const isAdmin: boolean = await authController.isAdmin(session);
    if (!isAdmin) {
        res.status(403).end();
        return;
    }
    next();
}