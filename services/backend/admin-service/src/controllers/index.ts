import { CreateChapterAdminController } from "./auth/createChapterAdmin";
import { mongodbClient } from "@/db";
import { SignInController } from "./auth/signIn";
import { ChangePasswordController } from "./auth/changePassword";
import { CreateChapterExecomController } from "./auth/createExecom";

export class ControllerClass {
    constructor() {
        // do something
        mongodbClient.init();
    }

    createChapterAdmin = CreateChapterAdminController;
    createChapterExecom = CreateChapterExecomController;
    signIn = SignInController;
    changePassword = ChangePasswordController;
}

const Controllers = new ControllerClass();
export default Controllers;
