import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin, HasManySetAssociationsMixin
} from "sequelize";
import {WorkerInstance} from "./worker.model";

export interface RoleProps {
    id: number;
    name: string;
}

export interface RoleCreationProps extends Optional<RoleProps, "id"> {}

export interface RoleInstance extends Model<RoleProps, RoleCreationProps>, RoleProps {
    getWorkers: HasManyGetAssociationsMixin<WorkerInstance>;
    setWorker: HasManySetAssociationsMixin<WorkerInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<RoleInstance> {
    return sequelize.define<RoleInstance>("Role", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}