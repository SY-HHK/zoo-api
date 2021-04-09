import express from "express";

/**
 * Check if id provided in the url
 * @param req
 * @param res
 * @param next
 */
export async function checkIdMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id: number = parseInt(req.params.id, 10);
    if (id === undefined) {
        res.status(404).end();
        return;
    }
    next();
}