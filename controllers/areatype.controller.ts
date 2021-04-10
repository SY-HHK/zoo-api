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

    public async create(props: AreaTypeCreationProps, areaId: number):Promise<AreaTypeInstance | null> {
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });

        if(area === null) {
            return null;
        }
        const areaType: AreaTypeInstance | null = await this.AreaType.create({
            ...props
        });

        if(areaType === null) {
            return null;
        }

        await areaType.setArea(area);
        return areaType

    }

}