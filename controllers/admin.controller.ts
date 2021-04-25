import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AreaInstance} from "../models/area.model";
import {UserInstance} from "../models/user.model";
import {TicketInstance} from "../models/ticket.model";

export class AdminController {

    User: ModelCtor<UserInstance>;
    Ticket: ModelCtor<TicketInstance>
    Area: ModelCtor<AreaInstance>;

    private static instance: AdminController;

    public static async getInstance(): Promise<AdminController> {
        if(AdminController.instance === undefined) {
            const {Area, Ticket, User} = await SequelizeManager.getInstance();
            AdminController.instance = new AdminController(Area, Ticket, User);
        }
        return AdminController.instance;
    }

    private constructor(Area: ModelCtor<AreaInstance>, Ticket: ModelCtor<TicketInstance>, User: ModelCtor<UserInstance>) {
        this.Area = Area;
        this.Ticket = Ticket;
        this.User = User;
    }

    public async stats(): Promise<any> {
        return await this.Ticket.findAndCountAll({
            where: {
                active: true,
                startDate: {
                    $gte: new Date()
                },
                endDate: {
                    $lte: new Date()
                }
            },
            group: ['area_id']
        });
    }
}