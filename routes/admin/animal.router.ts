import express from "express";
import {adminMiddleware} from "../../middlewares/auth.middleware";
import {checkIdMiddleware} from "../../middlewares/utils.middleware";
import {AnimalController} from "../../controllers/animal.controller";
import {AnimalInstance} from "../../models/animal.model";

const animalRouter = express.Router();

/**
 * Create a simple animal
 * @return role
 */
animalRouter.post("/create", adminMiddleware, async function(req, res) {
    const name: string = req.body.name;
    const species: string = req.body.species;
    const journal: string = req.body.journal;
    const areaId: number = req.body.areaId !== undefined ? parseInt(req.body.areaId, 10) : 0;
    if (name === undefined || species === undefined || journal === undefined || areaId === 0) {
        res.status(400).end();
        return;
    }
    const animalController: AnimalController = await AnimalController.getInstance();
    const animal: AnimalInstance | null = await animalController.create({name, species, journal}, areaId);
    if (animal === null) {
        res.status(409).end();
        return;
    }
    res.status(201).json(animal).end();
});

/**
 * Get an animal by id
 * @return role
 */
animalRouter.get("/get/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.body.id, 10);
    const animalController: AnimalController = await AnimalController.getInstance();
    const animal: AnimalInstance | null = await animalController.read(id);
    if (animal === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(animal).end();
});

/**
 * Update an animal by id
 * @return role
 */
animalRouter.put("/update/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.body.id, 10);
    const name: string = req.body.name;
    const species: string = req.body.species;
    const journal: string = req.body.journal;
    const areaId: number = req.body.areaId !== undefined ? parseInt(req.body.areaId, 10) : 0;
    if (name === undefined || species === undefined || journal === undefined || areaId === 0) {
        res.status(400).end();
        return;
    }
    const animalController: AnimalController = await AnimalController.getInstance();
    const animal: AnimalInstance | null = await animalController.update(id, {name, species, journal}, areaId);
    if (animal === null) {
        res.status(409).end();
        return;
    }
    res.status(200).json(animal).end();
});

/**
 * Delete an animal by id
 */
animalRouter.delete("/delete/:id", adminMiddleware, checkIdMiddleware, async function(req, res) {
    const id: number = parseInt(req.body.id, 10);
    const animalController: AnimalController = await AnimalController.getInstance();
    const isDeleted: boolean = await animalController.delete(id);
    if (!isDeleted) {
        res.status(404).end();
        return;
    }
    res.status(200).end();
});

export {
    animalRouter
};