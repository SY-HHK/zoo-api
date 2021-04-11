import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {RoleCreationProps, RoleInstance} from "../models/role.model";
import {WorkerInstance} from "../models/worker.model";

export class RoleController {

    Worker: ModelCtor<WorkerInstance>;
    Role: ModelCtor<RoleInstance>;

    private static instance: RoleController;

    public static async getInstance(): Promise<RoleController> {
        if(RoleController.instance === undefined) {
            const {Worker, Role} = await SequelizeManager.getInstance();
            RoleController.instance = new RoleController(Worker, Role);
        }
        return RoleController.instance;
    }

    private constructor(Worker: ModelCtor<WorkerInstance>, Role: ModelCtor<RoleInstance>) {
        this.Worker = Worker;
        this.Role = Role;
    }

    public async create(props: RoleCreationProps): Promise<RoleInstance | null> {
        const alreadyExist: RoleInstance |null = await this.Role.findOne({
            where: {
                name: props.name
            }
        });
        if (alreadyExist !== null) {
            return null;
        }
        return await this.Role.create({
            ...props
        });
    }

    public async read(id: number): Promise<RoleInstance | null> {
        return await this.Role.findOne({
            where: {
                id
            }
        })
    }

    public async update(id: number, props: RoleCreationProps): Promise<RoleInstance | null> {
        const role: RoleInstance | null = await this.read(id);
        if (role === null) {
            return null;
        }
        role.name = props.name;
        await role.save();
        return role;
    }

    public async delete(id: number): Promise<boolean> {
        const role: RoleInstance | null = await this.read(id);
        if (role === null) {
            return false;
        }
        await role.destroy();
        return true;
    }
}