import { mongodbClient } from "@/db";
import { ShortenUrlController } from "./shortenUrl";

export class ControllerClass {
    constructor() {
        mongodbClient.init();
    }

    shortenUrl = ShortenUrlController;
}

const Controllers = new ControllerClass();
export default Controllers;
