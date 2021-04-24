import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";

const imageRouter = express.Router();

/**
 * Create a simple image
 * @return image
 */
imageRouter.post("/create", adminMiddleware, async function(req, res) {

});

/**
 * Get an image by id
 * @return image
 */
imageRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

/**
 * Update an image by id
 * @return image
 */
imageRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

/**
 * Delete an image by id
 * @return void
 */
imageRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

export {
    imageRouter
};