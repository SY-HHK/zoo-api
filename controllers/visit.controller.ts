import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AreaInstance} from "../models/area.model";
import {UserInstance} from "../models/user.model";
import {TicketInstance} from "../models/ticket.model";

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


}