import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {AreaInstance} from "./area.model";

export interface MaintenanceProps {
    id: number;
    startDate: Date;
    endDate: Date;
}

export interface MaintenanceCreationProps extends Optional<MaintenanceProps, "id"> {}

export interface MaintenanceInstance extends Model<MaintenanceProps, MaintenanceCreationProps>, MaintenanceProps {
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<MaintenanceInstance> {
    return sequelize.define<MaintenanceInstance>("Maintenance", {
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