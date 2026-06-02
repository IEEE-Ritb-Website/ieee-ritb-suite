import { mongodbClient } from "@/db";
import { CreateShortUrlController } from "./shortUrl/createShortUrl";
import { GetShortUrlController } from "./shortUrl/getShortUrl";
import { CronHandlerController } from "./cron/cronHandler";

export class ControllerClass {
    constructor() {
        mongodbClient.init();
    }

    getShortUrl = GetShortUrlController;
    createShortUrl = CreateShortUrlController;
    cronHandler = CronHandlerController;
}

const Controllers = new ControllerClass();
export default Controllers;
