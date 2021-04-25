import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {TicketTypeCreationProps, TicketTypeInstance} from "../models/ticketType.model";


export class TicketTypeController {

    TicketType: ModelCtor<TicketTypeInstance>;

    private static instance: TicketTypeController;

    public static async getInstance(): Promise<TicketTypeController> {
        if(TicketTypeController.instance === undefined) {
            const {TicketType} = await SequelizeManager.getInstance();
            TicketTypeController.instance = new TicketTypeController(TicketType);
        }
        return TicketTypeController.instance;
    }

    private constructor(TicketType: ModelCtor<TicketTypeInstance>) {
        this.TicketType = TicketType;
    }

    public async create(props: TicketTypeCreationProps): Promise<TicketTypeInstance | null> {
        const alreadyExist: TicketTypeInstance | null = await this.TicketType.findOne({
            where: {
                name: props.name
            }
        });
        if (alreadyExist !== null) {
            return null;
        }
        return await this.TicketType.create({
            ...props
        });
    }

    public async read(id: number): Promise<TicketTypeInstance | null> {
        return await this.TicketType.findOne({
            where: {
                id
            }
        })
    }

    public async update(id: number, props: TicketTypeCreationProps): Promise<TicketTypeInstance | null> {
        const ticketType: TicketTypeInstance | null = await this.read(id);
        if (ticketType === null) {
            return null;
        }
        ticketType.name = props.name;
        ticketType.price = props.price;
        ticketType.data = props.data;
        await ticketType.save();
        return ticketType;
    }

    public async delete(id: number): Promise<boolean> {
        const ticketType: TicketTypeInstance | null = await this.read(id);
        if (ticketType === null) {
            return false;
        }
        await ticketType.destroy();
        return true;
    }
}