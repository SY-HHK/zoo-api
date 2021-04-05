import {SequelizeManager} from "../models";
import {config} from "dotenv";
config();

SequelizeManager.getInstance().then((res) => {
    console.log('done.');
});