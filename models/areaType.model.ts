import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {AreaInstance} from "./area.model";

export interface AreaTypeProps {
    id: number;
    name: string;
}

export interface AreaTypeCreationProps extends Optional<AreaTypeProps, "id"> {}

export interface AreaTypeInstance extends Model<AreaTypeProps, AreaTypeCreationProps>, AreaTypeProps {
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<AreaTypeInstance> {
    return sequelize.define<AreaTypeInstance>("Area_type", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        }
    },
        {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}