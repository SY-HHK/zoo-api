import express from "express";
import {authMiddleware, shopMiddleware} from "../middlewares/auth.middleware";
import {checkIdMiddleware} from "../middlewares/utils.middleware";

const visitRouter = express.Router();

/**
 * Set your ticket to active
 */
visitRouter.get('enter/:id', authMiddleware, async function(req, res) {

});

/**
 * Set your current area
 */
visitRouter.put('visit/:id', authMiddleware, async function(req, res) {

});

/**
 * Set your ticket to inactive
 */
visitRouter.delete('leave/:id', authMiddleware, async function(req, res) {

});

export {
    visitRouter
};
