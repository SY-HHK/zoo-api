import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";

const animalRouter = express.Router();

/**
 * Create a simple animal
 * @return role
 */
animalRouter.post("/create", adminMiddleware, async function(req, res) {

});

/**
 * Get an animal by id
 * @return role
 */
animalRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

/**
 * Update an animal by id
 * @return role
 */
animalRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

/**
 * Delete an animal by id
 */
animalRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {

});

export {
    animalRouter
};