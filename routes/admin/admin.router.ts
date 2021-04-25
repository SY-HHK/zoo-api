import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {AdminController} from "../../controllers/admin.controller";

const adminRouter = express.Router();

adminRouter.get('/stats', adminMiddleware, async function (req, res) {
    const adminController: AdminController = await AdminController.getInstance();
    const data: any = await adminController.stats();
    res.status(200).json(data).end();
});

export {
    adminRouter
};