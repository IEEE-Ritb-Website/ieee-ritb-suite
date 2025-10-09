import { Request, Response } from "express";
import { GetChaptersController } from "./chapters/getChapters";

export class ControllerClass {
    constructor() {
        // do something
    }

    getChapters = GetChaptersController;
}

const Controllers = new ControllerClass();
export default Controllers;
