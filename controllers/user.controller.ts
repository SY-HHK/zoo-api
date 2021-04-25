import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";
import {hash} from "bcrypt";
import {WorkerInstance} from "../models/worker.model";
import {RoleInstance} from "../models/role.model";

export class UserController {

    User: ModelCtor<UserInstance>;
    Worker: ModelCtor<WorkerInstance>;
    Role: ModelCtor<RoleInstance>;

    private static instance: UserController;

    public static async getInstance(): Promise<UserController> {
        if(UserController.instance === undefined) {
            const {User, Worker, Role} = await SequelizeManager.getInstance();
            UserController.instance = new UserController(User, Worker, Role);
        }
        return UserController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Worker: ModelCtor<WorkerInstance>, Role: ModelCtor<RoleInstance>) {
        this.User = User;
        this.Worker = Worker;
        this.Role = Role;
    }

    public async create(props: UserCreationProps): Promise<UserInstance | null> {
        const alreadyExist = await this.readByEmail(props.email);
        if (alreadyExist) {
            return null;
        }
        const hashedPassword = await hash(props.password, 5);
        return await this.User.create({
            ...props,
            password: hashedPassword
        });
    }

    public async read(id: number): Promise<UserInstance | null> {
        return await this.User.findOne({
            where: {
                id
            }
        });
    }

    public async update(id: number, props: UserCreationProps): Promise<UserInstance | null> {
        const user: UserInstance | null = await this.User.findOne({
            where:{
                id
            }
        });
        if (user === null) return null;
        user.email = props.email;
        user.password = await hash(props.password, 5);
        return await user.save();
    }

    public async delete(id: number): Promise<boolean> {
        const user: UserInstance| null = await this.User.findOne({
            where:{
                id
            }
        });
        if (user === null) return false;
        await user.destroy();
        return true;
    }

    public async readByEmail(email: string): Promise<UserInstance |null> {
        return await this.User.findOne({
            where: {
                email
            }
        })
    }
}