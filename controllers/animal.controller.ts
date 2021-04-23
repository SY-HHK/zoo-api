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

    public async create(props: AnimalCreationProps): Promise<AnimalInstance | null> {

    }

    public async read(id: number): Promise<AnimalInstance | null> {

    }

    public async update(id: number, props: AnimalCreationProps): Promise<AnimalInstance | null> {

    }

    public async delete(id: number): Promise<boolean> {

    }
}