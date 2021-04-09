import express from "express";
import {AuthController} from "../controllers/auth.controller";

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