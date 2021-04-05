import {ModelCtor, Sequelize} from "sequelize";
import userCreator, {UserInstance} from "./user.model";
import sessionCreator, {SessionInstance} from "./session.model";
import {Dialect} from "sequelize/types/lib/sequelize";
import ticketCreator, {TicketInstance} from "./ticket.model";
import ticketTypeCreator, {TicketTypeInstance} from "./ticketType.model";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Ticket: ModelCtor<TicketInstance>;
    TicketType: ModelCtor<TicketTypeInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Ticket: ModelCtor<TicketInstance>;
    TicketType: ModelCtor<TicketTypeInstance>;

    public static async getInstance(): Promise<SequelizeManager> {
        if(SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            User: userCreator(sequelize),
            Session: sessionCreator(sequelize),
            Ticket: ticketCreator(sequelize),
            TicketType: ticketTypeCreator(sequelize)
        }
        SequelizeManager.associate(managerProps);
        await sequelize.sync();
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {
        props.User.hasMany(props.Session); // User N Session
        props.Session.belongsTo(props.User); // Session 1 User
        props.User.hasMany(props.Ticket); // User N tickets
        props.Ticket.belongsTo(props.User); // ticket 1 User
        props.TicketType.hasMany(props.Ticket); // ticketType N ticket
        props.Ticket.belongsTo(props.TicketType); // ticket 1 ticketType
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.User = props.User;
        this.Session = props.Session;
        this.Ticket = props.Ticket;
        this.TicketType = props.TicketType;
    }
}