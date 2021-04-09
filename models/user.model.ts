import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin
} from "sequelize";
import {SessionInstance} from "./session.model";
import {TicketInstance} from "./ticket.model";
import {WorkerInstance} from "./worker.model";

export interface UserProps {
    id: number;
    password: string;
    email: string;
}

export interface UserCreationProps extends Optional<UserProps, "id"> {}

export interface UserInstance extends Model<UserProps, UserCreationProps>, UserProps {
    getSessions: HasManyGetAssociationsMixin<SessionInstance>;
    addSession: HasManyAddAssociationMixin<SessionInstance, "id">;
    getTickets: HasManyGetAssociationsMixin<TicketInstance>;
    addTicket: HasManyAddAssociationMixin<TicketInstance, "id">;
    getWorker: HasOneGetAssociationMixin<WorkerInstance>;
    setWorker: HasOneSetAssociationMixin<WorkerInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<UserInstance> {
    return sequelize.define<UserInstance>("User", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}