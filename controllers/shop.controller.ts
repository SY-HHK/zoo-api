import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {TicketCreationProps, TicketInstance} from "../models/ticket.model";
import {UserInstance} from "../models/user.model";
import {TicketTypeInstance} from "../models/ticketType.model";


export class ShopController {

    Ticket: ModelCtor<TicketInstance>;
    TicketType: ModelCtor<TicketTypeInstance>;
    User: ModelCtor<UserInstance>;

    private static instance: ShopController;

    public static async getInstance(): Promise<ShopController> {
        if(ShopController.instance === undefined) {
            const {Ticket, TicketType, User} = await SequelizeManager.getInstance();
            ShopController.instance = new ShopController(Ticket, TicketType, User);
        }
        return ShopController.instance;
    }

    private constructor(Ticket: ModelCtor<TicketInstance>, TicketType: ModelCtor<TicketTypeInstance>, User: ModelCtor<UserInstance>) {
        this.Ticket = Ticket;
        this.TicketType = TicketType;
        this.User = User;
    }

    public async buy(props: TicketCreationProps, ticketTypeId: number, userId: number): Promise<TicketInstance | null> {
        const ticketType: TicketTypeInstance | null = await this.TicketType.findOne({
            where: {
                id: ticketTypeId
            }
        });
        const user: UserInstance | null = await this.User.findOne({
            where: {
                id: userId
            }
        });
        if (ticketType === null || user === null) {
            return null;
        }
        const ticket: TicketInstance |null = await this.Ticket.create({
            ...props
        });
        if (ticket === null) {
            return null;
        }
        await ticket.setType(ticketType);
        await ticket.setUser(user);
        return ticket;
    }

    public async read(id: number): Promise<TicketInstance | null> {
        return this.Ticket.findOne({
            where: {
                id
            }
        });
    }

    public async give(id: number, userId: number): Promise<TicketInstance | null> {
        const ticket: TicketInstance | null = await this.read(id);
        const user: UserInstance | null = await this.User.findOne({
            where: {
                id: userId
            }
        });
        if (ticket === null || user === null) {
            return null;
        }
        await ticket.setUser(user);
        return ticket;
    }

    public async cancel(id: number): Promise<boolean> {
        const ticket: TicketInstance | null = await this.read(id);
        if (ticket === null) {
            return false;
        }
        await ticket.destroy();
        return true;
    }
}