import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {UserInstance} from "./user.model";
import {RoleInstance} from "./role.model";

export interface WorkerProps {
    id: number;
    atWork: boolean;
}

export interface WorkerCreationProps extends Optional<WorkerProps, "id"> {}

export interface WorkerInstance extends Model<WorkerProps, WorkerCreationProps>, WorkerProps {
    getUser: HasOneGetAssociationMixin<UserInstance>;
    setUser: HasOneSetAssociationMixin<UserInstance, "id">;
    getRole: BelongsToGetAssociationMixin<RoleInstance>;
    setRole: BelongsToSetAssociationMixin<RoleInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<WorkerInstance> {
    return sequelize.define<WorkerInstance>("Worker", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        atWork: {
            type: DataTypes.BOOLEAN
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}