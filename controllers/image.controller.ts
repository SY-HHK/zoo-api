import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {ImageCreationProps, ImageInstance} from "../models/image.model";
import {AreaInstance} from "../models/area.model";

export class ImageController {

    Image: ModelCtor<ImageInstance>;
    Area: ModelCtor<AreaInstance>;
    rootDir: string;

    private static instance: ImageController;

    public static async getInstance(): Promise<ImageController> {
        if(ImageController.instance === undefined) {
            const {Image, Area} = await SequelizeManager.getInstance();
            ImageController.instance = new ImageController(Image, Area);
        }
        return ImageController.instance;
    }

    private constructor(Image: ModelCtor<ImageInstance>, Area: ModelCtor<AreaInstance>) {
        this.Image = Image;
        this.Area = Area;
        this.rootDir = require('path').dirname(require.main !== undefined ? require.main.filename : '');
    }

    public async create(props: ImageCreationProps, base64: string, areaId: number): Promise<ImageInstance | null> {
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });
        if (area === null) {
            return null;
        }
        const images: ImageInstance[] = await area.getImages();
        props.path = this.rootDir+'/resources/area'+areaId+'-image'+(images.length+1);
        const isSaved: boolean = await this.saveImage(base64, props.path);
        if (!isSaved) {
            return null;
        }
        const image: ImageInstance | null = await this.Image.create({
            ...props
        });
        if (image === null) {
            await require('fs/promises').rm(props.path);
            return null;
        }
        await image.setArea(area);
        return image;
    }

    public async read(id: number): Promise<ImageInstance | null> {
        return await this.Image.findOne({
            where: {
                id
            }
        });
    }

    public async update(id: number, areaId: number): Promise<ImageInstance | null> {
        const image: ImageInstance | null = await this.read(id);
        const area: AreaInstance | null = await this.Area.findOne({
            where: {
                id: areaId
            }
        });
        if (image === null || area === null) {
            return null;
        }
        await image.setArea(area);
        return image;
    }

    public async delete(id: number): Promise<boolean> {
        const image: ImageInstance | null = await this.read(id);
        if (image === null) {
            return false;
        }
        await require('fs/promises').rm(image.path);
        await image.destroy();
        return true;
    }

    private async saveImage(base64: string, path: string): Promise<boolean> {
        const base64Data = base64.replace(/^data:image\/png;base64,/, "");
        const error: any = await require("fs/promises").writeFile(path, base64Data, {encoding: 'base64'});
        return !error;
    }
}