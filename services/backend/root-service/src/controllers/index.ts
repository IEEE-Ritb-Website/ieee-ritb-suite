import { mongodbClient } from "@/db";
import { GetChaptersController } from "./chapters/getChapters";
import { CronHandlerController } from "./cron/cronHandler";
import { GetUsersController } from "./user/getUsers";

export class ControllerClass {
    constructor() {
        // do something
        mongodbClient.init();
    }

    getChapters = GetChaptersController;
    cronHandler = CronHandlerController;
    getUsers = GetUsersController;
}

const Controllers = new ControllerClass();
export default Controllers;
