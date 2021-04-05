import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {AreaInstance} from "./area.model";

export interface AnimalProps {
    id: number;
    species: string;
    journal: string;
}

export interface AnimalCreationProps extends Optional<AnimalProps, "id"> {}

export interface AnimalInstance extends Model<AnimalProps, AnimalCreationProps>, AnimalProps {
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<AnimalInstance> {
    return sequelize.define<AnimalInstance>("Animal", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        species: {
            type: DataTypes.STRING
        },
        journal: {
            type: DataTypes.TEXT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}