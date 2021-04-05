import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin,
    HasOneSetAssociationMixin, HasOneGetAssociationMixin
} from "sequelize";
import {UserInstance} from "./user.model";
import {TicketTypeInstance} from "./ticketType.model";

export interface TicketProps {
    id: number;
    startDate: Date;
    endDate: Date;
}

export interface TicketCreationProps extends Optional<TicketProps, "id"> {}

export interface TicketInstance extends Model<TicketProps, TicketCreationProps>, TicketProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
    getType: HasOneGetAssociationMixin<TicketTypeInstance>;
    setType: HasOneSetAssociationMixin<TicketTypeInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<TicketInstance> {
    return sequelize.define<TicketInstance>("Ticket", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}