import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin
} from "sequelize";
import {TicketInstance} from "./ticket.model";

export interface TicketTypeProps {
    id: number;
    name: string;
    price: number;
    data: JSON;
}

export interface TicketTypeCreationProps extends Optional<TicketTypeProps, "id"> {}

export interface TicketTypeInstance extends Model<TicketTypeProps, TicketTypeCreationProps>, TicketTypeProps {
    getTickets: HasManyGetAssociationsMixin<TicketInstance>;
    addTicket: HasManyAddAssociationMixin<TicketInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<TicketTypeInstance> {
    return sequelize.define<TicketTypeInstance>("Ticket_type", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DOUBLE
        },
        data: {
            type: DataTypes.JSON
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}