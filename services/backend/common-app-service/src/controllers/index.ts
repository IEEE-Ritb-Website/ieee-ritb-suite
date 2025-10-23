import { mongodbClient } from "@/db";
import { CreateShortUrlController } from "./shortUrl/createShortUrl";
import { GetShortUrlController } from "./shortUrl/getShortUrl";

export class ControllerClass {
    constructor() {
        mongodbClient.init();
    }

    getShortUrl = GetShortUrlController;
    createShortUrl = CreateShortUrlController;
}

const Controllers = new ControllerClass();
export default Controllers;
