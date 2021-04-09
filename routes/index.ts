import {Express} from "express";
import {authRouter} from "./auth.router";
import {userRouter} from "./admin/user.router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/admin/user", userRouter);
}