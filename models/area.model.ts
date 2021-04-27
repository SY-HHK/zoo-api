import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin, HasManyAddAssociationsMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {AnimalInstance} from "./animal.model";
import {AreaTypeInstance} from "./areaType.model";
import {ImageInstance} from "./image.model";
import {MaintenanceInstance} from "./maintenance.model";

export interface AreaProps {
    id: number;
    name: string;
    description: string;
    capacity: number;
    duration: number;
    openAt: number;
    closeAt: number;
    handicapAccess: boolean;
    journal: string;
}

export interface AreaCreationProps extends Optional<AreaProps, "id"> {}

export interface AreaInstance extends Model<AreaProps, AreaCreationProps>, AreaProps {
    getAnimals: HasManyGetAssociationsMixin<AnimalInstance>,
    addAnimal: HasManyAddAssociationsMixin<AnimalInstance, "id">,
    getImages: HasManyGetAssociationsMixin<ImageInstance>,
    addImage: HasManyAddAssociationsMixin<ImageInstance, "id">,
    getMaintenances: HasManyGetAssociationsMixin<MaintenanceInstance>,
    addMaintenance: HasManyAddAssociationsMixin<MaintenanceInstance, "id">,
    getArea_type: BelongsToGetAssociationMixin<AreaTypeInstance>;
    setArea_type: BelongsToSetAssociationMixin<AreaTypeInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<AreaInstance> {
    return sequelize.define<AreaInstance>("Area", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        capacity: {
            type: DataTypes.BIGINT
        },
        duration: {
            type: DataTypes.DOUBLE
        },
        openAt: {
            type: DataTypes.FLOAT
        },
        closeAt: {
            type: DataTypes.FLOAT
        },
        handicapAccess: {
            type: DataTypes.BOOLEAN
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