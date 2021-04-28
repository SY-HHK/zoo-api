import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AreaInstance} from "../models/area.model";
import {AreaTypeCreationProps, AreaTypeInstance} from "../models/areaType.model";


export class AreaTypeController {

    Area: ModelCtor<AreaInstance>;
    AreaType: ModelCtor<AreaTypeInstance>;

    private static instance: AreaTypeController;

    public static async getInstance(): Promise<AreaTypeController> {
        if(AreaTypeController.instance === undefined) {
            const {Area, AreaType} = await SequelizeManager.getInstance();
            AreaTypeController.instance = new AreaTypeController(Area, AreaType);
        }
        return AreaTypeController.instance;
    }

    private constructor(Area: ModelCtor<AreaInstance>, AreaType: ModelCtor<AreaTypeInstance>) {
        this.Area = Area;
        this.AreaType = AreaType;
    }

    public async create(props: AreaTypeCreationProps):Promise<AreaTypeInstance | null> {
        const alreadyExist: AreaTypeInstance | null = await this.AreaType.findOne({
            where: {
                name: props.name
            }
        });
        if(alreadyExist !== null) {
            return null;
        }
        return await this.AreaType.create({
            ...props
        });
    }

    public async read(id: number): Promise<AreaTypeInstance | null> {
        return await this.AreaType.findOne({
            where: {
                id
            }
        });
    }

    public async update(id: number, props: AreaTypeCreationProps): Promise<AreaTypeInstance | null> {
        const areaType: AreaTypeInstance | null = await this.AreaType.findOne({
            where:{
                id
            }
        });
        if(areaType === null) {
            return null;
        }
        areaType.name = props.name;
        return await areaType.save();
    }

    public async delete(id: number): Promise<boolean> {
        const areaType: AreaTypeInstance | null = await this.read(id);
        if (areaType === null) {
            return false;
        }
        await areaType.destroy();
        return true;
    }

}