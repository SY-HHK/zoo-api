import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {AreaInstance} from "./area.model";

export interface ImageProps {
    id: number;
    path: string;
}

export interface ImageCreationProps extends Optional<ImageProps, "id"> {}

export interface ImageInstance extends Model<ImageProps, ImageCreationProps>, ImageProps {
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<ImageInstance> {
    return sequelize.define<ImageInstance>("Image", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        path: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}