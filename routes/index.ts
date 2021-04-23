import {Express} from "express";
import {authRouter} from "./auth.router";
import {userRouter} from "./admin/user.router";
import {workerRouter} from "./admin/worker.router";
import {roleRouter} from "./admin/role.router";
import {ticketTypeRouter} from "./admin/ticketType.router"
import {shopRouter} from "./shop.router";
import {animalRouter} from "./admin/animal.router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/shop", shopRouter);
    app.use("/admin/user", userRouter);
    app.use("/admin/worker", workerRouter);
    app.use("/admin/role", roleRouter);
    app.use("/admin/ticket-type", ticketTypeRouter);
    app.use("/admin/animal", animalRouter);
}