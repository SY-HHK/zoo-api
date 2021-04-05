import {ModelCtor, Sequelize} from "sequelize";
import {Dialect} from "sequelize/types/lib/sequelize";
import userCreator, {UserInstance} from "./user.model";
import sessionCreator, {SessionInstance} from "./session.model";
import ticketCreator, {TicketInstance} from "./ticket.model";
import ticketTypeCreator, {TicketTypeInstance} from "./ticketType.model";
import workerCreator, {WorkerInstance} from "./worker.model";
import roleCreator, {RoleInstance} from "./role.model";
import animalCreator, {AnimalInstance} from "./animal.model";
import areaCreator, {AreaInstance} from "./area.model";
import areaTypeCreator, {AreaTypeInstance} from "./areaType.model";
import imageCreator, {ImageInstance} from "./image.model";
import maintenanceCreator, {MaintenanceInstance} from "./maintenance.model";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Ticket: ModelCtor<TicketInstance>;
    TicketType: ModelCtor<TicketTypeInstance>;
    Worker: ModelCtor<WorkerInstance>;
    Role: ModelCtor<RoleInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Area: ModelCtor<AreaInstance>;
    AreaType: ModelCtor<AreaTypeInstance>;
    Image: ModelCtor<ImageInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Ticket: ModelCtor<TicketInstance>;
    TicketType: ModelCtor<TicketTypeInstance>;
    Worker: ModelCtor<WorkerInstance>;
    Role: ModelCtor<RoleInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Area: ModelCtor<AreaInstance>;
    AreaType: ModelCtor<AreaTypeInstance>;
    Image: ModelCtor<ImageInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;

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
            TicketType: ticketTypeCreator(sequelize),
            Worker: workerCreator(sequelize),
            Role: roleCreator(sequelize),
            Animal: animalCreator(sequelize),
            Area: areaCreator(sequelize),
            AreaType: areaTypeCreator(sequelize),
            Image: imageCreator(sequelize),
            Maintenance: maintenanceCreator(sequelize),
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
        props.Worker.belongsTo(props.User); //worker 1 user
        props.User.hasOne(props.Worker); //user 1-0 worker
        props.Worker.belongsTo(props.Role); //worker 1 role
        props.Role.hasMany(props.Worker); //role n workers
        props.Animal.belongsTo(props.Area); //animal 1 area
        props.Area.hasMany(props.Animal); //area n animals
        props.Image.belongsTo(props.Area); //image 1 area
        props.Area.hasMany(props.Image); //area n images
        props.Maintenance.belongsTo(props.Area); //maintenance 1 area
        props.Area.hasMany(props.Maintenance); //area n maintenances
        props.Area.belongsTo(props.AreaType); //area 1 areaType
        props.AreaType.hasMany(props.Area); //areaType n areas
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.User = props.User;
        this.Session = props.Session;
        this.Ticket = props.Ticket;
        this.TicketType = props.TicketType;
        this.Worker = props.Worker;
        this.Role = props.Role;
        this.Animal = props.Animal;
        this.Area = props.Area;
        this.AreaType = props.AreaType;
        this.Image = props.Image;
        this.Maintenance = props.Maintenance;
    }
}