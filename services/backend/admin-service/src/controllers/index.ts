import { CreateChapterAdminController } from "./auth/createChapterAdmin";
import { mongodbClient } from "@/db";

export class ControllerClass {
    constructor() {
        // do something
        mongodbClient.init();
    }

    createChapterAdmin = CreateChapterAdminController;
}

const Controllers = new ControllerClass();
export default Controllers;
