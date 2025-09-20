import { CreateChapterAdminController } from "./auth/createChapterAdmin";
import { mongodbClient } from "@/db";
import { SignInController } from "./auth/signIn";

export class ControllerClass {
    constructor() {
        // do something
        mongodbClient.init();
    }

    createChapterAdmin = CreateChapterAdminController;
    signIn = SignInController;
}

const Controllers = new ControllerClass();
export default Controllers;
