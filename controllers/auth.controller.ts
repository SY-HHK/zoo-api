import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";
import {WorkerInstance} from "../models/worker.model";
import {RoleInstance} from "../models/role.model";

export class AuthController {

    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: AuthController;

    public static async getInstance(): Promise<AuthController> {
        if(AuthController.instance === undefined) {
            const {User, Session} = await SequelizeManager.getInstance();
            AuthController.instance = new AuthController(User, Session);
        }
        return AuthController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.User = User;
        this.Session = Session;
    }

    public async subscribe(props: UserCreationProps):
        Promise<UserInstance | null> {
        const passwordHashed = await hash(props.password, 5);
        return this.User.create({
            ...props,
            password: passwordHashed
        });
    }

    public async log(email: string, password: string): Promise<SessionInstance | null> {
        const user = await this.User.findOne({
            where: {
                email
            }
        });
        if(user === null) {
            return null;
        }
        const isSamePassword = await compare(password, user.password);
        if(!isSamePassword) {
            return null;
        }
        const token = await hash( Date.now() + email, 5);
        const session = await this.Session.create({
            token
        });
        await session.setUser(user);
        return session;
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    public async deleteSession(token?: string): Promise<boolean> {
        const session = await this.Session.findOne({
            where: {
                token
            }
        });
        if (session === null) return false;
        await session.destroy();
        return true;
    }

    /**
     * Return true if user.worker.role.name === 'admin' else return false
     */
    public async isAdmin(session: SessionInstance): Promise<boolean> {
        const user: UserInstance = await session.getUser();
        const worker: WorkerInstance = await user.getWorker();
        if (worker === null) {
            return false;
        }
        const workerRole: RoleInstance = await worker.getRole();
        if (workerRole === null) {
            return false;
        }
        return workerRole.name === 'admin';
    }
}
