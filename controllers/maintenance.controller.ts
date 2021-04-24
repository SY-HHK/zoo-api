import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {MaintenanceCreationProps, MaintenanceInstance} from "../models/maintenance.model";
import {AreaInstance} from "../models/area.model";

export class MaintenanceController {

    Maintenance: ModelCtor<MaintenanceInstance>;
    Area: ModelCtor<AreaInstance>;

    private static instance: MaintenanceController;

    public static async getInstance(): Promise<MaintenanceController> {
        if(MaintenanceController.instance === undefined) {
            const {Maintenance, Area} = await SequelizeManager.getInstance();
            MaintenanceController.instance = new MaintenanceController(Maintenance, Area);
        }
        return MaintenanceController.instance;
    }

    private constructor(Maintenance: ModelCtor<MaintenanceInstance>, Area: ModelCtor<AreaInstance>) {
        this.Maintenance = Maintenance;
        this.Area = Area;
    }

    public async create(props: MaintenanceCreationProps, areaId: number): Promise<MaintenanceInstance | null> {
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });
        if (area === null) {
            return null;
        }
        const maintenance: MaintenanceInstance | null = await this.Maintenance.create({
            ...props
        });
        if (maintenance === null) {
            return null;
        }
        await maintenance.setArea(area);
        return maintenance;
    }

    public async read(id: number): Promise<MaintenanceInstance | null> {
        return await this.Maintenance.findOne({
            where: {
                id
            }
        });
    }

    public async update(id: number, props: MaintenanceCreationProps, areaId: number): Promise<MaintenanceInstance | null> {
        const maintenance: MaintenanceInstance | null = await this.read(id);
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });
        if (maintenance === null || area === null) {
            return null;
        }
        maintenance.startDate = props.startDate;
        maintenance.endDate = props.endDate;
        await maintenance.setArea(area);
        return maintenance;
    }

    public async delete(id: number): Promise<boolean> {
        const maintenance: MaintenanceInstance | null = await this.read(id);
        if (maintenance === null) {
            return false;
        }
        await maintenance.destroy();
        return true;
    }
}