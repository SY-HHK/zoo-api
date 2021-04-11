import {Express} from "express";
import {authRouter} from "./auth.router";
import {userRouter} from "./admin/user.router";
import {workerRouter} from "./admin/worker.router.js";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/admin/user", userRouter);
    app.use("/admin/worker", workerRouter);
}