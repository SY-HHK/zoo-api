import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {ImageInstance} from "../models/image.model";
import {AreaTypeInstance} from "../models/areaType.model";
import {AreaCreationProps, AreaInstance} from "../models/area.model";

export class AreaController {

    Area: ModelCtor<AreaInstance>;
    Image: ModelCtor<ImageInstance>;
    AreaType: ModelCtor<AreaTypeInstance>;

    private static instance: AreaController;

    public static async getInstance(): Promise<AreaController> {
        if(AreaController.instance === undefined) {
            const {Area, Image, AreaType} = await SequelizeManager.getInstance();
            AreaController.instance = new AreaController(Area, Image, AreaType);
        }
        return AreaController.instance;
    }

    private constructor(Area: ModelCtor<AreaInstance>, Image: ModelCtor<ImageInstance>, AreaType: ModelCtor<AreaTypeInstance>) {
        this.Area = Area;
        this.Image = Image;
        this.AreaType = AreaType;
    }

    public async create(props: AreaCreationProps, areaTypeId: number):Promise<AreaInstance | null> {
        const areaType: AreaTypeInstance | null = await this.AreaType.findOne({
            where: {
                id: areaTypeId
            }
        });
        if (areaType === null) {
            return null;
        }
        const area: AreaInstance | null = await this.Area.create({
            ...props,
        });
        if (area === null) {
            return null;
        }
        await area.setArea_type(areaType);
        return area;
    }

    public async update(id: number, props: AreaCreationProps, areaTypeId: number): Promise<AreaInstance | null> {
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id
            }
        });
        const areaType: AreaTypeInstance | null = await this.AreaType.findOne({
            where: {
                id: areaTypeId
            }
        });
        if(area === null || areaType === null) {
            return null;
        }

        area.name = props.name;
        area.description = props.description;
        area.openAt = props.openAt;
        area.closeAt = props.closeAt;
        area.journal = props.journal;
        area.capacity = props.capacity;
        area.duration = props.duration;
        area.handicapAccess = props.handicapAccess;
        area.journal = props.journal;

        await area.setArea_type(areaType);
        return await area.save();
    }

    public async delete(id: number): Promise<boolean> {
        const area: AreaInstance | null = await this.read(id);
        if(area === null) {
            return false;
        }
        await area.destroy();
        return true;
    }

    public async read(id: number): Promise<AreaInstance | null> {
        return await this.Area.findOne({
            where: {
                id
            }
        });
    }
}
