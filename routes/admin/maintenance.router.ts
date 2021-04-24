import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";

const maintenanceRouter = express.Router();

/**
 * Create a simple maintenance
 * @return maintenance
 */
maintenanceRouter.post("/create", adminMiddleware, async function(req, res) {

});

/**
 * Get an animal by id
 * @return animal
 */
maintenanceRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

/**
 * Update a maintenance by id
 * @return maintenance
 */
maintenanceRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

/**
 * Delete a maintenance by id
 * @return void
 */
maintenanceRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

export {
    maintenanceRouter
};