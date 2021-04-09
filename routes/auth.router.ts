import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/subscribe",
    async function (req, res) {
        const password = req.body.password;
        const email = req.body.email;
        if (password === undefined ||
            email === undefined) {
            res.status(400).end();
            return;
        }
        const authController = await AuthController.getInstance();
        const user = await authController.subscribe({
            password,
            email
        });
        if (user !== null) {
            res.status(201);
            res.json(user);
        } else {
            res.status(409).end();
        }
    });

authRouter.post("/login", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const session = await authController.log(email, password);
    if (session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

authRouter.delete("/logout", authMiddleware, async function (req, res) {
    const authController = await AuthController.getInstance();
    const isDeleted = await authController.deleteSession(req.headers["authorization"]);
    if (!isDeleted) {
        res.status(404)
        res.send("Invalid token").end();
    }
    res.status(200).end();
});

export {
    authRouter
};
