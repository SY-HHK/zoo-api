import express from "express";

/**
 * Check if id provided in the url
 */
export async function checkIdMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id: string = req.params.id;
    if (id === undefined) {
        res.status(404).end();
        return;
    }
    next();
}