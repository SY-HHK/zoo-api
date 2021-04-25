import {Express} from "express";
import {authRouter} from "./auth.router";
import {userRouter} from "./admin/user.router";
import {workerRouter} from "./admin/worker.router";
import {roleRouter} from "./admin/role.router";
import {ticketTypeRouter} from "./admin/ticketType.router"
import {shopRouter} from "./shop.router";
import {animalRouter} from "./admin/animal.router";
import {imageRouter} from "./admin/image.router";
import {maintenanceRouter} from "./admin/maintenance.router";
import {visitRouter} from "./visit.router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/shop", shopRouter);
    app.use("/visit", visitRouter);
    app.use("/admin/user", userRouter);
    app.use("/admin/worker", workerRouter);
    app.use("/admin/role", roleRouter);
    app.use("/admin/ticket-type", ticketTypeRouter);
    app.use("/admin/animal", animalRouter);
    app.use("/admin/image", imageRouter);
    app.use("/admin/maintenance", maintenanceRouter);
}