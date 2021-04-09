import express from "express";

export async function checkIdMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id: number = parseInt(req.params.id, 10);
    if (id === undefined) {
        res.status(404).end();
        return;
    }
    next();
}