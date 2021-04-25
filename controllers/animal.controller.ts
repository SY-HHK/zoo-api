import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AnimalCreationProps, AnimalInstance} from "../models/animal.model";
import {AreaInstance} from "../models/area.model";

export class AnimalController {

    Animal: ModelCtor<AnimalInstance>;
    Area: ModelCtor<AreaInstance>;

    private static instance: AnimalController;

    public static async getInstance(): Promise<AnimalController> {
        if(AnimalController.instance === undefined) {
            const {Animal, Area} = await SequelizeManager.getInstance();
            AnimalController.instance = new AnimalController(Animal, Area);
        }
        return AnimalController.instance;
    }

    private constructor(Animal: ModelCtor<AnimalInstance>, Area: ModelCtor<AreaInstance>) {
        this.Animal = Animal;
        this.Area = Area;
    }

    public async create(props: AnimalCreationProps, areaId: number): Promise<AnimalInstance | null> {
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });
        if (area === null) {
            return null;
        }
        const animal: AnimalInstance | null = await this.Animal.create({
            ...props
        });
        if (animal === null) {
            return null;
        }
        await animal.setArea(area);
        return animal;
    }

    public async read(id: number): Promise<AnimalInstance | null> {
        return await this.Animal.findOne({
            where: {
                id
            }
        });
    }

    public async update(id: number, props: AnimalCreationProps, areaId: number): Promise<AnimalInstance | null> {
        const animal: AnimalInstance | null = await this.read(id);
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });
        if (animal === null || area === null) {
            return null;
        }
        animal.name = props.name;
        animal.species = props.species;
        animal.journal = props.journal;
        await animal.setArea(area);
        return animal;
    }

    public async delete(id: number): Promise<boolean> {
        const animal: AnimalInstance | null = await this.read(id);
        if (animal === null) {
            return false;
        }
        await animal.destroy();
        return true;
    }
}