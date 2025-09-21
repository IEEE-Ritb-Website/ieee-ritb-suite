import { mongodbClient } from "@/db";
import { CreateChapterAdminController } from "./auth/createChapterAdmin";
import { CreateChapterExecomController } from "./auth/createExecom";
import { SignInController } from "./auth/signIn";
import { ChangePasswordController } from "./auth/changePassword";
import { CreateChapterController } from "./chapter/createChapter";

export class ControllerClass {
    constructor() {
        // instantiate the mongodb client
        mongodbClient.init();
    }

    signIn = SignInController;
    createChapterAdmin = CreateChapterAdminController;
    createChapterExecom = CreateChapterExecomController;
    changePassword = ChangePasswordController;
    createChapter = CreateChapterController;
}

const Controllers = new ControllerClass();
export default Controllers;
