import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";

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
}
