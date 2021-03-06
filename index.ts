import {config} from "dotenv";
config();
import express, {Express} from "express";
import bodyParser from "body-parser";

import {buildRoutes} from "./routes";

const app: Express = express();

app.use(bodyParser.json());

buildRoutes(app);

const port = process.env.NODE_PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
});

