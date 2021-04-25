import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {WorkerCreationProps, WorkerInstance} from "../models/worker.model";
import {RoleInstance} from "../models/role.model";
import {UserInstance} from "../models/user.model";

export class WorkerController {

    User: ModelCtor<UserInstance>;
    Worker: ModelCtor<WorkerInstance>;
    Role: ModelCtor<RoleInstance>;

    private static instance: WorkerController;

    public static async getInstance(): Promise<WorkerController> {
        if(WorkerController.instance === undefined) {
            const {User, Worker, Role} = await SequelizeManager.getInstance();
            WorkerController.instance = new WorkerController(User, Worker, Role);
        }
        return WorkerController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Worker: ModelCtor<WorkerInstance>, Role: ModelCtor<RoleInstance>) {
        this.User = User;
        this.Worker = Worker;
        this.Role = Role;
    }

    public async create(props: WorkerCreationProps, userId: number, roleId: number): Promise<WorkerInstance | null> {
        const user: UserInstance |null = await this.User.findOne({
            where: {
                id: userId
            }
        });
        const role: RoleInstance |null = await this.Role.findOne({
            where: {
                id: roleId
            }
        });
        if (user === null || role === null) {
            return null;
        }
        const alreadyExist = await user.getWorker();
        if (alreadyExist !== null) {
            return null;
        }
        const worker: WorkerInstance | null = await this.Worker.create({
            ...props
        });
        if (worker === null) {
            return null;
        }
        await worker.setUser(user);
        await worker.setRole(role);
        return worker;
    }

    public async read(id: number): Promise<WorkerInstance | null> {
        return await this.Worker.findOne({
            where: {
                id
            }
        });
    }

    public async update(id: number, props: WorkerCreationProps, userId: number, roleId: number): Promise<WorkerInstance | null> {
        const worker: WorkerInstance |null = await this.read(id);
        if (worker === null) {
            return null;
        }
        const user: UserInstance | null = await this.User.findOne({
            where: {
                id: userId
            }
        });
        if (user === null) {
            return null;
        }
        const role: RoleInstance | null = await this.Role.findOne({
            where: {
                id: roleId
            }
        })
        if (role === null) {
            return null;
        }
        worker.atWork = props.atWork;
        await worker.setUser(user);
        await worker.setRole(role);
        await worker.save();
        return worker;
    }

    public async delete(id: number): Promise<boolean> {
        const worker: WorkerInstance | null = await this.read(id);
        if (worker === null) {
            return false;
        }
        await worker.destroy();
        return true;
    }
}