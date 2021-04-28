import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AreaInstance} from "../models/area.model";
import {UserInstance} from "../models/user.model";
import {TicketInstance} from "../models/ticket.model";
import {TicketTypeInstance} from "../models/ticketType.model";

export class VisitController {

    User: ModelCtor<UserInstance>;
    Ticket: ModelCtor<TicketInstance>
    Area: ModelCtor<AreaInstance>;

    private static instance: VisitController;

    public static async getInstance(): Promise<VisitController> {
        if(VisitController.instance === undefined) {
            const {User, Ticket, Area} = await SequelizeManager.getInstance();
            VisitController.instance = new VisitController(User, Ticket, Area);
        }
        return VisitController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Ticket: ModelCtor<TicketInstance>, Area: ModelCtor<AreaInstance>) {
        this.User = User;
        this.Ticket = Ticket;
        this.Area = Area;
    }

    public async enter(id: number): Promise<boolean> {
        const ticket: TicketInstance | null = await this.read(id);
        if (ticket === null) {
            return false;
        }
        if (!this.isValid(ticket)) {
            return false;
        }
        ticket.active = true;
        await ticket.save();
        return true;
    }

    public async leave(id: number): Promise<boolean> {
        const ticket: TicketInstance | null = await this.read(id);
        if (ticket === null) {
            return false;
        }
        if (!this.isValid(ticket)) {
            return false;
        }
        ticket.active = false;
        await ticket.save();
        return true;
    }

    public async visit(id: number, nextArea: number): Promise<boolean> {
        const ticket: TicketInstance | null = await this.read(id);
        const nextAreaInstance: AreaInstance | null = await this.Area.findOne({
            where: {
                id: nextArea
            }
        });
        if (ticket === null || nextAreaInstance === null) {
            return false;
        }
        if (!ticket.active || !this.isValid(ticket, nextAreaInstance)) {
            return false;
        }
        const ticketType: TicketTypeInstance = await ticket.getTicket_type();
        if (ticketType.data.areaOrder !== undefined) {
            if (!this.canVisit(ticketType.data.areaOrder, ticket.currentAreaId, nextArea)) {
                return false;
            }
        }
        ticket.currentAreaId = nextAreaInstance.id;
        await ticket.save();
        return true;
    }

    public async read(id: number): Promise<TicketInstance | null> {
        return await this.Ticket.findOne({
            where: {
                id
            }
        });
    }

    private isValid(ticket: TicketInstance, nextArea?: AreaInstance): boolean {
        const currentDate: Date = new Date(Date.now());
        if (ticket.startDate.getTime() > currentDate.getTime() || ticket.endDate.getTime() < currentDate.getTime()) {
            return false;
        }
        if (nextArea !== undefined && (nextArea.openAt > currentDate.getHours()+(currentDate.getMinutes()/60) || nextArea.closeAt < currentDate.getHours()+(currentDate.getMinutes()/60))) {
            return false;
        }
        return true;
    }

    private canVisit(areaOrder: number[], currentArea: number | undefined, nextArea: number): boolean {
        console.log(currentArea);
        if (currentArea === null || currentArea === undefined) {
            return areaOrder.indexOf(nextArea) === 0;
        }
        if (areaOrder.indexOf(currentArea) === -1) {
            return false;
        }
        if (areaOrder.indexOf(currentArea) === areaOrder.length-1) {
            return false;
        }
        return areaOrder[areaOrder.indexOf(currentArea)+1] === nextArea;
    }
}